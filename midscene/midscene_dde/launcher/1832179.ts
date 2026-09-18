/**
 * 用例 PMSID: 1832179
 * 用例标题: 【启动器】【全屏模式】【搜索规则】搜索框输入大小写字母
 * 生成时间: 2026-09-10
 * 用例编写人: UT005571（王艺桥）
 * 前置条件:
 *   1、启动器为全屏模式
 *   2、UI设计图：https://www.sketch.com/s/2c059c90-2632-4eca-9d04-79b88108da7e
 * 用例步骤:
 *   1. 搜索框输入字母，如大写字母"M" → 预期：搜索到所有在中文环境和英文环境下名称中带有 M 字母的应用
 *   2. 搜索框输入字母，如小写字母"m" → 预期：同上（大小写不敏感，结果相同）
 *   3. 搜索框输入字母，如"yysd" → 预期：可搜索到"应用商店"，字母搜索结果优先匹配中文拼音简拼
 *   4. 搜索框输入字母，如"y y s d" → 预期：可搜索到"应用商店"（带空格输入同样匹配拼音简拼）
 */

// 公共方法：createTestApp 创建 .desktop 模拟新应用；killAppWindows 关闭应用窗口
const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { createTestApp, killAppWindows } = require(helperPath);

// dde-shell 配置文件：current_frame 决定启动器模式（WindowedFrame=窗口模式 / FullscreenFrame=全屏模式）
const settingsIni = '~/.config/deepin/org.deepin.dde-shell/settings.ini';

// 测试应用规划：
// - Mail测试(mail-test)：英文名称"Mail测试"含字母 M/m——验证英文环境名称含 M 的应用
// - 小米测试(xiaomi-test)：中文名称，拼音"xiao mi"中含 m（第二个音节首字母）——验证中文环境名称（拼音）含 M 的应用
// - 百度测试(baidu-test)：中文名称，拼音"bai du"不含 M——作为对照应用，不应被搜到
const installApps = [
    { name: 'Mail测试', file: 'mail-test', icon: 'deepin-mail' },
    { name: '小米测试', file: 'xiaomi-test', icon: 'deepin-music' },
    { name: '百度测试', file: 'baidu-test', icon: 'deepin-browser' },
];

