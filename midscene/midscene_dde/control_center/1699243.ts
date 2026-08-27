/**
 * 用例 PMSID: 1699243
 * 用例标题:【控制中心】【个性化】【颜色和图标】颜色和图标三级界面展示
 * 生成时间: 2026-06-18
 * 用例编写人:UT005044(王亮)
 */

describe('1699243-【控制中心】【个性化】【颜色和图标】颜色和图标三级界面展示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1699243-【控制中心】【个性化】【颜色和图标】颜色和图标三级界面展示', async ({ device, agent, uos, env }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 打开个性化菜单界面
        await agent.aiAssert("导航栏显示：系统");
        await agent.aiTap("左侧区域的菜单项：个性化", { deepThink: true }); 
        await agent.aiAssert("导航栏显示：个性化 ，右侧区域存在菜单项：颜色和图标");
        await agent.aiTap("左侧区域的菜单项：颜色和图标", { deepThink: true }); 

        //检查1：颜色和图标界面展示检查
        await agent.aiAssert("右侧区域存在标题项：活动用色，下方有9个圆形的活动色项项，默认选中为蓝色,和最后一个彩色的自定义项");
        await agent.aiAssert("右侧区域的分类标题：图标设置，下方存在两个菜单项：图标主题和光标主题，图标主题默认值为：origin，光标主题默认值为：bloom");

    }, { timeout: 300000, tags: ["1699243", "level1", "smoke"] });
  
    afterEach(async ({ device, agent, system }) => {
        console.log('4. afterEach: 每个测试后的清理');        
        //还原环境1：关闭打开的应用      
        await device.pressKey("Super", "Down");
        await system.exec(`killall dde-control-center`);
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  