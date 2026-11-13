/**
 * 用例 PMSID: 1832641
 * 用例标题: 【启动器】【全屏模式】【应用文件夹】 拖动同一类型应用，重合度大于一半到小于一半时释放图标，检查应用文件夹
 * 生成时间: 2026/7/24
 * 用例编写人: UT001707(陈慧)
 */

describe('1832641-【启动器】【全屏模式】【应用文件夹】 拖动同一类型应用，重合度小于一半时释放图标应用位置恢复到原位，重合度大于一半时释放鼠标创建新的文件夹', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();

        // 初始化/更新 item-arrangement.ini.22bak 文件
        // 配置说明：顶层放置 计算机(系统分类) 和 文件管理器(系统分类) 两个同类应用
        const bakIniPath = '~/.config/deepin/dde-launchpad/item-arrangement.ini.22bak';
        const bakWriteCmd = `cat > ${bakIniPath} <<'MIDSCEOF'
[fullscreen]
1\\name=internal/category/9
1\\pageCount=0
toplevel\\pageCount=1
toplevel\\pageItems\\0=dde-computer.desktop, dde-file-manager.desktop
MIDSCEOF`;
        const bakResult = await system.exec(bakWriteCmd);
        assertTrue(bakResult.success, '创建/更新 .22bak 文件失败');
        console.log('item-arrangement.ini.22bak 已创建（顶层2个同类应用：计算机+文件管理器）');
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

    test('1832641-【启动器】【全屏模式】【应用文件夹】 拖动同一类型应用，重合度小于一半时释放图标应用位置恢复到原位，重合度大于一半时释放鼠标创建新的文件夹', async ({ device, agent, uos, system }) => {
        // 步骤 1: 打开启动器全屏模式
        await uos.openLauncher();
        await agent.aiWaitFor('启动器全屏模式已打开');

        // 步骤 2: 拖动文件管理器（同一类应用），重合度<50% 时释放鼠标，检查应用位置恢复到原位
        // 通过 xdotool 直接控制鼠标完成拖拽（不使用 aiDrag / aiAction）
        const screenInfo = await system.exec('xdpyinfo 2>/dev/null | grep "dimensions" | awk \'{print $2}\'');
        console.log('屏幕尺寸: ' + screenInfo.stdout.trim());
        // 源位置：文件管理器（第2个图标，约 435, 168）
        // 目标位置（<50%）：计算机图标右边缘附近（约 295, 168）—— 只重合小部分，不触发文件夹特效
        const srcX = 435, srcY = 168;              // 文件管理器
        const tgtBelow50X = 295, tgtBelow50Y = 168; // 计算机右边缘（重合度<50%）
        // 1) 移动到源位置
        await system.exec(`xdotool mousemove ${srcX} ${srcY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 2) 按下左键
        await system.exec(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 3) 分步移动到目标位置（<50%）
        const midX1 = Math.floor((srcX + tgtBelow50X) / 2);
        const midY1 = Math.floor((srcY + tgtBelow50Y) / 2);
        await system.exec(`xdotool mousemove ${midX1} ${midY1}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mousemove ${tgtBelow50X} ${tgtBelow50Y}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 4) 在目标位置停留 1 秒（确认是 <50% 不触发特效）
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('已在目标位置停留 1 秒: (' + tgtBelow50X + ',' + tgtBelow50Y + ')');
        // 5) 释放左键
        await system.exec(`xdotool mouseup 1`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('【第 1 次拖动完成】<50% 释放: (' + srcX + ',' + srcY + ') -> (' + tgtBelow50X + ',' + tgtBelow50Y + ')');

        // 检查 1: 重合度<50% 释放时没有文件夹特效，文件管理器恢复到原位
        await agent.aiAssert('文件管理器图标恢复到原位置(位于计算机右侧),启动器仍只有1个文件管理器和1个计算机图标');

        // 步骤 3: 再次拖动文件管理器（同一类应用），重合度>50% 时释放鼠标，检查应用文件夹
        // 源位置：文件管理器（仍在原位，约 435, 168）
        // 目标位置（>50%）：计算机图标中心（约 221, 168）—— 重合度>50%，触发新建文件夹
        const tgtAbove50X = 221, tgtAbove50Y = 168; // 计算机中心（重合度>50%）
        // 1) 移动到源位置
        await system.exec(`xdotool mousemove ${srcX} ${srcY}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 2) 按下左键
        await system.exec(`xdotool mousedown 1`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 3) 分步移动到目标中心（>50%）
        const midX2 = Math.floor((srcX + tgtAbove50X) / 2);
        const midY2 = Math.floor((srcY + tgtAbove50Y) / 2);
        await system.exec(`xdotool mousemove ${midX2} ${midY2}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mousemove ${tgtAbove50X + 30} ${tgtAbove50Y}`);
        await new Promise(resolve => setTimeout(resolve, 100));
        await system.exec(`xdotool mousemove ${tgtAbove50X} ${tgtAbove50Y}`);
        await new Promise(resolve => setTimeout(resolve, 200));
        // 4) 在目标中心停留 1 秒（确认是 >50% 触发文件夹特效）
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('已在目标中心停留 1 秒: (' + tgtAbove50X + ',' + tgtAbove50Y + ')');
        // 5) 释放左键
        await system.exec(`xdotool mouseup 1`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('【第 2 次拖动完成】>50% 释放: (' + srcX + ',' + srcY + ') -> (' + tgtAbove50X + ',' + tgtAbove50Y + ')');

        // 检查 2: 重合度>50% 释放时创建了新的应用文件夹
        await agent.aiAssert('触发了文件夹合并特效，并在释放后创建了新的应用文件夹（应用文件夹名称为同类应用分类属性"系统管理")');

        // 检查 3: 顶层应用区域中：原来2个独立应用变成了1个新建的应用文件夹
        await agent.aiAssert('启动器顶层应用区域中:原来的1个计算机和1个文件管理器合并为1个新建的应用文件夹(系统管理)');

    }, { timeout: 600000, tags: ['1832641', 'level3', 'laptop'] });

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
