/**
 * 用例 PMSID: 1504489
 * 用例标题:【控制中心】【个性化】【颜色和图标】活动用色设置生效显示
 * 生成时间: 2026-06-18
 * 用例编写人:UT005044(王亮)
 */

describe('1504489-【控制中心】【个性化】【颜色和图标】活动用色设置生效显示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1504489-【控制中心】【个性化】【颜色和图标】活动用色设置生效显示', async ({ device, agent, uos, env }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 打开个性化菜单界面
        await agent.aiAssert("导航栏显示：系统");
        await agent.aiTap("左侧区域的菜单项：个性化", { deepThink: true }); 
        await agent.aiAssert("导航栏显示：个性化 ，右侧区域存在菜单项：颜色和图标");
        await agent.aiTap("左侧区域的菜单项：颜色和图标", { deepThink: true }); 

        //检查1：颜色和图标界面展示检查
        await agent.aiAssert("右侧区域存在标题项：活动用色，下方有9个圆形的活动色项项，默认选中为蓝色,和最后一个彩色的自定义项");

        // 步骤 3: 手动设置活动颜色为黄色
        await agent.aiTap("点击活动用色项：黄色", { deepThink: true }); 

        //检查2：颜色和图标界面展示检查
        await agent.aiAssert("左侧的一级菜单个性化项的底色为黄色，导航栏的标题颜色和图标的颜色为黄色");

    }, { timeout: 300000, tags: ["1504489", "level2", "smoke"] });
  
    afterEach(async ({ device, agent, system }) => {
        console.log('4. afterEach: 每个测试后的清理');  
        //还原环境1：还原活动用色     
        await agent.aiTap("点击活动用色项：蓝色", { deepThink: true });       

        //还原环境2：关闭打开的应用      
        await device.pressKey("Super", "Down");
        await system.exec(`killall dde-control-center`);
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  