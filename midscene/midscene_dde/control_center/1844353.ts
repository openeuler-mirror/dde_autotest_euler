/**
 * 用例 PMSID: 1844353
 * 用例标题: 【控制中心】【账户】【新建账户】添加账户流程
 * 生成时间: 2025-12-24
 * 用例编写人:UT005571(王艺桥)
 */

describe('1844353-【控制中心】【账户】【新建账户】添加账户流程', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
      // 尝试点击窗口上取消，有则关，无则跳过
      try {
          await agent.aiTap("请密码输入窗口上的：取消");
      } catch (e) {}
    });
  
    beforeEach(async ({ device, agent, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1844353-【控制中心】【账户】【新建账户】添加账户流程', async ({ device,env, agent, uos }) => {
      // 步骤 1: 打开控制中心 
      await uos.openApp("控制中心",{maximizeWindow: true});
     
      // 步骤 2: 账户
      await agent.aiTap("账户");

      // 步骤 3: 点击添加新用户
      await agent.aiTap("右上角：添加新用户");

      // 步骤 4: 创建新用户test，密码：1
      await agent.aiTap("用户名后面必填");
      await device.typeText("Test");
      await agent.aiTap("新密码后面必填");
      await device.typeText("1");
      await agent.aiTap("重复密码后面必填");
      await device.typeText("1");
      await agent.aiTap("创建用户");
      await agent.aiWaitFor("出现鉴权窗口");
      await agent.aiTap("密码输入框");
      await device.typeText(env.testPassword)
      await agent.aiTap("确认");

      // 检查：创建账户成功，Test账户显示在其他账户下方
      await agent.aiAssert("其他账户下方显示Test 标准用户")

    }, { timeout: 300000, tags: ["1844353","level1","smoke"] });
  
    afterEach(async ({ device ,agent, system }) => {
      console.log('4. afterEach: 每个测试后的清理');
      // 清除创建的账户
      await agent.aiTap("Test");
      await agent.aiScroll('账户/Test下方区域',{direction:'down',distance:10});
      await agent.aiTap("下方删除当前账户按钮");
      await agent.aiTap("弹窗上的：删除");
      // 清理环境
      await device.pressKey("super", "Down");
      await system.exec(`killall dde-control-center`);
    });
  
    afterAll(async ({ uos }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
});