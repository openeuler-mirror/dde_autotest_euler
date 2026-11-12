/**
 * 用例 PMSID: 1832427
 * 用例标题: 【启动器】【窗口模式】【我的常用】"我的常用"模块应用布局检查
 * 生成时间: 2026-08-06
 * 用例编写人: UT002485（卢燕）
 */

describe('1832427-【启动器】【窗口模式】【我的常用】"我的常用"模块应用布局检查', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 确保启动器为窗口模式
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${configPath}`);
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('已设置启动器为窗口模式');
  });

  beforeEach(async ({ device, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1832427-【启动器】【窗口模式】【我的常用】"我的常用"模块应用布局检查', async ({ device, agent, uos }) => {
    // 步骤1：打开启动器窗口模式，检查"我的常用"模块应用布局
    console.log('步骤1：打开启动器窗口模式，检查"我的常用"模块应用布局');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示', { timeoutMs: 30000 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 检查：每行展示4个图标，从左向右依次排序
    await agent.aiAssert('启动器窗口模式"我的常用"模块中每行展示4个应用图标，从左向右依次排序');
  }, { timeout: 600000, tags: ['1832427', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });
});
