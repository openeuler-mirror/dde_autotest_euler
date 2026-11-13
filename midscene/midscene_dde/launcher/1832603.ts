/**
 * 用例 PMSID: 1832603
 * 用例标题: 【启动器】【全屏模式】【遮挡弹窗】唤出通知中心，打开启动器全屏模式，通知中心弹窗被遮挡
 * 生成时间: 2026-08-06
 * 用例编写人: UT002485（卢燕）
 */

describe('1832603-【启动器】【全屏模式】【遮挡弹窗】唤出通知中心，打开启动器全屏模式，通知中心弹窗被遮挡', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 通过配置文件设置启动器为全屏模式并重启 dde-shell
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=WindowedFrame/current_frame=FullscreenFrame/' ${configPath}`);
    await system.exec(`kill -9 $(pgrep -x dde-shell) 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('已设置启动器为全屏模式');
  });

  beforeEach(async ({ device, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1832603-【启动器】【全屏模式】【遮挡弹窗】唤出通知中心，打开启动器全屏模式，通知中心弹窗被遮挡', async ({ device, agent, uos }) => {
    // 步骤1：点击快捷键 super+m 唤出通知中心
    console.log('步骤1：快捷键 Super+M 唤出通知中心');
    await device.pressKey('Super', 'M');
    await agent.aiWaitFor('通知中心弹窗已显示', { timeoutMs: 30000 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 检查：通知中心已唤出
    await agent.aiAssert('通知中心弹窗已显示在屏幕右侧');

    // 步骤2：打开启动器全屏模式
    console.log('步骤2：打开启动器全屏模式');
    await device.pressKey('Super');
    await agent.aiWaitFor('启动器全屏模式已显示，包含应用图标网格列表', { timeoutMs: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查：通知中心弹窗被遮挡（启动器全屏模式覆盖整个屏幕，通知中心弹窗不可见）
    await agent.aiAssert('启动器全屏模式已打开，界面显示了应用图标网格列表，启动器覆盖整个屏幕，通知中心弹窗不可见');
  }, { timeout: 600000, tags: ['1832603', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();
    // 还原启动器为窗口模式
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${configPath}`);
    await system.exec(`kill -9 $(pgrep -x dde-shell) 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('已还原启动器为窗口模式');
  });
});
