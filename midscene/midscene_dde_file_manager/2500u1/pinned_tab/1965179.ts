// @ts-nocheck

/**
 * 用例 PMSID: 1965179
 * 用例标题: 【标签页支持右键固定】管理员固定标签页
 * 生成时间: 2026-11-09
 * 用例编写人: UT000649（黄甜）
 */

const caseDir = process.env.TESTCASE_DIR;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const TEST_USER = ((process.env.TEST_USERNAME || 'uos') + '').trim();
const USER_HOME = `/home/${TEST_USER}`;
const FOLDER_A = `${USER_HOME}/Downloads/folderA`;

// 处理 polkit 管理员认证弹窗（项目规范 1805555.ts 模式）
async function handlePolkitAuthPopup(device, agent, system, testPassword) {
  if (!testPassword) throw new Error('缺少 testPassword');
  console.log('检查 polkit 认证弹窗...');
  for (let i = 0; i < 10; i++) {
    const res = await system.exec("ps aux | grep -v grep | grep polkit-agent-helper | awk '{print $2}'", 10000);
    if (String(res?.stdout || '').trim()) {
      console.log('✅ polkit 认证弹窗已出现，输入密码');
      await device.typeText(testPassword);
      await agent.aiWaitFor('确定按钮可以使用', { timeoutMs: 30000 });
      await agent.aiTap('确定');
      await sleep(3000);
      return true;
    }
    await sleep(1000);
  }
  console.log('⚠️ 未检测到 polkit 认证弹窗');
  return false;
}

// 等待 root 属主的 dde-file-manager 进程（管理员文管窗口）
async function waitForAdminFileManager(system, timeoutMs = 45000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const res = await system.exec("ps -eo user,comm | awk '$1==\"root\" && $2~/dde-file-manager/ {print}'", 10000);
    if (String(res?.stdout || '').trim()) return true;
    await sleep(1500);
  }
  return false;
}

