/**
 * 用例 PMSID: 1832421
 * 用例标题: 【启动器】【窗口模式】【“自由排序”分类】【应用文件夹】用文件夹开启状态，点击应用文件夹内非应用图标区域，启动器不响应
 * 生成时间: 2026-07-23
 * 用例编写人: UT005044(王亮)
 */

describe('1832421-【启动器】【窗口模式】【“自由排序”分类】【应用文件夹】用文件夹开启状态，点击应用文件夹内非应用图标区域，启动器不响应', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 初始化/更新 item-arrangement.ini.22bak 文件
    // 配置说明：应用文件夹有1页应用且已满（12个应用，无空位）
    const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
    const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=1
1\\pageItems\\0=dde-file-manager.desktop, deepin-album.desktop, deepin-draw.desktop, deepin-reader.desktop, deepin-editor.desktop, deepin-mail.desktop, deepin-terminal.desktop, downloader.desktop, deepin-manual.desktop, dde-computer.desktop, dde-trash.desktop, deepin-system-monitor.desktop
toplevel\\pageCount=2
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop, deepin-calculator.desktop, deepin-calendar.desktop, deepin-camera.desktop, deepin-music.desktop
toplevel\\pageItems\\1=deepin-screen-recorder.desktop, deepin-voice-note.desktop, deepin-movie.desktop, deepin-picker.desktop
MIDSCEOF`;
    const bakResult = await system.exec(bakWriteCmd);
    assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');
    console.log('item-arrangement.ini.22bak 已创建（应用文件夹含1页，已满12个应用）');
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

  test('1832421-【启动器】【窗口模式】【“自由排序”分类】【应用文件夹】用文件夹开启状态，点击应用文件夹内非应用图标区域，启动器不响应', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开启动器窗口模式，切换到"自由排序"分类
    console.log('步骤 1: 打开启动器窗口模式，切换到"自由排序"分类');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器界面已显示');
    await agent.aiTap('启动器窗口左上角的排序模式图标', { deepThink: true });
    await agent.aiTap('自由排序');
    console.log('已切换到自由排序分类');

    // 步骤 2: 打开应用文件夹，点击应用文件夹内非应用图标区域
    console.log('步骤 2: 打开应用文件夹，点击应用文件夹内非应用图标区域');
    // 打开应用文件夹
    await agent.aiTap('名称为系统管理的应用文件夹图标', { deepThink: true });
    await agent.aiAssert('应用文件夹浮层框已打开，显示文件夹内的应用图标');
    await agent.aiTap('应用文件夹浮层框内顶部的空白区域');
    console.log('已点击文件夹内非图标区域');
    // 检查1: 启动器不响应
    await agent.aiAssert('应用文件夹浮层框仍然保持打开状态，启动器无变化');

  }, { timeout: 600000, tags: ['1832421', 'level3'] });

  afterEach(async ({ device, system}) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('esc');
    // 清理环境：删除相关配置文件，重新加载
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
