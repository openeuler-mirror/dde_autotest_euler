/**
 * 用例 PMSID: 1832157
 * 用例标题: 【启动器】【全屏模式】【卸载应用】卸载应用文件夹内的当前页末尾的应用，应用无需补位
 * 生成时间: 2026-09-02 11:45:00
 * 用例编写人: UT005571（王艺桥）
 */

// 卸载目标应用：用 apt 真实安装 d-feet（轻量应用），右键卸载会通过应用商店正常卸载
const testApp = { name: 'D-Feet', id: 'd-feet', desktop: 'org.gnome.dfeet.desktop' };
// 应用文件夹配置文件路径
const INI_PATH = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
// 初始配置备份路径（用于恢复）
const INIT_INI_PATH = '/tmp/item-arrangement.backup.ini';

describe('1832157-【启动器】【全屏模式】【卸载应用】卸载应用文件夹内的当前页末尾的应用，应用无需补位', () => {
    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('beforeAll: 前置准备 - 安装卸载目标应用并构造应用文件夹配置');
        await uos.showDesktop();

        // 前置：备份当前 item-arrangement.ini 配置文件（用于 afterAll 恢复）
        console.log('前置：备份当前应用文件夹配置');
        await system.exec(`cp -f ${INI_PATH} ${INIT_INI_PATH} 2>/dev/null`);
        console.log('前置：配置文件已备份');

        // 前置：先卸载残留的 d-feet，确保环境干净
        console.log('前置：清理残留的 d-feet');
        await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt remove -y ${testApp.id}' 2>&1`, 180000);
        console.log('前置：清理完成');

        // 前置：apt 安装 d-feet（作为应用文件夹内末尾的卸载目标）
        console.log(`前置：安装 ${testApp.name}（${testApp.id}）...`);
        const installResult = await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt install -y ${testApp.id}' 2>&1`, 180000);
        if (installResult.success) {
            console.log(`${testApp.name} 安装成功`);
        } else {
            console.error(`${testApp.name} 安装失败:`, installResult.stderr);
        }
        // 校验安装结果
        const verify = await system.exec(`dpkg -l 2>/dev/null | grep -c '${testApp.id}'`);
        const installed = (verify.stdout && verify.stdout.toString().trim()) !== '0';
        if (!installed) {
            throw new Error(`前置：${testApp.name}（${testApp.id}）安装失败，终止用例`);
        }
        console.log(`前置：${testApp.name} 安装校验通过`);

        // 前置：构造应用文件夹配置（含2页应用，d-feet 放在第1页末尾，用于验证卸载后无补位）
        console.log('前置：写入应用文件夹配置（含2页应用，d-feet 在第1页末尾）');
        const writeCmd = `cat > ${INI_PATH} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=2
1\\pageItems\\0=dde-file-manager.desktop, deepin-terminal.desktop, downloader.desktop, deepin-defender.desktop, deepin-system-monitor.desktop, ${testApp.desktop}
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

        // 重启 dde-shell DDE 服务使配置生效（重启 DDE 服务，不重启 desktop 插件，避免锁屏）
        console.log('前置：重启 dde-shell DDE 服务使配置生效');
        await system.exec('systemctl --user restart dde-shell@DDE 2>&1', 60000);
        await system.exec('sleep 8');
        const statusResult = await system.exec('systemctl --user is-active dde-shell@DDE');
        if (!(statusResult.success && statusResult.stdout.trim() === 'active')) {
            throw new Error('dde-shell DDE 服务未正常启动');
        }
        console.log('前置：dde-shell DDE 服务重启成功，应用文件夹配置已生效');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, uos, system, env }) => {
        console.log('beforeEach: 确保启动器为全屏模式');
        const result = await system.exec(`cat /home/${env.testUsername}/.config/deepin/org.deepin.dde-shell/settings.ini`);
        assertTrue(result.success, '读取配置文件失败');

        const content = result.stdout.toString();
        const isFullscreen = content.includes('current_frame=FullscreenFrame');
        const isWindowed = content.includes('current_frame=WindowedFrame');

        console.log('配置文件内容：', content);
        console.log('isFullscreen：', isFullscreen);
        console.log('isWindowed：', isWindowed);

        // 若为窗口模式，切换到全屏模式（前置条件要求全屏模式）
        if (isWindowed) {
            console.log('检测到窗口模式，切换到全屏模式...');
            await uos.openLauncher();
            await agent.aiTap({
                prompt: '识别指定图标坐标：在启动器窗口模式左下角的全屏模式图标',
                images: [{
                    name: '全屏模式小图标',
                    url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203-1.png',
                }],
                deepThink: true,
            });
        }
        if (isFullscreen) {
            console.log('检测到全屏模式，无需操作');
        }
        await device.pressKey('ESC');
    });

    test('1832157-【启动器】【全屏模式】【卸载应用】卸载应用文件夹内的当前页末尾的应用，应用无需补位', async ({ device, agent, uos, system }) => {
        console.log('1832157: 开始测试 - 卸载应用文件夹内的当前页末尾的应用，应用无需补位');

        // 步骤 1: 打开启动器全屏模式
        console.log('步骤 1: 打开启动器全屏模式');
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已显示', { timeoutMs: 30000 });
        // 预期 1: 打开成功
        await agent.aiAssert('启动器全屏模式已打开，界面铺满屏幕，显示应用图标网格和底部搜索框');
        console.log('步骤 1 完成：启动器全屏模式已打开');

        // 步骤 2: 打开应用文件夹，卸载当前页末尾的应用，检查应用排序
        console.log('步骤 2: 打开应用文件夹，右键卸载当前页末尾的应用');
        // 点击应用文件夹图标（启动器全屏模式下显示为"其他应用"文件夹图标，与其他应用图标不同，是文件夹样式）
        await agent.aiTap('启动器全屏模式下应用列表中的应用文件夹图标，该图标是文件夹样式（与其他单个应用图标不同），通常显示在应用列表中靠前位置');
        await agent.aiWaitFor('应用文件夹已打开，界面显示文件夹内应用列表', { timeoutMs: 30000 });
        console.log('步骤 2：应用文件夹已打开，显示第1页应用');

        // 右键点击当前页末尾的应用（D-Feet），点击卸载
        console.log('步骤 2：右键点击当前页末尾的应用');
        await agent.aiRightClick('应用文件夹内当前页末尾的应用图标', { deepThink: true });
        await agent.aiWaitFor('应用右键菜单已显示', { timeoutMs: 15000 });
        await agent.aiTap('右键菜单中的"卸载"选项');
        await agent.aiWaitFor('卸载确认对话框已显示', { timeoutMs: 15000 });
        await agent.aiTap('卸载确认对话框中的"确定"按钮');
        console.log('步骤 2：已点击卸载并确认，等待卸载完成');

        // 等待卸载完成：先通过 dpkg 确认应用已卸载（卸载可能需要数秒到数十秒）
        console.log('步骤 2：等待应用卸载完成（通过 dpkg 轮询确认）');
        let uninstalled = false;
        for (let i = 0; i < 24; i++) {
            const check = await system.exec(`dpkg -l 2>/dev/null | grep -c '${testApp.id}'`);
            const count = (check.stdout && check.stdout.toString().trim());
            if (count === '0') {
                uninstalled = true;
                console.log(`步骤 2：应用已卸载（第${i + 1}次检查）`);
                break;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        if (!uninstalled) {
            console.log('步骤 2：应用卸载超时，但继续验证补位结果');
        }
        // 卸载完成后等待界面稳定
        await new Promise(resolve => setTimeout(resolve, 3000));
        console.log('步骤 2：应用卸载完成');

        // 卸载后应用文件夹会自动关闭，需重新打开应用文件夹验证补位结果
        const launcherVisible = await agent.aiBoolean('启动器全屏模式当前已显示在屏幕上');
        if (!launcherVisible) {
            await uos.openLauncher();
            await agent.aiWaitFor('启动器全屏模式已显示', { timeoutMs: 30000 });
        }
        console.log('步骤 2：重新打开应用文件夹验证补位结果');
        await agent.aiTap('启动器全屏模式下应用列表中的应用文件夹图标，该图标是文件夹样式（与其他单个应用图标不同），通常显示在应用列表中靠前位置');
        await agent.aiWaitFor('应用文件夹已打开，界面显示文件夹内应用列表', { timeoutMs: 30000 });
        // 预期 2: 页面末位空出的位置无需下一页应用补位；卸载的是末尾应用，无需补位
        await agent.aiAssert('应用文件夹第1页中末尾应用已不存在（已卸载），第1页共显示5个应用图标且末位空出，应用无需补位，应用文件夹第2页的应用未补位到第1页的空位');
        console.log('步骤 2 完成：末尾应用已卸载，末位空出，无需补位，第2页应用未补位');

        // 收尾：按 ESC 关闭应用文件夹和启动器
        await device.pressKey('ESC');
    }, { timeout: 600000, tags: ['1832157', 'level3'] });

    afterEach(async ({ device, agent }) => {
        console.log('afterEach: 释放所有按键');
        await device.releaseAllKeys();
    });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('afterAll: 后置清理 - 恢复应用文件夹配置并卸载测试应用');
        // 后置：用备份的配置文件恢复 item-arrangement.ini
        await system.exec(`cp -f ${INIT_INI_PATH} ${INI_PATH} 2>/dev/null`);
        console.log('后置：应用文件夹配置已恢复');
        // 卸载 d-feet（兜底，卸载操作可能已卸载）
        await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt remove -y ${testApp.id}' 2>&1`, 180000);
        console.log('后置：测试应用已卸载');
        // 重启 dde-shell DDE 服务使恢复的配置生效
        await system.exec('systemctl --user restart dde-shell@DDE 2>&1', 60000);
        await system.exec('sleep 8');
        console.log('后置：dde-shell DDE 服务重启完成，配置已恢复');
        await device.pressKey('ESC');
        await uos.showDesktop();
    });
});
