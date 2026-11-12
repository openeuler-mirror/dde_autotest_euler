/**
 * 用例 PMSID: 1832363
 * 用例标题: 【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】同页内拖动应用，图标自行补位移动
 * 生成时间: 2026-07-28
 * 用例编写人: UT005044(王亮)
 */

describe('1832363-【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】同页内拖动应用，图标自行补位移动', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 初始化/更新 item-arrangement.ini.22bak 文件
    // 配置说明：应用文件夹有1页应用（6个应用），用于测试同页内拖动补位
    const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
    const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=1
1\\pageItems\\0=dde-file-manager.desktop, deepin-terminal.desktop, downloader.desktop, deepin-defender.desktop, deepin-system-monitor.desktop, deepin-devicemanager.desktop
toplevel\\pageCount=2
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop, deepin-app-store.desktop, deepin-pc-manager.desktop, uos-ai-assistant.desktop
toplevel\\pageItems\\1=dde-computer.desktop, dde-trash.desktop, dde-printer.desktop
MIDSCEOF`;
    const bakResult = await system.exec(bakWriteCmd);
    assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');
    console.log('item-arrangement.ini.22bak 已创建（应用文件夹含1页6个应用）');
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
    const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';

    const replaceCmd = `cp -f ${bakIniPath} ${iniPath}`;
    const replaceResult = await system.exec(replaceCmd);
    assertTrue(replaceResult.success, '替换 item-arrangement.ini 配置文件失败');
    console.log('item-arrangement.ini 已使用 .22bak 文件覆盖');

    await system.exec('systemctl --user daemon-reload');
    await system.exec('systemctl --user restart dde-shell@DDE', 60000);
    await system.exec('sleep 5');
    const statusResult = await system.exec('systemctl --user is-active dde-shell@DDE');
    assertTrue(statusResult.success && statusResult.stdout.trim() === 'active', 'dde-shell服务未正常启动');
    console.log('=====================================');
    console.log('【dde-shell服务重启成功，使 item-arrangement.ini 生效】');
    console.log('=====================================');

    // 读取配置文件，检查启动器模式
    const result = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
    assertTrue(result.success, '读取配置文件失败');
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

  test('1832363-【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】同页内拖动应用，图标自行补位移动', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开启动器窗口模式，切换到"自由排序"分类
    console.log('步骤 1: 打开启动器窗口模式，切换到"自由排序"分类');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器界面已显示');
    await agent.aiTap('启动器窗口左上角的排序模式图标', { deepThink: true });
    await agent.aiTap('自由排序');
    console.log('已切换到自由排序分类');

    // 步骤 2: 同页内拖动应用，从起始位置到目的位置
    console.log('步骤 2: 同页内拖动应用，从起始位置到目的位置');
    await agent.aiTap('名称为系统管理的应用文件夹图标', { deepThink: true });
    await agent.aiAssert('应用文件夹浮层框已打开，显示文件夹内的应用图标');

    const { aiDragHover } = await import(`${caseDir}midscene_dde/common/common.js`);
    await aiDragHover(agent, '应用文件夹浮层框内的第一个位置的应用图标', '浮层框内第一行第三个位置的图标', system, {
    waitForHover: 1500,
    // assertion: '查看当前截图，底部任务栏上出现了与ADragTest图标一模一样的驻留图标',
    });
    console.log('水平向右拖动图标补位移动');
    // 检查1: 水平向右拖动图标补位移动
    await agent.aiAssert('应用文件夹浮层框内的文件管理器图标展示到了第一行第三个图标位置');

    await aiDragHover(agent, '应用文件夹浮层框内的第二行第一个位置的应用图标', '浮层框内第一行第一个位置的图标名称上', system, {
    waitForHover: 1500,
    // assertion: '查看当前截图，底部任务栏上出现了与ADragTest图标一模一样的驻留图标',
    });
    console.log('垂直向上拖动图标补位移动');
    // 检查2: 垂直向上拖动图标补位移动
    await agent.aiAssert('应用文件夹浮层框内的系统监视器图标展示到了第一行的图标位置');

  }, { timeout: 600000, tags: ['1832363', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('esc');
    await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini');
    console.log('item-arrangement.ini 已删除');
    await system.exec('systemctl --user restart dde-shell@DDE', 60000);
    await system.exec('sleep 5');
    console.log('dde-shell 服务已重启');
    await system.exec('systemctl --user daemon-reload');
    console.log('systemctl --user daemon-reload 已执行');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
