/**
 * 用例 PMSID: 1832155
 * 用例标题: 【启动器】【全屏模式】【卸载应用】卸载应用文件夹内的当前页非末尾的应用，本页应用往前补位
 * 生成时间: 2026-09-02 12:00:00
 * 用例编写人: UT005571（王艺桥）
 */

// 卸载目标应用：通过 apt 真实安装 d-feet（desktop 文件 org.gnome.dfeet.desktop，启动器显示名"D-Feet"）
// 说明：必须使用 apt 真实安装的应用，右键"卸载"才会走包管理器真正删除并触发文件夹内补位；
//       createTestApp 创建的用户级 .desktop 模拟应用无法被启动器卸载流程删除，不能用于本用例
const DFEET_PKG = 'd-feet';
const DFEET_DESKTOP = 'org.gnome.dfeet.desktop';
// 应用文件夹配置文件路径
const INI_PATH = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
// 初始配置备份路径（用于恢复）
const INIT_INI_PATH = '/tmp/item-arrangement.backup.ini';
// dde-shell 启动器模式配置文件（current_frame 决定窗口/全屏模式）
const SETTINGS_INI = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
// 启动器模式配置备份路径（用于恢复进入用例前的模式）
const SETTINGS_BACKUP = '/tmp/dde-shell-settings-1832155.ini';

