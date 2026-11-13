/**
 * 用例 PMSID: 1832653
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】 移除应用文件夹中的应用，应用文件夹消失
 * 生成时间: 2026/7/23
 * 用例编写人: UT001707(陈慧)
 */

describe('1832653-【启动器】【全屏模式】【应用文件夹】 移除应用文件夹中的应用，应用文件夹消失', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();

        // 初始化/更新 item-arrangement.ini.22bak 文件
        // 配置说明：包含"系统管理"应用文件夹，内含2个应用（方便移出测试）
        //   文件管理器、相册
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=1
1\\pageItems\\0=dde-file-manager.desktop, deepin-album.desktop
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop
MIDSCEOF`;
        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');
        console.log('item-arrangement.ini.22bak 已创建（系统管理文件夹，内含2个应用）');
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

    test('1832653-【启动器】【全屏模式】【应用文件夹】 移除应用文件夹中的应用，应用文件夹消失', async ({ device, agent, uos, system }) => {
        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');

        // 步骤 2: 单击进入"系统管理"应用文件夹
        await agent.aiTap('应用列表中的"系统管理"应用文件夹图标');
        await agent.aiWaitFor('应用文件夹已打开，界面显示2个应用（文件管理器、相册）');

        // 步骤 3: 依次移出应用，使应用文件夹消失
        // 通过 xdotool 直接控制鼠标将文件夹内应用拖到文件夹外
        // 参考 1832691 用例的拖拽方式：平滑对角线路径，目标位置在启动器网格内
        const screenInfo = await system.exec('xdpyinfo 2>/dev/null | grep "dimensions" | awk \'{print $2}\'');
        console.log('屏幕尺寸: ' + screenInfo.stdout.trim());

        // 移出第1个应用"文件管理器"（拖到文件夹外部）
        // 源位置：文件夹内"文件管理器"图标（约 648, 308）
        // 目标位置：启动器网格内右下方（约 1195, 913），确保在文件夹弹窗边界外
        const out1SrcX = 648, out1SrcY = 308;
        const out1TgtX = 1195, out1TgtY = 913;
        const out1MidX = Math.floor((out1SrcX + out1TgtX) / 2);
        const out1MidY = Math.floor((out1SrcY + out1TgtY) / 2);
        await system.exec(`xdotool mousemove ${out1SrcX} ${out1SrcY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousemove ${out1MidX} ${out1MidY}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mousemove ${out1TgtX} ${out1TgtY}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mouseup 1`);
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('已移出第1个应用（文件管理器）');
        await agent.aiWaitFor('启动器页面"系统管理"应用文件夹仍然存在');
        await agent.aiAssert('显示系统管理应用文件夹');

        // 移出第2个应用"相册"（移出后文件夹内0个应用，文件夹应消失）
        await agent.aiWaitFor('启动器全屏模式已打开');
        await agent.aiTap('"系统管理"图标');
        // 源位置：文件夹内"相册"图标（约 648, 312）
        // 目标位置：启动器网格内右下方（约 1226, 904），确保在文件夹弹窗边界外
        const out2SrcX = 648, out2SrcY = 312;
        const out2TgtX = 331, out2TgtY = 641;
        const out2MidX = Math.floor((out2SrcX + out2TgtX) / 2);
        const out2MidY = Math.floor((out2SrcY + out2TgtY) / 2);
        await system.exec(`xdotool mousemove ${out2SrcX} ${out2SrcY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousemove ${out2MidX} ${out2MidY}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mousemove ${out2TgtX} ${out2TgtY}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mouseup 1`);
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('已移出第2个应用（相册），文件夹内0个应用');
        // 检查: 移出所有应用后，"系统管理"文件夹从启动器消失
        await agent.aiAssert('"系统管理"应用文件夹从启动器消失');

    }, { timeout: 600000, tags: ['1832653', 'level3', 'laptop'] });

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
