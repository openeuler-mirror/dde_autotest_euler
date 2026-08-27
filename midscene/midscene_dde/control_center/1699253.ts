/**
 * 用例 PMSID: 1699253
 * 用例标题:【控制中心】【蓝牙和其他设备】【鼠标与触控板】鼠标与触控板三级菜单项界面展示
 * 生成时间: 2026-01-29
 * 用例编写人:UT005044(王亮)
 */

describe('1699253-【控制中心】【蓝牙和其他设备】【鼠标与触控板】鼠标与触控板三级菜单项界面展示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1699253-【控制中心】【蓝牙和其他设备】【鼠标与触控板】鼠标与触控板三级菜单项界面展示', async ({ device, agent, uos, system }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击一级菜单项：蓝牙和其他设备
        await agent.aiTap("蓝牙和其他设备", { deepThink: true });
        await agent.aiAssert("顶部导航栏显示：蓝牙和其他设备");
        await agent.aiAssert("右侧区域的列表菜单项中存在：鼠标与触控板");

        // 步骤 3: 点击二级菜单项：鼠标与触控板
        await agent.aiTap("鼠标与触控板", { deepThink: true });

        //检查1：鼠标与触控板 三级菜单界面各设置项展示
        await agent.aiAssert("顶部导航栏显示：蓝牙和其他设备 / 鼠标与触控板");
        await agent.aiAssert("右侧区域存在设置项标题：滚动速度，紧靠下方展示刻度调节区，从左到右展示可调节值依次为：1,2,3,4,5,6,7,8,9,10，默认值为1");
        await agent.aiAssert("右侧区域存在设置项标题：双击速度，紧靠下方展示刻度调节区，最左展示：慢，最右展示：快，中间还有5个刻度值，默认值在中间的刻度位置");
        await agent.aiAssert("右侧区域存在设置项标题：双击测试，在“双击速度”项的右侧，区域中间展示趴着的小猫图案");
        await agent.aiAssert("右侧区域存在设置项标题：左手模式，最右侧显示开关按钮，默认关闭，灰色效果");
        await agent.aiAssert("右侧区域存在菜单项：最左侧展示鼠标logo，标题：鼠标，最右侧展示箭头标识：>");
        const ret = await system.exec('cat /proc/bus/input/devices | grep Touchpad');
        if (ret.success && ret.stdout != '') {
            console.log ('执行成功,机型为笔记本电脑或有触控板：', ret.stdout);
            await agent.aiAssert("右侧区域存在菜单项：最左侧展示logo，标题：触控板，最右侧展示箭头标识：>");
        } else {
            console.log ('机型不是笔记本电脑或无触控板', ret.stderr);
        }

    }, { timeout: 300000, tags: ["1699253", "level1", "smoke"] });
  
    afterEach(async ({ device, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        //还原环境, 恢复窗口大小并关闭
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  