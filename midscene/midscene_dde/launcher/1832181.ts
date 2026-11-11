/**
 * 用例 PMSID: 1832181
 * 用例标题: 【启动器】【全屏模式】【搜索规则】搜索框输入拼音
 * 生成时间: 2026-08-17
 * 用例编写人: UT005571（王艺桥）
 */

// 公共方法：createTestApp 创建 .desktop 模拟新应用（会进入“最近安装”）；killAppWindows 关闭应用窗口
const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { createTestApp, killAppWindows } = require(helperPath);

// dde-shell 配置文件：current_frame 决定启动器模式（WindowedFrame=窗口模式 / FullscreenFrame=全屏模式）
const settingsIni = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
// 为保证拼音搜索规则可验证，创建名称中含目标拼音的测试应用：
// - mail测试：用于验证 ma / mai 搜索能匹配到含 "mail" 的应用
// - manual测试：用于验证 ma 搜索能匹配到含 "manual" 的应用
// - 音乐测试：用于验证 yinyue 搜索能匹配到含 "音乐" 的应用（icon 用 deepin-music 音乐图标，
//   避免 AI 视觉误判：dde-file-manager 图标形似文件夹，yinyue 命中项少时 AI 会把结果误认为桌面图标）
const installApps = [
    { name: 'mail测试', file: 'mail-test', icon: 'dde-file-manager' },
    { name: 'manual测试', file: 'manual-test', icon: 'dde-file-manager' },
    { name: '音乐测试', file: 'music-test', icon: 'deepin-music' },
];

