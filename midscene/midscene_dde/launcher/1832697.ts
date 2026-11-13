/**
 * 用例 PMSID: 1832697
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】【翻页规则】鼠标滚轮操作，向下滑动
 * 生成时间: 2026/7/17
 * 用例编写人: UT001707(陈慧)
 */

describe('1832697-【启动器】【全屏模式】【应用文件夹】【翻页规则】鼠标滚轮操作，向下滑动', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();

        // ============================================================
        // 前置条件: 应用文件夹（internal/folders/1）有2页应用，每页6个，共12个应用
        // 参考 1832669 的前置条件结构
        // ============================================================
        // 网格布局: 4列×3行 = 12个应用/页（这里每页只用 6 个，留出空白位置）
        //   列 x: 470, 720, 970, 1220
        //   行 y: 240, 440, 640
        //
        // 配置文件结构说明（item-arrangement.ini）:
        //   [fullscreen]                    -- 全屏模式段
        //   1\name=系统管理                  -- 1 表示"应用文件夹1"（即 internal/folders/1）
        //   1\pageCount=2                   -- 应用文件夹1 共有 2 页
        //   1\pageItems\0=...               -- 应用文件夹1 第1页内容（6个应用）
        //   1\pageItems\1=...               -- 应用文件夹1 第2页内容（6个应用）
        //   toplevel\pageCount=1            -- 启动器顶层共 1 页
        //   toplevel\pageItems\0=...        -- 启动器顶层第1页内容（含 internal/folders/1）
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=系统管理
1\\pageCount=2
1\\pageItems\\0=dde-file-manager.desktop, deepin-album.desktop, deepin-draw.desktop, deepin-reader.desktop, deepin-editor.desktop, deepin-mail.desktop
1\\pageItems\\1=deepin-terminal.desktop, downloader.desktop, deepin-calculator.desktop, dde-calendar.desktop, deepin-camera.desktop, deepin-music.desktop
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop
MIDSCEOF`;
        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');

        // 验证前置条件：应用文件夹（internal/folders/1）有2页，每页6个应用
        const catResult = await system.exec(`cat ${bakIniPath}`);
        assertTrue(catResult.success, '读取 .22bak 文件失败');
        const iniContent = catResult.stdout.toString();

        // 1. 校验 pageCount=2
        const pageCountMatch = iniContent.match(/^1\\pageCount=(\d+)/m);
        assertTrue(pageCountMatch !== null, '前置条件校验失败: 未找到 1\\pageCount 配置');
        const folderPageCount = parseInt(pageCountMatch[1], 10);
        assertTrue(folderPageCount === 2, `前置条件校验失败: 应用文件夹页数应为 2，实际 ${folderPageCount}`);

        // 2. 校验第1页（pageItems\0）恰好 6 个应用
        const page0Match = iniContent.match(/^1\\pageItems\\0=([^\n]+)/m);
        assertTrue(page0Match !== null, '前置条件校验失败: 未找到 1\\pageItems\\0 配置');
        const page0Apps = page0Match[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
        assertTrue(page0Apps.length === 6, `前置条件校验失败: 应用文件夹第1页应有 6 个应用，实际 ${page0Apps.length} 个（${page0Apps.join(', ')}）`);

        // 3. 校验第2页（pageItems\1）恰好 6 个应用
        const page1Match = iniContent.match(/^1\\pageItems\\1=([^\n]+)/m);
        assertTrue(page1Match !== null, '前置条件校验失败: 未找到 1\\pageItems\\1 配置');
        const page1Apps = page1Match[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
        assertTrue(page1Apps.length === 6, `前置条件校验失败: 应用文件夹第2页应有 6 个应用，实际 ${page1Apps.length} 个（${page1Apps.join(', ')}）`);

        // 4. 校验顶层已引用应用文件夹 internal/folders/1
        const toplevelPage0 = iniContent.match(/^toplevel\\pageItems\\0=([^\n]+)/m);
        const toplevelPage1 = iniContent.match(/^toplevel\\pageItems\\1=([^\n]+)/m);
        const allToplevel = (toplevelPage0 ? toplevelPage0[1] : '') + ',' + (toplevelPage1 ? toplevelPage1[1] : '');
        assertTrue(allToplevel.includes('internal/folders/1'), '前置条件校验失败: 顶层应引用应用文件夹 internal/folders/1');

        console.log(`item-arrangement.ini.22bak 已创建:`);
        console.log(`  - 应用文件夹1: 共 ${folderPageCount} 页`);
        console.log(`  - 第1页: ${page0Apps.length} 个应用`);
        console.log(`  - 第2页: ${page1Apps.length} 个应用`);
        console.log(`  - 合计: ${page0Apps.length + page1Apps.length} 个应用`);
        console.log('【前置条件】应用文件夹（internal/folders/1）有2页应用，每页6个应用');
    });

    beforeEach(async ({ device, agent, uos, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');

        const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';

        // 预置步骤1：使用 .22bak 文件覆盖 item-arrangement.ini
        const replaceCmd = `cp -f ${bakIniPath} ${iniPath}`;
        const replaceResult = await system.exec(replaceCmd);
        assertTrue(replaceResult.success, '替换 item-arrangement.ini 配置文件失败');
        console.log('item-arrangement.ini 已使用 .22bak 文件覆盖');

        // 重启 dde-shell 服务，使新配置生效
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

        console.log('配置文件内容：', content);
        console.log('isFullscreen：', isFullscreen);
        console.log('isWindowed：', isWindowed);

        if (isWindowed) {
            console.log('检测到窗口模式，切换到全屏模式...');
            await uos.openLauncher();
            await agent.aiTap({
                prompt: '识别指定图标坐标：在启动器窗口模式左下角的全屏模式图标',
                images: [{
                    name: '全屏模式小图标',
                    url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203-1.png',
                }],
                convertHttpImage2Base64: true,
                deepThink: true,
            });
        }
        if (isFullscreen) {
            console.log('检测到全屏模式，无需操作');
        }
        await device.pressKey('ESC');
    });

    test('1832697-【启动器】【全屏模式】【应用文件夹】【翻页规则】鼠标滚轮操作，向下滑动', async ({ device, agent, uos, system }) => {
        // 步骤 1: 打开启动器并切换到全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');

        // 步骤 2: 打开应用文件夹
        await agent.aiTap('系统管理');
        await agent.aiWaitFor('应用文件夹已打开，界面显示文件夹内第1页应用');

        // 步骤 3: 在应用文件夹内使用 xdotool 模拟鼠标滚轮向下滑动
        // 1) 先把鼠标移动到应用文件夹中心区域（弹窗内）
        //    应用文件夹弹窗内网格（4列×3行）中心约 (845, 440)
        await system.exec(`xdotool mousemove 845 440`);
        await new Promise(resolve => setTimeout(resolve, 300));
        // 2) 模拟鼠标滚轮向下滚动（button 5 = 向下滚轮 / wheel down）
        //    重复 10 次确保触发翻页
        await system.exec(`xdotool click --repeat 10 5`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('步骤3 完成：已使用 xdotool 模拟鼠标滚轮向下滑动');

        // 检查 1: 翻页到第2页指示点状态
        await agent.aiAssert('第二页应用文件夹在应用文件夹弹窗的底部，能看到两页指示点，第一个点为灰色（未激活），第二个点为白色（激活），说明向下滚动翻页成功');

    }, { timeout: 600000, tags: ['1832697', 'level3','laptop'] });

    afterEach(async ({ device, agent }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system, env }) => {
        console.log('5. afterAll: 清理测试套件');
        // 切换回窗口模式
        await agent.aiTap({
            prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
            images: [{
                name: '窗口模式小图标',
                url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
            }],
            convertHttpImage2Base64: true,
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
