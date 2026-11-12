/**
 * 用例 PMSID: 1832445
 * 用例标题: 【启动器】【窗口模式】【最近安装】打开新安装的应用，该应用从“最近安装”菜单中移除
 * 生成时间: 2026/09/09
 * 用例编写人: UT005571（王艺桥）
 */

// 公共方法：createTestApp 创建 .desktop 模拟新应用（会进入“最近安装”）；killAppWindows 关闭应用窗口
const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { createTestApp, killAppWindows } = require(helperPath);

// dde-shell 配置文件：current_frame 决定启动器模式（WindowedFrame=窗口模式 / FullscreenFrame=全屏模式）
const settingsIni = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
// 2 个模拟新应用：Exec 用 dde-file-manager（系统已装，打开后窗口明显易识别）
const testApps = [
    { name: '360浏览器', file: '360-browser-test' },
    { name: '微信', file: 'wechat-test' },
];

describe('1832445-【启动器】【窗口模式】【最近安装】打开新安装的应用，该应用从“最近安装”菜单中移除', () => {
    // 标记用例前是否为全屏模式（全屏才需要切窗口模式，afterAll 时据此还原）
    let needRestoreFrame = false;

    beforeAll(async ({ uos, system }) => {
        console.log('beforeAll：确保启动器为窗口模式，并创建2个模拟新应用');
        await uos.showDesktop();

        // 1. 读取启动器模式配置：启动器默认就是窗口模式，仅当配置为全屏模式时才需要切换
        const frameResult = await system.exec(`cat ${settingsIni}`);
        const isFullscreen = frameResult.success && frameResult.stdout.includes('current_frame=FullscreenFrame');
        console.log('当前启动器模式：', isFullscreen ? '全屏模式，需切换为窗口模式' : '窗口模式（或默认），无需操作');

        // 2. 全屏模式才切换：写配置为窗口模式（createTestApp 内部重启 dde-shell 后生效，模式持久保持）
        //    说明：用 UI 点击参考图切模式可能不写入配置，重开启动器会回到全屏；写配置切换更可靠
        if (isFullscreen) {
            needRestoreFrame = true;
            await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=WindowedFrame\\n' > ${settingsIni}`);
        }

        // 3. 依次创建2个模拟新应用；创建时先不重启 dde-shell（restartDdeShell=false），
        //    避免短时间内连续重启 dde-shell 导致任务栏(dock)图标加载失败、显示异常
        for (const app of testApps) {
            await createTestApp(system, app.name, app.file, 'dde-file-manager', 'dde-file-manager', 'Network;', false);
        }

        // 4. 两个应用都创建完成后，统一重启一次 dde-shell 刷新应用列表（等待时间留足，让任务栏图标加载完成）
        console.log('重启 dde-shell 刷新应用列表');
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 8000));
        await uos.showDesktop();
    });

    test('1832445-【启动器】【窗口模式】【最近安装】打开新安装的应用，该应用从“最近安装”菜单中移除', async ({ device, agent, uos }) => {
        // 步骤1：打开启动器，确认2个新应用显示在“最近安装”
        console.log('步骤1：打开启动器，确认新应用显示在“最近安装”');
        await uos.openLauncher();
        await agent.aiWaitFor('启动器以窗口模式打开：右侧显示“我的常用”和“最近安装”区域，左侧是竖向应用列表', { timeoutMs: 15000 });
        await agent.aiAssert('启动器窗口模式的“最近安装”区域中可以看到“360浏览器”和“微信”这两个应用图标（它们是本次新安装的应用，已显示在最近安装区域中）');

        // 步骤2：打开360浏览器，验证其从“最近安装”移除
        console.log('步骤2：打开360浏览器，关闭后验证其从“最近安装”移除');
        await agent.aiTap('启动器窗口模式“最近安装”区域中的360浏览器应用图标', { deepThink: true });
        await agent.aiWaitFor('文件管理器窗口已打开（启动器已自动关闭）', { timeoutMs: 15000 });
        await uos.closeCurrentWindow();
        await agent.aiWaitFor('刚才打开的文件管理器窗口已经关闭，屏幕上看不到文件管理器窗口', { timeoutMs: 10000 });

        await uos.openLauncher();
        await agent.aiWaitFor('启动器以窗口模式打开：显示“我的常用”和“最近安装”区域', { timeoutMs: 15000 });
        await agent.aiAssert('启动器窗口模式的“最近安装”区域中已经没有360浏览器应用图标（打开后已从最近安装移除），微信应用图标仍显示在“最近安装”区域中');

        // 步骤3：打开微信，验证其也从“最近安装”移除
        console.log('步骤3：打开微信，关闭后验证其从“最近安装”移除');
        await agent.aiTap('启动器窗口模式“最近安装”区域中的微信应用图标', { deepThink: true });
        await agent.aiWaitFor('文件管理器窗口已打开（启动器已自动关闭）', { timeoutMs: 15000 });
        await uos.closeCurrentWindow();
        await agent.aiWaitFor('刚才打开的文件管理器窗口已经关闭，屏幕上看不到文件管理器窗口', { timeoutMs: 10000 });

        await uos.openLauncher();
        // 说明：2 个应用都被打开后"最近安装"已清空，该区域会自动隐藏（实测产品行为），
        // 故这里只等待启动器窗口打开，不能再等待"最近安装"区域出现
        await agent.aiWaitFor('启动器以窗口模式打开：显示"我的常用"区域、左侧竖向分类栏、底部搜索框', { timeoutMs: 15000 });
        await agent.aiAssert('启动器窗口模式中已经没有"最近安装"区域（2个新应用都被打开后最近安装清空，区域自动隐藏），界面上不存在任何"最近安装"分组；即使能看到360浏览器或微信，它们也只能出现在"我的常用"区域中，而不是"最近安装"区域中');

        // 收尾：关闭启动器
        await device.pressKey('ESC');
    }, { timeout: 600000, tags: ['1832445', 'level3'] });

    afterAll(async ({ uos, device, system }) => {
        console.log('afterAll：删除测试应用、关闭应用窗口、重启 dde-shell 恢复任务栏图标');
        // 1. 删除2个测试应用并刷新桌面数据库
        for (const app of testApps) {
            await system.exec(`rm -f ~/.local/share/applications/${app.file}.desktop 2>/dev/null`);
        }
        await system.exec('update-desktop-database ~/.local/share/applications/ 2>/dev/null');
        // 2. 关闭测试中打开的文件管理器窗口
        await killAppWindows(system, ['dde-file-manager']);
        // 3. 仅当用例前是全屏模式（即用例中切换过）时，才写回全屏配置还原；原本窗口模式则不动
        if (needRestoreFrame) {
            await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=FullscreenFrame\\n' > ${settingsIni}`);
        }
        // 4. 收起启动器
        await device.pressKey('ESC');
        // 5. 删除 .desktop 后 dde-shell 热重载应用列表可能导致任务栏(dock)图标错位显示异常，
        //    重启一次 dde-shell 让任务栏图标恢复正常（全屏还原配置也在本次重启时生效）
        console.log('重启 dde-shell 恢复任务栏图标');
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 8000));
        await uos.showDesktop();
    });
});