describe('1832181-【启动器】【全屏模式】【搜索规则】搜索框输入拼音', () => {
    // 标记用例前是否为窗口模式（窗口才需要切全屏模式，afterAll 时据此还原）
    let needRestoreFrame = false;

    beforeAll(async ({ uos, system }) => {
        console.log('beforeAll：确保启动器为全屏模式基线，并创建3个拼音测试应用');
        await uos.showDesktop();

        // 1. 读取启动器模式配置：本用例要求全屏模式，仅当配置为窗口模式时才需要切换
        const frameResult = await system.exec(`cat ${settingsIni}`);
        const isWindowed = frameResult.success && frameResult.stdout.includes('current_frame=WindowedFrame');
        console.log('当前启动器模式：', isWindowed ? '窗口模式，需切换为全屏模式' : '全屏模式（或默认），无需操作');

        // 2. 窗口模式才切换：写配置为全屏模式（重启 dde-shell 后生效，模式持久保持）
        //    说明：用 UI 点击参考图切模式可能不写入配置，重开启动器会回到窗口模式；写配置切换更可靠
        if (isWindowed) {
            needRestoreFrame = true;
            await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=FullscreenFrame\\n' > ${settingsIni}`);
        }

        // 3. 依次创建3个测试应用；创建时先不重启 dde-shell（restartDdeShell=false），
        //    避免短时间内连续重启 dde-shell 导致任务栏(dock)图标加载失败、显示异常
        for (const app of installApps) {
            await createTestApp(system, app.name, app.file, 'dde-file-manager', app.icon, 'AudioVideo;', false);
        }

        // 4. 统一重启一次 dde-shell 刷新应用列表，同时让全屏模式配置生效（等待时间留足，让任务栏图标加载完成）
        console.log('重启 dde-shell 刷新应用列表并应用全屏模式');
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 8000));
        await uos.showDesktop();
    });

    test('1832181-【启动器】【全屏模式】【搜索规则】搜索框输入拼音', async ({ device, agent, uos }) => {
        console.log('开始测试：搜索框输入拼音');

        // 步骤1：打开启动器（beforeAll 已通过配置切为全屏模式，打开即为全屏，无需 UI 切换）
        console.log('步骤1：打开启动器全屏模式');
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已显示：界面铺满屏幕，显示应用图标网格和底部搜索框', { timeoutMs: 15000 });
        await agent.aiAssert('启动器全屏模式已打开，界面铺满屏幕，显示应用图标网格和底部搜索框');

        // 步骤2：搜索框输入拼音"ma"，验证匹配名称中含ma相连的应用
        console.log('步骤2：搜索框输入拼音 ma');
        await agent.aiTap('启动器全屏模式底部的搜索输入框');
        // 用 pressKey 逐字输入，触发键盘事件以实时触发搜索过滤（typeText 用粘贴可能不触发搜索）
        await device.pressKey('m');
        await new Promise(resolve => setTimeout(resolve, 300));
        await device.pressKey('a');
        await new Promise(resolve => setTimeout(resolve, 500));
        await agent.aiWaitFor('搜索框显示ma', { timeoutMs: 15000 });
        // 点名本用例关心的测试应用（轮询判断，避免单次AI误判）：含ma相连的 mail测试/manual测试 应显示，不含ma的 音乐测试 不应显示
        // （系统自带的文件管理器、邮箱等英文名 manager/mail 也含 ma，一并匹配属正常，不限制结果总数）
        await agent.aiWaitFor('搜索结果中显示"mail测试"应用图标', { timeoutMs: 15000 });
        await agent.aiWaitFor('搜索结果中显示"manual测试"应用图标', { timeoutMs: 15000 });
        await agent.aiWaitFor('搜索结果中不显示"音乐测试"应用图标', { timeoutMs: 15000 });

        // 步骤3：清除后输入"m a"，验证空格被过滤后结果与ma相同
        console.log('步骤3：清除后输入 m a（验证空格被过滤）');
        await device.pressKey('Ctrl+A');
        await device.pressKey('Delete');
        await new Promise(resolve => setTimeout(resolve, 500));
        await device.pressKey('m');
        await new Promise(resolve => setTimeout(resolve, 300));
        await device.pressKey('Space');
        await new Promise(resolve => setTimeout(resolve, 500));
        await device.pressKey('a');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiWaitFor('搜索框显示ma（输入的空格被过滤）', { timeoutMs: 15000 });
        // 验证空格被过滤后结果与输入ma一致：mail测试/manual测试显示，音乐测试不显示
        await agent.aiWaitFor('搜索结果中显示"mail测试"应用图标', { timeoutMs: 15000 });
        await agent.aiWaitFor('搜索结果中显示"manual测试"应用图标', { timeoutMs: 15000 });
        await agent.aiWaitFor('搜索结果中不显示"音乐测试"应用图标', { timeoutMs: 15000 });

        // 步骤4：清除后输入"mai"，验证匹配名称中含3个字母mai相连的应用
        console.log('步骤4：清除后输入 mai');
        await device.pressKey('Ctrl+A');
        await device.pressKey('Delete');
        await new Promise(resolve => setTimeout(resolve, 500));
        await device.pressKey('m');
        await new Promise(resolve => setTimeout(resolve, 300));
        await device.pressKey('a');
        await new Promise(resolve => setTimeout(resolve, 300));
        await device.pressKey('i');
        await new Promise(resolve => setTimeout(resolve, 500));
        await agent.aiWaitFor('搜索框显示mai', { timeoutMs: 15000 });
        // 说明：实测搜索"mai"还会匹配到"邮箱"等拼音/模糊匹配结果，此处只验证核心结果"名称中含3个字母mai相连的应用（如mail测试）"
        await agent.aiWaitFor('搜索结果中显示"mail测试"应用图标', { timeoutMs: 15000 });

        // 步骤5：清除后输入"yinyue"，验证可搜索到音乐应用
        console.log('步骤5：清除后输入 yinyue');
        await device.pressKey('Ctrl+A');
        await device.pressKey('Delete');
        await new Promise(resolve => setTimeout(resolve, 500));
        await device.pressKey('y');
        await new Promise(resolve => setTimeout(resolve, 200));
        await device.pressKey('i');
        await new Promise(resolve => setTimeout(resolve, 200));
        await device.pressKey('n');
        await new Promise(resolve => setTimeout(resolve, 200));
        await device.pressKey('y');
        await new Promise(resolve => setTimeout(resolve, 200));
        await device.pressKey('u');
        await new Promise(resolve => setTimeout(resolve, 200));
        await device.pressKey('e');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiWaitFor('搜索框显示yinyue', { timeoutMs: 15000 });
        // 轮询等待具体结果图标出现（AI 多轮截图判断，避免单次误判；给足轮询时间）
        await agent.aiWaitFor('搜索结果中显示"音乐测试"应用图标', { timeoutMs: 20000 });

        // 收尾：按 ESC 关闭启动器
        await device.pressKey('ESC');
    }, { timeout: 600000, tags: ['1832181', 'level3'] });

    afterAll(async ({ uos, device, system }) => {
        console.log('afterAll：删除测试应用、关闭测试窗口、还原启动器模式、重启 dde-shell 恢复任务栏图标');
        // 1. 删除3个测试应用并刷新桌面数据库
        for (const app of installApps) {
            await system.exec(`rm -f ~/.local/share/applications/${app.file}.desktop 2>/dev/null`);
        }
        await system.exec('update-desktop-database ~/.local/share/applications/ 2>/dev/null');
        // 2. 关闭测试中可能打开的文件管理器窗口
        await killAppWindows(system, ['dde-file-manager']);
        // 3. 仅当用例前是窗口模式（即用例中切换过）时，才写回窗口配置还原；原本全屏模式则不动
        if (needRestoreFrame) {
            await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=WindowedFrame\\n' > ${settingsIni}`);
        }
        // 4. 收起启动器
        await device.pressKey('ESC');
        // 5. 删除 .desktop 后 dde-shell 热重载应用列表可能导致任务栏(dock)图标错位显示异常，
        //    重启一次 dde-shell 让任务栏图标恢复正常（模式还原配置也在本次重启时生效）
        console.log('重启 dde-shell 恢复任务栏图标并还原模式');
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 8000));
        await uos.showDesktop();
    });
});