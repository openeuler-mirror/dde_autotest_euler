/**
 * 用例 PMSID: 1832661
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】 【自由拖动排序】跨页间拖动，起始页无空位目标页有空位，目标页图标自行补位移动
 * 生成时间: 2026/9/10
 * 用例编写人: UT001707(陈慧)
 */

describe('1832661-【启动器】【全屏模式】【应用文件夹】 【自由拖动排序】跨页间拖动，起始页无空位目标页有空位，目标页图标自行补位移动', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();

        // ============================================================
        // 前置条件: 应用文件夹（internal/folders/1）有2页应用
        //   - 第1页: 12 个应用（已满，无空位）—— 起始页
        //   - 第2页: 3 个应用（有空位）—— 目标页
        // ============================================================
        // 配置文件结构说明（item-arrangement.ini）:
        //   [fullscreen]                    -- 全屏模式段
        //   1\name=系统管理                  -- 1 表示"应用文件夹1"（即 internal/folders/1）
        //   1\pageCount=2                   -- 应用文件夹1 共有 2 页
        //   1\pageItems\0=...               -- 应用文件夹1 第1页内容（12个应用，已满，无空位）
        //   1\pageItems\1=...               -- 应用文件夹1 第2页内容（3个应用，有空位）
        //   toplevel\pageCount=1            -- 启动器顶层共 1 页
        //   toplevel\pageItems\0=...        -- 启动器顶层第1页内容（含 internal/folders/1）
        // 写 ini：与 1832667 / 1832663 / 1832665 等用例保持一致，
        // 使用 cat > ... <<'MIDSCEOF' heredoc 写入，单引号定界符禁止变量展开
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=系统管理
1\\pageCount=2
1\\pageItems\\0=dde-file-manager.desktop, deepin-album.desktop, deepin-draw.desktop, deepin-reader.desktop, deepin-editor.desktop, deepin-mail.desktop, deepin-terminal.desktop, downloader.desktop, deepin-manual.desktop, dde-trash.desktop, deepin-system-monitor.desktop, deepin-calculator.desktop
1\\pageItems\\1=deepin-music.desktop, deepin-voice-note.desktop, deepin-screen-recorder.desktop
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1, org.deepin.browser.desktop
MIDSCEOF`;
        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');

        // 验证前置条件
        const catResult = await system.exec(`cat ${bakIniPath}`);
        assertTrue(catResult.success, '读取 .22bak 文件失败');
        const iniContentRead = catResult.stdout.toString();

        // 1. 校验 pageCount=2
        const pageCountMatch = iniContentRead.match(/^1\\pageCount=(\d+)/m);
        assertTrue(pageCountMatch !== null, '前置条件校验失败: 未找到 1\\pageCount 配置');
        const folderPageCount = parseInt(pageCountMatch[1], 10);
        assertTrue(folderPageCount === 2, `前置条件校验失败: 应用文件夹页数应为 2，实际 ${folderPageCount}`);

        // 2. 校验第1页（pageItems\0）恰好 12 个应用（已满，无空位）
        const page0Match = iniContentRead.match(/^1\\pageItems\\0=([^\n]+)/m);
        assertTrue(page0Match !== null, '前置条件校验失败: 未找到 1\\pageItems\\0 配置');
        const page0Apps = page0Match[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
        assertTrue(page0Apps.length === 12, `前置条件校验失败: 应用文件夹第1页应满 12 个应用（无空位），实际 ${page0Apps.length} 个（${page0Apps.join(', ')}）`);

        // 3. 校验第2页（目标页）有应用且未满（有空位）
        const page1Match = iniContentRead.match(/^1\\pageItems\\1=([^\n]+)/m);
        assertTrue(page1Match !== null, '前置条件校验失败: 未找到 1\\pageItems\\1 配置');
        const page1Apps = page1Match[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
        assertTrue(page1Apps.length > 0 && page1Apps.length < 12, `前置条件校验失败: 应用文件夹第2页应有应用且有空位，实际 ${page1Apps.length} 个`);

        // 4. 校验顶层已引用应用文件夹 internal/folders/1
        const toplevelPage0 = iniContentRead.match(/^toplevel\\pageItems\\0=([^\n]+)/m);
        const toplevelPage1 = iniContentRead.match(/^toplevel\\pageItems\\1=([^\n]+)/m);
        const allToplevel = (toplevelPage0 ? toplevelPage0[1] : '') + ',' + (toplevelPage1 ? toplevelPage1[1] : '');
        assertTrue(allToplevel.includes('internal/folders/1'), '前置条件校验失败: 顶层应引用应用文件夹 internal/folders/1');

        console.log(`item-arrangement.ini.22bak 已创建:`);
        console.log(`  - 应用文件夹1: 共 ${folderPageCount} 页`);
        console.log(`  - 第1页: ${page0Apps.length} 个应用（已满，无空位）`);
        console.log(`  - 第2页: ${page1Apps.length} 个应用（有空位）`);
        console.log('【前置条件】应用文件夹（internal/folders/1）有2页应用（第1页满12个无空位，第2页有空位）');
    });

    beforeEach(async ({ device, agent, uos, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');

        const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';

        // 预置步骤1：使用 .22bak 文件覆盖 item-arrangement.ini
        const replaceCmd = `mkdir -p ~/.config/deepin/dde-launchpad && cp -f ${bakIniPath} ${iniPath}`;
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

    test('1832661-【启动器】【全屏模式】【应用文件夹】 【自由拖动排序】跨页间拖动，起始页无空位目标页有空位，目标页图标自行补位移动', async ({ device, agent, uos, system }) => {
        const pcService = device.getPCService();

        // ============================================================
        // 关键坐标（基于 1832663/1832665 系列实测值，分辨率相关，换屏需重新校准）
        // ============================================================
        // 应用文件夹弹窗 X 范围: ≈ 470 ~ 1450（宽 980）
        //   - 1499 触发弹窗关闭 → 弹窗右边缘 ≈ 1499 - 49 = 1450
        // 应用网格列中心 X: 470, 720, 970, 1220（4 列）
        // 应用网格行中心 Y: 估算 ≈ 290, 530, 770（3 行，间距 240）
        // 源图标（当前页最后一个 = 第3行第4列"计算器"）→ (1220, 770)
        // 翻页触发点: 弹窗右边缘附近 → 需拖过最后一列右边界（1220 + 125 ≈ 1345）
        //   取 flipX ≈ 1370（> 1345 且 < 1450 弹窗右边缘，避免触发弹窗关闭）
        // 触发停留: dde-launcher Timer interval=1000ms，停留 ≥ 1500ms 足够
        // 落点: 目标页第1排第2列 (720, 290) → 目标页第1列空白，其余应用后移让位
        // ============================================================

        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');
        console.log('✅ 启动器全屏模式已打开');

        // 步骤 2: 打开应用文件夹
        await agent.aiTap('系统管理');
        await agent.aiWaitFor('应用文件夹已打开，底部有2个指示点，第1个指示点为白色激活状态');
        // 校验起始页已满：第1页最后一格（第3行第4列）有应用
        await agent.aiAssert('应用文件夹已打开,底部有2个指示点,第1个指示点为白色激活状态,第1页右下角最后一格显示有应用图标');
        console.log('✅ 应用文件夹已打开(2页,停在第1页,第1页已满)');

        // 步骤 3: 记录屏幕尺寸（用于日志）
        const screenInfo = await system.exec('xdpyinfo 2>/dev/null | grep "dimensions" | awk \'{print $2}\'');
        console.log('屏幕尺寸: ' + screenInfo.stdout.trim());

        // 步骤 4: 在该页最后一个图标位置 mousedown（固定坐标，绕开 aiHover 不稳定）
        // 源: 第1页最后一位"计算器"（第3行第4列）→ (1220, 770)
        const srcX = 1220, srcY = 770;
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
        // 起始页无空位（已满），最后一位就在右下角，拖向右缘即可触发向后翻页
        const flipX = 1370, flipY = 770;
        const midX = Math.floor((realDownX + flipX) / 2);
        const midY = Math.floor((realDownY + flipY) / 2);
        await system.exec(`xdotool mousemove ${realDownX + 60} ${realDownY}`);  // 步进1
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousemove ${midX} ${midY}`);                  // 步进2
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousemove ${flipX - 40} ${flipY}`);          // 步进3
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousemove ${flipX} ${flipY}`);               // 步进4（翻页触发点）
        await new Promise(resolve => setTimeout(resolve, 1500));                // 停留 1.5s 触发翻页
        console.log('已拖到翻页触发点(' + flipX + ',' + flipY + ')停留1.5s: drag.x = ' + (flipX - realDownX) + ' 像素');

        // 步骤 6: 翻页到目标页后,将鼠标拖到目标页第1排第2个位置(720, 290)后释放
        // 目标页应用自行移动让位：释放位置越靠前，后续应用越向后顺移
        await new Promise(resolve => setTimeout(resolve, 500));                // 等待 0.5s 翻页动画完成
        await system.exec(`xdotool mousemove 990 580`);                        // 分步回移，避免一次性跳变
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec('xdotool mousemove 720 290');                         // 移动到第1排第2个位置
        await new Promise(resolve => setTimeout(resolve, 1000));
        await system.exec('xdotool mouseup 1');                                // 释放鼠标左键
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('✅ 鼠标已在目标页第1排第2个位置(720, 290)释放');

        // 验证 1: 拖动成功，目标页（第2页）图标自行移动让位，被拖应用已进入目标页
        await agent.aiAssert('应用文件夹弹窗底部第2个指示点为白色激活状态,页面第1排左第2个显示"计算器",第1排依次为:音乐、计算器、语音记事本、截图');
        console.log('✅ 目标页应用已自行移动让位,计算器已进入第2页');

        // 验证 2: 起始页（第1页）其他应用无需补位（被拖出的是最后一位,前面 11 个顺序与位置不变）
        await agent.aiTap('应用文件夹弹窗底部的第1个指示点');
        await new Promise(resolve => setTimeout(resolve, 1500));
        await agent.aiAssert('第1页显示,底部第1个指示点为白色激活状态,第1页中不存在计算器应用,第一排从左到右依次为:文件管理器、相册、绘图、阅读器,最后一位（第3行第4列）为空');
        console.log('✅ 第1页其他应用无需补位,仅最后一位为空位');

    }, { timeout: 600000, tags: ['1832661', 'level3', 'laptop'] });

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
        await system.exec('systemctl --user restart dde-shell@DDE', 30000);
        await system.exec('sleep 10');
        console.log('dde-shell 服务已重启');

        // 最后执行 daemon-reload
        await system.exec('systemctl --user daemon-reload');
        console.log('systemctl --user daemon-reload 已执行');
    });
});