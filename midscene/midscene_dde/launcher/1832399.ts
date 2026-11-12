/**
 * 用例 PMSID: 1832399
 * 用例标题: 【启动器】【窗口模式】【“自由排序”分类】【应用文件夹】应用图标移出应用文件夹，从文件夹左边拖动图标离开文件夹边界，释放图标到目标文件夹
 * 生成时间: 2026-09-09
 * 用例编写人: UT002485（卢燕）
 */

describe('1832399-【启动器】【窗口模式】【“自由排序”分类】【应用文件夹】应用图标移出应用文件夹，从文件夹左边拖动图标离开文件夹边界，释放图标到目标文件夹', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const iniPath = '/home/uos/.config/deepin/dde-launchpad/item-arrangement.ini';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 预置：两个字面量文件夹——文件夹1（我的文件夹，源，6个应用）、文件夹2（目标文件夹，目标，1个应用）
    const preset = `[fullscreen]
1\\name=我的文件夹
1\\pageCount=1
1\\pageItems\\0=dde-file-manager.desktop, deepin-terminal.desktop, deepin-system-monitor.desktop, deepin-devicemanager.desktop, dde-printer.desktop, dde-calendar.desktop
2\\name=目标文件夹
2\\pageCount=1
2\\pageItems\\0=deepin-editor.desktop
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1, internal/folders/2, org.deepin.browser.desktop, deepin-app-store.desktop
`;
    const b64 = Buffer.from(preset).toString('base64');
    await system.exec('mkdir -p /home/uos/.config/deepin/dde-launchpad/');
    await system.exec(`python3 -c "import base64; f=open('${iniPath}','w'); f.write(base64.b64decode('${b64}').decode()); f.close()"`);

    // 自由排序模式 + 窗口模式
    await system.exec('dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.launchpad -k categoryType -v 2');
    const configPath = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${configPath}`);

    await system.exec('systemctl --user daemon-reload');
    await system.exec('systemctl --user restart dde-shell@DDE', 60000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    const statusResult = await system.exec('systemctl --user is-active dde-shell@DDE');
    assertTrue(statusResult.success && statusResult.stdout.trim() === 'active', 'dde-shell服务未正常启动');
    console.log('dde-shell服务重启成功，配置已生效');
  });

  beforeEach(async ({ device, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1500));
  });

  test('1832399-【启动器】【窗口模式】【“自由排序”分类】【应用文件夹】应用图标移出应用文件夹，从文件夹左边拖动图标离开文件夹边界，释放图标到目标文件夹', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器窗口模式（自由排序）
    console.log('步骤1：打开启动器窗口模式');
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2500));
    const launcherChk = await system.exec(`DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority xdotool search --name launchpad 2>/dev/null || true`);
    if (!(launcherChk.stdout || '').trim()) {
      console.log('启动器窗口未检测到，重试打开');
      await device.pressKey('Super');
      await new Promise(resolve => setTimeout(resolve, 2500));
    }
    await agent.aiAssert('启动器窗口模式已显示');

    const pcService = device.getPCService();

    // 步骤2：先定位目标文件夹（目标文件夹）位置——在打开源文件夹弹窗前定位，左侧列表不被弹窗遮挡
    console.log('步骤2：定位目标文件夹图标位置');
    await agent.aiHover('启动器左侧列表中名称为目标文件夹的应用文件夹图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    const targetPos = await pcService.mouse.getPosition();
    const targetX = targetPos.x;
    const targetY = targetPos.y;
    console.log(`目标文件夹位置: (${targetX}, ${targetY})`);

    // 步骤3：打开源应用文件夹（我的文件夹）
    console.log('步骤3：打开源应用文件夹（我的文件夹）');
    await agent.aiTap('名称为我的文件夹的应用文件夹图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤4：定位弹窗内第一行第一个应用图标（文件管理器，位于弹窗左侧）
    console.log('步骤4：定位源图标（弹窗内第一行第一个：文件管理器）');
    await agent.aiHover('我的文件夹弹窗内第一行第一个应用图标（文件管理器）', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    const srcPos = await pcService.mouse.getPosition();
    const srcX = srcPos.x;
    const srcY = srcPos.y;
    console.log(`源图标位置: (${srcX}, ${srcY})`);

    // 步骤5：按住鼠标左键，从文件夹左边拖动图标离开文件夹边界，再移动到目标文件夹释放
    console.log('步骤5：拖动图标离开文件夹边界并释放到目标文件夹');
    await pcService.mouse.move([{ x: srcX, y: srcY }]);
    await new Promise(resolve => setTimeout(resolve, 500));
    await pcService.mouse.pressButton(0);
    await new Promise(resolve => setTimeout(resolve, 800));

    // 先向左拖动离开文件夹弹窗边界（左移90px）
    const step = 15;
    const delayMs = 15;
    const exitX = srcX - 90;
    let currX = srcX;
    while (currX > exitX) {
      currX = Math.max(currX - step, exitX);
      await pcService.mouse.move([{ x: currX, y: srcY }]);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    await new Promise(resolve => setTimeout(resolve, 800));

    // 再移动到目标文件夹中心位置（先X后Y分步）
    let cx = exitX;
    while (cx > targetX) {
      cx = Math.max(cx - step, targetX);
      await pcService.mouse.move([{ x: cx, y: srcY }]);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    while (cx < targetX) {
      cx = Math.min(cx + step, targetX);
      await pcService.mouse.move([{ x: cx, y: srcY }]);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    let cy = srcY;
    while (cy > targetY) {
      cy = Math.max(cy - step, targetY);
      await pcService.mouse.move([{ x: targetX, y: cy }]);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    while (cy < targetY) {
      cy = Math.min(cy + step, targetY);
      await pcService.mouse.move([{ x: targetX, y: cy }]);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
    await pcService.mouse.move([{ x: targetX, y: targetY }]);
    // 悬浮在目标文件夹上1.2秒，等待目标文件夹高亮
    await new Promise(resolve => setTimeout(resolve, 1200));

    // 松开鼠标左键，释放图标到目标文件夹
    await pcService.mouse.releaseButton(0);
    await new Promise(resolve => setTimeout(resolve, 2500));
    console.log(`拖拽完成: (${srcX}, ${srcY}) -> (${targetX}, ${targetY})`);

    // 步骤6：验证源文件夹弹窗已关闭，显示启动器界面
    console.log('步骤6：验证文件夹弹窗已关闭');
    await agent.aiAssert('我的文件夹弹窗已关闭，显示启动器窗口界面');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 步骤7：打开目标文件夹，验证文件管理器已移入
    console.log('步骤7：验证文件管理器已移入目标文件夹');
    await agent.aiTap('名称为目标文件夹的应用文件夹图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('目标文件夹弹窗内显示文件管理器应用图标');
  }, { timeout: 600000, tags: ['1832399', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 1. 关闭启动器：ESC 关闭可能残留的目标文件夹弹窗，再次 ESC 收起启动器
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 500));
    // 2. 删除预置 ini 并重启 dde-shell，恢复默认排列
    await system.exec(`rm -f ${iniPath}`);
    await system.exec('systemctl --user daemon-reload');
    await system.exec('systemctl --user restart dde-shell@DDE', 60000);
    await new Promise(resolve => setTimeout(resolve, 5000));
    // 3. 恢复启动器排序模式为自由排序（common.js 公共方法，dde-dconfig 直接写，不打开启动器）
    const { restoreLauncherSortMode } = require(`${caseDir}midscene_dde/common/common.js`);
    await restoreLauncherSortMode(system);
    // 4. 确保启动器已关闭：通过 DBus 查询 Visible，若仍打开则按 ESC 关闭
    for (let i = 0; i < 5; i++) {
        const visResult = await system.exec(`gdbus call --session --dest org.deepin.dde.Launcher1 --object-path /org/deepin/dde/Launcher1 --method org.freedesktop.DBus.Properties.Get org.deepin.dde.Launcher1 Visible 2>/dev/null || true`);
        const out = (visResult.stdout || '').trim();
        if (out.includes('false')) break;
        if (out.includes('true')) {
            console.log('检测到启动器仍处于打开状态，按 ESC 关闭');
            await device.pressKey('ESC');
            await new Promise(resolve => setTimeout(resolve, 1500));
        } else {
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
    // 5. 恢复完成。
  });
});
