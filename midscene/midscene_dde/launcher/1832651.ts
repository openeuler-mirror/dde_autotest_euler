/**
 * 用例 PMSID: 1832651
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】 应用文件夹内的应用布局和显示规则
 * 生成时间: 2026/7/23
 * 用例编写人: UT001707(陈慧)
 */

describe('1832651-【启动器】【全屏模式】【应用文件夹】 应用文件夹内的应用布局和显示规则', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();

        // 预创建 4 套 .22bak 配置文件，对应 4 种应用数量场景：
        //   .22bak.1  -> 1 个应用（单行居中）
        //   .22bak.3  -> 3 个应用（少于4个，单行居中）
        //   .22bak.12 -> 12 个应用（4列×3行）
        //   .22bak.16 -> 16 个应用（大于12个，4列×3行+翻页）
        const baseBak = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';

        // 通用应用列表（12个以内）
        const apps1 = 'dde-file-manager.desktop';
        const apps3 = 'dde-file-manager.desktop, deepin-album.desktop, deepin-draw.desktop';
        const apps12 = [
            'dde-file-manager.desktop',
            'deepin-album.desktop',
            'deepin-draw.desktop',
            'deepin-reader.desktop',
            'deepin-editor.desktop',
            'deepin-mail.desktop',
            'deepin-terminal.desktop',
            'downloader.desktop',
            'deepin-calculator.desktop',
            'deepin-camera.desktop',
            'deepin-music.desktop',
            'deepin-movie.desktop',
        ].join(', ');
        // 16个应用（>12个，需要翻页）
        const apps16 = apps12 + ', deepin-app-store.desktop, deepin-boot-maker.desktop, deepin-voice-note.desktop, deepin-screen-recorder.desktop';

        // 写入 4 份配置文件
        // 注意: heredoc 写法 <<'MIDSCEOF' 会保留反斜杠原样，因此 JS 模板字符串中
        //       1 个反斜杠写为 \\（4 字符 → 2 字符 → shell 看到 1 字符 → 写入文件 1 字符）
        const writeCmds = [
            `cat > ${baseBak}.1 <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=1
1\\pageItems\\0=${apps1}
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1
MIDSCEOF`,
            `cat > ${baseBak}.3 <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=1
1\\pageItems\\0=${apps3}
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1
MIDSCEOF`,
            `cat > ${baseBak}.12 <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=1
1\\pageItems\\0=${apps12}
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1
MIDSCEOF`,
            `cat > ${baseBak}.16 <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=2
1\\pageItems\\0=${apps12}
1\\pageItems\\1=deepin-app-store.desktop, deepin-boot-maker.desktop, deepin-voice-note.desktop, deepin-screen-recorder.desktop
toplevel\\pageCount=1
toplevel\\pageItems\\0=internal/folders/1
MIDSCEOF`,
        ];
        for (const cmd of writeCmds) {
            const r = await system.exec(cmd);
            assertTrue(r.success, `创建 .22bak 配置文件失败: ${cmd.substring(0, 80)}...`);
        }
        console.log('item-arrangement.ini.22bak.{1,3,12,16} 已创建（4套应用数量配置）');
    });

    beforeEach(async ({ device, agent, uos, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 注: 本用例的"切换应用数量"在 test 内部通过 system.exec 完成，
        // beforeEach 仅保证启动器为全屏模式。
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

    // 工具函数：切换到指定应用数量的配置并重启 dde-shell
    async function switchToConfig(system, appCount) {
        const iniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini';
        const bakPath = `~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak.${appCount}`;
        await system.exec(`cp -f ${bakPath} ${iniPath}`);
        await system.exec('systemctl --user daemon-reload');
        await system.exec('systemctl --user restart dde-shell@DDE', 60000);
        await system.exec('sleep 10');
        const statusResult = await system.exec('systemctl --user is-active dde-shell@DDE');
        assertTrue(statusResult.success && statusResult.stdout.trim() === 'active', 'dde-shell服务未正常启动');
        console.log(`已切换到 ${appCount} 个应用的配置，dde-shell 已重启`);
    }

    test('1832651-【启动器】【全屏模式】【应用文件夹】 应用文件夹内的应用布局和显示规则', async ({ device, agent, uos, system }) => {
        // 场景 1: 1 个应用（单行居中）
        console.log('========== 场景 1: 1 个应用 ==========');
        await switchToConfig(system, 1);
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');
        await agent.aiTap('应用列表中的"系统管理"应用文件夹图标');
        await agent.aiWaitFor('应用文件夹已打开');
        // 检查 1: 1 个应用时单行居中显示
        await agent.aiAssert('应用文件夹内只有 1 个应用时，该应用图标在弹窗内单行居中显示');

        // 退出文件夹弹窗，准备切换到下一个场景
        await device.pressKey('ESC');
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 场景 2: 少于 4 个应用（3 个应用，单行居中）
        console.log('========== 场景 2: 少于 4 个应用（3 个） ==========');
        await switchToConfig(system, 3);
        // 重新打开启动器以应用新配置
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');
        await agent.aiTap('应用列表中的"系统管理"应用文件夹图标');
        await agent.aiWaitFor('应用文件夹已打开');
        // 检查 2: 少于 4 个应用时单行居中显示
        await agent.aiAssert('应用文件夹内少于 4 个应用时，所有应用图标在弹窗内单行居中显示');

        await device.pressKey('ESC');
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 场景 3: 12 个应用（4 列 × 3 行）
        console.log('========== 场景 3: 12 个应用 ==========');
        await switchToConfig(system, 12);
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');
        await agent.aiTap('应用列表中的"系统管理"应用文件夹图标');
        await agent.aiWaitFor('应用文件夹已打开');
        // 检查 3: 12 个应用时按 4 列 × 3 行网格显示
        await agent.aiAssert('应用文件夹内有 12 个应用时，按每行 4 个、共 3 行的网格布局显示');

        await device.pressKey('ESC');
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 场景 4: 大于 12 个应用（16 个，4 列 × 3 行 + 翻页指示点）
        console.log('========== 场景 4: 大于 12 个应用（16 个） ==========');
        await switchToConfig(system, 16);
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');
        await agent.aiTap('应用列表中的"系统管理"应用文件夹图标');
        await agent.aiWaitFor('应用文件夹已打开');
        // 检查 4: 大于 12 个时按 4 列 × 3 行布局，超出部分翻页，底部有圆点翻页指示
        await agent.aiAssert('系统管理应用文件夹内共有12个应用，按每行4个、共3行进行网格布局，且底部显示了分页原点');
        await agent.aiTap('应用文件夹内第二个原点');
        await agent.aiAssert('当前处于第二个点（第二页），本页显示4个应用');

    }, { timeout: 1200000, tags: ['1832651', 'level3', 'laptop'] });

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

        // 清理预置步骤1：先删除 item-arrangement.ini 和所有 .22bak.* 文件
        await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini');
        await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak');
        await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak.1');
        await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak.3');
        await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak.12');
        await system.exec('rm -rf ~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak.16');
        console.log('item-arrangement.ini 及所有 .22bak.* 配置文件已删除');

        // 然后重启 dde-shell 服务
        await system.exec('systemctl --user restart dde-shell@DDE', 60000);
        await system.exec('sleep 10');
        console.log('dde-shell 服务已重启');

        // 最后执行 daemon-reload
        await system.exec('systemctl --user daemon-reload');
        console.log('systemctl --user daemon-reload 已执行');
    });
});
