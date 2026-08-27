/**
 * 用例 PMSID: 1699127
 * 用例标题:【控制中心】【个性化】个性化二级菜单项界面展示
 * 生成时间: 2026-06-18
 * 用例编写人:UT005044(王亮)
 */

describe('1699127-【控制中心】【个性化】个性化二级菜单项界面展示', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1699127-【控制中心】【个性化】个性化二级菜单项界面展示', async ({ device, agent, uos, env }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 打开个性化菜单界面
        await agent.aiAssert("导航栏显示：系统");
        await agent.aiTap("左侧区域的菜单项：个性化", { deepThink: true }); 
        await agent.aiAssert("导航栏显示：个性化，右侧区域存在菜单项：桌面和任务栏");

        //检查1：插件区域界面展示检查
        await agent.aiAssert("右侧区域存在标题项：主题，下方有8个主题项：bloom,flow,hazy color,nirvana,organic glass,origin,square,vintage,和一个自定义项：下载更多");
        await agent.aiAssert("右侧区域的8个菜单项:外观，桌面和任务栏，窗口效果，壁纸，屏幕保护，颜色和图标，字体和字号，其中外观的默认值为：浅色");

    }, { timeout: 300000, tags: ["1699127", "level1", "smoke"] });
  
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
  