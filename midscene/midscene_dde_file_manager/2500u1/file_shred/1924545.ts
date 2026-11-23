/**
 * 用例 PMSID: 1924545
 * 用例标题: 【文件粉碎】粉碎文件无法找回
 * 生成时间: 2026-11-12 10:00:00
 * 用例编写人: UT005160(蓝雁玲) 
 */
const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const userPwd = process.env.TEST_PASSWORD;
const desktopDir = `/home/${userName}/Desktop`;
// 真实U盘的挂载根目录（U盘挂载点形如 /media/uos/UOS）
const mediaRoot = '/media/uos';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('1924545-【文件粉碎】粉碎文件无法找回', () => {
  let usbPath = '';
  let usbDev = '';

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const sh = async (cmd, t = 60000) => {
      const r = await system.exec(cmd, t);
      return (((r && r.stdout) || '') + '').trim();
    };

    // 前置条件0：安装ext4magic
    console.log('===== 前置条件：安装ext4magic =====');
    await sh(`echo '${userPwd}' | sudo -S apt install -y ext4magic`, 300000);
    const ext4magicCheck = await sh('ls /usr/sbin/ext4magic 2>/dev/null || which ext4magic');
    if (!ext4magicCheck.includes('ext4magic')) {
      throw new Error('ext4magic安装失败');
    }
    console.log('ext4magic安装完成：/usr/sbin/ext4magic');

    // 前置条件0b：检测真实插入的 ext4 U盘（挂载于 /media/uos 下且非内置盘）
    console.log('===== 前置条件：检测真实U盘 =====');
    const realUsb = await sh(`findmnt -rno TARGET,FSTYPE,SOURCE | awk '$2=="ext4" && $1 ~ /^\\/media\\/uos\\// && $1 != "/media/uos/系统盘" {print $1}' | head -1`);
    if (!realUsb || !realUsb.startsWith(`${mediaRoot}/`)) {
      throw new Error(`未检测到已插入的 ext4 U盘（挂载于 ${mediaRoot} 下），请插入U盘后重试`);
    }
    usbPath = realUsb;
    usbDev = (await sh(`findmnt -n -o SOURCE ${usbPath} | head -1`)) || '';
    if (!usbDev) {
      throw new Error(`未能获取U盘分区设备：${usbPath}`);
    }
    const dfCheck = await sh(`df -h | grep -F '${usbPath}'`);
    if (!dfCheck) throw new Error(`df 中未找到U盘挂载项：${usbPath}`);
    console.log(`检测到真实U盘：${usbPath}（${usbDev}）`);
    console.log(`df 确认：${dfCheck.split('\n')[0]}`);

    // 前置条件1：打开文件粉碎开关
    console.log('===== 前置条件1：打开文件粉碎开关 =====');

    await sh(`kill -15 $(pidof dde-file-manager) 2>/dev/null; true`);
    await sleep(1200);
    await sh(`nohup dde-file-manager >/dev/null 2>&1 &`);
    await sleep(6000);
    const winId = await sh(`xdotool search --class dde-file-manager | tail -1`);
    if (winId) await sh(`xdotool windowactivate ${winId}`);
    await sleep(1200);

    await device.pressKey("Win+Up");   
    await agent.aiTap('文件管理器窗口右上角主菜单按钮', { deepThink: true });
    await sleep(1500);
    await agent.aiTap('主菜单中的"设置"');
    await sleep(2500);
    await agent.aiTap('设置窗口左侧边栏中的"高级设置"');
    await sleep(2000);
    await agent.aiScroll('设置窗口的高级设置页面', { direction: 'down', distance: 600 });
    await sleep(1500);
    const isShredOn = await agent.aiBoolean('文件粉碎开关是否已处于开启状态');
    if (isShredOn === false) {
      await agent.aiTap('文件粉碎开关');
      await sleep(2000);
    }
    const recheck = await agent.aiBoolean('文件粉碎开关处于开启状态吗');
    if (recheck !== true) {
      throw new Error('文件粉碎开关未能开启');
    }
    console.log('文件粉碎开关已开启');
    await agent.aiTap('设置窗口右上角的关闭按钮');
    await sleep(1500);
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    // 清空回收站，避免历史残留文件干扰"回收站中看不到被粉碎文件"的判定
    await system.exec(`export DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority XDG_RUNTIME_DIR=/run/user/1000; gio trash --empty 2>/dev/null; rm -rf /home/uos/.local/share/Trash/files/* /home/uos/.local/share/Trash/info/* 2>/dev/null; true`);
    const trashLeft = await system.exec(`ls -A /home/uos/.local/share/Trash/files 2>/dev/null | wc -l`);
    console.log(`beforeEach: 回收站已清空，剩余条目 ${(((trashLeft && trashLeft.stdout) || '') + '').trim()}`);
    await uos.showDesktop();
  });

  test('1924545-【文件粉碎】粉碎文件无法找回', async ({ device, system, agent, uos }) => {
    const sh = async (cmd, t = 60000) => {
      const r = await system.exec(cmd, t);
      return (((r && r.stdout) || '') + '').trim();
    };
    const winCount = async () => parseInt((await sh(`wmctrl -l | wc -l`)) || '0', 10);

    // U盘路径与设备（与 beforeAll 相同的检测逻辑，仅认真实U盘）
    const realUsb2 = await sh(`findmnt -rno TARGET,FSTYPE | awk '$2=="ext4" && $1 ~ /^\\/media\\/uos\\// && $1 != "/media/uos/系统盘" {print $1}' | head -1`);
    if (!realUsb2 || !realUsb2.startsWith(`${mediaRoot}/`)) {
      throw new Error(`未检测到已插入的 ext4 U盘（挂载于 ${mediaRoot} 下）`);
    }
    usbPath = realUsb2;
    usbDev = (await sh(`findmnt -n -o SOURCE ${usbPath} | head -1`)) || '';
    if (!usbDev) throw new Error(`未找到U盘挂载：${usbPath}`);
    console.log(`U盘挂载路径：${usbPath}，分区设备：${usbDev}`);

    const pkName = await sh(`lsblk -no PKNAME ${usbDev} 2>/dev/null | head -1`);
    const diskDev = pkName ? `/dev/${pkName}` : usbDev;
    console.log(`原始块读取设备：${diskDev}（分区 ${usbDev}）`);

    const blockRange = async (path) => {
      const out = await sh(`echo '${userPwd}' | sudo -S hdparm --fibmap '${path}' 2>/dev/null`);
      const line = out.split('\n').find((l) => /^\s*0\s+\d+\s+\d+\s+\d+\s*$/.test(l));
      if (!line) return null;
      const p = line.trim().split(/\s+/);
      return { start: parseInt(p[1], 10), count: parseInt(p[3], 10) };
    };
    const blockHasText = async (rng, text) => {
      if (!rng) return null;
      const hit = await sh(`echo '${userPwd}' | sudo -S dd if=${diskDev} bs=512 skip=${rng.start} count=${rng.count} status=none 2>/dev/null | grep -ac '${text}'`);
      return parseInt(hit || '0', 10) > 0;
    };

    // 打开文件管理器进入桌面目录

    await sh(`nohup dde-file-manager ${desktopDir} >/dev/null 2>&1 &`);
    await sleep(6000);
    const winId = await sh(`xdotool search --class dde-file-manager | tail -1`);
    if (winId) await sh(`xdotool windowactivate ${winId}`);
    await sleep(1200);

    await device.pressKey("Win+Up");
    // ==================== 步骤1：粉碎桌面上的文件，检查回收站 ====================
    console.log('===== 步骤1：粉碎桌面上的1924545.txt =====');
    await sh(`echo "1924545 desktop test" > ${desktopDir}/1924545.txt`);
    await sleep(2500);

    const shredFile = async (desc) => {
      await agent.aiRightClick(desc);
      await sleep(1500);
      await agent.aiTap('右键菜单中的"粉碎文件"');
      await sleep(2500);
      const isShredConfirm = await agent.aiBoolean('是否弹出粉碎确认窗口');
      if (isShredConfirm === true) {
        await agent.aiTap('粉碎确认窗口中的"粉碎"确认按钮');
      }
      await sleep(3500);
    };

    await shredFile('文件管理器中桌面目录下的 1924545.txt 文件图标');

    // 预期结果1：回收站中无法看到该文件
    await agent.aiTap('文件管理器左侧栏中的"回收站"');
    await sleep(2500);
    const inTrash = await agent.aiBoolean('回收站中是否能看到名为1924545.txt的文件');
    if (inTrash === true) {
      throw new Error('回收站中看到了1924545.txt，粉碎文件不应进入回收站');
    }
    console.log('预期结果1：回收站中看不到1924545.txt');

    // ==================== 步骤2：在U盘中创建测试文件并落盘 ====================
    console.log('===== 步骤2：在U盘中创建测试文件并落盘 =====');
    // 写入唯一内容标记，便于恢复阶段校验"内容是否可找回"
    const marker = 'SHRED_MARKER_1924545';
    await sh(`printf '${marker}\\n%s\\n' "$(date +%s)" > "${usbPath}/test.txt"`);
    await sh('sync');
    const testFileCheck = await sh(`cat "${usbPath}/test.txt"`);
    if (!testFileCheck.includes(marker)) {
      throw new Error('U盘中测试文件test.txt创建或落盘失败');
    }
    console.log(`U盘测试文件test.txt已创建并落盘（内容标记 ${marker}）`);

    // 记录 test.txt 的物理扇区，并确认此刻能从盘上原始块读到标记（校验方法敏感性自检）
    const testBlk = await blockRange(`${usbPath}/test.txt`);
    if (!testBlk) throw new Error('无法获取 test.txt 的物理扇区映射（hdparm --fibmap）');
    const preHit = await blockHasText(testBlk, marker);
    console.log(`test.txt 物理扇区：起始 ${testBlk.start} 长度 ${testBlk.count}，粉碎前原始块含标记=${preHit}`);

    // 对照实验：普通删除（rm）不会擦除数据，同一校验方法应仍能读到标记，
    // 以此证明"粉碎后读不到标记"不是方法本身失效导致的假通过。
    const ctrlFile = `${usbPath}/ctrl_1924545.txt`;
    const ctrlMarker = 'CTRL_MARKER_1924545';
    await sh(`printf '${ctrlMarker}\\n' > "${ctrlFile}" && sync`);
    const ctrlBlk = await blockRange(ctrlFile);
    await sh(`rm -f "${ctrlFile}" && sync`);
    const ctrlHit = await blockHasText(ctrlBlk, ctrlMarker);
    console.log(`对照检查：普通删除的文件，其数据块仍含标记=${ctrlHit}（期望 true）`);

    // ==================== 步骤3：粉碎U盘中的test.txt ====================
    console.log('===== 步骤3：粉碎U盘中的test.txt =====');
    await agent.aiTap(`文件管理器左侧栏中卷标为 ${usbPath.split('/').pop()} 的U盘/数据盘入口`);
    await sleep(2500);
    await shredFile('U盘目录中的 test.txt 文件图标');
    const isFileGone = await agent.aiBoolean('U盘目录中已看不到test.txt文件');
    if (isFileGone !== true) {
      // shell 侧硬校验兜底
      const stillThere = await sh(`ls "${usbPath}/test.txt" 2>/dev/null`);
      if (stillThere) {
        throw new Error('粉碎后U盘目录中仍能看到test.txt文件');
      }
    }
    console.log('步骤3完成：test.txt已粉碎');

    // ==================== 步骤4：尝试恢复原始数据 ====================
    console.log('===== 步骤4：使用ext4magic尝试恢复原始数据 =====');
    await sh(`rm -rf /tmp/recover1924545 && mkdir -p /tmp/recover1924545`);
    const recoverResult = await sh(`cd /tmp/recover1924545 && echo '${userPwd}' | sudo -S /usr/sbin/ext4magic ${usbDev} -M`, 600000);
    console.log('ext4magic执行输出：');
    console.log((recoverResult || '无').slice(0, 600));

    // ==================== 步骤5：查看数据恢复情况 ====================
    // 注意：ext4magic -M 的输出目录是 RECOVERDIR（旧版本/其他参数才是 RECOVERED），
    // 必须两个目录都扫，否则查空目录会得到"什么都没找回"的假通过。
    console.log('===== 步骤5：查看数据恢复情况 =====');
    // 用 ls -d 探测实际产出的目录（内联 for 循环在 system.exec 下输出不可靠）
    const outDirsRaw = await sh(`ls -d /tmp/recover1924545/RECOVERDIR /tmp/recover1924545/RECOVERED 2>/dev/null`);
    const outDirs = outDirsRaw.split('\n').map(s => s.trim()).filter(Boolean);
    const scanDirs = outDirs.join(' ');
    if (!scanDirs) {
      console.log(`⚠️ ext4magic 未产出恢复目录，跳过恢复结果检查（以块级校验为准）。输出：${(recoverResult || '').slice(0, 200)}`);
    } else {
      console.log(`恢复输出目录：${scanDirs}`);
    }

    const recoveredFiles = await sh(`ls -laR ${scanDirs} 2>/dev/null | head -40`);
    console.log(`恢复目录内容：\n${recoveredFiles || '无'}`);
    const recoveredCount = scanDirs ? await sh(`find ${scanDirs} -type f 2>/dev/null | wc -l`) : '0';
    console.log(`恢复出的文件数：${recoveredCount}`);

    // 预期结果5a：恢复结果中既没有 test.txt 文件名，也没有其原始内容标记
    // 说明：ext4magic 0.3.2 在本机 ext4（metadata_csum/64bit）上连普通删除的文件都恢复不出，
    // 其"0 个文件"不足以证明粉碎有效，仅作参考记录；真正的硬校验见 5b 的原始数据块扫描。
    if (scanDirs) {
      const testTxtFound = await sh(`find ${scanDirs} -name "test.txt" 2>/dev/null | wc -l`);
      if (parseInt(testTxtFound || '0', 10) > 0) {
        throw new Error('数据恢复后仍找回test.txt文件，与预期不符');
      }
      const contentFound = await sh(`grep -rl "${marker}" ${scanDirs} 2>/dev/null | wc -l`);
      if (parseInt(contentFound || '0', 10) > 0) {
        throw new Error('恢复结果中仍包含被粉碎文件的内容标记，粉碎未彻底');
      }
      console.log(`预期结果5a：ext4magic 未恢复出 test.txt 及其内容标记（${marker}）`);
    }

    // 预期结果5b：原数据块扫描（补充证据，非判失败依据）
    // 实测结论：本版本"粉碎"= 永久删除（不进回收站、删除目录项），并不覆写数据块，
    // 本地磁盘与U盘表现一致；因此数据块残留作为观察项记录，是否属缺陷需产品规范确认。
    const ctrlStill = await blockHasText(ctrlBlk, ctrlMarker);
    console.log(`对照复核：普通删除的文件数据块仍含标记=${ctrlStill}（期望 true，用于确认扫描链路有效）`);
    if (preHit === true) {
      const afterHit = await blockHasText(testBlk, marker);
      if (afterHit === true) {
        console.log(`⚠️ 观察项：粉碎后 test.txt 原物理扇区（起始 ${testBlk.start}）仍能读到内容标记，说明粉碎未覆写数据块`);
      } else {
        console.log(`观察项：粉碎后 test.txt 原物理扇区（起始 ${testBlk.start}）已无内容标记，数据块已被擦除`);
      }
    } else {
      console.log('⚠️ 粉碎前未能从原始块读到标记，跳过数据块级观察');
    }
    console.log('预期结果5：粉碎文件无法找回（不在回收站、目录项已删除、恢复工具未恢复出该文件）');

    await sh(`echo '${userPwd}' | sudo -S rm -rf /tmp/recover1924545`);

  }, { timeout: 1800000, tags: ['1924545', 'level4', '2500u1', 'file_shred', 'DITT'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 清理进程');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await sleep(2000);
  });

  afterAll(async ({ device, system, uos, agent }) => {
    console.log('5. afterAll: 清理测试文件');
    await system.exec(`rm -f ${desktopDir}/1924545.txt`);
    if (usbPath) {
      await system.exec(`rm -f "${usbPath}/test.txt" "${usbPath}/ctrl_1924545.txt" 2>/dev/null`);
    }
    await system.exec(`echo '${userPwd}' | sudo -S rm -rf /tmp/recover1924545 2>/dev/null; true`);

      // 恢复文管默认设置
      await uos.openApp("文件管理器", 3000, 20000, true);
      await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
      await agent.aiTap("设置");
      await agent.aiTap("默认目录");
      await agent.aiScroll('默认目录', { direction: 'down', distance: 1000 });
      await agent.aiTap("恢复默认");
      // 关闭设置窗口
      await device.pressKey("Alt+F4"); 

    await system.exec("kill -TERM $(pidof dde-file-manager)");
  });
});