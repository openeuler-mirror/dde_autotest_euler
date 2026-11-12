/**
 * 用例 PMSID: 1832447
 * 用例标题: 【启动器】【窗口模式】【最近安装】安装5个新应用，打开应用后自动补位
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

describe('1832447-【启动器】【窗口模式】【最近安装】安装5个新应用，打开应用后自动补位', () => {
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

    test('1832447-【启动器】【窗口模式】【最近安装】安装5个新应用，打开应用后自动补位', async ({ device, agent, uos }) => {
        console.log('开始测试：安装5个新应用，打开应用后自动补位');

        // 步骤1：打开启动器窗口模式，验证新应用安装成功
        console.log('步骤1：打开启动器窗口模式，验证新应用安装成功');
        await uos.openLauncher();
        await agent.aiWaitFor('启动器以窗口模式打开：右侧显示“我的常用”和“最近安装”区域，左侧是竖向应用列表', { timeoutMs: 15000 });
        await agent.aiAssert('启动器窗口模式中“最近安装”区域存在新安装的应用图标（如阅读器测试、语音记事本测试、画板测试、qGo测试等），应用安装成功');

        // 步骤2：检查“最近安装”，验证最多4个，按安装时间从新到旧依次为E→D→C→B，A（FSearch）不展示
        console.log('步骤2：验证“最近安装”最多显示4个应用，按安装时间从新到旧依次为E→D→C→B，A（FSearch）不展示');
        // 说明：“最近安装”按安装时间从新到旧（最新在最前）显示前4个未打开的新应用，
        //   5个应用按A->B->C->D->E顺序安装，最新安装的E排最前，依次E->D->C->B，最先安装的A被挤出不展示
        await agent.aiAssert('启动器窗口模式中“最近安装”区域最多只显示4个应用图标，且按安装时间从新到旧依次为：阅读器测试（E，最新安装）、语音记事本测试（D）、画板测试（C）、qGo测试（B），最先安装的FSearch测试（A）不展示在“最近安装”区域中');

        // 步骤3：单击打开“最近安装”中排最前的阅读器测试（E），验证其从“最近安装”移除，FSearch测试（A）自动补位
        console.log('步骤3：打开阅读器测试（E），关闭后验证其移除、FSearch测试（A）自动补位');
        await agent.aiTap('启动器窗口模式中“最近安装”区域的阅读器测试应用图标', { deepThink: true });
        await agent.aiWaitFor('文件管理器窗口已打开（启动器已自动关闭）', { timeoutMs: 15000 });
        await uos.closeCurrentWindow();
        await agent.aiWaitFor('刚才打开的文件管理器窗口已经关闭，屏幕上看不到文件管理器窗口', { timeoutMs: 10000 });

        await uos.openLauncher();
        await agent.aiWaitFor('启动器以窗口模式打开：显示“我的常用”和“最近安装”区域', { timeoutMs: 15000 });
        // 说明：打开E后E移除，被挤出的A补位回“最近安装”，按从新到旧顺序D->C->B->A，A在最末（第四位/最右侧）
        await agent.aiAssert('“最近安装”区域中已经没有阅读器测试应用图标（E应用打开后已移除），FSearch测试（A应用）自动补位显示在“最近安装”区域中（补位后按从新到旧为D、C、B、A，A在最右侧）');

        // 收尾：关闭启动器
        await device.pressKey('ESC');
    }, { timeout: 600000, tags: ['1832447', 'level3'] });

    afterAll(async ({ uos, device, system }) => {
        console.log('afterAll：删除测试应用、关闭应用窗口、重启 dde-shell 恢复任务栏图标');
        // 1. 删除5个测试应用并刷新桌面数据库
        for (const app of installApps) {
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
        // 5. 删除 .desktop 后 dde-shell 热重载应用列表可能导致任务栏(dock)图标错位，重启一次 dde-shell 让任务栏图标恢复正常
        console.log('重启 dde-shell 恢复任务栏图标');
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 8000));
        await uos.showDesktop();
    });
});
