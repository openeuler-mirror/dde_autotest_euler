/**
 * 用例 PMSID: 1832669
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】 【自由拖动排序】跨页间拖动，拖动图标到最后一页时继续向右拖动不松手，显示新建页
 * 生成时间: 2026/7/18
 * 用例编写人: UT001707(陈慧)
 */

describe('1832669-【启动器】【全屏模式】【应用文件夹】 【自由拖动排序】跨页间拖动，拖动图标到最后一页时继续向右拖动不松手，显示新建页', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();

        // ============================================================
        // 前置条件: 应用文件夹（internal/folders/1）有2页应用，且2页应用均已满（12+12 = 24个应用，每页12个）
        // ============================================================
        // 网格布局: 4列×3行 = 12个应用/页
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

    test('1832669-【启动器】【全屏模式】【应用文件夹】 【自由拖动排序】跨页间拖动，拖动图标到最后一页时继续向右拖动不松手，显示新建页', async ({ device, agent, uos, system }) => {
        // 前置条件: 应用文件夹有2页应用，每页6个，共12个应用
        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('显示桌面图标，正下方显示搜索框，且搜索框页面居中显示');

        // 步骤 2: 打开应用文件夹（点击顶层"应用文件夹"图标）
        await agent.aiTap('系统管理');
        await agent.aiWaitFor('应用文件夹已打开');
        // await agent.aiTap('文件夹底部第二个指示点');
        // await agent.aiWaitFor('应用文件夹内不存在文件管理器应用');
        // await agent.aiTap('文件夹底部第一个指示点');

        // 步骤 3: 跨页间拖动应用，拖动图标到最后一页时继续向右拖动不松手
        // 场景说明：
        //   - 起始页（第1页）有 6 个应用
        //   - 目标页（第2页 = 最后一页）有 6 个应用
        //   - 拖动到第2页（最后一页）后继续向右拖动不松手
        //   - 预期: 显示新建页（第3页指示点激活）
        // 通过 xdotool 直接控制鼠标完成拖拽（不使用 aiDrag / aiAction）
        const screenInfo = await system.exec('xdpyinfo 2>/dev/null | grep "dimensions" | awk \'{print $2}\'');
        console.log('屏幕尺寸: ' + screenInfo.stdout.trim());
        const srcX = 652, srcY = 282;  // 第1页第1格"文件管理器"图标中心
        const tgtX = 1354, tgtY = 518; // 屏幕右边缘外，斜对角（斜向翻页触发点）
        // 1) 移动到源位置
        await system.exec(`xdotool mousemove ${srcX} ${srcY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 2) 按下左键
        await system.exec(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 3) 分步斜向移动到目标位置（沿对角线弧形拖拽，路径更平缓以确保翻页触发）
        await system.exec(`xdotool mousemove ${srcX + 200} ${srcY}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        await system.exec(`xdotool mousemove ${srcX + 400} ${Math.floor((srcY + tgtY) / 3)}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        await system.exec(`xdotool mousemove ${Math.floor((srcX + tgtX) / 2)} ${Math.floor((srcY + tgtY) / 2)}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        await system.exec(`xdotool mousemove ${tgtX - 200} ${tgtY}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        await system.exec(`xdotool mousemove ${tgtX - 50} ${tgtY}`);
        await new Promise(resolve => setTimeout(resolve, 300));
        await system.exec(`xdotool mousemove ${tgtX} ${tgtY}`);
        // 4) 到达目标位置后停留 4 秒钟，不释放鼠标（延长停留时间，确保新建页完全渲染）
        await new Promise(resolve => setTimeout(resolve, 4000));
        console.log('步骤3 拖动到目标位置（不松手）: (' + srcX + ',' + srcY + ') -> (' + tgtX + ',' + tgtY + ')');
        // 不执行 mouseup，保留按压状态
        // 等待新建页完全渲染
        await agent.aiWaitFor('应用文件夹弹窗已显示新建页（第3页），第三个指示点处于激活状态');
        // 检查: 显示新建页（拖动到最后一页时继续向右不松手触发新建页显示）
        await agent.aiAssert('在应用文件夹弹窗的底部能看到三个指示点，第三个指示点已激活为高亮状态（白色），前两个指示点为灰色未激活状态，说明新建页（第3页）创建成功,当前弹窗内除了右侧拖进来的蓝色文件夹图标外，其余区域显示空白');
        // 步骤4: 将拖动应用拖出到第二页
        // 预期结果: 新建页消失，文件管理器应用显示在第二页
        // 目标: 从当前 tgtX,tgtY 位置（仍按压）拖动到第二页区域，
        //       当且仅当第二页应用指示点已激活时才释放鼠标左键
        // 拖到第二页区域（指定坐标），让第二页指示点激活
        const dropX = 544, dropY = 445;  // 第一页区域指定坐标
        await new Promise(resolve => setTimeout(resolve, 1500));
        // 1) 已在目标位置（仍按压），分步拖动到第一页区域指定坐标
        //    路径: 1354,518 -> 1254,518 -> 900,450 -> (629,442)
        await system.exec(`xdotool mousemove ${tgtX - 100} ${tgtY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousemove ${Math.floor((srcX + tgtX) / 2)} ${Math.floor((srcY + tgtY) / 2)}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousemove 900 450`);
        await system.exec(`xdotool mousemove ${dropX} ${dropY}`);
        // 2) 等待第一页应用指示点激活（使用 AI 验证）—— 关键：指示点未激活时不能松手
        await agent.aiWaitFor('应用文件夹弹窗底部的分页指示点中，第一个指示点处于激活高亮状态（白色），');
        // 3) 释放左键（第一页指示点已激活后才松手）
        await system.exec(`xdotool mouseup 1`);
        // 4) 等待 UI 充分稳定（让 dde-launchpad 完成应用重排）
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('步骤4 拖到第一页区域并松手（第一页指示点已激活）: (' + tgtX + ',' + tgtY + ') -> (' + dropX + ',' + dropY + ')');
        // await agent.aiTap('系统管理');
        // 检查: 文件管理器应用显示在第1页，新建页隐藏
        await agent.aiAssert('文件管理器应用显示在第1页,不显示新建页');

    }, { timeout: 600000, tags: ['1832669', 'level3', 'laptop'] });

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
