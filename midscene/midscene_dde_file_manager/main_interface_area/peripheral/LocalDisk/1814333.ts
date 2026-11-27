/**
 * 用例 PMSID: 1814333
 * 用例标题: 【本地磁盘】盘符展示-本地虚拟磁盘检查
 * 用例模块: 文件管理器/主界面区域/外设/本地磁盘
 * 来源用例: 禅道 PMS https://pms.uniontech.com/testcase-view-1814333.html （v1，3 步）
 * 生成时间: 2026-11-05
 * 用例编写人: UT000159（游伟）
 */
// @ts-nocheck

// 用例原文（PMS 1814333）：
//   前置条件：dd 创建镜像、losetup 绑定、mkfs 格式化、mount 挂载虚拟磁盘
//   步骤1 在本地创建一个虚拟分区，设备不同文件系统      预期：可以挂载不同文件系统
//   步骤2 在不同文件系操作文件                         预期：可以在不同文件系统文件操作文件
//   步骤3 虚拟磁盘卸载、挂载操作                       预期：可正常卸载、挂载，无其他异常
//
// 实现说明：
//   1) 步骤1 用 dd + losetup + mkfs 现场创建两个不同文件系统（ext4 / vfat）的虚拟磁盘并挂载，
//      “可以挂载不同文件系统”用 mount 表 + 实际读写客观校验；
//   2) 步骤2 在文件管理器中进入两个挂载点做真实文件操作（新建文件夹/删除），结果用挂载点内
//      真实文件校验，保证断言可回到用例期望；
//   3) 步骤3 先卸载再挂载，均以 mount 表客观校验，并在“计算机”页面断言盘符/分区展示正常。
//   4) 步骤2 的坑与规避（远程 UOS 25 本机文管实测）：
//      a. 地址栏输入会被行内路径补全追加内容并选中，直接回车可能被带进子目录——输入后先按一次
//         Delete 清掉补全段再回车，并以窗口标题（当前目录名）确认真的进了目标目录；
//      b. 新建文件夹时 typeText 不要带自动回车，否则“自动回车 + 显式回车”两次回车会把刚建好的
//         目录打开，之后的删除就变成在目标目录内部执行；
//      c. 删除不再用 AI 点条目图标（窗口顶部选项卡上写着当前目录名，曾被误当内容区条目），
//         改为在只含用例目录的工作目录里 Ctrl+A 选中后 Delete，必要时 Shift+Delete/右键菜单兜底。
const USERNAME = process.env.TEST_USERNAME;
const SYS_CREDENTIAL
const USER_ID = process.env.TEST_UID || '1000';
const USER_GID = process.env.TEST_GID || '1000';

