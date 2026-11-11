/**
 * 用例 PMSID: 1832151
 * 用例标题: 【启动器】【全屏模式】【卸载应用】卸载当前页非末尾的应用，本页应用往前补位
 * 生成时间: 2026-08-17
 * 用例编写人: UT005571（王艺桥）
 */

// 卸载目标应用：通过 apt 真实安装 d-feet（desktop 文件 org.gnome.dfeet.desktop，启动器显示名"D-Feet"）
// 说明：必须使用 apt 真实安装的应用，右键"卸载"才会走包管理器真正删除并触发本页补位；
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
const SETTINGS_BACKUP = '/tmp/dde-shell-settings-1832151.ini';

describe('1832151-【启动器】【全屏模式】【卸载应用】卸载当前页非末尾的应用，本页应用往前补位', () => {
    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 前置准备 - apt 安装 d-feet 并构造启动器配置');
        await uos.showDesktop();

        // 前置：备份当前 item-arrangement.ini 配置文件（用于 afterAll 恢复）
        console.log('前置：备份当前启动器配置');
        await system.exec(`cp -f ${INI_PATH} ${INIT_INI_PATH} 2>/dev/null`);

        // 前置：备份当前启动器模式配置（用于 afterAll 还原进入用例前的窗口/全屏模式）
        await system.exec(`cp -f ${SETTINGS_INI} ${SETTINGS_BACKUP} 2>/dev/null`);
        console.log('前置：启动器模式配置已备份');

        // 前置：先卸载残留的 d-feet，保证基线干净（包不存在时 apt remove 也会成功返回）
        console.log('前置：清理可能残留的 d-feet');
        await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt remove -y ${DFEET_PKG}'`, 180000);

        // 前置：通过 apt 真实安装 d-feet（作为当前页非末尾的卸载测试目标）
        console.log('前置：apt 安装 d-feet ...');
        const installResult = await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt install -y ${DFEET_PKG}'`, 180000);
        if (!installResult.success) {
            throw new Error(`前置：d-feet 安装失败：${installResult.stderr}`);
        }
        console.log('前置：d-feet 安装完成');

        // 前置：构造启动器配置（含2页应用，d-feet 放在第1页非末尾位置（第10个），用于验证卸载后本页应用往前补位）
        console.log('前置：写入启动器配置（含2页应用，d-feet 在第1页非末尾位置）');
        const writeCmd = `cat > ${INI_PATH} <<'MIDSCEOF'
[fullscreen]
toplevel\\pageCount=2
toplevel\\pageItems\\0=org.deepin.browser.desktop, dde-file-manager.desktop, deepin-app-store.desktop, deepin-music.desktop, deepin-movie.desktop, deepin-screen-recorder.desktop, deepin-image-viewer.desktop, deepin-album.desktop, deepin-draw.desktop, ${DFEET_DESKTOP}, deepin-reader.desktop, deepin-editor.desktop, deepin-mail.desktop, deepin-terminal.desktop, deepin-voice-note.desktop, downloader.desktop, deepin-manual.desktop, dde-computer.desktop, dde-trash.desktop, org.deepin.dde.control-center.desktop, deepin-system-monitor.desktop, deepin-boot-maker.desktop, deepin-devicemanager.desktop, deepin-log-viewer.desktop, dde-printer.desktop, deepin-calculator.desktop, deepin-font-manager.desktop
toplevel\\pageItems\\1=deepin-compressor.desktop, deepin-deb-installer.desktop, deepin-diskmanagement.desktop, deepin-scanner.desktop, deepin-picker.desktop, deepin-camera.desktop, dde-cooperation.desktop, com.sogou.ime.ng.fcitx5.uos.configurer.desktop, com.uos.drive.desktop, dde-calendar.desktop, deepin-data-transfer.desktop, deepin-defender.desktop, uos-ai-assistant.desktop, uos-recovery-gui.desktop, uos-remote-assistance.desktop, uos-service-support.desktop
MIDSCEOF`;
        const writeResult = await system.exec(writeCmd);
        if (!writeResult.success) {
            throw new Error('写入启动器配置失败');
        }
        console.log('前置：启动器配置已写入');

        // 写全屏模式配置（无条件写，保证打开启动器即为全屏模式；仅当窗口才写时重启后可能未生效）
        await system.exec(`mkdir -p ~/.config/deepin/org.deepin.dde-shell && printf '[General]\\ncurrent_frame=FullscreenFrame\\n' > ~/.config/deepin/org.deepin.dde-shell/settings.ini`);

        // 重启 dde-shell 使配置生效（等待时间留足，让任务栏图标加载完成）
        console.log('前置：重启 dde-shell 使配置生效');
        await system.exec('systemctl --user restart dde-shell@DDE', 60000);
        await new Promise(resolve => setTimeout(resolve, 8000));
        console.log('前置：dde-shell 服务重启成功，启动器配置已生效');
        await uos.showDesktop();
    });

    beforeEach(async ({ device }) => {
        console.log('2. beforeEach: 确认启动器为全屏模式（beforeAll 已写配置并重启）');
        await device.pressKey('ESC');
    });

    test('1832151-【启动器】【全屏模式】【卸载应用】卸载当前页非末尾的应用，本页应用往前补位', async ({ device, agent, uos, system }) => {
        console.log('1832151: 开始测试 - 卸载当前页非末尾的应用，本页应用往前补位');

        // 步骤 1: 打开启动器全屏模式
        console.log('步骤 1: 打开启动器全屏模式');
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已显示', { timeoutMs: 15000 });
        // 预期 1: 打开成功
        await agent.aiAssert('启动器全屏模式已打开，界面铺满屏幕，显示应用图标网格和底部搜索框');
        console.log('步骤 1 完成：启动器全屏模式已打开');

        // 步骤 2: 卸载当前页非末尾的应用，检查应用排序
        console.log('步骤 2: 右键卸载当前页非末尾的D-Feet应用');
        // 基线：先固定卸载前的布局（D-Feet 在第二行第二列，其右侧第二行第三列为文档查看器），
        // 作为卸载后"前移补位"的对照，避免只凭卸载后单张截图无法判断应用是否移动
        await agent.aiAssert('当前页第二行第二列位置显示"D-Feet"应用图标，其右侧第二行第三列位置显示"文档查看器"应用图标，第四行排列有6个应用图标', { timeoutMs: 15000 });
        console.log('步骤 2 基线：卸载前布局已确认（D-Feet 在第二行第二列）');
        // 右键点击当前页非末尾的应用（D-Feet，位于第10个，非末尾），点击卸载
        await agent.aiRightClick('启动器全屏模式当前页非末尾位置的D-Feet应用图标', { deepThink: true });
        await agent.aiWaitFor('应用右键菜单已显示', { timeoutMs: 15000 });
        await agent.aiTap('右键菜单中的"卸载"');
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
        console.log('d-feet 已由包管理器卸载完成');
        // 等待卸载进度窗口关闭、dde-shell 刷新应用列表完成
        await agent.aiWaitFor('D-Feet 已卸载完成：启动器当前页中已看不到"D-Feet"应用图标，第二行第二列位置显示的是"文档查看器"应用图标', { timeoutMs: 30000 });
        // 预期 2: 用卸载后单张截图可直接核对的具体事实描述补位结果：
        //   D-Feet 消失、其后的文档查看器前移占据原格（前移补位）、第四行由6个变5个且末位空位（下一页未补位到当前页）、仍停留在第一页且启动器未退出
        await agent.aiAssert('卸载后启动器当前页满足：①页面中已看不到"D-Feet"应用图标；②第二行第二列（D-Feet原来的位置）现在显示"文档查看器"应用图标，即原D-Feet后面的应用往前移动补位；③第四行只排列5个应用图标，第四行末尾（第六、七、八列）为空位，没有下一页的应用补位到当前页；④顶部仍显示2个翻页指示点且停留在第一页，启动器保持全屏打开状态，未退出启动器', { timeoutMs: 15000 });
        console.log('步骤 2 完成：本页应用往前补位，无下一页补位，保持在当前页面');

        // 收尾：按 ESC 关闭启动器
        await device.pressKey('ESC');
    }, { timeout: 600000, tags: ['1832151', 'level3'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.releaseAllKeys();
    });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 后置清理 - 卸载 d-feet 并恢复启动器配置');
        // 后置：卸载 d-feet（用例中途失败时兜底清理；用例成功时此处为空操作）
        await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt remove -y ${DFEET_PKG}'`, 180000);
        console.log('后置：d-feet 已卸载');
        // 后置：用备份的配置文件恢复 item-arrangement.ini
        await system.exec(`cp -f ${INIT_INI_PATH} ${INI_PATH} 2>/dev/null`);
        // 后置：恢复启动器模式配置（还原进入用例前的窗口/全屏模式）
        await system.exec(`cp -f ${SETTINGS_BACKUP} ${SETTINGS_INI} 2>/dev/null`);
        console.log('后置：启动器模式配置已恢复');
        // 重启 dde-shell 使恢复的配置生效
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 8000));
        await device.pressKey('esc');
        await uos.showDesktop();
    });
});
