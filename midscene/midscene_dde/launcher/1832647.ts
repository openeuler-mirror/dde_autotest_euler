/**
 * 用例 PMSID: 1832647
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】 拖动同一类型应用，创建2个相同名称的应用文件夹
 * 生成时间: 2026/7/23
 * 用例编写人: UT001707(陈慧)
 */

describe('1832647-【启动器】【全屏模式】【应用文件夹】 拖动同一类型应用，创建2个相同名称的应用文件夹', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();

        // 初始化/更新 item-arrangement.ini.22bak 文件
        // 配置说明：顶层放置 4 个应用，按"两两同类型"分组
        //   dde-computer.desktop          = 计算机
        //   org.dde.calendar.desktop      = 日历
        //   deepin-app-store.desktop      = 应用商店
        //   deepin-album.desktop          = 相册
        // 用例步骤：拖动 计算机+日历 创建第1个文件夹；拖动 应用商店+相册 创建第2个文件夹
        // 注：两组应用的分类不一定相同，因此断言"两个同名文件夹"而不是固定为"系统管理"
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
toplevel\\pageCount=1
toplevel\\pageItems\\0=dde-computer.desktop, org.dde.calendar.desktop, deepin-app-store.desktop, deepin-album.desktop
MIDSCEOF`;
        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');
        console.log('item-arrangement.ini.22bak 已创建（顶层4个应用：计算机、日历、应用商店、相册）');
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

    test('1832647-【启动器】【全屏模式】【应用文件夹】 拖动同一类型应用，创建2个相同名称的应用文件夹', async ({ device, agent, uos, system }) => {
        const caseDir = process.env.TESTCASE_DIR;
        // 引入公共拖拽方法：先 aiLocate 识别源/目标坐标，再分步拖动释放
        const { aiDragHover } = await import(`${caseDir}midscene_dde/common/common.js`);

        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');

        // 步骤 2: 先识别"计算机"和"日历"图标坐标，再拖动"计算机"到"日历"上形成第 1 个应用文件夹
        console.log('步骤 2: 先识别坐标，再拖动"计算机"到"日历"，形成第 1 个应用文件夹');
        await aiDragHover(
            agent,
            '启动器全屏模式中的应用列表中"计算机"应用图标',
            '启动器全屏模式中的应用列表中"日历"应用图标',
            system,
            {
                waitForHover: 1500,
            },
        );
        console.log('第一次拖动完成: 计算机 → 日历');
        await agent.aiWaitFor('显示系统管理应用图标');
        await agent.aiTap('应用列表中的"系统管理"应用文件夹图标');
        await agent.aiWaitFor('应用文件夹已打开,界面显示2个应用');
        await device.pressKey('ESC');

        // 步骤 3: 先识别"应用商店"和"相册"图标坐标，再拖动"应用商店"到"相册"上形成第 2 个应用文件夹
        console.log('步骤 3: 先识别坐标，再拖动"应用商店"到"相册"，形成第 2 个应用文件夹');
        await aiDragHover(
            agent,
            '启动器全屏模式中的应用列表中"相册"应用图标',
            '启动器全屏模式中的应用列表中"应用商店"应用图标',
            system,
            {
                waitForHover: 2000,
            },
        );
        console.log('第二次拖动完成: 相册 → 应用商店');
        await agent.aiWaitFor('显示系统管理应用图标');

        // 步骤 4: 检查应用文件夹名称是否可重复
        // 预期: 启动器中存在两个同名应用文件夹（具体名称由 app 分类决定）
        await agent.aiAssert('启动器全屏模式下存在两个同名应用文件夹');

    }, { timeout: 600000, tags: ['1832647', 'level3', 'laptop'] });

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
