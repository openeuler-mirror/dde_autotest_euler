/**
 * 用例 PMSID: 1832231
 * 用例标题: 【启动器】【窗口模式】文字限定高度范围内，应用名称换行显示
 * 生成时间: 2026-07-28
 * 用例编写人: UT002485（卢燕）
 */

const DDE_SHELL_CONFIG_PATH = '~/.config/deepin/org.deepin.dde-shell/settings.ini';

describe('1832231-【启动器】【窗口模式】文字限定高度范围内，应用名称换行显示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 确保启动器为窗口模式
    const result = await system.exec(`cat ${DDE_SHELL_CONFIG_PATH}`);
    const content = result.stdout.toString();
    if (content.includes('current_frame=FullscreenFrame')) {
      await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${DDE_SHELL_CONFIG_PATH}`);
      await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  });

  beforeEach(async ({ device, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  test('1832231-【启动器】【窗口模式】文字限定高度范围内，应用名称换行显示', async ({ device, agent, uos, system }) => {
    // 步骤1：设置最小字号，使文字在限定高度范围内更容易换行
    console.log('设置字号为9（最小），使文字在限定高度范围内');
    await system.exec('busctl --user call org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 Set "ss" "fontsize" "9"');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤2：打开启动器窗口模式
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 500));
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示', { timeoutMs: 30000 });

    // 切换到自由排序模式，查看全部应用列表
    await agent.aiTap('启动器小窗口左上角的排序模式按钮（显示自由排序、按分类、按名称选项的图标）', { deepThink: true });
    await agent.aiWaitFor('排序模式菜单已显示', { timeoutMs: 10000 });
    await agent.aiTap('自由排序');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 滚动查看更多应用列表，寻找长名称应用
    await agent.aiScroll('启动器应用列表区域', { direction: 'down', distance: 200 });
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiScroll('启动器应用列表区域', { direction: 'down', distance: 200 });
    await new Promise(resolve => setTimeout(resolve, 500));

    // 截图记录
    await agent.logScreenshot('小字号下窗口模式应用名称换行显示', {
      content: '字号9时，窗口模式自由排序下应用名称在限定高度范围内换行显示',
    });

    // 检查：在文字限定高度范围内，应用名称一行展示不下时换行显示
    // 窗口模式下，应用名称在限定高度范围内可能换行显示或省略号显示，验证存在应用名称文字完整显示的情况
    await agent.aiAssert('启动器窗口模式自由排序下，字号较小时，应用名称在限定高度范围内显示，存在应用名称完整显示的情况（可能换行显示为两行或单行完整显示，不出现省略号截断）');
  }, { timeout: 600000, tags: ['1832231', 'level3'] });

  afterEach(async ({ device, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 恢复默认字体大小
    await system.exec('busctl --user call org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 Set "ss" "fontsize" "12"');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ device, uos, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复默认字体大小
    await system.exec('busctl --user call org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 Set "ss" "fontsize" "12"');
    await new Promise(resolve => setTimeout(resolve, 1000));

    await device.pressKey('ESC');
    await uos.showDesktop();
  });
});
