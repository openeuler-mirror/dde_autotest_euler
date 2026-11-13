/**
 * 用例 PMSID: 1832541
 * 用例标题: 【启动器】【全屏模式】检查应用图标默认大小
 * 生成时间: 2026/8/5
 * 用例编写人: UT002485（卢燕）
 */

const DDE_SHELL_CONFIG_PATH = '~/.config/deepin/org.deepin.dde-shell/settings.ini';

describe('1832541-【启动器】【全屏模式】检查应用图标默认大小', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 确保启动器为全屏模式
    const result = await system.exec(`cat ${DDE_SHELL_CONFIG_PATH}`);
    const content = result.stdout.toString();
    if (content.includes('current_frame=WindowedFrame')) {
      await system.exec(`sed -i 's/current_frame=WindowedFrame/current_frame=FullscreenFrame/' ${DDE_SHELL_CONFIG_PATH}`);
      await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
    // 确保字体大小为默认值 12
    await system.exec('busctl --user call org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 Set "ss" "fontsize" "12"');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('已设置启动器为全屏模式，字体为默认大小12');
  });

  beforeEach(async ({ device, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  test('1832541-【启动器】【全屏模式】检查应用图标默认大小', async ({ device, agent, uos }) => {
    // 步骤1：打开启动器全屏模式
    await uos.openLauncher();
    await agent.aiWaitFor('启动器全屏模式已打开', { timeoutMs: 20000 });

    // 检查：全屏模式下的应用图标默认大小为第二大尺寸
    await agent.aiAssert('启动器全屏模式下，应用图标为默认大小（第二大尺寸，图标与图标之间间距适中，非最大尺寸也非最小尺寸）');
  }, { timeout: 600000, tags: ['1832541', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ device, uos, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();

    // 还原启动器为窗口模式
    await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${DDE_SHELL_CONFIG_PATH}`);
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('已还原启动器为窗口模式');
  });
});
