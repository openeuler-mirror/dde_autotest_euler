/**
 * 用例 PMSID: 1844337
 * 用例标题:【控制中心】【账户】新建账户的用户名和密码一致时报错提示
 * 生成时间: 2026-06-01
 * 用例编写人:UT005044(王亮)
 */

describe('1844337-【控制中心】【账户】新建账户的用户名和密码一致时报错提示', () => {
    const testUser = 'testuser1';

    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1844337-【控制中心】【账户】新建账户的用户名和密码一致时报错提示', async ({ device,env, agent, uos }) => {
      // 步骤 1: 打开控制中心 
      await uos.openApp("控制中心", 2000, 20000, true);
     
      // 步骤 2: 打开账户界面
      await agent.aiTap("账户", { deepThink: true });
      await agent.aiAssert("导航栏显示：账户,右侧区域界面中，右上角存在按钮标题：添加新用户")

      // 步骤 3: 点击添加新用户
      await agent.aiTap("右侧区域界面右上角按钮：添加新用户", { deepThink: true });

      // 步骤 4: 创建新用户界面，输入用户名和密码一致
      await agent.aiTap("用户名对应右侧的输入框", { deepThink: true });
      await device.typeText(`${testUser}`);
      await agent.aiTap("新密码对应右侧的输入框", { deepThink: true });
      await device.typeText(`${testUser}`);
      await agent.aiAssert("新密码对应的输入框置红");

      // 检查1：新建账户的密码框更新为错误状态
      await agent.aiTap("重复密码对应右侧的输入框", { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 3000));
      await device.typeText(`${testUser}`);
      await agent.aiTap("创建用户",  { deepThink: true });

      // 检查2：不能创建新账户，新建账户的密码框更新为错误状态，弹出TIPS
      await agent.aiAssert("弹框未关闭，新密码对应的输入框置红，且密码选中状态");

    }, { timeout: 300000, tags: ["1844337","level2","smoke"] });
  
    afterEach(async ({ device, agent, system, uos, env }) => {
        console.log('4. afterEach: 每个测试后的清理');        
        //还原环境1：退出新建的账户
        await agent.aiTap("弹框中的按钮：取消",  { deepThink: true });
       
        //还原环境2：关闭打开的应用             
        await device.pressKey("Super", "Down");
        await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await device.pressKey("Alt", "F4");
    });  
});