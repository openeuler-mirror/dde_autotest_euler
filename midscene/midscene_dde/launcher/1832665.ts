/**
 * 用例 PMSID: 1832665
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】 【自由拖动排序】跨页间拖动，目标页无空位，目标页最后一个应用自动补到下一页首位
 * 生成时间: 2026/8/18
 * 用例编写人: UT001707(陈慧)
 */

describe('1832665-【启动器】【全屏模式】【应用文件夹】 【自由拖动排序】跨页间拖动，目标页无空位，目标页最后一个应用自动补到下一页首位', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();

        // ============================================================
        // 前置条件: 应用文件夹（internal/folders/1）有3页应用
        //   - 第1页: 11 个应用（与 1832667 一致，存在一个空位，最后一格 4列3行 位置空着）
        //   - 第2页: 12 个应用（与 1832667 一致，已满）
        //   - 第3页: 1 个应用
        // ============================================================
        // 配置文件结构说明（item-arrangement.ini）:
        //   [fullscreen]                    -- 全屏模式段
        //   1\name=系统管理                  -- 1 表示"应用文件夹1"（即 internal/folders/1）
        //   1\pageCount=3                   -- 应用文件夹1 共有 3 页
        //   1\pageItems\0=...               -- 应用文件夹1 第1页内容（11个应用，存在一个空位，与 1832667 一致）
        //   1\pageItems\1=...               -- 应用文件夹1 第2页内容（12个应用，已满，与 1832667 一致）
        //   1\pageItems\2=...               -- 应用文件夹1 第3页内容（1个应用）
        //   toplevel\pageCount=1            -- 启动器顶层共 1 页
        //   toplevel\pageItems\0=...        -- 启动器顶层第1页内容（含 internal/folders/1）
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=系统管理
1\\pageCount=3
1\\pageItems\\0=dde-file-manager.desktop, deepin-draw.desktop, deepin-reader.desktop, deepin-editor.desktop, deepin-mail.desktop, deepin-terminal.desktop, downloader.desktop, deepin-manual.desktop, dde-trash.desktop, deepin-system-monitor.desktop, deepin-data-transfer.desktop
1\\pageItems\\1=deepin-album.desktop, deepin-voice-note.desktop, deepin-screen-recorder.desktop, deepin-movie.desktop, dde-computer.desktop, deepin-font-manager.desktop, deepin-calculator.desktop, dde-calendar.desktop, deepin-camera.desktop, deepin-app-store.desktop, deepin-compressor.desktop, deepin-music.desktop
1\\pageItems\\2=deepin-log-viewer.desktop
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop
MIDSCEOF`;
        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');

        // 验证前置条件
        const catResult = await system.exec(`cat ${bakIniPath}`);
        assertTrue(catResult.success, '读取 .22bak 文件失败');
        const iniContent = catResult.stdout.toString();

        // 1. 校验 pageCount=3
        const pageCountMatch = iniContent.match(/^1\\pageCount=(\d+)/m);
        assertTrue(pageCountMatch !== null, '前置条件校验失败: 未找到 1\\pageCount 配置');
        const folderPageCount = parseInt(pageCountMatch[1], 10);
        assertTrue(folderPageCount === 3, `前置条件校验失败: 应用文件夹页数应为 3，实际 ${folderPageCount}`);

        // 2. 校验第1页（pageItems\0）恰好 11 个应用（存在一个空位，与 1832667 一致）
        const page0Match = iniContent.match(/^1\\pageItems\\0=([^\n]+)/m);
        assertTrue(page0Match !== null, '前置条件校验失败: 未找到 1\\pageItems\\0 配置');
        const page0Apps = page0Match[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
        assertTrue(page0Apps.length === 11, `前置条件校验失败: 应用文件夹第1页应 11 个应用（存在一个空位），实际 ${page0Apps.length} 个（${page0Apps.join(', ')}）`);

        // 3. 校验第2页（pageItems\1）恰好 12 个应用（已满，与 1832667 一致）
        const page1Match = iniContent.match(/^1\\pageItems\\1=([^\n]+)/m);
        assertTrue(page1Match !== null, '前置条件校验失败: 未找到 1\\pageItems\\1 配置');
        const page1Apps = page1Match[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
        assertTrue(page1Apps.length === 12, `前置条件校验失败: 应用文件夹第2页应满 12 个应用，实际 ${page1Apps.length} 个（${page1Apps.join(', ')}）`);

        // 4. 校验第3页（pageItems\2）恰好 1 个应用
        const page2Match = iniContent.match(/^1\\pageItems\\2=([^\n]+)/m);
        assertTrue(page2Match !== null, '前置条件校验失败: 未找到 1\\pageItems\\2 配置');
        const page2Apps = page2Match[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
        assertTrue(page2Apps.length === 1, `前置条件校验失败: 应用文件夹第3页应 1 个应用，实际 ${page2Apps.length} 个（${page2Apps.join(', ')}）`);

        // 5. 校验顶层已引用应用文件夹 internal/folders/1
        const toplevelPage0 = iniContent.match(/^toplevel\\pageItems\\0=([^\n]+)/m);
        const toplevelPage1 = iniContent.match(/^toplevel\\pageItems\\1=([^\n]+)/m);
        const allToplevel = (toplevelPage0 ? toplevelPage0[1] : '') + ',' + (toplevelPage1 ? toplevelPage1[1] : '');
        assertTrue(allToplevel.includes('internal/folders/1'), '前置条件校验失败: 顶层应引用应用文件夹 internal/folders/1');

        console.log(`item-arrangement.ini.22bak 已创建:`);
        console.log(`  - 应用文件夹1: 共 ${folderPageCount} 页`);
        console.log(`  - 第1页: ${page0Apps.length} 个应用（存在一个空位，与 1832667 一致）`);
        console.log(`  - 第2页: ${page1Apps.length} 个应用（已满，与 1832667 一致）`);
        console.log(`  - 第3页: ${page2Apps.length} 个应用`);
        console.log('【前置条件】应用文件夹（internal/folders/1）有3页应用（前2页与1832667一致，第3页有1个应用）');
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

    test('1832665-【启动器】【全屏模式】【应用文件夹】 【自由拖动排序】跨页间拖动，目标页无空位，目标页最后一个应用自动补到下一页首位', async ({ device, agent, uos, system }) => {
        const pcService = device.getPCService();

        // ============================================================
        // 关键坐标（基于 1832697 网格 + 实测反推）
        // ============================================================
        // 应用文件夹弹窗 X 范围: ≈ 470 ~ 1450（宽 980）
        //   - 1499 触发弹窗关闭 → 弹窗右边缘 ≈ 1499 - 49 = 1450
        // 应用网格列中心 X: 470, 720, 970, 1220（1832697 实测值）
        // 应用网格行中心 Y: 估算 ≈ 290, 530, 770（3 行，间距 240）
        //   - 第1行约在弹窗内偏上 290，第2行居中 530，第3行偏下 770
        // 源图标: 第1页第1行第1列"文件管理器"  → (470, 290)
        // 目标图标: 第2页第1行第2列               → (720, 290)
        // 翻页触发点: 弹窗右边缘 (1450, 500)      → drag.x = 980 > 阈值
        // 触发停留: Timer interval=1000ms, 1500ms 足够（1s + 0.5s 缓冲）
        // ============================================================

        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');
        console.log('✅ 启动器全屏模式已打开');

        // 步骤 2: 打开应用文件夹
        await agent.aiTap('系统管理');
        await agent.aiWaitFor('应用文件夹已打开，底部有3个指示点，第1个指示点为白色激活状态');
        console.log('✅ 应用文件夹已打开（3页，停在第1页）');

        // 步骤 3: 记录屏幕尺寸（用于日志）
        const screenInfo = await system.exec('xdpyinfo 2>/dev/null | grep "dimensions" | awk \'{print $2}\'');
        console.log('屏幕尺寸: ' + screenInfo.stdout.trim());

        // 步骤 4: 在源图标位置 mousedown（用固定坐标，绕开 aiHover 不稳定）
        // 源: 第1页第1行第1列"文件管理器" → (470, 290)
        const srcX = 652, srcY = 715;
        await system.exec(`xdotool mousemove ${srcX} ${srcY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 200));

        // 校准真实 mousedown 位置（防御性，确保 mousedown 成功）
        const realDownPos = await system.exec('xdotool getmouselocation --shell');
        const realDownX = parseInt(realDownPos.stdout.match(/X=(\d+)/)?.[1] || srcX);
        const realDownY = parseInt(realDownPos.stdout.match(/Y=(\d+)/)?.[1] || srcY);
        console.log('mousedown 位置: (' + realDownX + ',' + realDownY + ') [预期 (' + srcX + ',' + srcY + ')]');

        // 步骤 5: 分步向右拖到弹窗右边缘触发翻页（放慢速度：每步 200ms，让 dde-launcher 更稳定识别）
        // QML 源码: drag.x > (width - cellWidth)  → pageIntent = 1（向后翻页）
        // 弹窗宽 ≈ 980, cellWidth ≈ 250, 触发阈值 ≈ 730
        // 目标 flipX = 1318, drag.x = 1318 - 657 = 661（需实测，< 730 可能不够）
        // 步进路径完全在弹窗内（避免"拖到外面"），每步 200ms 让 dde-launcher 稳定识别 drag 事件
        const flipX = 1318, flipY = 767;
        const midX = Math.floor((realDownX + flipX) / 2);
        const midY = Math.floor((realDownY + flipY) / 2);
        await system.exec(`xdotool mousemove ${realDownX + 150} ${realDownY}`);  // 步进1
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousemove ${midX} ${midY}`);                  // 步进2
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousemove ${flipX - 50} ${flipY}`);          // 步进3
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousemove ${flipX} ${flipY}`);               // 步进4（翻页触发点）
        await new Promise(resolve => setTimeout(resolve, 1000));                // 停留 0.5s 触发翻页
        console.log('已拖到翻页触发点(' + flipX + ',' + flipY + ')停留0.5s: drag.x = ' + (flipX - realDownX) + ' 像素');

        // 步骤 6: 拖到目标点后等待0.5秒,又将鼠标拖动到应用文件夹内第3排第3个位置(970, 770)后才释放鼠标
        await new Promise(resolve => setTimeout(resolve, 500));                // 等待 0.5s
        await system.exec('xdotool mousemove 1069 700');                        // 移动到第3排第3个位置
        await new Promise(resolve => setTimeout(resolve, 1000));
        await system.exec('xdotool mouseup 1');                                // 释放鼠标左键
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('✅ 鼠标已在第3排第3个位置(1069 700)释放');

        // 步骤 10: 验证自动创建新页（3个指示点，第3个灰色）
        //   - 目标页（第2页）已满且为最后一页
        //   - 拖入新应用时，dde-launcher 自动创建新页（第3页）
        //   - 第2页最后一个应用（"音乐"）自动顺移到第3页首位
        await agent.aiTap('应用文件夹弹窗底部第3个指示点');
        await agent.aiAssert('应用文件夹弹窗底部第3个指示点为白色激活状态,第3页首位是"音乐"');
        // console.log('✅ 第3页首位是"音乐"，用例验证通过');

    }, { timeout: 600000, tags: ['1832665', 'level3', 'laptop'] });

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
        await system.exec('systemctl --user restart dde-shell@DDE', 3000);
        await system.exec('sleep 10');
        console.log('dde-shell 服务已重启');

        // 最后执行 daemon-reload
        await system.exec('systemctl --user daemon-reload');
        console.log('systemctl --user daemon-reload 已执行');
    });
});
