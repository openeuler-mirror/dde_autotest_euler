/**
 * 用例 PMSID: 1832153
 * 用例标题: 【启动器】【全屏模式】【卸载应用】卸载当前页末尾的应用，应用无需补位
 * 生成时间: 2026-08-17
 * 用例编写人: UT005571（王艺桥）
 */

// 卸载目标应用：用 apt 真实安装 d-feet（轻量应用），右键卸载会通过应用商店正常卸载
const testApp = { name: 'D-Feet', id: 'd-feet', desktop: 'org.gnome.dfeet.desktop' };
// 应用文件夹配置文件路径
const INI_PATH = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
// 初始配置备份路径（用于恢复）
const INIT_INI_PATH = 'midscene_dde/launcher/item-arrangement.ini';

describe('1832153-【启动器】【全屏模式】【卸载应用】卸载当前页末尾的应用，应用无需补位', () => {
    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 前置准备 - 安装卸载目标应用并构造启动器配置');
        await uos.showDesktop();

        // 前置：先卸载残留的 d-feet，确保环境干净
        console.log('前置：清理残留的 d-feet');
        await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt remove -y ${testApp.id}'`, 180000);
        console.log('前置：清理完成');

        // 前置：apt 安装 d-feet（作为当前页末尾的卸载目标）
        console.log(`前置：安装 ${testApp.name}（${testApp.id}）...`);
        const installResult = await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt install -y ${testApp.id}'`, 180000);
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

        // 前置：构造启动器配置（含2页应用，d-feet 放在第1页末尾，用于验证卸载后无补位）
        console.log('前置：写入启动器配置（含2页应用，d-feet 在第1页末尾）');
        const writeCmd = `cat > ${INI_PATH} <<'MIDSCEOF'
[fullscreen]
toplevel\\pageCount=2
toplevel\\pageItems\\0=org.deepin.browser.desktop, dde-file-manager.desktop, deepin-app-store.desktop, deepin-music.desktop, deepin-movie.desktop, deepin-screen-recorder.desktop, deepin-image-viewer.desktop, deepin-album.desktop, deepin-draw.desktop, deepin-reader.desktop, deepin-editor.desktop, deepin-mail.desktop, deepin-terminal.desktop, deepin-voice-note.desktop, downloader.desktop, deepin-manual.desktop, dde-computer.desktop, dde-trash.desktop, org.deepin.dde.control-center.desktop, deepin-system-monitor.desktop, deepin-boot-maker.desktop, deepin-devicemanager.desktop, deepin-log-viewer.desktop, dde-printer.desktop, deepin-calculator.desktop, ${testApp.desktop}
toplevel\\pageItems\\1=deepin-compressor.desktop, deepin-deb-installer.desktop, deepin-diskmanagement.desktop, deepin-scanner.desktop, deepin-picker.desktop, deepin-camera.desktop, dde-cooperation.desktop, com.sogou.ime.ng.fcitx5.uos.configurer.desktop, com.uos.drive.desktop, dde-calendar.desktop, deepin-data-transfer.desktop, deepin-defender.desktop, uos-ai-assistant.desktop, uos-recovery-gui.desktop, uos-remote-assistance.desktop, uos-service-support.desktop
MIDSCEOF`;
        const writeResult = await system.exec(writeCmd);
        if (!writeResult.success) {
            throw new Error('写入启动器配置失败');
        }
        console.log('前置：启动器配置已写入');

        // 重启 dde-shell 使配置生效
        await system.exec('systemctl --user daemon-reload');
        await system.exec('systemctl --user restart dde-shell@DDE', 60000);
        await system.exec('sleep 10');
        const statusResult = await system.exec('systemctl --user is-active dde-shell@DDE');
        if (!(statusResult.success && statusResult.stdout.trim() === 'active')) {
            throw new Error('dde-shell服务未正常启动');
        }
        console.log('前置：dde-shell服务重启成功，启动器配置已生效');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, uos, system, env }) => {
        console.log('2. beforeEach: 每个测试前的准备，确保启动器为全屏模式');
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

    test('1832153-【启动器】【全屏模式】【卸载应用】卸载当前页末尾的应用，应用无需补位', async ({ device, agent, uos, system }) => {
        console.log('1832153: 开始测试 - 卸载当前页末尾的应用，应用无需补位');

        // 步骤 1: 打开启动器全屏模式
        console.log('步骤 1: 打开启动器全屏模式');
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已显示');
        // 预期 1: 打开成功
        await agent.aiAssert('启动器全屏模式已打开，界面铺满屏幕，显示应用图标网格和底部搜索框');
        console.log('步骤 1 完成：启动器全屏模式已打开');

        // 步骤 2: 卸载当前页末尾的应用，检查应用排序
        console.log('步骤 2: 右键卸载当前页末尾的D-Feet应用');
        // 右键点击当前页末尾的应用（D-Feet），点击卸载
        await agent.aiRightClick('启动器全屏模式当前页末尾的D-Feet应用图标', { deepThink: true });
        await agent.aiWaitFor('应用右键菜单已显示');
        await agent.aiTap('右键菜单中的"卸载"');
        await agent.aiWaitFor('卸载确认对话框已显示');
        await agent.aiTap('卸载确认对话框中的"确定"按钮');
        console.log('步骤 2：已点击卸载并确认，等待卸载完成');
        // 等待卸载完成：通过 dpkg 轮询确认 d-feet 已卸载（卸载通知可能转瞬即逝，dpkg 状态更可靠）
        let uninstalled = false;
        for (let i = 0; i < 30; i++) {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const check = await system.exec(`dpkg -s ${testApp.id} 2>/dev/null | grep -c 'Status: install ok installed'`);
            const count = (check.stdout && check.stdout.toString().trim()) || '0';
            console.log(`卸载检查第${i + 1}次：dpkg 中 d-feet 已安装状态 = ${count}`);
            if (count === '0') {
                uninstalled = true;
                break;
            }
        }
        assertTrue(uninstalled, 'D-Feet 应在卸载确认后从系统中卸载');
        // 等待 dde-shell 刷新应用列表，使当前页应用状态更新
        await new Promise(resolve => setTimeout(resolve, 3000));
        // 预期 2: 页面末位空出的位置无需下一页应用补位；卸载应用后，启动器保持在当前页面
        await agent.aiAssert('启动器当前页末尾空出的位置无需下一页应用补位（下一页应用未补位到当前页末尾），且卸载应用后启动器保持在当前页面，未退出启动器');
        console.log('步骤 2 完成：末尾应用已卸载，无补位，保持在当前页面');

        // 收尾：按 ESC 关闭启动器
        await device.pressKey('ESC');
    }, { timeout: 600000, tags: ['1832153', 'level3'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.releaseAllKeys();
    });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 后置清理 - 恢复启动器配置并卸载测试应用');
        // 后置：用初始配置文件恢复 item-arrangement.ini
        await system.exec(`cp -f ${INIT_INI_PATH} ${INI_PATH} 2>/dev/null`);
        // 卸载 d-feet（兜底，卸载操作可能已卸载）
        await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt remove -y ${testApp.id}'`, 180000);
        // 重启 dde-shell 使恢复的配置生效
        await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null');
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('后置：启动器配置已恢复，测试应用已卸载');
        await device.pressKey('esc');
        await uos.showDesktop();
    });
});
