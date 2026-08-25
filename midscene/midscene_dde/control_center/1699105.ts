/**
 * 用例 PMSID: 1699105
 * 用例标题:【控制中心】【个性化】【桌面和任务栏】桌面和任务栏项三级界面展示
 * 生成时间: 2026-04-30
 * 用例编写人:UT005044(王亮)
 */

describe('1699105-【控制中心】【个性化】【桌面和任务栏】桌面和任务栏项三级界面展示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1699105-【控制中心】【个性化】【桌面和任务栏】桌面和任务栏项三级界面展示', async ({ device, agent, uos, env }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 打开个性化菜单界面
        await agent.aiAssert("导航栏显示：系统");
        await agent.aiTap("左侧区域的菜单项：个性化", { deepThink: true }); 
        await agent.aiAssert("导航栏显示：个性化，右侧区域存在菜单项：桌面和任务栏");

        // 步骤 3: 打开桌面和任务栏菜单界面
        await agent.aiTap("右侧区域的菜单项：桌面和任务栏", { deepThink: true });   
        await agent.aiAssert("导航栏显示：个性化 / 桌面和任务栏，右侧区域存在菜单项：插件区域");

        // 步骤 4: 打开插件区域菜单界面
        await agent.aiTap("右侧区域的菜单项：插件区域", { deepThink: true });   
        await agent.aiAssert("导航栏显示：个性化 / 桌面和任务栏 / 插件区域");       


        //检查1：插件区域界面展示检查
        await agent.aiAssert("右侧区域存在标题项：插件区域，下方有多个插件项标题包括：系统监视器、剪贴板、截图、录屏、亮度、勿扰模式、视觉效果、通知、屏幕键盘、关机、网络、时间、多任务视图，统一按标题的首字母排序");
        await agent.aiAssert("右侧区域的4个插件项:关机、网络、时间、多任务视图对应右侧有勾选态");

    }, { timeout: 300000, tags: ["1699105", "level1", "smoke"] });
  
    afterEach(async ({ device, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');        
        //还原环境1：关闭打开的应用      
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
    });
  });
  