describe('1832179-【启动器】【全屏模式】【搜索规则】搜索框输入大小写字母', () => {
    // 标记用例前是否为窗口模式（窗口才需要切全屏模式，afterAll 时据此还原）
    let needRestoreFrame = false;

    beforeAll(async ({ uos, system }) => {
        console.log('beforeAll：确保启动器为全屏模式基线，并创建3个搜索测试应用');
        await uos.showDesktop();

        // 1. 读取启动器模式配置：本用例要求全屏模式，仅当配置为窗口模式时才需要切换
        const frameResult = await system.exec(`cat ${settingsIni}`);
        const isWindowed = frameResult.success && frameResult.stdout.includes('current_frame=WindowedFrame');
        console.log('当前启动器模式：', isWindowed ? '窗口模式，需切换为全屏模式' : '全屏模式（或默认），无需操作');

        // 2. 窗口模式才切换：写配置为全屏模式（重启 dde-shell 后生效，模式持久保持）
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

    test('1832179-【启动器】【全屏模式】【搜索规则】搜索框输入大小写字母', async ({ device, agent, uos, system }) => {
        console.log('开始测试：搜索框输入大小写字母');

        // 搜索辅助：清空搜索框（Ctrl+A + Delete）后逐键输入，再等待指定应用出现在"搜索结果区域"
        // 说明：搜索输入存在偶发时序/输入法抖动，等待失败时自动清空重输一次再试
        const searchAndWait = async (keys, expectedPrompt, maxRetry = 2) => {
            for (let attempt = 1; attempt <= maxRetry; attempt++) {
                await device.pressKey('Ctrl+A');
                await device.pressKey('Delete');
                await new Promise(resolve => setTimeout(resolve, 500));
                for (const ch of keys) {
                    await device.pressKey(ch);
                    await new Promise(resolve => setTimeout(resolve, 250));
                }
                await new Promise(resolve => setTimeout(resolve, 800));
                try {
                    await agent.aiWaitFor(expectedPrompt, { timeoutMs: 15000 });
                    return;
                } catch (e) {
                    console.log(`搜索等待未通过（第${attempt}次），清空重试：${expectedPrompt.slice(0, 30)}...`);
                }
            }
            // 最后一次重试不再捕获，失败向上抛出
            await device.pressKey('Ctrl+A');
            await device.pressKey('Delete');
            await new Promise(resolve => setTimeout(resolve, 500));
            for (const ch of keys) {
                await device.pressKey(ch);
                await new Promise(resolve => setTimeout(resolve, 250));
            }
            await new Promise(resolve => setTimeout(resolve, 800));
            await agent.aiWaitFor(expectedPrompt, { timeoutMs: 15000 });
        };

        // 步骤1：打开启动器全屏模式
        console.log('步骤1：打开启动器全屏模式');
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已显示：界面铺满屏幕，显示应用图标网格和底部搜索框', { timeoutMs: 15000 });
        await agent.aiAssert('启动器全屏模式已打开，界面铺满屏幕，显示应用图标网格和底部搜索框');
        console.log('步骤1 完成：启动器全屏模式已打开');

        // 步骤2：搜索框输入大写字母"M"
        // 预期：搜索到所有在中文环境和英文环境下名称中带有 M 字母的应用（Mail测试=英文含M；小米测试=中文拼音首字母含m；对照=百度测试不应显示）
        console.log('步骤2：搜索框输入大写字母 M');
        await agent.aiTap('启动器全屏模式底部的搜索输入框');
        await new Promise(resolve => setTimeout(resolve, 500));
        // 输入大写 M：用 xdotool 组合键 shift+m 保证输出大写（device.pressKey 直接按字母为小写）
        await system.exec('xdotool key --clearmodifiers shift+m');
        await new Promise(resolve => setTimeout(resolve, 800));
        await agent.aiWaitFor('搜索框显示大写字母M', { timeoutMs: 15000 });
        // 点名验证：英文名称含M的 Mail测试、中文拼音含M的 小米测试 应显示；对照应用 百度测试 不应显示
        await agent.aiWaitFor('搜索结果区域中显示"Mail测试"应用图标', { timeoutMs: 15000 });
        await agent.aiWaitFor('搜索结果区域中显示"小米测试"应用图标', { timeoutMs: 15000 });
        await agent.aiWaitFor('搜索结果区域中不显示"百度测试"应用图标', { timeoutMs: 15000 });
        console.log('步骤2 完成：大写 M 搜索到英文名称含 M 与中文名称（拼音）含 M 的应用');

        // 步骤3：清除后输入小写字母"m"，验证大小写不敏感、结果与步骤2相同
        console.log('步骤3：清除后输入小写字母 m');
        await searchAndWait(['m'], '搜索结果区域中显示"Mail测试"应用图标');
        await agent.aiWaitFor('搜索结果区域中显示"小米测试"应用图标', { timeoutMs: 15000 });
        await agent.aiWaitFor('搜索结果区域中不显示"百度测试"应用图标', { timeoutMs: 15000 });
        console.log('步骤3 完成：小写 m 搜索结果与大写一致（大小写不敏感）');

        // 步骤4：清除后输入"yysd"
        console.log('步骤4：清除后输入 yysd');
        // 预期：可搜索到“应用商店”，字母搜索结果优先匹配中文拼音简拼（yysd=应/用/商/店）
        // 实测：全屏启动器搜索 yysd 后应用网格被过滤，仅剩"应用商店"一个结果
        await searchAndWait(['y', 'y', 's', 'd'], '启动器应用网格中仅显示"应用商店"一个应用图标（搜索过滤后的结果，网格中无"文件管理器""浏览器""终端"等其他应用图标）');
        console.log('步骤4 完成：yysd 拼音简拼搜索到“应用商店”');

        // 步骤5：清除后输入"y y s d"（带空格）
        console.log('步骤5：清除后输入 y y s d（带空格）');
        // 预期：同样可搜索到“应用商店”（空格被过滤，等效于 yysd）
        await searchAndWait(['y', 'Space', 'y', 'Space', 's', 'Space', 'd'], '启动器应用网格中仅显示"应用商店"一个应用图标（搜索过滤后的结果，网格中无"文件管理器""浏览器""终端"等其他应用图标）');
        console.log('步骤5 完成：带空格输入 y y s d 同样搜索到“应用商店”）');

        // 收尾：按 ESC 关闭启动器
        await device.pressKey('ESC');
    }, { timeout: 600000, tags: ['1832179', 'level3'] });

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