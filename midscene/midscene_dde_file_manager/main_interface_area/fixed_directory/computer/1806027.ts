/**
 * 用例 PMSID: 1806027
 * 用例标题: 隐藏数据盘和系统盘，多窗口实时生效
 * 生成时间: 2026-10-29 11:00:00
 * 用例编写人: UT005160(蓝雁玲)
 *
*/
const caseDir = process.env.TESTCASE_DIR;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const WIN_COUNT = 3;

describe('1806027-隐藏数据盘和系统盘，多窗口实时生效', () => {
    const sh = async (system, cmd, timeout = 30000) => {
        const r = await system.exec(cmd, timeout);
        const out = ((r && r.stdout) || '').trim();
        return out;
    };

    /** 拿所有"文件管理器"窗口 ID */
    const fmWindows = async (system) => {
        const out = await sh(system, `wmctrl -l | grep "文件管理器" | awk '{print $1}'`, 15000);
        return out.split('\n').map((s) => s.trim()).filter(Boolean);
    };

    const activate = async (system, wid) => {
        await sh(system, `wmctrl -i -a ${wid} 2>/dev/null; sleep 1; true`, 10000);
        await sleep(1200);
    };

    /** 侧边栏是否还能看到系统盘 / 数据盘 */
    const disksVisible = async (agent, label) => {
        const sys = await agent.aiBoolean('文件管理器左侧边栏里能看到"系统盘"这一项');
        const data = await agent.aiBoolean('文件管理器左侧边栏里能看到"数据盘"这一项');
        console.log(`[${label}] 系统盘可见=${sys} 数据盘可见=${data}`);
        return { sys, data };
    };

    /** 打开设置 → 工作区 → 计算机显示项目 */
    const openComputerDisplaySettings = async (agent) => {
        await agent.aiTap('文件管理器标题栏右上角的三条横线主菜单按钮', { deepThink: true });
        await agent.aiTap('主菜单中的"设置"');
        await agent.aiTap('设置窗口左侧导航中"工作区"分组下的"计算机显示项目"');
        const ok = await agent.aiBoolean('"计算机工作区内隐藏内置磁盘"和"计算机工作区内隐藏我的目录"两个处于未勾选状态');
        if (!ok) {
            throw new Error('"计算机工作区内隐藏内置磁盘"和"计算机工作区内隐藏我的目录"两个处于勾选状态');
        }
    };

    const hideDiskChecked = async (agent) => agent.aiBoolean('"计算机工作区内隐藏内置磁盘"左侧的勾选框处于已勾选状态');

    beforeAll(async ({ system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        const { closeFileManager, clearEnvironment, resetDconfigDefaults } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
        // 前置："未配置隐藏系统盘和数据盘" —— 先归零，确保是初始态
        await resetDconfigDefaults(system);
    });

    beforeEach(async ({ uos }) => {
        console.log('2. beforeEach: 回到桌面');
        await uos.showDesktop();
    });

    test('1806027-设置隐藏内置磁盘后其他窗口实时生效', async ({ agent, device, uos, system }) => {
        console.log('===== 步骤1：打开多个文管窗口，确认都显示系统盘和数据盘 =====');
        console.log('预期1：侧边栏和计算机视图显示系统盘和数据盘');
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器窗口右上角的三条横线", { deepThink: true });
        await agent.aiTap("设置");    
        await agent.aiTap("默认目录");
        await agent.aiScroll('默认目录', { direction: 'down', distance: 1000 });
        await agent.aiTap("恢复默认"); 
        await device.pressKey('Alt+F4');
        await device.pressKey('Super+Left');

        // 再开1个新窗口
        await device.pressKey('Ctrl+N');
        await device.pressKey('Super+Right');

        // 逐个窗口确认能看到系统盘 / 数据盘
        await agent.aiAssert("左边文管窗口左侧栏看到系统盘和数据盘");
        await agent.aiAssert("右边文管窗口左侧栏看到系统盘和数据盘");
        console.log('✅ 预期1 通过：2个窗口都显示系统盘和数据盘');

        console.log('===== 步骤2：在其中一个窗口勾选「隐藏内置磁盘」，检查其他窗口是否实时隐藏 =====');
        await agent.aiTap("左边文管窗口标题栏");
        await openComputerDisplaySettings(agent);

        await agent.aiTap('"计算机工作区内隐藏内置磁盘"复选框的中心', { deepThink: true });

        const after = await hideDiskChecked(agent);
        if (after !== true) {
            throw new Error('勾选「计算机工作区内隐藏内置磁盘」失败');
        }
        console.log('已在窗口1设置中勾选「计算机工作区内隐藏内置磁盘」');

        // 关掉设置窗口，避免它和主窗口同名干扰后续识别
        await agent.aiTap('设置窗口右上角的关闭按钮');

        await agent.aiAssert("左边文管窗口左侧栏看到系统盘和数据盘");
        await agent.aiAssert("右边文管窗口左侧栏看到系统盘和数据盘");
        await agent.aiAssert("左边文管窗口计算机界面工作区看不到系统盘和数据盘");
        await agent.aiAssert("右边文管窗口计算机界面工作区看不到系统盘和数据盘");

        console.log('✅ 预期2 通过：2个窗口都在未刷新的情况下实时隐藏了系统盘和数据盘');

        console.log('===== 恢复设置，避免影响后续用例 =====');
        await agent.aiTap("左边文管窗口标题栏");
        await agent.aiTap("文件管理器窗口右上角的三条横线", { deepThink: true });
        await agent.aiTap("设置");    
        await agent.aiTap("默认目录");
        await agent.aiScroll('默认目录', { direction: 'down', distance: 1000 });
        await agent.aiTap("恢复默认"); 
        await device.pressKey('Alt+F4');

        console.log('✅ 已取消勾选，环境恢复');
        console.log('===== 测试结束 =====');
    }, { timeout: 1800000, tags: ['1806027', 'level3','main_interface_area','fixed_directory', 'computer', 'DITT', 'lanyanling'] });

    afterEach(async ({ system }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ system, uos }) => {
        console.log('5. afterAll: 清理测试套件');
        const { closeFileManager, clearEnvironment, resetDconfigDefaults } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await resetDconfigDefaults(system);
        await clearEnvironment(system);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });
});
