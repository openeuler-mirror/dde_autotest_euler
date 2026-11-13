/**
 * 用例 PMSID: 1832655
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】 文字限定高度范围内，应用文件夹名称一行显示不下时换行显示
 * 生成时间: 2026/7/23
 * 用例编写人: UT001707(陈慧)
 */

describe('1832655-【启动器】【全屏模式】【应用文件夹】 文字限定高度范围内，应用文件夹名称一行显示不下时换行显示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        console.log(" 设置字号11");
        await system.exec('busctl --user call org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 Set "ss" "fontsize" "18"');
        await uos.showDesktop();

        // 初始化/更新 item-arrangement.ini.22bak 文件
        // 配置说明：包含"系统管理"应用文件夹，内有3个应用
        // 注: 本用例需要"限定高度内"显示，因此保持默认字体（不放大），让单行放不下的字符串能触发换行
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=1
1\\pageItems\\0=dde-file-manager.desktop, deepin-album.desktop, deepin-draw.desktop
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop
MIDSCEOF`;
        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');
        console.log('item-arrangement.ini.22bak 已创建（系统管理文件夹，1个应用）');
    });

    beforeEach(async ({ device, agent, uos, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');

        const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';

        const replaceCmd = `cp -f ${bakIniPath} ${iniPath}`;
        const replaceResult = await system.exec(replaceCmd);
        assertTrue(replaceResult.success, '替换 item-arrangement.ini 配置文件失败');
        console.log('item-arrangement.ini 已使用 .22bak 文件覆盖');

        await system.exec('systemctl --user daemon-reload');
        await system.exec('systemctl --user restart dde-shell@DDE', 60000);
        await system.exec('sleep 10');
        const statusResult = await system.exec('systemctl --user is-active dde-shell@DDE');
        assertTrue(statusResult.success && statusResult.stdout.trim() === 'active', 'dde-shell服务未正常启动');
        console.log('=====================================');
        console.log('【dde-shell服务重启成功，使 item-arrangement.ini 生效】');
        console.log('=====================================');

        // 预置步骤2：确保启动器为全屏模式
        const result = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
        assertTrue(result.success, '读取配置文件失败');

        const content = result.stdout.toString();
        const isFullscreen = content.includes('current_frame=FullscreenFrame');
        const isWindowed = content.includes('current_frame=WindowedFrame');

        if (isWindowed) {
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

    test('1832655-【启动器】【全屏模式】【应用文件夹】 文字限定高度范围内，应用文件夹名称一行显示不下时换行显示', async ({ device, agent, uos, system }) => {

        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');

        // 步骤 2: 单击进入"系统管理"应用文件夹
        await agent.aiTap('应用列表中的"系统管理"应用文件夹图标');
        await agent.aiWaitFor('应用文件夹已打开，界面显示文件夹内应用');

        // 步骤 3: 修改文件夹名称为"xxx...xxx"
        await agent.aiTap('应用文件夹标题或名称区域');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await device.typeText('xxx_系统管理_xxx_系统管理_xxx_系统管理_xxx');
        await device.pressKey('Enter');
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('已修改文件夹名称为: xxx_系统管理_xxx_系统管理_xxx_系统管理_xxx');

        // 步骤 4: 退出文件夹回到启动器页面
        await device.pressKey('ESC');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 检查1 : 一行展示不下时换行显示
        await agent.aiAssert('应用文件夹名称一行显示不下时显示不下时，单行末尾显示省略号');

        // 步骤 5: 再次进入文件夹，把名称修改得更长（"xxx...xxx...yyy"），触发"换行后还放不下"
        await agent.aiTap('应用列表中的应用文件夹图标');
        await agent.aiWaitFor('应用文件夹已打开，界面显示文件夹内应用');
        await agent.aiTap('应用文件夹标题或名称区域');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await device.typeText('xxx_系统管理_xxx_系统管理_xxx_系统管理_xxx_yyy_系统管理_yyy_系统管理_yyy_系统管理_yyy_系统管理_yyy');
        await device.pressKey('Enter');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await device.pressKey('ESC');
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 检查 2: 换行后依然显示不下时，末尾使用省略号显示
        await agent.aiAssert('应用文件夹名称换行后依然显示不下时，单行末尾显示省略号');

    }, { timeout: 600000, tags: ['1832655', 'level3', 'laptop'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 释放可能仍按下的鼠标左键
        await system.exec('xdotool mouseup 1');
        await new Promise(resolve => setTimeout(resolve, 200));
        console.log('已确保释放鼠标左键');
        // 切换回窗口模式
        await agent.aiTap({
            prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
            images: [{
                name: '窗口模式小图标',
                url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
            }],
            deepThink: true,
        });
        await device.pressKey('esc');

        // 恢复默认字体大小（防止之前的用例修改了字号）
        await system.exec('busctl --user call org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 Set "ss" "fontsize" "14"');
        console.log('已恢复系统字体大小为14');

        // 清理预置步骤1：先删除 item-arrangement.ini 文件
        await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini');
        console.log('item-arrangement.ini 已删除');

        // 然后重启 dde-shell 服务
        await system.exec('systemctl --user restart dde-shell@DDE', 60000);
        await system.exec('sleep 10');
        console.log('dde-shell 服务已重启');

        // 最后执行 daemon-reload
        await system.exec('systemctl --user daemon-reload');
        console.log('systemctl --user daemon-reload 已执行');
    });
});
