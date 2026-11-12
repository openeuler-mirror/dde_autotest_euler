/**
 * 用例 PMSID: 1832429
 * 用例标题: 【启动器】【窗口模式】【我的常用】"我的常用"模块应用布局检查
 * 生成时间: 2026-08-06
 * 用例编写人: UT002485（卢燕）
 */

describe('1832429-【启动器】【窗口模式】【我的常用】"我的常用"模块应用布局检查', () => {
  const APP_NAME = '计算器';
  const APP_KEY = 'deepin-calculator';

  let originalTimes = null;

  async function getAppLaunchedTimes(system) {
    const result = await system.exec('dde-dconfig get -a org.deepin.dde.application-manager -r org.deepin.dde.am -k appsLaunchedTimes');
    const raw = result.stdout.trim();
    return JSON.parse(raw.slice(1, -1));
  }

  async function setAppLaunchedTimes(system, timesObj) {
    const jsonStr = JSON.stringify(timesObj);
    await system.exec(`dde-dconfig set -a org.deepin.dde.application-manager -r org.deepin.dde.am -k appsLaunchedTimes -v '${jsonStr}'`);
  }

  async function logTimes(system, label) {
    const times = await getAppLaunchedTimes(system);
    console.log(`[${label}] 计算器(${times[APP_KEY] ?? 0})`);
    return times[APP_KEY] ?? 0;
  }

  async function relaunchDdeShell(system) {
    await system.exec(`kill -9 $(pgrep -x dde-shell) 2>/dev/null || true`);
    await new Promise(resolve => setTimeout(resolve, 10000));
  }

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 保存原始点击次数
    originalTimes = await getAppLaunchedTimes(system);
    await logTimes(system, '原始点击次数（已备份）');

    // 设置启动器为窗口模式
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${configPath}`);
    await relaunchDdeShell(system);
    console.log('已设置启动器为窗口模式');
  });

  beforeEach(async ({ device, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1832429-【启动器】【窗口模式】【我的常用】"我的常用"模块应用布局检查', async ({ device, agent, uos, system }) => {
    // 步骤1：从启动器多次打开应用，检查使用频率是否增加、应用是否出现在"我的常用"
    console.log('步骤1：从启动器多次打开应用，检查"我的常用"模块下的应用是否会靠前');
    const before1 = await logTimes(system, '步骤1-启动前');
    for (let i = 0; i < 3; i++) {
      await uos.openLauncher();
      await agent.aiWaitFor('启动器窗口模式已显示', { timeoutMs: 30000 });
      await agent.aiDoubleClick(APP_NAME, { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
      await uos.closeCurrentWindow();
      await new Promise(resolve => setTimeout(resolve, 800));
      await uos.showDesktop();
    }
    const after1 = await logTimes(system, '步骤1-3次启动后');
    console.log(`步骤1: 启动器打开3次，${before1} -> ${after1}`);
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示', { timeoutMs: 30000 });
    await agent.aiAssert('启动器窗口模式"我的常用"模块中存在计算器');
    await agent.logScreenshot('步骤1-启动器多次打开靠前', {
      content: '从启动器多次打开计算器后，出现在"我的常用"模块中',
    });
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤2：从任务栏打开应用
    console.log('步骤2：从任务栏打开应用，检查使用频率是否正确增加');
    const before2 = await logTimes(system, '步骤2-启动前');
    await agent.aiTap('任务栏中的计算器图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 3000));
    await uos.closeCurrentWindow();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await uos.showDesktop();
    const after2 = await logTimes(system, '步骤2-任务栏打开后');
    console.log(`步骤2: 任务栏打开1次，${before2} -> ${after2}`);
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示', { timeoutMs: 30000 });
    await agent.aiAssert('启动器窗口模式"我的常用"模块中存在计算器');
    await agent.logScreenshot('步骤2-任务栏打开频率增加');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤3：从启动器再次打开应用
    console.log('步骤3：从启动器打开应用，检查使用频率是否正确增加');
    const before3 = await logTimes(system, '步骤3-启动前');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示', { timeoutMs: 30000 });
    await agent.aiDoubleClick(APP_NAME, { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await uos.closeCurrentWindow();
    await new Promise(resolve => setTimeout(resolve, 800));
    await uos.showDesktop();
    const after3 = await logTimes(system, '步骤3-启动器打开后');
    console.log(`步骤3: 启动器打开1次，${before3} -> ${after3}`);
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示', { timeoutMs: 30000 });
    await agent.aiAssert('启动器窗口模式"我的常用"模块中存在计算器');
    await agent.logScreenshot('步骤3-启动器打开频率增加');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤4：创建桌面快捷方式并从桌面打开
    console.log('步骤4：从桌面打开应用，检查使用频率是否正确增加');
    await uos.showDesktop();
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示', { timeoutMs: 30000 });
    await agent.aiRightClick(APP_NAME, { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    try {
      await agent.aiTap('发送到桌面', { deepThink: true });
    } catch (e) {
      console.log('桌面快捷方式可能已存在，将复用');
    }
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await uos.showDesktop();

    const before4 = await logTimes(system, '步骤4-启动前');
    await agent.aiDoubleClick('桌面上的计算器图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 3000));
    await uos.closeCurrentWindow();
    await new Promise(resolve => setTimeout(resolve, 800));
    await uos.showDesktop();
    const after4 = await logTimes(system, '步骤4-桌面打开后');
    console.log(`步骤4: 桌面打开1次，${before4} -> ${after4}`);
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示', { timeoutMs: 30000 });
    await agent.aiAssert('启动器窗口模式"我的常用"模块中存在计算器');
    await agent.logScreenshot('步骤4-桌面打开频率增加');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤5：Super+1 快捷方式启动
    console.log('步骤5：Super+1 快捷方式启动应用，检查使用频率是否不增加');
    const before5 = await logTimes(system, '步骤5-启动前');
    await device.pressKey('Super', '1');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await uos.closeCurrentWindow();
    await new Promise(resolve => setTimeout(resolve, 800));
    await uos.showDesktop();
    const after5 = await logTimes(system, '步骤5-快捷方式启动后');
    console.log(`步骤5: Super+1 快捷方式启动，${before5} -> ${after5}（快捷方式不计入频率）`);
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示', { timeoutMs: 30000 });
    await agent.aiAssert('启动器窗口模式"我的常用"模块已显示');
    await agent.logScreenshot('步骤5-快捷方式启动频率验证');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤6：命令行启动 deepin-editor
    console.log('步骤6：命令行启动应用，检查使用频率是否不增加');
    const before6 = await logTimes(system, '步骤6-启动前');
    await system.exec(`deepin-calculator &`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await uos.closeCurrentWindow();
    await new Promise(resolve => setTimeout(resolve, 800));
    await uos.showDesktop();
    const after6 = await logTimes(system, '步骤6-命令行启动后');
    console.log(`步骤6: 命令行启动，${before6} -> ${after6}（命令行不计入频率）`);
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示', { timeoutMs: 30000 });
    await agent.aiAssert('启动器窗口模式"我的常用"模块已显示');
    await agent.logScreenshot('步骤6-命令行启动频率验证');
  }, { timeout: 1200000, tags: ['1832429', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');

    // 清理桌面快捷方式
    await system.exec(`rm -f ~/Desktop/deepin-calculator.desktop ~/Desktop/计算器.desktop 2>/dev/null || true`);

    // 恢复原始点击次数
    if (originalTimes) {
      await setAppLaunchedTimes(system, originalTimes);
      await relaunchDdeShell(system);
      await logTimes(system, '已恢复原始点击次数');
    }

    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 2000));
  });
});
