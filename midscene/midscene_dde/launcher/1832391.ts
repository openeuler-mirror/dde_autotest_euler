/**
 * 用例 PMSID: 1832391
 * 用例标题: 【启动器】【窗口模式】【“自由排序”分类】【应用文件夹】应用图标移入应用文件夹，当前页无空位，移入应用图标到当前页，检查应用文件夹
 * 生成时间: 2026-09-09
 * 用例编写人: UT002485（卢燕）
 */

describe('1832391-【启动器】【窗口模式】【“自由排序”分类】【应用文件夹】应用图标移入应用文件夹，当前页无空位，移入应用图标到当前页，检查应用文件夹', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const iniPath = '/home/uos/.config/deepin/dde-launchpad/item-arrangement.ini';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 预置：字面量文件夹名"我的文件夹"，第一页12个应用（已满，无空位）
    const preset = `[fullscreen]
1\\name=我的文件夹
1\\pageCount=1
1\\pageItems\\0=dde-file-manager.desktop, deepin-terminal.desktop, deepin-system-monitor.desktop, deepin-devicemanager.desktop, dde-printer.desktop, dde-calendar.desktop, org.deepin.dde.control-center.desktop, deepin-calculator.desktop, deepin-editor.desktop, deepin-mail.desktop, deepin-screen-recorder.desktop, deepin-manual.desktop
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop, deepin-app-store.desktop
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

  test('1832391-【启动器】【窗口模式】【“自由排序”分类】【应用文件夹】应用图标移入应用文件夹，当前页无空位，移入应用图标到当前页，检查应用文件夹', async ({ device, agent, uos, system }) => {
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

    // 步骤2：定位左侧列表中的应用商店图标（拖拽源）和"我的文件夹"图标（目标，第一页已满）
    console.log('步骤2：定位源图标与目标文件夹图标');
    const pcService = device.getPCService();
    await agent.aiHover('启动器左侧列表中的应用商店应用图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    const srcPos = await pcService.mouse.getPosition();
    const srcX = srcPos.x;
    const srcY = srcPos.y;
    console.log(`应用商店图标位置: (${srcX}, ${srcY})`);

    await agent.aiHover('启动器左侧列表中名称为我的文件夹的应用文件夹图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    const folderPos = await pcService.mouse.getPosition();
    const tgtX = folderPos.x;
    const tgtY = folderPos.y;
    console.log(`目标文件夹图标位置: (${tgtX}, ${tgtY})`);

    // 步骤3：拖动应用商店图标到文件夹图标上（当前页无空位，需新建页）
    console.log('步骤3：拖动应用商店图标移入应用文件夹（当前页无空位）');
    await pcService.mouse.move([{ x: srcX, y: srcY }]);
    await new Promise(resolve => setTimeout(resolve, 500));
    await pcService.mouse.pressButton(0);
    await new Promise(resolve => setTimeout(resolve, 800));

    const steps = 15;
    const stepX = (tgtX - srcX) / steps;
    const stepY = (tgtY - srcY) / steps;
    for (let i = 1; i <= steps; i++) {
      await pcService.mouse.move([{ x: Math.round(srcX + stepX * i), y: Math.round(srcY + stepY * i) }]);
      await new Promise(resolve => setTimeout(resolve, 40));
    }
    // 悬浮在文件夹上1.2秒，等待文件夹高亮特效
    await new Promise(resolve => setTimeout(resolve, 1200));
    await pcService.mouse.releaseButton(0);
    await new Promise(resolve => setTimeout(resolve, 2500));
    console.log(`拖拽完成: (${srcX}, ${srcY}) -> (${tgtX}, ${tgtY})`);

    // 步骤4：打开应用文件夹，验证第一页占满12个且无应用商店，因第一页已满自动新建第二页
    console.log('步骤4：验证新建页');
    await agent.aiTap('名称为我的文件夹的应用文件夹图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiAssert('我的文件夹弹窗内当前页占满显示12个应用图标，未显示应用商店图标，底部显示2个翻页圆点');
    // 点击第2个翻页圆点切到第二页，验证应用商店在其中
    await agent.aiTap('我的文件夹弹窗底部的第2个翻页圆点', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiAssert('我的文件夹弹窗内当前页显示应用商店应用图标');
  }, { timeout: 600000, tags: ['1832391', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 1. 关闭启动器：ESC 关闭可能残留的我的文件夹弹窗，再次 ESC 收起启动器
    //    （启动器打开状态会跨 dde-shell 重启保持，必须在重启前显式关闭）
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
  });
});
