/**
 * 用例 PMSID: 1832145
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】应用文件夹开启状态，点击任务栏区域，启动器收起
 * 生成时间: 2026/7/21
 * 用例编写人: UT005571（王艺桥）
 *
 */

describe('1832145-【启动器】【全屏模式】【应用文件夹】应用文件夹开启状态，点击任务栏区域，启动器收起', () => {
    // 应用文件夹配置文件路径
    const INI_PATH = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
    // 初始配置备份路径（用于恢复）
    const INIT_INI_PATH = '/tmp/item-arrangement.backup.ini';
    // dde-shell 启动器模式配置文件（current_frame 决定窗口/全屏模式）
    const SETTINGS_INI = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
    // 启动器模式配置备份路径（用于恢复进入用例前的模式）
    const SETTINGS_BACKUP = '/tmp/dde-shell-settings-1832145.ini';

    beforeAll(async ({ device, uos, system }) => {
        console.log('1. beforeAll: 前置准备 - 构造 2 页应用文件夹并确保全屏模式');
        await uos.showDesktop();

        // 前置：备份当前 item-arrangement.ini（用于 afterAll 恢复）
        await system.exec(`cp -f ${INI_PATH} ${INIT_INI_PATH} 2>/dev/null`);
        console.log('前置：配置文件已备份');

        // 前置：备份当前启动器模式配置（用于 afterAll 还原进入用例前的窗口/全屏模式）
        await system.exec(`cp -f ${SETTINGS_INI} ${SETTINGS_BACKUP} 2>/dev/null`);
        console.log('前置：启动器模式配置已备份');

        // 前置：写入 2 页应用文件夹配置（模块 launcher_fullscreen_app_folder 的等价内联）
        console.log('前置：写入 2 页应用文件夹配置');
        const writeCmd = `cat > ${INI_PATH} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=2
1\\pageItems\\0=dde-file-manager.desktop, deepin-terminal.desktop, downloader.desktop, deepin-defender.desktop, deepin-system-monitor.desktop, deepin-devicemanager.desktop
1\\pageItems\\1=deepin-compressor.desktop, deepin-deb-installer.desktop, deepin-diskmanagement.desktop, deepin-scanner.desktop, deepin-screen-recorder.desktop, deepin-picker.desktop
toplevel\\pageCount=2
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop, deepin-app-store.desktop, deepin-pc-manager.desktop, uos-ai-assistant.desktop
toplevel\\pageItems\\1=dde-computer.desktop, dde-trash.desktop, dde-printer.desktop
MIDSCEOF`;
        const writeResult = await system.exec(writeCmd);
        if (!writeResult.success) {
            throw new Error('写入 2 页应用文件夹配置失败');
        }
        console.log('前置：应用文件夹配置已写入');

        // 前置：写全屏模式配置（无条件写，保证打开启动器即为全屏模式）
        await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=FullscreenFrame\\n' > ~/.config/deepin/org.deepin.dde-shell/settings.ini`);

        // 重启 dde-shell 使配置生效（等待时间留足，让任务栏图标加载完成）
        console.log('前置：重启 dde-shell 使配置生效');
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null', 60000);
        await new Promise(resolve => setTimeout(resolve, 8000));
        console.log('前置：dde-shell 服务重启成功，配置已生效');
        await uos.showDesktop();
    });

    beforeEach(async ({ device }) => {
        console.log('2. beforeEach: 确认启动器为全屏模式（beforeAll 已写配置并重启）');
        await device.pressKey('ESC');
    });

    test('1832145-【启动器】【全屏模式】【应用文件夹】应用文件夹开启状态，点击任务栏区域，启动器收起', async ({ device, agent, uos }) => {
        console.log('1832145: 开始测试 - 点击任务栏区域，启动器收起');

        // 前置：beforeAll 已写全屏配置并重启，打开启动器即为全屏模式

        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开，显示桌面图标和搜索框');
        await agent.aiAssert('1. 启动器全屏模式已打开');

        // 步骤 2: 打开应用文件夹
        await agent.aiTap('应用列表中的"应用文件夹"图标');
        await agent.aiWaitFor('应用文件夹已打开，界面显示文件夹内应用列表');
        await agent.aiAssert('2. 应用文件夹已开启，显示文件夹内应用');

        // 步骤 3: 点击任务栏右侧靠近托盘的区域（避开启动器按钮，避免误触切换）
        await agent.aiTap('屏幕底部任务栏右侧靠近系统托盘图标的空白区域');
        await agent.aiWaitFor('启动器全屏界面已收起，屏幕显示桌面壁纸和桌面图标');
        await agent.aiAssert('3. 启动器已收起，应用文件夹随之关闭，屏幕显示桌面壁纸和桌面图标，不再显示启动器全屏界面');
    }, { timeout: 600000, tags: ['1832145', 'level3'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.releaseAllKeys();
    });

    afterAll(async ({ uos, device, system }) => {
        console.log('5. afterAll: 后置清理 - 恢复配置');
        // 恢复 item-arrangement.ini 备份
        await system.exec(`cp -f ${INIT_INI_PATH} ${INI_PATH} 2>/dev/null`);
        console.log('后置：应用文件夹配置已恢复');
        // 恢复启动器模式配置（还原进入用例前的窗口/全屏模式）
        await system.exec(`cp -f ${SETTINGS_BACKUP} ${SETTINGS_INI} 2>/dev/null`);
        console.log('后置：启动器模式配置已恢复');
        // 重启 dde-shell 使恢复的配置生效
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null', 60000);
        await new Promise(resolve => setTimeout(resolve, 8000));
        await device.pressKey('ESC');
        await uos.showDesktop();
    });
});
