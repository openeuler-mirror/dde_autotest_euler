/**
 * 用例 PMSID: 1832623
 * 用例标题: 【启动器】【全屏模式】【自由拖动排序】跨页间拖动，起始页和目标页均有空位，跨页间插入图标
 * 生成时间: 2026/8/19
 * 用例编写人: UT001707(陈慧)
 * 参考用例: 1832625（同结构）、1832663（应用文件夹类似场景）
 */

describe('1832623-【启动器】【全屏模式】【自由拖动排序】跨页间拖动，起始页和目标页均有空位，跨页间插入图标', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();

        // ============================================================
        // 前置条件: 启动器顶层（toplevel）有2页应用，2页应用均无空位（已满）
        //   与 1832625 用例前置条件完全一致
        //   依据: /home/uos/midscene-uos-latest-x86_64/midscene_dde/item-arrangement.ini
        //   - 第1页: 5 个应用（来自配置文件 pageItems\0）+ 27 个占位应用 = 32 个（已满）
        //   - 第2页: 31 个应用（来自配置文件 pageItems\1）+ 1 个占位应用 = 32 个（已满）
        //   - 拖入新应用到第2页时，dde-launcher 自动创建第3页，第2页最后一个占位应用自动顺移到第3页首位
        // ============================================================
        // 配置文件结构说明（item-arrangement.ini）:
        //   [fullscreen]                       -- 全屏模式段
        //   toplevel\pageCount=2               -- 启动器顶层共 2 页
        //   toplevel\pageItems\0=...           -- 启动器顶层第1页内容（5+27=32个应用，已满）
        //   toplevel\pageItems\1=...           -- 启动器顶层第2页内容（31+1=32个应用，已满）
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
toplevel\\pageCount=2
toplevel\\pageItems\\0=org.deepin.browser.desktop, dde-file-manager.desktop, deepin-app-store.desktop, deepin-music.desktop, com.qianxin.qaxsafe.desktop, org.deepin.browser.desktop.bak1, org.deepin.browser.desktop.bak2, org.deepin.browser.desktop.bak3, org.deepin.browser.desktop.bak4, org.deepin.browser.desktop.bak5, org.deepin.browser.desktop.bak6, org.deepin.browser.desktop.bak7, org.deepin.browser.desktop.bak8, org.deepin.browser.desktop.bak9, org.deepin.browser.desktop.bak10, org.deepin.browser.desktop.bak11, org.deepin.browser.desktop.bak12, org.deepin.browser.desktop.bak13, org.deepin.browser.desktop.bak14, org.deepin.browser.desktop.bak15, org.deepin.browser.desktop.bak16, org.deepin.browser.desktop.bak17, org.deepin.browser.desktop.bak18, org.deepin.browser.desktop.bak19, org.deepin.browser.desktop.bak20, org.deepin.browser.desktop.bak21, org.deepin.browser.desktop.bak22, org.deepin.browser.desktop.bak23, org.deepin.browser.desktop.bak24, org.deepin.browser.desktop.bak25, org.deepin.browser.desktop.bak26, org.deepin.browser.desktop.bak27
toplevel\\pageItems\\1=deepin-screen-recorder.desktop, deepin-image-viewer.desktop, deepin-album.desktop, deepin-draw.desktop, deepin-reader.desktop, deepin-editor.desktop, deepin-mail.desktop, deepin-terminal.desktop, deepin-voice-note.desktop, downloader.desktop, deepin-manual.desktop, dde-computer.desktop, dde-trash.desktop, org.deepin.dde.control-center.desktop, deepin-system-monitor.desktop, dde-printer.desktop, deepin-calculator.desktop, deepin-font-manager.desktop, deepin-deb-installer.desktop, dde-introduction.desktop, deepin-camera.desktop, dde-cooperation.desktop, com.sogou.ime.ng.fcitx5.uos.configurer.desktop, com.uos.drive.desktop, dde-calendar.desktop, deepin-defender.desktop, org.remmina.Remmina.desktop, uos-ai-assistant.desktop, uos-recovery-gui.desktop, uos-remote-assistance.desktop, uos-service-support.desktop, deepin-movie.desktop
MIDSCEOF`;
        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');

        // 验证前置条件
        const catResult = await system.exec(`cat ${bakIniPath}`);
        assertTrue(catResult.success, '读取 .22bak 文件失败');
        const iniContent = catResult.stdout.toString();

        // 1. 校验 pageCount=2
        const pageCountMatch = iniContent.match(/^toplevel\\pageCount=(\d+)/m);
        assertTrue(pageCountMatch !== null, '前置条件校验失败: 未找到 toplevel\\pageCount 配置');
        const folderPageCount = parseInt(pageCountMatch[1], 10);
        assertTrue(folderPageCount === 2, `前置条件校验失败: 启动器顶层页数应为 2，实际 ${folderPageCount}`);

        // 2. 校验第1页（pageItems\0）恰好 32 个应用（已满，无空位）
        const page0Match = iniContent.match(/^toplevel\\pageItems\\0=([^\n]+)/m);
        assertTrue(page0Match !== null, '前置条件校验失败: 未找到 toplevel\\pageItems\\0 配置');
        const page0Apps = page0Match[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
        assertTrue(page0Apps.length === 32, `前置条件校验失败: 启动器第1页应满 32 个应用，实际 ${page0Apps.length} 个`);

        // 3. 校验第2页（pageItems\1）恰好 32 个应用（已满，无空位）
        const page1Match = iniContent.match(/^toplevel\\pageItems\\1=([^\n]+)/m);
        assertTrue(page1Match !== null, '前置条件校验失败: 未找到 toplevel\\pageItems\\1 配置');
        const page1Apps = page1Match[1].split(',').map(s => s.trim()).filter(s => s.length > 0);
        assertTrue(page1Apps.length === 32, `前置条件校验失败: 启动器第2页应满 32 个应用，实际 ${page1Apps.length} 个`);

        // 4. 记录第2页最后一个应用（用于验证：拖入后该应用应自动顺移到第3页首位）
        const lastAppOnPage2 = page1Apps[page1Apps.length - 1];
        console.log(`第2页最后一个应用: ${lastAppOnPage2}`);

        console.log(`item-arrangement.ini.22bak 已创建:`);
        console.log(`  - 启动器顶层: 共 ${folderPageCount} 页`);
        console.log(`  - 第1页: ${page0Apps.length} 个应用（已满，无空位）`);
        console.log(`  - 第2页: ${page1Apps.length} 个应用（已满，无空位）`);
        console.log('【前置条件】启动器顶层有2页应用，2页应用均无空位（已满，与1832625一致）');
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

    test('1832623-【启动器】【全屏模式】【自由拖动排序】跨页间拖动，起始页和目标页均有空位，跨页间插入图标', async ({ device, agent, uos, system }) => {
        const pcService = device.getPCService();

        // ============================================================
        // 关键坐标（与 1832625 一致：源在第1页，目标在第2页）
        // ============================================================
        // 源位置: 第1页第1行第1列 (baseSrcX=646, baseSrcY=180) 1920x1080
        // 边缘位置: 屏幕右边缘外侧 (baseEdgeX=1940, baseEdgeY=385)
        // 目标位置: 第2页第2行第2、3个图标之间 (baseTgtX=1592, baseTgtY=385)
        // ============================================================

        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiAssert('启动器全屏模式已打开,应用商店显示在第1页第1行第3个位置');
        console.log('✅ 启动器全屏模式已打开');

        // 步骤 2: 翻到第2页，确认影院显示在最后一个
        await agent.aiTap({
            prompt: '识别启动器全屏模式顶部第二个圆点',
            images: [],
            deepThink: true,
        });
        await agent.aiAssert('启动器全屏模式顶部第二个原点被激活,影院位置显示在第4行最后1个');
        await agent.aiTap('启动器顶部的第1个圆点');

        // 步骤 3: 记录屏幕尺寸（用于日志与分辨率自适应）
        const screenInfo = await system.exec('xdpyinfo 2>/dev/null | grep "dimensions" | awk \'{print $2}\'');
        console.log('屏幕尺寸: ' + screenInfo.stdout.trim());

        // 分辨率自适应处理
        const screenSize = screenInfo.stdout.trim().split('x');
        const actualWidth = parseInt(screenSize[0]);
        const actualHeight = parseInt(screenSize[1]);
        const baseWidth = 1920;
        const baseHeight = 1080;
        const scaleX = actualWidth / baseWidth;
        const scaleY = actualHeight / baseHeight;
        console.log(`分辨率自适应: ${actualWidth}x${actualHeight}, 缩放比例: x=${scaleX.toFixed(2)}, y=${scaleY.toFixed(2)}`);

        // 基准坐标（基于1920x1080）
        // 源位置: 第1页第1行第1列
        // 边缘位置: 屏幕右边缘外侧
        // 目标位置: 第2页第2行第2、3个图标之间
        const baseSrcX = 646, baseSrcY = 180;
        const baseEdgeX = 1940, baseEdgeY = 385;
        const baseTgtX = 1592, baseTgtY = 385;

        // 实际坐标（根据分辨率缩放）
        const srcX = Math.floor(baseSrcX * scaleX), srcY = Math.floor(baseSrcY * scaleY);
        const edgeX = Math.floor(baseEdgeX * scaleX), edgeY = Math.floor(baseEdgeY * scaleY);
        const tgtX = Math.floor(baseTgtX * scaleX), tgtY = Math.floor(baseTgtY * scaleY);
        console.log(`实际坐标: 源位置(${srcX},${srcY}), 边缘(${edgeX},${edgeY}), 目标(${tgtX},${tgtY})`);

        // 步骤 4: 在源位置按下鼠标左键
        await system.exec(`xdotool mousemove ${srcX} ${srcY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 200));

        // 校准真实 mousedown 位置
        const realDownPos = await system.exec('xdotool getmouselocation --shell');
        const realDownX = parseInt(realDownPos.stdout.match(/X=(\d+)/)?.[1] || srcX);
        const realDownY = parseInt(realDownPos.stdout.match(/Y=(\d+)/)?.[1] || srcY);
        console.log('mousedown 位置: (' + realDownX + ',' + realDownY + ') [预期 (' + srcX + ',' + srcY + ')]');

        // 步骤 5: 分步向右拖到屏幕右边缘触发翻页
        const midX = Math.floor((realDownX + edgeX) / 2);
        const midY = Math.floor((realDownY + edgeY) / 2);
        await system.exec(`xdotool mousemove ${realDownX + 150} ${realDownY}`);   // 步进1
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousemove ${midX} ${midY}`);                  // 步进2
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousemove ${edgeX - 50} ${edgeY}`);          // 步进3
        await new Promise(resolve => setTimeout(resolve, 200));
        await system.exec(`xdotool mousemove ${edgeX} ${edgeY}`);               // 步进4（翻页触发点）
        // 停留约1秒触发翻页（时间过长会导致连续翻多页）
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('已拖到右边缘(' + edgeX + ',' + edgeY + ')停留1s触发翻页');

        // 立即将鼠标从边缘移开，防止连续翻页
        const retreatX = edgeX - 200;
        await system.exec(`xdotool mousemove ${retreatX} ${srcY}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('已离开边缘，等待翻页稳定');

        // 验证翻页成功
        await agent.aiWaitFor('启动器顶部第二个圆点是白色', { timeoutMs: 15000 });
        console.log('✅ 已确认翻到第2页');

        // 步骤 6: 从当前位置移动到目标位置（第2页第2行第2、3个图标之间），释放鼠标
        await new Promise(resolve => setTimeout(resolve, 500));                // 等待 0.5s
        // 分步移动到目标位置
        for (let x = retreatX; x >= tgtX; x -= 50) {
            await system.exec(`xdotool mousemove ${x} ${tgtY}`);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        await system.exec(`xdotool mousemove ${tgtX} ${tgtY}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('已到达目标位置(' + tgtX + ',' + tgtY + ')停留1s');
        // 释放鼠标左键
        await system.exec(`xdotool mouseup 1`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('✅ 鼠标拖拽完成: (' + srcX + ',' + srcY + ') -> (' + tgtX + ',' + tgtY + ') 释放');

        // 验证 1: 拖动成功，第2页（目标页）插入拖入的应用，目标页有空位（仍是2个圆点，未自动创建新页）
        await agent.aiAssert('启动器顶部第二个原点为实心为激活状态,显示第2页插入拖入的应用,(应用商店)');

        // 验证 2: 起始页（第1页）被拖出的应用位置由其他应用自行补位
        await agent.aiTap('启动器顶部的第3个圆点');
        await new Promise(resolve => setTimeout(resolve, 1500));
        await agent.aiAssert('启动器顶部第3个圆点是白色，停在第3页，第3页第一个应用是影院（从第2页末尾顺移过来）');

    }, { timeout: 600000, tags: ['1832623', 'level3', 'laptop'] });

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
        await uos.openLauncher();
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