const WORK_DIR = `/home/${USERNAME}/ws89_loop`;
const DIRNAME = 'ws89_1814333_dir';
const WORKDIR_NAME = 'ws89_1814333_work';
const DISKS = [
  { name: 'ws89_ext4', fstype: 'ext4', size: '300', img: `${WORK_DIR}/ws89_ext4.img`, mnt: `/home/${USERNAME}/mnt/ws89_ext4` },
  { name: 'ws89_vfat', fstype: 'vfat', size: '200', img: `${WORK_DIR}/ws89_vfat.img`, mnt: `/home/${USERNAME}/mnt/ws89_vfat` },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runSudo(system, cmd) {
  return system.exec(`echo '${SYS_PASSWORD}' | sudo -S ${cmd}`);
}

async function isMounted(system, mnt) {
  const res = await system.exec('mount');
  return String(res.stdout || '').includes(mnt);
}

/** 文件管理器当前活动窗口标题（=当前目录名，确定性判据，避免 AI 对地址栏面包屑的误判） */
async function fmTitle(system) {
  const res = await system.exec('xdotool getactivewindow getwindowname 2>/dev/null');
  return String(res.stdout || '').trim();
}

/** 地址栏导航并在标题上确认真的进入了目标目录。
 *  两个坑都要绕开：
 *   1) 文管地址栏会按已输入文本做行内路径补全并把补全段选中，直接回车可能被补全带进
 *      子目录（1814333 此前"在要删除的目录里执行删除"的成因之一）——输入后先按一次
 *      Delete 清掉被选中的补全段，没有补全时该键作用在行尾，无副作用；
 *   2) 必须以窗口标题（当前目录名）确认，而不是只信地址栏输入。 */
async function gotoDirExact(device, system, path, expectName) {
  for (let i = 0; i < 3; i++) {
    await device.pressKey('ctrl+l');
    await sleep(800);
    await device.pressKey('ctrl+a');
    await sleep(300);
    await device.typeText(path);
    await sleep(800);
    await device.pressKey('Delete');
    await sleep(300);
    await device.pressKey('Enter');
    await sleep(2600);
    const title = await fmTitle(system);
    if (title.includes(expectName)) {
      console.log(`导航到 ${path} 成功（标题：${title}）`);
      return true;
    }
    console.log(`导航到 ${path} 后标题=${title}（未包含 ${expectName}），重试第 ${i + 2} 次`);
  }
  return (await fmTitle(system)).includes(expectName);
}

/** 等待目录消失（删除判据：以文件系统为准） */
async function waitGoneDir(system, dir, name, hardMs) {
  const exists = async () => String((await system.exec(`test -d '${dir}/${name}' && echo yes`)).stdout || '').includes('yes');
  if (!(await exists())) return true;
  const start = Date.now();
  while (Date.now() - start < hardMs) {
    await sleep(2000);
    if (!(await exists())) return true;
  }
  return !(await exists());
}

/** 创建并挂载虚拟磁盘（dd → losetup → mkfs → mount） */
async function createAndMountDisk(system, disk) {
  console.log(`步骤1-${disk.fstype}：创建并挂载虚拟磁盘 ${disk.name}`);
  await runSudo(system, `mkdir -p '${WORK_DIR}' '${disk.mnt}'`);
  const imgOk = await system.exec(`test -f '${disk.img}' && echo yes`);
  if (!String(imgOk.stdout || '').includes('yes')) {
    await system.exec(`dd if=/dev/zero of='${disk.img}' bs=1M count=${disk.size} status=none`);
  }
  const loop = await runSudo(system, `losetup -j '${disk.img}' | head -1 | cut -d: -f1`);
  const loopDev = String(loop.stdout || '').trim().split(/\s+/).pop();
  if (!loopDev || !loopDev.startsWith('/dev/loop')) {
    const created = await runSudo(system, `losetup -fP --show '${disk.img}'`);
    if (!String(created.stdout || '').trim().startsWith('/dev/loop')) {
      throw new Error(`步骤1失败：losetup 绑定 ${disk.name} 失败：${String(created.stdout || created.stderr || '')}`);
    }
  }
  // 注意：mkfs.vfat 的 -F 需要跟 FAT 位数（12/16/32），不能当作 ext4 的 force 参数；
  // 若误用会把镜像路径当成 -F 的取值导致格式化失败。
  const mkfsCmd = disk.fstype === 'vfat'
    ? `mkfs -t vfat '${disk.img}'`
    : `mkfs -t ${disk.fstype} -F '${disk.img}'`;
  const mkfs = await runSudo(system, `${mkfsCmd} 2>&1 | tail -3`);
  console.log(`步骤1-${disk.fstype}：格式化输出 ${String(mkfs.stdout || '').replace(/\n/g, ' | ')}`);
  if (await isMounted(system, disk.mnt)) {
    await runSudo(system, `umount '${disk.mnt}'`);
  }
  // vfat 不支持 chmod，必须在挂载时用 uid/gid/umask 交出写权限
  const mountOpts = disk.fstype === 'vfat'
    ? `loop,uid=${USER_ID},gid=${USER_GID},umask=000`
    : 'loop';
  const mountRes = await runSudo(system, `mount -o ${mountOpts} '${disk.img}' '${disk.mnt}' 2>&1 | tail -2`);
  console.log(`步骤1-${disk.fstype}：挂载输出 ${String(mountRes.stdout || '').replace(/\n/g, ' | ')}`);
  if (!(await isMounted(system, disk.mnt))) {
    throw new Error(`步骤1失败：${disk.fstype} 虚拟磁盘未能挂载到 ${disk.mnt}`);
  }
  // 挂载点由 root 创建，放开权限，保证以普通用户运行的文件管理器可以在此新建/删除文件
  // （虚拟磁盘以 root 挂载，否则"新建文件夹"等操作会因权限不足失败）
  await runSudo(system, `chmod 777 '${disk.mnt}'`);
  // 读写校验：可以真正使用该文件系统。
  // 校验文件写在用例工作目录里、校验完立即删除，保证挂载根下不残留用例文件，
  // 步骤2 只操作工作目录，Ctrl+A 的选择范围就只可能是用例新建的目录。
  const workDir = `${disk.mnt}/${WORKDIR_NAME}`;
  const check = await system.exec(`mkdir -p '${workDir}' && echo ${disk.fstype} > '${workDir}/fs_check.txt' && cat '${workDir}/fs_check.txt'`);
  console.log(`步骤1-${disk.fstype}：读写校验输出 ${String(check.stdout || '').trim()}`);
  await system.exec(`rm -f '${workDir}/fs_check.txt'`);
}

describe('1814333-【本地磁盘】盘符展示-本地虚拟磁盘检查', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.exec('killall -15 dde-file-manager 2>/dev/null; true');
    await sleep(2000);
    for (const disk of DISKS) {
      await runSudo(system, `umount '${disk.mnt}' 2>/dev/null; losetup -D 2>/dev/null; true`);
    }
    await system.exec(`rm -rf '${WORK_DIR}' && mkdir -p '${WORK_DIR}'`);
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器窗口已打开', { timeoutMs: 40000, checkIntervalMs: 1000 });
    await uos.maximizeWindow();
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.releaseAllKeys();
  });

  test('1814333-【本地磁盘】盘符展示-本地虚拟磁盘检查', async ({ device, agent, uos, system }) => {
    // 步骤1：创建虚拟分区，挂载不同文件系统
    console.log('步骤1：创建虚拟分区并挂载不同文件系统（ext4 / vfat）');
    for (const disk of DISKS) {
      await createAndMountDisk(system, disk);
    }
    for (const disk of DISKS) {
      if (!(await isMounted(system, disk.mnt))) {
        throw new Error(`步骤1失败：${disk.fstype} 文件系统未处于挂载状态`);
      }
    }
    console.log('步骤1通过：两个不同文件系统（ext4/vfat）的虚拟分区均挂载成功');

    // 步骤2：在不同文件系统中操作文件
    console.log('步骤2：在不同文件系统中操作文件');
    for (const disk of DISKS) {
      // 挂载点下建用例工作目录并在里面操作：目录内只有本用例条目，
      // Ctrl+A 的选择范围就只可能是用例目标（挂载根下还有 lost+found 等系统目录）。
      const workDir = `${disk.mnt}/${WORKDIR_NAME}`;
      await system.exec(`rm -rf '${disk.mnt}/${DIRNAME}' '${workDir}' && mkdir -p '${workDir}'`);
      if (!(await gotoDirExact(device, system, workDir, WORKDIR_NAME))) {
        throw new Error(`步骤2失败：文件管理器未进入 ${workDir}（当前标题：${await fmTitle(system)}）`);
      }
      await device.pressKey('F5');
      await sleep(2000);
      // 新建文件夹：右键空白处 → 填名称 → 只按一次回车。
      // 关键：typeText 不再带自动回车，避免"自动回车 + 显式回车"两次回车把刚建好的目录打开，
      // 那样后面的删除就变成在目标目录内部执行（用户反馈的问题现象）。
      let created = false;
      for (let attempt = 1; attempt <= 3 && !created; attempt++) {
        await agent.aiRightClick('文件管理器内容区域的空白处');
        await sleep(1600);
        if (!(await agent.aiBoolean('右键菜单中包含"新建文件夹"选项'))) {
          console.log(`步骤2-${disk.fstype}：第 ${attempt} 次空白处右键菜单未出现"新建文件夹"，重试`);
          await device.pressKey('Escape');
          await sleep(1000);
          continue;
        }
        await agent.aiTap('右键菜单中的"新建文件夹"选项');
        await sleep(2200);
        await device.typeText(DIRNAME);
        await sleep(1000);
        await device.pressKey('Enter');
        await sleep(3000);
        const chk = await system.exec(`test -d '${workDir}/${DIRNAME}' && echo yes`);
        created = String(chk.stdout || '').includes('yes');
        if (!created) {
          console.log(`步骤2-${disk.fstype}：第 ${attempt} 次新建文件夹未落盘，重试`);
        }
      }
      if (!created) {
        throw new Error(`步骤2失败：${disk.fstype} 文件系统中新建文件夹未生效`);
      }
      // 新建后必须仍在工作目录里，不能被自动补全/回车带进新建目录
      const titleAfterCreate = await fmTitle(system);
      console.log(`步骤2-${disk.fstype}：新建后标题=${titleAfterCreate}`);
      if (titleAfterCreate.includes(DIRNAME)) {
        console.log(`步骤2-${disk.fstype}：被带进了新建目录，退回工作目录后再校验`);
        if (!(await gotoDirExact(device, system, workDir, WORKDIR_NAME))) {
          throw new Error(`步骤2失败：无法从 ${DIRNAME} 退回 ${workDir}`);
        }
      }
      console.log(`步骤2-${disk.fstype}通过：新建文件夹成功（${workDir}/${DIRNAME}）`);
      // 删除该文件夹，验证文件操作完整。
      // 工作目录里此刻只有用例目录一项，直接用 Ctrl+A 选中：
      // 不再用 AI 去点条目图标（本机文管的选项卡上写着当前目录名，曾把选项卡误当成
      // 内容区条目，点偏后选中态丢失，Delete 自然不生效）。
      await device.pressKey('F5');
      await sleep(2500);
      await device.pressKey('ctrl+a');
      await sleep(1500);
      await device.pressKey('Delete');
      await sleep(3000);
      let confirmDel = await agent.aiBoolean('弹出删除确认对话框（含"删除"或"永久删除"按钮）');
      if (confirmDel) {
        await agent.aiTap('删除确认对话框中的确认按钮（"删除"或"永久删除"）');
        await sleep(3000);
      }
      let deleted = await waitGoneDir(system, workDir, DIRNAME, 60000);
      if (!deleted) {
        // 回收站在 loop 挂载的虚拟磁盘上可能不可用（Delete 会被文管拒绝），再用 Shift+Delete 永久删除兜底
        console.log(`步骤2-${disk.fstype}：Delete 键未删除，尝试 Shift+Delete 永久删除`);
        await device.pressKey('ctrl+a');
        await sleep(1200);
        await device.pressKey('Shift', 'Delete');
        await sleep(3000);
        confirmDel = await agent.aiBoolean('弹出删除确认对话框（含"删除"或"永久删除"按钮）');
        if (confirmDel) {
          await agent.aiTap('删除确认对话框中的确认按钮（"删除"或"永久删除"）');
          await sleep(3000);
        }
        deleted = await waitGoneDir(system, workDir, DIRNAME, 60000);
      }
      if (!deleted) {
        console.log(`步骤2-${disk.fstype}：Shift+Delete 仍未删除，改用右键菜单兜底`);
        await device.pressKey('ctrl+a');
        await sleep(1200);
        await agent.aiRightClick(`文件管理器内容区域中名为"${DIRNAME}"的文件夹图标`);
        await sleep(1200);
        if (await agent.aiBoolean('弹出的菜单包含"删除"选项')) {
          await agent.aiTap('右键菜单中的"删除"选项');
          await sleep(2500);
          confirmDel = await agent.aiBoolean('弹出删除确认对话框（含"删除"或"永久删除"按钮）');
          if (confirmDel) {
            await agent.aiTap('删除确认对话框中的确认按钮（"删除"或"永久删除"）');
            await sleep(2500);
          }
        } else {
          await device.pressKey('Escape');
          await sleep(800);
        }
        deleted = await waitGoneDir(system, workDir, DIRNAME, 60000);
      }
      if (!deleted) {
        throw new Error(`步骤2失败：${disk.fstype} 文件系统中删除文件夹未生效`);
      }
      console.log(`步骤2-${disk.fstype}通过：删除文件夹成功`);
    }
    await agent.logScreenshot('1814333_step2_file_ops');
    console.log('步骤2通过：两个文件系统均可正常操作文件');

    // 步骤3：虚拟磁盘卸载、挂载
    console.log('步骤3：虚拟磁盘卸载、挂载操作');
    for (const disk of DISKS) {
      await runSudo(system, `umount '${disk.mnt}'`);
      await sleep(1500);
      if (await isMounted(system, disk.mnt)) {
        throw new Error(`步骤3失败：${disk.fstype} 虚拟磁盘卸载后仍处于挂载状态`);
      }
      console.log(`步骤3-${disk.fstype}：卸载成功`);
    }
    await device.pressKey('ctrl+l');
    await sleep(800);
    await device.pressKey('ctrl+a');
    await sleep(300);
    await device.typeText('computer:///');
    await sleep(800);
    await device.pressKey('Delete');
    await sleep(300);
    await device.pressKey('Enter');
    await sleep(2500);
    await device.pressKey('F5');
    await sleep(2000);
    await agent.logScreenshot('1814333_step3_after_umount');
    for (const disk of DISKS) {
      const remountOpts = disk.fstype === 'vfat'
        ? `loop,uid=${USER_ID},gid=${USER_GID},umask=000`
        : 'loop';
      const remount = await runSudo(system, `mount -o ${remountOpts} '${disk.img}' '${disk.mnt}' 2>&1 | tail -1`);
      console.log(`步骤3-${disk.fstype}：重新挂载输出 ${String(remount.stdout || '').replace(/\n/g, ' | ')}`);
      await runSudo(system, `chmod 777 '${disk.mnt}'`);
      if (!(await isMounted(system, disk.mnt))) {
        throw new Error(`步骤3失败：${disk.fstype} 虚拟磁盘重新挂载失败`);
      }
      await system.exec(`echo remount > '${disk.mnt}/remount_check.txt' && cat '${disk.mnt}/remount_check.txt'`);
    }
    await device.pressKey('F5');
    await sleep(2500);
    await agent.aiAssert('文件管理器"计算机"页面显示本机分区/盘符且界面正常无异常');
    await agent.logScreenshot('1814333_step3_after_remount');
    console.log('步骤3通过：虚拟磁盘可正常卸载、挂载，文件管理器运行正常');
    await uos.closeCurrentWindow();
    await uos.showDesktop();
  }, { timeout: 1500000, tags: ['1814333', 'level3', 'LocalDisk', 'DITT', 'youwei', 'virtualdisk'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    for (const disk of DISKS) {
      await runSudo(system, `umount '${disk.mnt}' 2>/dev/null; true`);
    }
    await runSudo(system, 'losetup -D 2>/dev/null; true');
    await runSudo(`test -d '${WORK_DIR}' && rm -rf '${WORK_DIR}'`);
    await runSudo(`test -d /home/${USERNAME}/mnt/ws89_ext4 && rm -rf /home/${USERNAME}/mnt/ws89_ext4`);
    await runSudo(`test -d /home/${USERNAME}/mnt/ws89_vfat && rm -rf /home/${USERNAME}/mnt/ws89_vfat`);
    await runSudo(`test -d /home/${USERNAME}/mnt && rm -rf /home/${USERNAME}/mnt`);
    await system.exec('killall -15 dde-file-manager 2>/dev/null; true');
    await agent.aiTap('桌面任意空白区域');
    await uos.showDesktop();
  });
});
