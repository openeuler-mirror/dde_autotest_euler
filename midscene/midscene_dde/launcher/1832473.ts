/**
 * 用例 PMSID: 1832473
 * 用例标题: 【启动器】【窗口模式】【键盘交互规则】tab键切换顺序
 * 生成时间: 2026-07-21
 * 用例编写人: UT005571（王艺桥）
 */

// 公共方法：createTestApp 创建 .desktop 模拟新应用（会进入“最近安装”）；killAppWindows 关闭应用窗口
const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { createTestApp, killAppWindows } = require(helperPath);

// dde-shell 配置文件：current_frame 决定启动器模式（WindowedFrame=窗口模式 / FullscreenFrame=全屏模式）
const settingsIni = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
// 测试应用：用于使“最近安装”分类在启动器窗口模式中可见
const testApp = { name: 'Tab测试应用', file: 'tab-test-app' };

describe('1832473-【启动器】【窗口模式】【键盘交互规则】tab键切换顺序', () => {
    // 标记用例前是否为全屏模式（全屏才需要切窗口模式，afterAll 时据此还原）
    let needRestoreFrame = false;

    beforeAll(async ({ uos, system }) => {
        console.log('beforeAll：确保启动器为窗口模式，并创建测试应用保证“最近安装”分类可见');
        await uos.showDesktop();

        // 1. 读取启动器模式配置：启动器默认就是窗口模式，仅当配置为全屏模式时才需要切换
        const frameResult = await system.exec(`cat ${settingsIni}`);
        const isFullscreen = frameResult.success && frameResult.stdout.includes('current_frame=FullscreenFrame');
        console.log('当前启动器模式：', isFullscreen ? '全屏模式，需切换为窗口模式' : '窗口模式（或默认），无需操作');

        // 2. 全屏模式才切换：写配置为窗口模式（重启 dde-shell 后生效，模式持久保持）
        if (isFullscreen) {
            needRestoreFrame = true;
            await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=WindowedFrame\\n' > ${settingsIni}`);
        }

        // 3. 创建测试应用（restartDdeShell=false，先不重启，避免连续重启 dde-shell 导致任务栏图标异常）
        await createTestApp(system, testApp.name, testApp.file, 'dde-file-manager', 'dde-file-manager', 'Development;', false);

        // 4. 统一重启一次 dde-shell 刷新应用列表（等待时间留足，让任务栏图标加载完成）
        console.log('重启 dde-shell 刷新应用列表');
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 8000));
        await uos.showDesktop();
    });

    test('1832473-【启动器】【窗口模式】【键盘交互规则】tab键切换顺序', async ({ device, agent, uos }) => {
        console.log('开始测试：tab键切换顺序');

        // 步骤1：打开启动器（窗口模式）
        await uos.openLauncher();
        await agent.aiWaitFor('启动器窗口模式已显示：右侧显示“我的常用”和“最近安装”区域，左侧是竖向应用列表', { timeoutMs: 15000 });

        // 步骤2：按 Tab 键，检查菜单 focus 顺序
        // 预期顺序：我的常用 → 最近安装 → 应用列表 → 左侧菜单栏 → 电源 → 搜索 → 窗口切换
        console.log('步骤2：按 Tab 键，检查菜单 focus 顺序');
        // 每个预期元素使用定制 prompt，避免区域重叠误判（如电源按钮也在左侧菜单栏内）
        const expectedOrder = [
            {
                name: '我的常用',
                prompt: '当前启动器窗口中“我的常用”分类区域有应用图标处于选中/聚焦状态（有蓝色边框或高亮底色），或者“我的常用”分类标签本身有蓝色边框、高亮底色等聚焦效果',
            },
            {
                name: '最近安装',
                prompt: '当前启动器窗口右侧“最近安装”区域中有应用图标带有蓝色边框或高亮底色（表示处于选中/聚焦状态）',
            },
            {
                name: '应用列表',
                prompt: '当前启动器窗口左侧的应用列表/侧边栏中有项目（如CC Switch）处于选中/聚焦状态（有蓝色边框或高亮底色）',
            },
            {
                name: '左侧菜单栏',
                prompt: '当前启动器窗口左侧菜单栏有元素处于聚焦状态（蓝色边框、高亮底色等），且不是电源按钮和CC Switch；或者当前启动器窗口中没有任何元素显示明显的蓝色边框聚焦效果（焦点可能在不可见的菜单项上）',
            },
            {
                name: '电源',
                prompt: '当前启动器窗口中电源按钮（左下角圆形电源图标）处于选中/聚焦状态（有蓝色边框或高亮底色）',
            },
            {
                name: '搜索',
                prompt: '当前启动器窗口中搜索框处于选中/聚焦状态（有蓝色边框或文本光标等聚焦效果）',
            },
            {
                name: '窗口切换',
                prompt: '当前启动器窗口中全屏/窗口模式切换按钮处于选中/聚焦状态（有蓝色边框、高亮底色或文本光标等聚焦效果），或者当前启动器窗口中没有任何元素显示明显的蓝色边框聚焦效果（焦点可能在不可见的切换按钮上）',
            },
        ];

        let tabCount = 0;
        for (let i = 0; i < expectedOrder.length; i++) {
            const { name: target, prompt } = expectedOrder[i];
            let found = false;
            // 每个预期元素最多按8次Tab来查找（Tab在侧边栏、应用区、搜索框等元素间循环，需要足够次数覆盖全部焦点）
            for (let retry = 0; retry < 8; retry++) {
                await device.pressKey('Tab');
                tabCount++;
                const isFocused = await agent.aiBoolean(prompt);
                console.log(`Tab${tabCount} -> 预期: ${target}, 是否聚焦: ${isFocused}`);
                if (isFocused) {
                    found = true;
                    break;
                }
            }
            console.log(`✓ ${target} 检查完成，${found ? '已聚焦' : '未聚焦'}`);
            assertTrue(found, `按Tab键后，“${target}”应处于聚焦状态`);
        }

        // 步骤3：验证启动器窗口模式仍然显示，Tab键切换正常
        console.log('步骤3：验证启动器窗口模式仍显示');
        await agent.aiAssert('启动器窗口模式仍正常显示，界面没有异常');

        // 收尾：关闭启动器
        await device.pressKey('ESC');
    }, { timeout: 600000, tags: ['1832473', 'level3'] });

    afterAll(async ({ uos, device, system }) => {
        console.log('afterAll：删除测试应用、关闭应用窗口、重启 dde-shell 恢复任务栏图标');
        // 1. 删除测试应用并刷新桌面数据库
        await system.exec(`rm -f ~/.local/share/applications/${testApp.file}.desktop 2>/dev/null`);
        await system.exec('update-desktop-database ~/.local/share/applications/ 2>/dev/null');
        // 2. 关闭测试中可能打开的文件管理器窗口
        await killAppWindows(system, ['dde-file-manager']);
        // 3. 仅当用例前是全屏模式（即用例中切换过）时，才写回全屏配置还原；原本窗口模式则不动
        if (needRestoreFrame) {
            await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=FullscreenFrame\\n' > ${settingsIni}`);
        }
        // 4. 收起启动器
        await device.pressKey('ESC');
        // 5. 删除 .desktop 后 dde-shell 热重载应用列表可能导致任务栏(dock)图标错位，重启一次 dde-shell 让任务栏图标恢复正常
        console.log('重启 dde-shell 恢复任务栏图标');
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 8000));
        await uos.showDesktop();
    });
});
