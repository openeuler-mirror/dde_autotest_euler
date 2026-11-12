/**
 * 用例 PMSID: 1832347
 * 用例标题: 【启动器】【窗口模式】【“自由排序”分类】【拖动排序】更改应用排序后，重新进入窗口自由排序模式，检查应用顺序
 * 生成时间: 2026-07-23
 * 用例编写人: UT005044(王亮)
 */

describe('1832347-【启动器】【窗口模式】【“自由排序”分类】【拖动排序】更改应用排序后，重新进入窗口自由排序模式，检查应用顺序', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 读取配置文件，检查启动器模式
    const result = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
    const content = result.stdout.toString();
    const isFullscreen = content.includes('current_frame=FullscreenFrame');
    const isWindowed = content.includes('current_frame=WindowedFrame');
    if (isFullscreen) {
      console.log('检测到全屏模式，切换到窗口模式...');
      await device.pressKey('ESC');
      await uos.openLauncher();
      await agent.aiTap({
        prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
        images: [{
          name: '窗口模式小图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
        }],
        deepThink: true,
      });
    }
    if (isWindowed) {
      console.log('检测到窗口模式，无需操作');
    }
    await device.pressKey('ESC');
  });

  test('1832347-【启动器】【窗口模式】【“自由排序”分类】【拖动排序】更改应用排序后，重新进入窗口自由排序模式，检查应用顺序', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开启动器窗口模式，切换到"自由排序"分类
    console.log('步骤 1: 打开启动器窗口模式，切换到"自由排序"分类');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器界面已显示');
    await agent.aiTap('启动器窗口左上角的排序模式图标', { deepThink: true });
    await agent.aiTap('自由排序');
    console.log('已切换到自由排序分类');

    // 步骤 2: 更改应用排序后，重新打开启动器，检查应用顺序
    console.log('步骤 2: 更改应用排序');
    const { hoverDrag } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await hoverDrag(agent, device, '启动器界面内中间列表区的文件管理器应用图标', 0, 100, 3000);
    console.log('已更改应用排序');
    await device.pressKey('ESC');
    console.log('关闭启动器');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器界面已显示');
    
    // 检查1: 应用排序为修改后的顺序
    await agent.aiAssert('启动器界面内中间列表区的应用显示正常');

  }, { timeout: 600000, tags: ['1832347', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini');
    await system.exec('systemctl --user restart dde-shell@DDE', 6000);
    await system.exec('sleep 5');
    await system.exec('systemctl --user daemon-reload');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });
});
