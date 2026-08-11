/**
 * 用例 PMSID: 1844645
 * 用例标题:【控制中心】【账户】当前账户的设置界面默认展示检查 
 * 生成时间: 2026-04-29
 * 用例编写人:UT005044(王亮)
 */

describe('1844645-【控制中心】【账户】当前账户的设置界面默认展示检查 ', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1844645-【控制中心】【账户】当前账户的设置界面默认展示检查 ', async ({ device, agent, uos, env }) => {
        // 步骤 1: 打开控制中心
        await uos.openApp("控制中心", 2000, 20000, true);

        // 步骤 2: 点击账户
        await agent.aiTap("账户", { deepThink: true });      
        await agent.aiAssert("导航栏显示：账户");

        //检查1：头像展示检查
        await agent.aiAssert("右侧区域左上角展示用户头像，圆形，紧靠右侧展示账户名；同一水平线对应的右侧展示按钮：添加新用户");

        //检查2：账户信息展示检查
        await agent.aiAssert("右侧区域中存在标题：账户信息，下方存在设置项标题：账户名，账户全名，账户类型，其中账户类型为灰态效果");

        //检查3：登录设置展示检查
        await agent.aiAssert("右侧区域中存在标题：登录设置，下方存在设置项标题：自动登录，快速登录，免密登录，都是开关项");

        //检查 4：登录方式展示检查
        await agent.aiAssert("右侧区域中存在标题：登录方式，下方存在设置项标题：密码");

        //检查 5：底部按钮展示检查
        await agent.aiAssert("右侧区域中底部左下角存在按钮：删除当前账户，红色字体灰态效果；底部右下角存在按钮：用户组设置");

    }, { timeout: 600000, tags: ["1844645", "level1", "smoke"] });
  
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
  