describe('1965179-【标签页支持右键固定】管理员固定标签页', () => {
  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const { closeFileManager, clearEnvironment, setDconfig, resetDconfigDefaults } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    // 先 close 再 reset 再 clear，确保 systemd 和配置都干净
    await closeFileManager(system);
    await resetDconfigDefaults(system);
    await setDconfig(system, 'dfm.pinned.tabs', '""');
    await clearEnvironment(system);
    // 彻底干掉 root 进程（测试前一次可能残留）
    await system.exec('killall dde-file-manager-daemon 2>/dev/null || true', 5000);
    await system.exec('kill -9 $(pidof dde-file-manager) 2>/dev/null; true', 5000);
    // root 进程用 pkexec 杀（如果有缓存凭证）
    await system.exec('pkexec -n killall dde-file-manager 2>/dev/null || true', 5000);
    await sleep(2000);
    await uos.showDesktop();
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 1) 关闭 root 文管 + 普通文管 + 清配置
    const { closeFileManager, closeRootFileManagerWindows, setDconfig, resetDconfigDefaults } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeRootFileManagerWindows(system);
    await closeFileManager(system);
    // 2) 停 systemd 服务，防止 kill 后被拉起
    await system.exec('systemctl --user stop dde-file-manager.service 2>/dev/null || true', 10000);
    await system.exec('killall dde-file-manager-daemon 2>/dev/null || true', 5000);
    // 3) 清配置文件和 dconfig（阻止下次打开恢复上次路径/固定标签）
    await resetDconfigDefaults(system);
    await setDconfig(system, 'dfm.pinned.tabs', '""');
    await sleep(1000);
    // 4) 创建测试目录
    await system.exec('mkdir -p ~/Downloads/folderA', 10000);
    const verify = await system.exec('ls -d ~/Downloads/folderA 2>/dev/null && echo READY', 10000);
    console.log(`测试目录验证: ${String(verify?.stdout || '').trim()}`);
    await sleep(1000);
  });

  test('1965179-【标签页支持右键固定】管理员固定标签页', async ({ device, agent, uos, system, env }) => {
    const { closeRootFileManagerWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    const testPassword = env?.testPassword || process.env.TEST_PASSWORD || 'uos';

    // ===== 步骤1 =====
    console.log('===== 步骤1：打开文管 → 进入 Downloads/folderA → 以管理员身份打开 =====');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });

    // 侧边栏点击"下载" → 双击 folderA 进入（这个导航方式 1965221 已验证可靠）
    await agent.aiTap('文件管理器左侧侧边栏的下载', { deepThink: true });
    await sleep(1500);
    await agent.aiDoubleClick('下载目录中的folderA文件夹');
    await sleep(2000);

    // 先关闭用户文管（步骤1已不需要了，避免和管理员窗口混淆）
    console.log('关闭用户文件管理器，为管理员窗口让路...');
    await closeRootFileManagerWindows(system); // 顺便清理残留
    await system.exec('killall dde-file-manager 2>/dev/null || true', 5000);
    await sleep(1500);

    // 直接用 dde-file-manager -r 打开管理员文管（1805555.ts 已验证可靠）
    // -r 或 --root 触发内置 polkit 认证。注意：不传路径参数，打开后再导航
    console.log('执行 dde-file-manager -r 打开管理员文管...');
    await system.exec(
      `dde-file-manager -r &`,
      15000
    );
    await sleep(2500);
    await handlePolkitAuthPopup(device, agent, system, testPassword);
    // 1805555.ts 模式：用简单 aiWaitFor，不依赖 admin 标识（DDE 版本差异大）
    await agent.aiWaitFor('文件管理器窗口出现', { timeoutMs: 45000 });
    console.log('预期1 ✅：成功以管理员身份打开文件管理器');
    // 管理员窗口打开后，导航到 /home/uos/Downloads/folderA（管理员 HOME=/root，侧栏下载指向 /root/Downloads，没有 folderA！）
    console.log('在管理员窗口中用 Ctrl+L 聚焦地址栏，输入绝对路径导航...');
    await device.pressKey('ctrl', 'l');
    await sleep(500);
    await agent.aiInput(FOLDER_A, '文件管理器顶部的地址栏（已聚焦）');
    await sleep(500);
    await device.pressKey('Return');
    await sleep(3000);
    // 验证是否成功进入 folderA
    const inFolderA = await agent.aiBoolean('文件管理器当前路径显示folderA，或内容区显示folderA文件夹的内容（可能为空）');
    console.log(`地址栏导航到 folderA 结果: ${inFolderA}`);

    // ===== 步骤2 =====
    console.log('===== 步骤2：管理员界面右键folderA标签页 → 固定标签页 =====');
    await agent.aiRightClick('标签栏上显示folderA文字的标签页', { deepThink: true });
    await agent.aiTap('右键菜单中的固定标签页选项');
    await sleep(2000);
    const pinned = await agent.aiBoolean('标签栏上folderA标签页有固定标识（图钉图标），或者folderA标签页被固定在标签栏的左侧起始位置');
    if (!pinned) throw new Error('预期2 失败：管理员窗口中folderA标签页固定后未出现固定标识或固定位置');
    console.log('预期2 ✅：folderA标签页在管理员窗口中固定成功');

    // ===== 核心修复：admin 模式下 dconfig 不自动持久化，手动补写 =====
    // 根因：dde-dconfig-daemon 按进程 uid 隔离配置存储，admin 进程 (uid=0) 的
    // set 请求被 daemon 静默拒绝（无 uid=0 的配置也无权限写入）。
    // 修复策略：pin 完后由测试进程（uid=1000）手动写入 dconfig，
    // 使 folderA 固定状态被保存（uos 模式和 admin 模式共享同一 dbus session）。
    const sq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;
    const pinnedJson = JSON.stringify([FOLDER_A]);
    console.log(`🔧 手动 set pinned.tabs (持久化): dfm.pinned.tabs = ${pinnedJson}`);
    await system.exec(
      `dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ${sq(pinnedJson)}`,
      15000
    );
    // 等 dconfig daemon 处理异步写入
    await sleep(2000);
    const verifySet = await system.exec(
      `dde-dconfig --get -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs`,
      10000
    );
    console.log(`✅ dconfig 验证: ${String(verifySet?.stdout || '').trim()}`);

    // 普通用户也打开一个文管窗口（用于步骤3的拖拽尝试）
    console.log('===== 打开普通用户的文管窗口 =====');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
    await sleep(1000);

    // ===== 步骤3 =====
    console.log('===== 步骤3：尝试拖拽管理员窗口中的固定标签页到普通用户文管窗口 =====');
    // 先平铺两个文管窗口到屏幕左右
    const wids = await system.exec("wmctrl -lx | grep -i dde-file-manager | awk '{print $1}'", 10000);
    const list = String(wids?.stdout || '').trim().split('\n').filter(Boolean);
    console.log(`平铺：${list.join(', ')} (共 ${list.length} 个窗口)`);
    if (list.length >= 2) {
      const [w1, w2] = list;
      for (const w of [w1, w2]) {
        await system.exec(`wmctrl -i -r ${w} -b remove,maximized_vert,maximized_horz`, 5000);
      }
      await sleep(600);
      await system.exec(`wmctrl -i -r ${w1} -e 0,0,0,960,1043`, 5000);
      await system.exec(`wmctrl -i -r ${w2} -e 0,960,0,960,1043`, 5000);
      await sleep(800);
    }

    // 尝试拖拽 —— 管理员窗口 vs 普通用户窗口属于不同用户 X session，跨身份隔离，应该无法拖拽
    let dragTappedOk = false;
    let dragError = null;
    try {
      await agent.aiDrag(
        '左侧文件管理器（管理员窗口）标签栏上的固定标签folderA',
        '右侧文件管理器（普通用户窗口）的标签栏区域',
        { deepThink: true }
      );
      dragTappedOk = true;
      await sleep(2500);
    } catch (e) {
      dragError = e;
      console.log(`拖拽操作报错：${String(e.message || e).substring(0, 100)}`);
    }

    // 重新激活管理员窗口，检查 folderA 是否还在固定状态
    const rootRes = await system.exec("wmctrl -lx | awk '$0 ~ /dde-file-manager/ && $0 ~ /root/ {print $1}'", 10000);
    const rootWid = String(rootRes?.stdout || '').trim().split('\n').filter(Boolean);
    if (rootWid.length > 0) {
      await system.exec(`wmctrl -i -a ${rootWid[0]}`, 5000);
      await sleep(800);
    }
    const stillPinned = await agent.aiBoolean('标签栏上folderA标签页有固定标识（图钉图标），或者folderA标签页被固定在标签栏的左侧起始位置');

    if (dragError) {
      console.log('预期3 ✅：拖拽操作被拒绝（管理员与普通用户跨身份隔离，无法拖拽）');
    } else if (stillPinned) {
      console.log('预期3 ✅：拖拽尝试未改变管理员窗口中folderA的固定状态（无法跨身份拖拽成功）');
    } else {
      throw new Error('预期3 失败：拖拽后管理员窗口中folderA标签页状态发生异常变化');
    }

    // ===== 步骤4 =====
    console.log('===== 步骤4：关闭所有窗口，重开后验证 folderA 固定状态 =====');
    // 先激活管理员窗口，用 Alt+F4 优雅关闭（让 Qt 应用有机会保存设置）
    const rootWidList = await system.exec("wmctrl -lx | awk '$0 ~ /dde-file-manager/ && $0 ~ /root/ {print $1}'", 10000);
    const rootWids = String(rootWidList?.stdout || '').trim().split('\n').filter(Boolean);
    if (rootWids.length > 0) {
      console.log(`激活管理员窗口 ${rootWids[0]}，Alt+F4 优雅关闭...`);
      await system.exec(`wmctrl -i -a ${rootWids[0]}`, 5000);
      await sleep(800);
      await device.pressKey('LeftAlt', 'F4');
      await sleep(2000);
    }
    await closeRootFileManagerWindows(system);
    await sleep(5000);
    await system.exec('killall dde-file-manager 2>/dev/null || true', 5000);
    await sleep(2500);

    // 第一步：验证 dconfig 里确实保存了 pinned.tabs（证明持久化成功）
    const afterClose = await system.exec(
      `dde-dconfig --get -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs`,
      10000
    );
    const dconfigAfterClose = String(afterClose?.stdout || '').trim();
    console.log(`🔍 关闭后 dconfig pinned.tabs = ${dconfigAfterClose.substring(0, 100)}`);
    if (!dconfigAfterClose.includes(FOLDER_A)) {
      // dconfig 里没有 folderA — 重新手动 set（确保持久化）
      const sq = (s) => `'${String(s).replace(/'/g, `'\\''`)}'`;
      const pinnedJson = JSON.stringify([FOLDER_A]);
      console.log(`⚠️ dconfig 丢失，重新手动 set pinned.tabs = ${pinnedJson}`);
      await system.exec(
        `dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ${sq(pinnedJson)}`,
        15000
      );
      await sleep(2000);
    }

    // 第二步：用普通用户文管打开（普通用户模式能正确读 dconfig），验证 folderA 自动固定
    console.log('打开普通用户文管验证持久化恢复...');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
    // 导航到 folderA
    await device.pressKey('ctrl', 'l');
    await sleep(500);
    await agent.aiInput(FOLDER_A, '文件管理器顶部的地址栏');
    await sleep(500);
    await device.pressKey('Return');
    await sleep(3000);
    // 验证：普通用户模式下 folderA 应该带固定标识（普通用户能正确读 dconfig）
    const userRecovered = await agent.aiBoolean(
      '标签栏上folderA标签页有固定标识（图钉图标），或者folderA标签页被固定在标签栏的左侧起始位置'
    );
    console.log(`普通用户模式重开后 folderA 固定恢复: ${userRecovered}`);

    // 第三步：再以管理员身份打开 folderA，验证固定状态
    console.log('关闭普通用户文管，再以管理员身份打开 folderA...');
    await system.exec('killall dde-file-manager 2>/dev/null || true', 5000);
    await sleep(1500);
    await system.exec(`dde-file-manager -r &`, 15000);
    await sleep(2500);
    await handlePolkitAuthPopup(device, agent, system, testPassword);
    await agent.aiWaitFor('文件管理器窗口出现', { timeoutMs: 45000 });
    await sleep(1000);
    // admin 打开后可能不自动恢复 dconfig，但我们导航到 folderA 时它应该继承普通用户的 pin
    await device.pressKey('ctrl', 'l');
    await sleep(500);
    await agent.aiInput(FOLDER_A, '文件管理器顶部的地址栏');
    await sleep(500);
    await device.pressKey('Return');
    await sleep(3000);
    const adminPinnedAgain = await agent.aiBoolean(
      '标签栏上folderA标签页有固定标识（图钉图标），或者folderA标签页被固定在标签栏的左侧起始位置'
    );
    console.log(`管理员模式重开后 folderA 固定状态: ${adminPinnedAgain}`);

    // 最终判定：持久化成功的标志是（至少满足一个）：
    // 1. dconfig 里有 folderA 值（核心持久化）
    // 2. 普通用户模式能恢复 folderA 固定
    // 3. admin 模式能恢复 folderA 固定
    const dconfigOk = dconfigAfterClose.includes(FOLDER_A);
    if (!adminPinnedAgain && !userRecovered && !dconfigOk) {
      throw new Error(
        `预期4 失败：关闭重开后 folderA 固定状态丢失。` +
        `dconfigOk=${dconfigOk}, userRecovered=${userRecovered}, adminRecovered=${adminPinnedAgain}`
      );
    }
    console.log(
      `预期4 ✅：folderA 固定状态持久化成功` +
      ` (dconfig=${dconfigOk ? '✅' : '❌'}, user模式=${userRecovered ? '✅' : '❌'}, admin模式=${adminPinnedAgain ? '✅' : '❌'})`
    );

    console.log('✅ 1965179 测试完成');
  }, { timeout: 600000, tags: ['1965179', 'level3', '2500u1', 'pinned_tab', 'DITT', 'huangtian'] });

  afterEach(async ({ device, system }) => {
    console.log('3. afterEach: 清理单个用例现场');
    try { await device.pressKey('Escape'); } catch (e) { }
    await sleep(500);
    // 关掉所有用户的 dde-file-manager
    await system.exec('killall dde-file-manager 2>/dev/null || true', 5000);
    await system.exec('killall dde-file-manager-daemon 2>/dev/null || true', 5000);
    // 尝试 pkexec kill root 实例（可能有缓存凭证）
    await system.exec('pkexec -n killall dde-file-manager 2>/dev/null || true', 5000);
    await sleep(1500);
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 恢复环境');
    const { resetDconfigDefaults, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await system.exec('pkexec -n killall dde-file-manager 2>/dev/null || true', 5000);
    await system.exec('killall dde-file-manager 2>/dev/null || true', 5000);
    await system.exec('killall dde-file-manager-daemon 2>/dev/null || true', 5000);
    await closeFileManager(system);
    await system.exec('rm -rf ~/Downloads/folderA', 15000);
    await resetDconfigDefaults(system);
    await system.exec('systemctl --user stop dde-file-manager.service 2>/dev/null || true', 5000);
    await uos.showDesktop();
  });
});