describe('1832155-【启动器】【全屏模式】【卸载应用】卸载应用文件夹内的当前页非末尾的应用，本页应用往前补位', () => {
    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 前置准备 - apt 安装 d-feet 并构造应用文件夹配置');
        await uos.showDesktop();

        // 前置：备份当前 item-arrangement.ini 配置文件（用于 afterAll 恢复）
        console.log('前置：备份当前应用文件夹配置');
        await system.exec(`cp -f ${INI_PATH} ${INIT_INI_PATH} 2>/dev/null`);

        // 前置：备份当前启动器模式配置（用于 afterAll 还原进入用例前的窗口/全屏模式）
        await system.exec(`cp -f ${SETTINGS_INI} ${SETTINGS_BACKUP} 2>/dev/null`);
        console.log('前置：启动器模式配置已备份');

        // 前置：先卸载残留的 d-feet，保证基线干净（包不存在时 apt remove 也会成功返回）
        console.log('前置：清理可能残留的 d-feet');
        await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt remove -y ${DFEET_PKG}'`, 180000);

        // 前置：通过 apt 真实安装 d-feet（作为应用文件夹内非末尾的卸载测试目标）
        console.log('前置：apt 安装 d-feet ...');
        const installResult = await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt install -y ${DFEET_PKG}'`, 180000);
        if (!installResult.success) {
            throw new Error(`前置：d-feet 安装失败：${installResult.stderr}`);
        }
        console.log('前置：d-feet 安装完成');

        // 前置：构造应用文件夹配置（含2页应用，d-feet 放在文件夹第1页非末尾位置（第3个），用于验证卸载后本页应用往前补位）
        console.log('前置：写入应用文件夹配置（含2页应用，d-feet 在文件夹第1页非末尾位置（第3个））');
        const writeCmd = `cat > ${INI_PATH} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=2
1\\pageItems\\0=dde-file-manager.desktop, deepin-terminal.desktop, ${DFEET_DESKTOP}, downloader.desktop, deepin-defender.desktop, deepin-system-monitor.desktop
1\\pageItems\\1=deepin-compressor.desktop, deepin-deb-installer.desktop, deepin-diskmanager.desktop, deepin-scanner.desktop, deepin-screen-recorder.desktop, deepin-picker.desktop
toplevel\\pageCount=2
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop, deepin-app-store.desktop, deepin-pc-manager.desktop, uos-ai-assistant.desktop
toplevel\\pageItems\\1=dde-computer.desktop, dde-trash.desktop, dde-printer.desktop
MIDSCEOF`;
        const writeResult = await system.exec(writeCmd);
        if (!writeResult.success) {
            throw new Error('写入应用文件夹配置失败');
        }
        console.log('前置：应用文件夹配置已写入');

        // 写全屏模式配置（无条件写，保证打开启动器即为全屏模式；仅当窗口才写时重启后可能未生效）
        await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=FullscreenFrame\\n' > ~/.config/deepin/org.deepin.dde-shell/settings.ini`);

        // 重启 dde-shell DDE 服务使配置生效（等待时间留足，让任务栏图标加载完成）
        console.log('前置：重启 dde-shell DDE 服务使配置生效');
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null', 60000);
        await new Promise(resolve => setTimeout(resolve, 8000));
        await uos.showDesktop();
    });

    beforeEach(async ({ device }) => {
        console.log('2. beforeEach: 确认启动器为全屏模式（beforeAll 已写配置并重启）');
        await device.pressKey('ESC');
    });

    test('1832155-【启动器】【全屏模式】【卸载应用】卸载应用文件夹内的当前页非末尾的应用，本页应用往前补位', async ({ device, agent, uos, system }) => {
        console.log('1832155: 开始测试 - 卸载应用文件夹内的当前页非末尾的应用，本页应用往前补位');

        // 步骤 1: 打开启动器全屏模式
        console.log('步骤 1: 打开启动器全屏模式');
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已显示', { timeoutMs: 30000 });
        // 预期 1: 打开成功
        await agent.aiAssert('启动器全屏模式已打开，界面铺满屏幕，显示应用图标网格和底部搜索框');
        console.log('步骤 1 完成：启动器全屏模式已打开');

        // 步骤 2: 打开应用文件夹，卸载当前页非末尾的应用，检查应用排序
        console.log('步骤 2: 打开应用文件夹，右键卸载当前页非末尾的应用');
        // 点击应用文件夹图标（toplevel 第一行第一个，标题为"系统管理"的文件夹样式图标）
        await agent.aiTap('启动器全屏模式下应用列表第一行第一个位置的"系统管理"应用文件夹图标，该图标是文件夹样式（与其他单个应用图标不同）');
        await agent.aiWaitFor('应用文件夹已打开，界面显示文件夹内应用列表', { timeoutMs: 30000 });
        console.log('步骤 2：应用文件夹已打开，显示第1页应用');

        // 基线：先固定卸载前文件夹内的布局（文件夹为4列网格，第1页共5个：
        //   第一行从左到右：文件管理器、终端、D-Feet、安全中心；第二行第一个：系统监视器），
        // 作为卸载后"前移补位"的对照，避免只凭卸载后单张截图无法判断应用是否移动
        await agent.aiAssert('"系统管理"应用文件夹第1页共排列5个应用图标：第一行从左到右依次为"文件管理器"、"终端"、"D-Feet"、"安全中心"，第二行第一个为"系统监视器"，其余位置为空', { timeoutMs: 15000 });
        console.log('步骤 2 基线：卸载前文件夹内布局已确认（第一行第三列为 D-Feet，共5个）');

        // 右键点击当前页非末尾的应用（第3个，非末尾），点击卸载
        console.log('步骤 2：右键点击当前页非末尾位置（第3个）的D-Feet应用');
        await agent.aiRightClick('应用文件夹内当前页第3个应用图标"D-Feet"（非末尾位置）', { deepThink: true });
        await agent.aiWaitFor('应用右键菜单已显示', { timeoutMs: 15000 });
        await agent.aiTap('右键菜单中的"卸载"选项');
        await agent.aiWaitFor('卸载确认对话框已显示', { timeoutMs: 15000 });
        await agent.aiTap('卸载确认对话框中的"确定"按钮');
        console.log('步骤 2：已点击卸载并确认，等待 apt 卸载完成');

        // 等待卸载完成：轮询 dpkg 状态，d-feet 包状态不再是 ii 即说明已被包管理器删除
        let uninstalled = false;
        for (let i = 0; i < 30; i++) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const check = await system.exec(`dpkg -l ${DFEET_PKG} 2>/dev/null | grep -c '^ii'`);
            const count = (check.stdout && check.stdout.toString().trim()) || '1';
            console.log(`卸载检查第${i + 1}次：d-feet 包已安装(ii)数量 = ${count}`);
            if (count === '0') {
                uninstalled = true;
                break;
            }
        }
        if (!uninstalled) {
            throw new Error('d-feet 卸载超时：90 秒内包仍处于已安装状态');
        }
        console.log('步骤 2：d-feet 已由包管理器卸载完成');

        // 卸载后应用文件夹会自动关闭，需重新打开应用文件夹验证补位结果
        const launcherVisible = await agent.aiBoolean('启动器全屏模式当前已显示在屏幕上');
        if (!launcherVisible) {
            await uos.openLauncher();
            await agent.aiWaitFor('启动器全屏模式已显示', { timeoutMs: 30000 });
        }
        console.log('步骤 2：重新打开应用文件夹验证补位结果');
        await agent.aiTap('启动器全屏模式下应用列表第一行第一个位置的"系统管理"应用文件夹图标，该图标是文件夹样式（与其他单个应用图标不同）');
        await agent.aiWaitFor('应用文件夹已打开，界面显示文件夹内应用列表', { timeoutMs: 30000 });
        // 预期 2: 用卸载后单张截图可直接核对的具体事实描述补位结果（文件夹为4列网格，应用按顺序紧凑重排）：
        //   D-Feet 消失、原第4位的"安全中心"前移到第3位、原第5位的"系统监视器"前移到第4位，
        //   4个应用排满第一行、第二行及以下全为空位（第2页应用未补位到第1页）
        await agent.aiAssert('"系统管理"应用文件夹第1页满足：①页面中已看不到"D-Feet"应用图标；②第一行从左到右紧凑排列4个应用，依次为"文件管理器"、"终端"、"安全中心"、"系统监视器"，即原D-Feet后面的"安全中心"、"系统监视器"都往前移动补位；③第二行及以下位置全部为空位，第1页只显示这4个应用，文件夹第2页的应用没有补位到第1页的空位；④底部仍显示2个翻页指示点且停留在第1页，文件夹窗口保持打开', { timeoutMs: 15000 });
        console.log('步骤 2 完成：本页应用往前补位，末位空出，第2页应用未补位');

        // 收尾：按 ESC 关闭应用文件夹和启动器
        await device.pressKey('ESC');
    }, { timeout: 600000, tags: ['1832155', 'level3'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 释放所有按键');
        await device.releaseAllKeys();
    });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 后置清理 - 卸载 d-feet 并恢复应用文件夹配置');
        // 后置：卸载 d-feet（用例中途失败时兜底清理；用例成功时此处为空操作）
        await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt remove -y ${DFEET_PKG}'`, 180000);
        console.log('后置：d-feet 已卸载');
        // 后置：用备份的配置文件恢复 item-arrangement.ini
        await system.exec(`cp -f ${INIT_INI_PATH} ${INI_PATH} 2>/dev/null`);
        // 后置：恢复启动器模式配置（还原进入用例前的窗口/全屏模式）
        await system.exec(`cp -f ${SETTINGS_BACKUP} ${SETTINGS_INI} 2>/dev/null`);
        console.log('后置：启动器模式配置已恢复');
        // 重启 dde-shell DDE 服务使恢复的配置生效
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null', 60000);
        await new Promise(resolve => setTimeout(resolve, 8000));
        console.log('后置：dde-shell DDE 服务重启完成，配置已恢复');
        await device.pressKey('ESC');
        await uos.showDesktop();
    });
});
