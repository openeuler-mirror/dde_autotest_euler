/**
 * 用例 PMSID: 1832357
 * 用例标题: 【启动器】【窗口模式】【"自由排序"分类】【新建应用文件夹】单击修改应用文件夹名称
 * 生成时间: 2026-07-28
 * 用例编写人: UT005044(王亮)
 */

describe('1832357-【启动器】【窗口模式】【"自由排序"分类】【新建应用文件夹】单击修改应用文件夹名称', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 初始化/更新 item-arrangement.ini.22bak 文件
    // 配置说明：应用文件夹有1页应用（6个应用）
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
    console.log('item-arrangement.ini.22bak 已创建（应用文件夹含1页应用）');
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

  test('1832357-【启动器】【窗口模式】【"自由排序"分类】【新建应用文件夹】单击修改应用文件夹名称', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开启动器窗口模式，切换到"自由排序"分类
    console.log('步骤 1: 打开启动器窗口模式，切换到"自由排序"分类');
    await uos.openLauncher();
    await agent.aiWaitFor('启动器界面已显示');
    await agent.aiTap('启动器窗口左上角的排序模式图标', { deepThink: true });
    await agent.aiTap('自由排序');
    console.log('已切换到自由排序分类');

    // 步骤 2: 单击名为"系统管理"的应用文件夹
    console.log('步骤 2: 单击名为"系统管理"的应用文件夹');
    await agent.aiTap('名称为系统管理的应用文件夹图标', { deepThink: true });
    // 检查1: 打开应用文件夹浮层框
    await agent.aiAssert('应用文件夹浮层框已打开，显示文件夹内的应用图标');

    // 步骤 3: 单击"系统管理"名称
    console.log('步骤 3: 单击"系统管理"名称');
    await agent.aiTap('应用文件夹顶部的"系统管理"名称文字');
    // 检查2: 整个名称被选中，被选中时的底色清晰可见
    await agent.aiAssert('整个名称被选中，被选中时的底色清晰可见');

    // 步骤 4: 使用for循环输入多类字符测试修改名称
    console.log('步骤 4: 使用for循环输入多类字符测试修改名称');
    const testNames = ['123', 'ABC', '新名称测试', 'Test123', '测试123ABC'];
    for (let i = 0; i < testNames.length; i++) {
      const newName = testNames[i];
      console.log(`  第${i + 1}次测试: 输入名称"${newName}"`);
      await device.typeText(newName);
      await device.pressKey('Enter');
      console.log(`  已输入名称"${newName}"并回车`);
      // 检查3: 应用名称修改成功
      await agent.aiAssert(`应用文件夹名称已修改为"${newName}"`);
      // 重新进入编辑模式，准备下一次输入
      await agent.aiTap(`应用文件夹顶部的"${newName}"名称文字`);
      await agent.aiAssert('整个名称被选中，被选中时的底色清晰可见');
    }

  }, { timeout: 600000, tags: ['1832357', 'level3'] });

  afterEach(async ({ device, system }) => {
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
