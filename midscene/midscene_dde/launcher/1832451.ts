/**
 * 用例 PMSID: 1832451
 * 用例标题: 【启动器】【窗口模式】【最近安装】应用右键菜单检查
 * 生成时间: 2026-08-15
 * 用例编写人: UT005571（王艺桥）
 */

describe('1832451-【启动器】【窗口模式】【最近安装】应用右键菜单检查', () => {
    // 系统缩放比例：=1 时右键菜单不含“禁用屏幕缩放”，>1 时含该项（位于“开机自启动”与“卸载”之间）
    let systemScale = 1;

    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 前置准备 - 清理残留并安装新应用');
        // 前置：先卸载残留的 360 安全浏览器，确保“最近安装”环境干净
        const removeResult = await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt remove -y com.360.browser-stable'`, 180000);
        if (!removeResult.success) {
            console.error('360安全浏览器清理警告:', removeResult.stderr);
        } else {
            console.log('360安全浏览器清理成功');
        }
        await uos.showDesktop();

        // 前置：通过 apt 安装新应用（360安全浏览器），比应用商店安装快
        console.log('前置：安装360安全浏览器...');
        await system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
        const installResult = await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt install -y com.360.browser-stable'`, 180000);
        if (installResult.success) {
            console.log('360安全浏览器安装成功');
        } else {
            console.error('360安全浏览器安装失败:', installResult.stderr);
        }

        // 检测系统缩放比例，用于判断右键菜单是否包含“禁用屏幕缩放”
        // 优先取主显示器 scaleFactor，取不到时回退到 xrdb 的 Xft.dpi（96=缩放1，144=1.5，192=2）
        const monitors = await device.monitors();
        const primaryMonitor = (monitors || []).find(m => m.isPrimary) || (monitors || [])[0];
        if (primaryMonitor && primaryMonitor.scaleFactor) {
            systemScale = primaryMonitor.scaleFactor;
            console.log(`系统缩放比例（device.monitors）：${systemScale}`);
        } else {
            const dpiResult = await system.exec('xrdb -query 2>/dev/null | grep -i "Xft.dpi" | awk -F: \'{print $2}\' | tr -d \' \\t\'');
            const dpi = parseFloat((dpiResult.stdout || '').toString().trim());
            systemScale = dpi > 0 ? dpi / 96 : 1;
            console.log(`系统缩放比例（xrdb dpi=${dpi}）：${systemScale}`);
        }
        console.log(`系统缩放比例最终值：${systemScale}（>1 时右键菜单包含“禁用屏幕缩放”，=1 时不包含）`);
    });

    beforeEach(async ({ device, agent, uos, system }) => {
        console.log('2. beforeEach: 每个测试前的准备，确保启动器为窗口模式');
        // 读取 dde-shell 配置，判断当前启动器模式
        const result = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
        assertTrue(result.success, '读取配置文件失败');

        const content = result.stdout.toString();
        const isFullscreen = content.includes('current_frame=FullscreenFrame');
        const isWindowed = content.includes('current_frame=WindowedFrame');

        console.log('配置文件内容：', content);
        console.log('isFullscreen：', isFullscreen);
        console.log('isWindowed：', isWindowed);

        // 若为全屏模式，先切换到窗口模式，保证用例从窗口模式切入
        if (isFullscreen) {
            console.log('检测到全屏模式，执行ESC确保启动器被关闭...');
            await device.pressKey('ESC');
            console.log('重新打开启动器...');
            await uos.openLauncher();
            console.log('切换启动器全屏模式到窗口模式...');
            await agent.aiTap({
                prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
                images: [{
                    name: '窗口模式小图标',
                    url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
                }],
                deepThink: true,
            });
        }
        if (isWindowed) {
            console.log('检测到窗口模式，无需操作');
        }
        await device.pressKey('ESC');
    });

    test('1832451-【启动器】【窗口模式】【最近安装】应用右键菜单检查', async ({ device, agent, uos }) => {
        console.log('1832451: 开始测试 - 最近安装应用右键菜单检查');

        // 步骤 1: 打开启动器（窗口模式），验证新应用安装成功并出现在“最近安装”
        console.log('步骤 1: 打开启动器窗口模式，验证360安全浏览器已安装并显示在“最近安装”');
        await uos.openLauncher();
        await agent.aiWaitFor('启动器窗口模式已显示');
        // 预期 1: 安装成功（启动器“最近安装”模块存在新安装的 360 安全浏览器图标）
        await agent.aiAssert('启动器窗口模式中“最近安装”模块存在360安全浏览器图标，应用安装成功');
        console.log('步骤 1 完成：360安全浏览器已安装并显示在“最近安装”');

        // 步骤 2: 鼠标右键点击“最近安装”的应用，检查右键菜单
        console.log('步骤 2: 鼠标右键点击“最近安装”的360安全浏览器，检查右键菜单');
        await agent.aiRightClick('最近安装模块的360安全浏览器', { deepThink: true });
        await agent.aiWaitFor('应用右键菜单已显示');
        // 预期 2: 菜单依次为：打开、从桌面移除、发送至任务栏/取消驻留、开机自启动、（禁用屏幕缩放）、卸载
        // 说明：实际菜单项因应用是否已驻留桌面/任务栏而显示“发送到桌面”或“从桌面上移除”、“发送至任务栏”或“取消驻留”
        await agent.aiAssert('应用右键菜单显示菜单项：打开、从桌面移除（或发送到桌面）、发送至任务栏（或取消驻留）、开机自启动、卸载，且菜单项从上到下依次排列');
        console.log('步骤 2：基础菜单项（打开/从桌面/任务栏/开机自启动/卸载）验证通过');

        // 禁用屏幕缩放：系统缩放为1时不出现，>1 时出现（位于“开机自启动”与“卸载”之间）
        if (systemScale > 1) {
            console.log(`系统缩放 ${systemScale} > 1，断言右键菜单包含“禁用屏幕缩放”且位于“开机自启动”与“卸载”之间`);
            await agent.aiAssert('应用右键菜单中存在“禁用屏幕缩放”菜单项，且该菜单项位于“开机自启动”与“卸载”之间');
        } else {
            console.log(`系统缩放 ${systemScale} = 1，断言右键菜单不包含“禁用屏幕缩放”`);
            await agent.aiAssert('应用右键菜单中不存在“禁用屏幕缩放”菜单项');
        }
        console.log('步骤 2 完成：右键菜单项验证通过');

        // 收尾：按 ESC 关闭右键菜单与启动器
        await device.pressKey('ESC');
    }, { timeout: 600000, tags: ['1832451', 'level3'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.releaseAllKeys();
    });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 后置清理 - 卸载安装的应用并恢复环境');
        // 后置：卸载 360 安全浏览器，恢复环境
        await system.exec(`echo "${env.testPassword}" | sudo -S sh -c 'apt remove -y com.360.browser-stable'`, 180000);
        console.log('360安全浏览器已卸载');
        await device.pressKey('esc');
        await uos.showDesktop();
    });
});
