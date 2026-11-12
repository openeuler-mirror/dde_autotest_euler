/**
 * 用例 PMSID: 1832449
 * 用例标题: 【启动器】【窗口模式】【最近安装】打开“最近安装”的所有应用，常用应用向下覆盖一行
 * 生成时间: 2026-08-17
 * 用例编写人: UT005571（王艺桥）
 */

// 公共方法：createTestApp 创建 .desktop 模拟新应用（会进入“最近安装”）；killAppWindows 关闭应用窗口
const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { createTestApp, killAppWindows } = require(helperPath);

// dde-shell 配置文件：current_frame 决定启动器模式（WindowedFrame=窗口模式 / FullscreenFrame=全屏模式）
const settingsIni = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
// 需要安装的5个应用（安装顺序 A->B->C->D->E），均为当前未安装的应用，通过 .desktop 模拟新装进“最近安装”
const installApps = [
    { name: 'FSearch测试', file: 'FSearch-test' },        // A
    { name: 'qGo测试', file: 'qGo-test' },                 // B
    { name: '画板测试', file: 'deepin-draw-test' },        // C
    { name: '语音记事本测试', file: 'deepin-voice-note-test' }, // D
    { name: '阅读器测试', file: 'deepin-reader-test' },    // E
];

describe('1832449-【启动器】【窗口模式】【最近安装】打开“最近安装”的所有应用，常用应用向下覆盖一行', () => {
    // 标记用例前是否为窗口模式（原本非窗口模式才需要还原，afterAll 时据此写回全屏）
    let needRestoreFrame = false;

    beforeAll(async ({ uos, system }) => {
        console.log('beforeAll：确保启动器为窗口模式，并依次创建5个新应用（A->B->C->D->E）');
        await uos.showDesktop();

        // 1. 读取启动器模式配置，记录用例前的模式（配置缺失时默认是全屏模式）
        const frameResult = await system.exec(`cat ${settingsIni}`);
        const wasWindowed = frameResult.success && frameResult.stdout.includes('current_frame=WindowedFrame');
        console.log('当前启动器模式：', wasWindowed ? '窗口模式（无需还原）' : '非窗口模式（全屏或默认），afterAll 将写回全屏还原');

        // 2. 无论当前什么模式，都显式写一次窗口模式配置（实测：dde-shell 重启后可能未正确应用已有配置，
        //    仅当全屏时才写会导致重启后仍是全屏、用例第一步等待窗口模式超时；无条件重写更可靠）
        needRestoreFrame = !wasWindowed;
        await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=WindowedFrame\\n' > ${settingsIni}`);

        // 3. 依次创建5个应用；创建时先不重启 dde-shell（restartDdeShell=false），
        //    避免短时间内连续重启 dde-shell 导致任务栏(dock)图标加载失败、显示异常
        //    说明：Exec 用 dde-file-manager（系统已装，打开后窗口明显易识别）
        //    重要：每个应用创建后间隔3秒——"最近安装"按 .desktop 的创建时间(birthtime)取最新4个，
        //    同秒创建的并列决胜顺序不稳定（实测会随机挤出1个并保留最旧的），间隔3秒保证顺序确定
        for (const app of installApps) {
            await createTestApp(system, app.name, app.file, 'dde-file-manager', 'dde-file-manager', 'Development;', false);
            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        // 4. 5个应用都创建完成后，统一重启一次 dde-shell 刷新应用列表（等待时间留足，让任务栏图标加载完成）
        console.log('重启 dde-shell 刷新应用列表');
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 8000));
        await uos.showDesktop();
    });

    test('1832449-【启动器】【窗口模式】【最近安装】打开“最近安装”的所有应用，常用应用向下覆盖一行', async ({ device, agent, uos }) => {
        console.log('开始测试：打开“最近安装”的所有应用，常用应用向下覆盖一行');

        // 步骤1：打开启动器窗口模式，验证新应用安装成功并显示在“最近安装”
        console.log('步骤1：打开启动器窗口模式，验证新应用显示在“最近安装”');
        await uos.openLauncher();
        await agent.aiWaitFor('启动器以窗口模式打开：右侧显示“我的常用”和“最近安装”区域，左侧是竖向应用列表', { timeoutMs: 15000 });
        await agent.aiAssert('启动器窗口模式中“最近安装”区域存在新安装的应用图标（如阅读器测试、语音记事本测试、画板测试、qGo测试、FSearch测试等），应用安装成功');

        // 步骤2：依次打开“最近安装”中的所有应用，直到“最近安装”清空，验证常用应用向下覆盖一行
        console.log('步骤2：依次打开“最近安装”中的所有应用，验证常用应用向下覆盖一行');
        await device.pressKey('ESC');
        // 说明：“最近安装”按安装时间从新到旧显示未打开的新应用，打开某应用后该应用从“最近安装”移除，
        //   被挤出的较早安装应用会自动补位。依次打开所有“最近安装”中的应用直至清空，
        //   “最近安装”清空后其所在行被释放，“我的常用”区域的常用应用向下覆盖一行。
        //   注意：环境中可能存在预装的近期安装应用（如统信Windows应用兼容引擎等），也需一并打开清空。
        let openCount = 0;
        const maxOpen = 15; // 上限，避免异常情况下死循环
        while (openCount < maxOpen) {
            await uos.openLauncher();
            // 注意：最后一个应用被打开后"最近安装"会清空且区域自动隐藏（实测产品行为），
            // 故这里只等启动器窗口打开，不能要求"最近安装"区域可见
            await agent.aiWaitFor('启动器以窗口模式打开：显示"我的常用"区域、左侧竖向分类栏、底部搜索框', { timeoutMs: 15000 });
            const recentHasApp = await agent.aiBoolean('启动器窗口模式中"最近安装"区域存在且区域内有应用图标');
            console.log(`第${openCount + 1}次检查：“最近安装”是否有应用 = ${recentHasApp}`);
            if (!recentHasApp) {
                console.log('“最近安装”已无应用，停止打开');
                break;
            }
            // 点击“最近安装”中第一个应用图标（最新安装的应用排最前）
            try {
                await agent.aiTap('启动器窗口模式中“最近安装”区域的第一个应用图标', { deepThink: true });
                // 等待启动器关闭（点击应用后启动器自动关闭），使用通用判断，不依赖具体应用类型
                await agent.aiWaitFor('启动器已关闭，有应用窗口正在打开或已打开', { timeoutMs: 15000 });
                // 关闭刚打开的应用窗口（应用打开后获得焦点），避免遗留窗口影响后续操作
                await uos.closeCurrentWindow();
                await new Promise(resolve => setTimeout(resolve, 1500));
            } catch (e) {
                console.log(`第${openCount + 1}次：打开/关闭应用异常，尝试 showDesktop 兜底：${e.message}`);
                await uos.showDesktop();
            }
            console.log(`第${openCount + 1}次：已打开并关闭应用窗口`);
            openCount++;
        }
        console.log(`步骤2：共打开 ${openCount} 个应用，“最近安装”应已清空`);

        // 重新打开启动器，验证“最近安装”已清空且“我的常用”常用应用向下覆盖一行
        await uos.openLauncher();
        // 此时"最近安装"已清空、区域已隐藏，只等待启动器窗口打开
        await agent.aiWaitFor('启动器以窗口模式打开：显示"我的常用"区域、左侧竖向分类栏、底部搜索框', { timeoutMs: 15000 });
        await agent.aiAssert('启动器窗口模式中已经没有"最近安装"区域（所有最近安装应用都被打开后该区域清空并自动隐藏），且"我的常用"区域的常用应用向下覆盖了一行（应用行数增加，占据原"最近安装"区域所在位置）');

        // 收尾：关闭启动器
        await device.pressKey('ESC');
    }, { timeout: 600000, tags: ['1832449', 'level3'] });

    afterAll(async ({ uos, device, system }) => {
        console.log('afterAll：删除测试应用、关闭应用窗口、重启 dde-shell 恢复任务栏图标');
        // 1. 删除5个测试应用并刷新桌面数据库
        for (const app of installApps) {
            await system.exec(`rm -f ~/.local/share/applications/${app.file}.desktop 2>/dev/null`);
        }
        await system.exec('update-desktop-database ~/.local/share/applications/ 2>/dev/null');
        // 2. 关闭循环中可能遗留的文件管理器窗口（测试应用 Exec 均为 dde-file-manager）
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
