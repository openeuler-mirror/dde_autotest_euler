/**
 * 用例 PMSID: 1962179
 * 用例标题:【控制中心】【蓝牙和其他设备】【鼠标与触控板】【鼠标】鼠标指针大小设置“中”即时生效正常
 * 生成时间: 2026-01-30
 * 用例编写人:UT005044(王亮)
 */

describe('1962179-【控制中心】【蓝牙和其他设备】【鼠标与触控板】【鼠标】鼠标指针大小设置“中”即时生效正常', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1962179-【控制中心】【蓝牙和其他设备】【鼠标与触控板】【鼠标】鼠标指针大小设置“中”即时生效正常', async ({ device, agent, uos, system }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击一级菜单项：蓝牙和其他设备
        await agent.aiTap("蓝牙和其他设备", { deepThink: true });
        await agent.aiAssert("顶部导航栏显示：蓝牙和其他设备");
        await agent.aiAssert("右侧区域的列表菜单项中存在：鼠标与触控板");

        // 步骤 3: 点击二级菜单项：鼠标与触控板
        await agent.aiTap("鼠标与触控板", { deepThink: true });
        await agent.aiAssert("顶部导航栏显示：蓝牙和其他设备 / 鼠标与触控板");
        await agent.aiAssert("右侧区域存在菜单项：最左侧展示鼠标logo，标题：鼠标，最右侧展示箭头标识：>");

        // 步骤 4: 点击二级菜单项：鼠标与触控板
        await agent.aiTap("点击菜单项：鼠标", { deepThink: true });
        await agent.aiAssert("顶部导航栏显示：蓝牙和其他设备 / 鼠标与触控板 / 鼠标");
        await agent.aiAssert("右侧区域存在设置项标题：指针大小，对应的选项框默认值为：小，且不存在说明文案：部分应用需注销或重启系统后生效");

        // 步骤 5: 点击鼠标大小项：中 的展示
        await agent.aiTap("点击鼠标大小的图案选项：中", { deepThink: true });

        //检查1：鼠标与触控板 三级菜单界面各设置项展示     
        await agent.aiAssert("指针大小的图案选项框焦点更新为：中，对应的选项边框高亮效果，物理鼠标指针的大小也相对变大了");
        await agent.aiAssert("指针大小设置项区域更新展现了说明文案：部分应用需注销或重启系统后生效");

    }, { timeout: 300000, tags: ["1962179", "level2", "smoke"] });
  
    afterEach(async ({ device, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 还原环境1: 恢复鼠标大小项：小
        await agent.aiTap("点击鼠标大小的图案选项：小", { deepThink: true });

        //还原环境2： 恢复窗口大小并关闭
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  