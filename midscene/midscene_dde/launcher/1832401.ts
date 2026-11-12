/**
 * 用例 PMSID: 1832401
 * 用例标题: 【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】应用图标移出应用文件夹，从文件夹右边拖动图标离开文件夹边界，不松手
 * 生成时间: 2026-09-10
 * 用例编写人: UT005044(王亮)
 */

describe('1832401-【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】应用图标移出应用文件夹，从文件夹右边拖动图标离开文件夹边界，不松手', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 初始化/更新 item-arrangement.ini.22bak 文件
    // 配置说明：应用文件夹1页3个应用
    const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
    const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=系统管理
1\\pageCount=1
1\\pageItems\\0=dde-file-manager.desktop, deepin-draw.desktop, deepin-editor.desktop
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop
MIDSCEOF`;
    const bakResult = await system.exec(bakWriteCmd);
    assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');
    console.log('item-arrangement.ini.22bak 已创建（应用文件夹1页3个应用）');
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
    const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
    const replaceResult = await system.exec(`cp -f ${bakIniPath} ${iniPath}`);
    assertTrue(replaceResult.success, '替换 item-arrangement.ini 配置文件失败');
    console.log('item-arrangement.ini 已使用 .22bak 文件覆盖');

    await system.exec('systemctl --user daemon-reload');
    await system.exec('systemctl --user restart dde-shell@DDE', 60000);
    await system.exec('sleep 5');
    const statusResult = await system.exec('systemctl --user is-active dde-shell@DDE');
    assertTrue(statusResult.success && statusResult.stdout.trim() === 'active', 'dde-shell服务未正常启动');
    console.log('dde-shell 服务已重启，item-arrangement.ini 已生效');

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

  test('1832401-【启动器】【窗口模式】【"自由排序"分类】【应用文件夹】应用图标移出应用文件夹，从文件夹右边拖动图标离开文件夹边界，不松手', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开启动器窗口模式，切换到"自由排序"分类
    console.log('步骤 1: 打开启动器窗口模式，切换到"自由排序"分类');
    await uos.openLauncher();
    await new Promise(r => setTimeout(r, 2000));
    await agent.aiTap('启动器窗口左上角的排序模式图标', { deepThink: true });
    await agent.aiTap('自由排序');
    console.log('已切换到自由排序分类');

    // 步骤 2: 打开应用文件夹
    console.log('步骤 2: 打开应用文件夹');
    await agent.aiTap('名称为系统管理的应用文件夹图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 1000));

    // 步骤 3: 拖动第一个图标向右离开文件夹边界，保持不松手
    console.log('步骤 3: 拖动第一个图标向右离开文件夹边界，保持不松手');
    const pcService = device.getPCService();

    // 使用aiHover定位第一个图标
    console.log('定位文件夹内第一个应用图标');
    await agent.aiHover('应用文件夹浮层框内的第一个应用图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 500));
    const pos = await pcService.mouse.getPosition();
    const srcX = pos.x;
    const srcY = pos.y;
    // 向右拖动500px离开文件夹右边界
    const targetX = srcX + 500;
    console.log(`源图标坐标(物理): (${srcX}, ${srcY}), 目标X: ${targetX}`);

    // 按下鼠标
    console.log('按下鼠标');
    await pcService.mouse.pressButton(0);
    await new Promise(r => setTimeout(r, 800));

    // 缓慢拖到文件夹右边界外
    console.log('缓慢拖拽图标向右离开文件夹边界');
    const steps = 25;
    const stepX = (targetX - srcX) / steps;
    for (let i = 1; i <= steps; i++) {
      await pcService.mouse.move([{ x: Math.round(srcX + stepX * i), y: srcY }]);
      await new Promise(r => setTimeout(r, 25));
    }

    // 保持不松手，悬浮在文件夹边界外2秒（文件夹应关闭，显示启动器页面）
    console.log('悬浮在文件夹边界外，保持按住不松手，等待文件夹关闭');
    for (let i = 0; i < 2; i++) {
      await pcService.mouse.move([{ x: targetX + (i % 2 === 0 ? 0 : 2), y: srcY }]);
      await new Promise(r => setTimeout(r, 1000));
    }

    // 检查1: 移出图标到浮层框外，应用文件夹浮层框会消失，启动器保持显示
    await agent.aiAssert('启动器界面保持展示，区域内上方不存在应用文件夹浮层框，应用图标和标题显示正常');

    // 释放鼠标
    console.log('释放鼠标');
    await pcService.mouse.releaseButton(0);
    await new Promise(r => setTimeout(r, 2000));
    console.log('已释放鼠标，预期文件夹已关闭，显示启动器页面');

  }, { timeout: 600000, tags: ['1832401', 'level3'] });

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
    await device.pressKey('ESC');
    await uos.showDesktop();
  });
});
