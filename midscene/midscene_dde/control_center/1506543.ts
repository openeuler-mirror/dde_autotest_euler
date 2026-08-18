/**
 * 用例 PMSID: 1506543
 * 用例标题:【控制中心】【系统】【启动菜单】启动菜单三级菜单界面展示检查
 * 生成时间: 2026-04-30
 * 用例编写人:UT005044(王亮)
 */

describe('1506543-【控制中心】【系统】【启动菜单】启动菜单三级菜单界面展示检查', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506543-【控制中心】【系统】【启动菜单】启动菜单三级菜单界面展示检查', async ({ device, agent, uos, env }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 打开启动菜单界面
        await agent.aiAssert("导航栏显示：系统，右侧区域存在菜单项：启动菜单");
        await agent.aiTap("右侧区域的启动菜单项", { deepThink: true });      

        //检查1：启动菜单界面展示检查
        await agent.aiAssert("导航栏显示：系统 / 启动菜单");
        await agent.aiAssert("右侧区域中存在标题：启动设置，下方的深色背景区域有多个菜单项，默认选中：统信桌面操作系统 V25 专业版本，最右侧有勾选态");

        //检查2：启动菜单设置项展示检查
        await agent.aiAssert("右侧区域中存在设置项标题：启动延时，主题，启动菜单验证，都是开关项，只有第二项“主题”的开关默认开启");

        //检查 3：启动菜单启动动画展示检查
        await agent.aiAssert("右侧区域中存在标题：启动动画，下方展示两个系统LOGO的图片框，左侧为大尺寸项，右侧为小尺寸项，默认选中小尺寸项");

    }, { timeout: 300000, tags: ["1506543", "level1", "smoke"] });
  
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
  