/**
 * 用例 PMSID: 1832201
 * 用例标题: 【启动器】【全屏模式】【键盘交互规则】hover状态验证，鼠标hover到应用
 * 生成时间: 2026-09-02 10:20:00
 * 用例编写人: UT005571（王艺桥）
 */

describe('1832201-【启动器】【全屏模式】【键盘交互规则】hover状态验证，鼠标hover到应用', () => {
    // 标记用例前是否为窗口模式（窗口才需要切全屏模式，afterAll 时据此还原）
    let needRestoreFrame = false;

    beforeAll(async ({ device, uos, system }) => {
        // 初始化测试环境：显示桌面，确保环境干净
        console.log('beforeAll: 初始化测试套件，显示桌面');
        await uos.showDesktop();

        // 清理环境残留：关闭可能残留的文件选择对话框（dde-file-dialog），
        // 避免其遮挡/污染 AI 视觉（实测残留弹窗会导致步骤2 断言误判失败）
        await system.exec('pkill -f dde-file-dialog 2>/dev/null; pkill -f dde-file-manager 2>/dev/null; sleep 1');
        console.log('beforeAll: 已清理残留文件对话框/文件管理器窗口');

        // 读取启动器模式配置，记录用例前的模式
        const frameResult = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
        const wasWindowed = frameResult.success && frameResult.stdout.includes('current_frame=WindowedFrame');
        console.log('当前启动器模式：', wasWindowed ? '窗口模式' : '非窗口模式（全屏或默认）');

        // 无条件写一次全屏模式配置：实测仅当窗口模式才写时，dde-shell 重启后可能未正确应用配置，
        // 打开启动器仍是窗口模式、等待全屏超时；无条件重写并重启更可靠
        needRestoreFrame = wasWindowed;
        await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=FullscreenFrame\\n' > ~/.config/deepin/org.deepin.dde-shell/settings.ini`);

        // 重启 dde-shell 让全屏模式生效（等待时间留足，让任务栏图标加载完成）
        console.log('重启 dde-shell 应用全屏模式');
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 8000));
        await uos.showDesktop();
    });

    beforeEach(async ({ device }) => {
        // 前置准备：beforeAll 已写全屏配置并重启，打开启动器即是全屏模式
        console.log('beforeEach: 确认启动器为全屏模式（beforeAll 已配置）');
        await device.pressKey('ESC');
    });

    test('1832201-【启动器】【全屏模式】【键盘交互规则】hover状态验证，鼠标hover到应用', async ({ device, agent, uos, system }) => {
        console.log('1832201: 开始测试 - hover状态验证，鼠标hover到应用');

        // 步骤前置辅助：确保启动器为全屏模式（实测 ESC 退出全屏启动器后 DDE 会把配置写回 WindowedFrame，
        // 导致下一次 openLauncher 以窗口模式打开；此处检测配置非全屏则重写配置并重启 dde-shell）
        const ensureFullscreen = async () => {
            const r = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
            if (!r.stdout.includes('FullscreenFrame')) {
                console.log('ensureFullscreen: 检测到配置非全屏，重写配置并重启 dde-shell');
                await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=FullscreenFrame\\n' > ~/.config/deepin/org.deepin.dde-shell/settings.ini`);
                await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
                await new Promise(resolve => setTimeout(resolve, 6000));
            }
        };

        // 前置准备：打开启动器（beforeAll 已写全屏模式配置并重启 dde-shell，打开即为全屏模式）
        console.log('前置准备：打开启动器（beforeAll 已配置全屏模式）');
        await ensureFullscreen();
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已显示', { timeoutMs: 30000 });
        console.log('启动器已全屏模式显示');

        // 步骤 1: 鼠标hover到应用上，点击空格或回车
        // 预期 1: 仅有hover效果，无高亮选中效果，点击空格或回车无响应

        console.log('步骤 1: 鼠标hover到应用上，点击空格或回车');

        // 1.1 鼠标hover到应用上，按空格键
        console.log('1.1 鼠标hover到应用图标上，按空格键');
        await agent.aiHover('启动器全屏模式应用列表第一行第二个普通应用图标');
        await device.pressKey('Space');
        // 功能断言：启动器仍然全屏显示，应用未被打开（hover状态按空格无响应，应用未被打开；
        // 空格可能被底部搜索框接收进入搜索态，但不允许有任何应用程序窗口被打开；
        // 断言描述带全屏特征（翻页点/底部搜索框/图标网格），避免应用较少时被误判为桌面）
        await agent.aiAssert('启动器仍然处于全屏模式（特征：顶部有翻页指示圆点、底部居中显示搜索框、应用图标网格铺满屏幕），屏幕上没有任何新打开的应用程序窗口，没有应用被打开', { timeoutMs: 10000 });
        // 清除可能输入到搜索框的空格并退出搜索态
        await device.pressKey('Backspace');
        await device.pressKey('Escape');
        console.log('1.1 完成：按空格无应用打开');

        // 1.2 鼠标hover到应用上，按回车键（重新打开启动器，避免搜索态污染）
        console.log('1.2 鼠标hover到应用图标上，按回车键');
        await ensureFullscreen();
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已显示', { timeoutMs: 30000 });
        await agent.aiHover('启动器全屏模式应用列表第一行第二个普通应用图标');
        await device.pressKey('Enter');
        // 功能断言：启动器仍然全屏显示，应用未被打开（hover状态按回车无响应，应用未被打开）
        await agent.aiAssert('启动器仍然处于全屏模式（特征：顶部有翻页指示圆点、底部居中显示搜索框、应用图标网格铺满屏幕），屏幕上没有任何新打开的应用程序窗口，没有应用被打开', { timeoutMs: 10000 });
        console.log('步骤 1 完成：空格和回车均无应用打开');
        // 关闭启动器，准备步骤2
        await device.pressKey('ESC');

        // 步骤 2: 鼠标hover到应用上，点击鼠标左键
        // 预期 2: 仅有hover效果，无高亮选中效果，点击左键应用被打开
        console.log('步骤 2: 鼠标hover到应用上，点击鼠标左键');
        await ensureFullscreen();
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已显示', { timeoutMs: 30000 });

        await agent.aiHover('启动器全屏模式应用列表中第一行第二个应用图标（Deepin File Manager / 文件管理器）');
        await agent.aiTap('启动器全屏模式应用列表中第一行第二个应用图标（Deepin File Manager / 文件管理器）');
        await agent.aiWaitFor('应用已被打开，启动器已关闭', { timeoutMs: 15000 });
        // 功能断言：应用已被打开，启动器全屏界面已关闭（点击鼠标左键应用被打开）
        await agent.aiAssert('应用已被打开，启动器全屏界面已关闭，点击鼠标左键应用被打开');
        console.log('步骤 2 完成：点击左键应用被打开');
        // 关闭打开的应用窗口（文件管理器），并清理可能残留的文件选择对话框
        await uos.closeCurrentWindow();
        await system.exec('pkill -f dde-file-dialog 2>/dev/null');

        // 步骤 3: 鼠标hover到右上角切换图标上，点击空格或回车
        // 预期 3: 仅有hover效果，无高亮选中效果，点击空格或回车无响应
        console.log('步骤 3: 鼠标hover到右上角切换图标上，点击空格或回车');
        await ensureFullscreen();
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已显示', { timeoutMs: 30000 });
        // 用 aiHover 定位切换图标（硬编码坐标 (0.97宽,0.04高) 实测偶发未命中，回车不触发切换）
        await agent.aiHover('启动器全屏模式右上角的切换图标（窗口/全屏切换按钮）');
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 按回车键，验证hover状态下键盘无响应
        console.log('3.1 鼠标hover到切换图标上，按回车键');
        // 权威判定：读取 settings.ini，模式切换会改写 current_frame（实测 UI 点击切换后配置即变化），
        // 用配置前后比对验证"无响应"，避免 AI 视觉对全屏/窗口/桌面描述的误判抖动
        const readFrame = async () => {
            const r = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
            return r.stdout.includes('WindowedFrame') ? 'WindowedFrame' : 'FullscreenFrame';
        };
        const frameBefore = await readFrame();
        await device.pressKey('Enter');
        await new Promise(resolve => setTimeout(resolve, 1500));
        const frameAfterEnter = await readFrame();
        console.log(`hover切换图标按回车：模式配置 ${frameBefore} -> ${frameAfterEnter}`);
        assertTrue(frameAfterEnter === frameBefore, 'hover状态按回车不应切换启动器模式（配置未变化，无响应）');
        // 3.2 hover 切换图标，按空格（同样无响应）
        console.log('3.2 鼠标hover到切换图标上，按空格键');
        await device.pressKey('Space');
        await new Promise(resolve => setTimeout(resolve, 1500));
        const frameAfterSpace = await readFrame();
        console.log(`hover切换图标按空格：模式配置 ${frameAfterEnter} -> ${frameAfterSpace}`);
        assertTrue(frameAfterSpace === frameAfterEnter, 'hover状态按空格不应切换启动器模式（配置未变化，无响应）');
        console.log('步骤 3 完成：空格和回车均无响应（与 Excel 预期一致）');
        // 关闭启动器，准备步骤4
        await device.pressKey('ESC');

        // 步骤 4: 鼠标hover到右上角切换图标上，点击鼠标左键
        // 预期 4: 仅有hover效果，无高亮选中效果，点击鼠标左键模式可切换
        console.log('步骤 4: 鼠标hover到右上角切换图标上，点击鼠标左键');
        await ensureFullscreen();
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已显示', { timeoutMs: 30000 });
        await agent.aiHover('启动器全屏模式右上角的切换图标');
        // 用配置前后比对做权威判定（UI 点击切换后 settings.ini 的 current_frame 会变化），
        // 避免 AI 视觉对"窗口形式/开始菜单/全屏"描述的误判
        const frameBeforeClick = await readFrame();
        await agent.aiTap('启动器全屏模式右上角的窗口模式切换图标');
        await new Promise(resolve => setTimeout(resolve, 2500));
        const frameAfterClick = await readFrame();
        console.log(`hover切换图标点击左键：模式配置 ${frameBeforeClick} -> ${frameAfterClick}`);
        assertTrue(frameAfterClick !== frameBeforeClick, '点击切换图标后启动器模式应切换（配置由 FullscreenFrame 变为 WindowedFrame）');
        console.log('步骤 4 完成：点击左键模式可切换');

    }, { timeout: 600000, tags: ['1832201', 'level3'] });

    afterEach(async ({ device, agent }) => {
        // 每个测试后的清理：释放所有按键，避免按键残留
        console.log('afterEach: 释放所有按键');
        await device.releaseAllKeys();
    });

    afterAll(async ({ uos, agent, device, system }) => {
        // 环境清理：关闭启动器、测试期间打开的应用窗口及残留文件对话框，恢复桌面状态
        console.log('afterAll: 清理测试环境');
        try {
            await device.pressKey('ESC');
        } catch (err) {
            console.log('afterAll: ESC异常', err.message);
        }
        // 兜底关闭测试期间可能残留的应用窗口（文件管理器/对话框），避免任务栏残留图标
        try {
            await uos.closeCurrentWindow();
        } catch (err) {
            console.log('afterAll: closeCurrentWindow 兜底执行（无窗口时忽略）', err.message);
        }
        await system.exec("pkill -f dde-file-dialog 2>/dev/null; pkill -f dde-file-manager 2>/dev/null");
        // 仅当用例前是窗口模式（即用例中切换过）时，才写回窗口配置还原；原本全屏模式则不动
        if (needRestoreFrame) {
            await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=WindowedFrame\\n' > ~/.config/deepin/org.deepin.dde-shell/settings.ini`);
        }
        // 重启一次 dde-shell 让模式还原生效（也让任务栏图标恢复正常）
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 8000));
        await uos.showDesktop();
    });
});
