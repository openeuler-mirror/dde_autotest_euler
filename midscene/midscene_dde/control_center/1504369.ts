/**
 * 用例 PMSID: 1504369
 * 用例标题: 【控制中心】【系统】【辅助信息】控制中心搜索系统信息模块功能正常
 * 生成时间: 2026-3-18 14:26:10
 * 用例编写人:UT000511(肖海燕)
 */


describe('1504369-【控制中心】【系统】【辅助信息】控制中心搜索系统信息模块功能正常', () => {
    beforeAll(async ({ device, uos, agent, system}) => {
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1504369-【控制中心】【系统】【辅助信息】控制中心搜索系统信息模块功能正常', async ({ device, agent, uos }) => {
      //步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      //步骤 2: 进入控制中心任一模块，输入框输入'本机'
      await agent.aiTap("系统");
      await agent.aiTap("系统菜单上方的搜索框");
      await device.typeText("本机");

      //检查下拉列表中有 系统-辅助信息-->关于本机模块选项
      await agent.aiAssert("搜索框下方显示：系统/关于本机");

      //步骤 3：点击下拉列表中任一 系统-辅助信息-->关于本机模块选项
      await device.pressKey("Enter");

      //检查正常跳转到 控制中心-系统-关于本机页面
      await agent.aiAssert("页面左上角导航栏显示：系统/关于本机");
      await agent.aiTap("点击系统上方搜索框里面的X");
      await agent.aiTap("点击左侧导航栏网络菜单");

      //步骤 4: 进入控制中心任一模块，输入框输入'开源'
      await agent.aiTap("系统菜单上方的搜索框");
      await device.typeText("开源");

      //检查下拉列表中有 系统-辅助信息-->开源软件声明 模块选项
      await agent.aiAssert("系统/开源软件声明");

      //步骤 5：点击下拉列表中任一 系统-辅助信息-->开源软件声明 模块选项
      await device.pressKey("Enter");                                

      //检查正常跳转至控制中心-系统-开源软件声明
      await agent.aiAssert("页面左上角导航栏显示：系统/开源软件声明");
      await agent.aiTap("点击系统上方搜索框里面的X");
      await agent.aiTap("点击左侧导航栏网络菜单");

      //步骤 6: 进入控制中心任一模块，输入框输入'用户许可'
      await agent.aiTap("系统菜单上方的搜索框");
      await device.typeText("用户许可");

      //检查下拉列表中有 系统-辅助信息-->最终用户许可协议 模块选项
      await agent.aiAssert("系统/用户许可协议");

      //步骤 7：点击下拉列表中任一 系统-辅助信息-->最终用户许可协议 模块选项
      await device.pressKey("Enter");

      //检查跳转至控制中心-系统-用户许可协议页面
      await agent.aiAssert("页面左上角导航栏显示：系统/用户许可协议");
      await agent.aiTap("点击系统上方搜索框里面的X");
      await agent.aiTap("点击左侧导航栏网络菜单");


     //步骤 8: 点击下拉列表中任一 系统信息 --> 隐私政策 模块选项
      await agent.aiTap("系统菜单上方的搜索框");
      await device.typeText("隐私");

      //检查下拉列表中有 系统-辅助信息 --> 隐私政策 模块选项
      await agent.aiAssert("系统/隐私政策");

      //步骤 9：点击下拉列表中任一 系统-辅助信息 --> 隐私政策 模块选项
      await device.pressKey("Enter");

      //检查正常跳转到 控制中心-系统-辅助信息-隐私政策页面
      await agent.aiAssert("页面左上角导航栏显示：系统/隐私政策");
        
    }, { timeout: 600000, tags: ["1504369","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 恢复默认窗口大小(控制中心)
      await device.pressKey("super", "Down");
      await uos.closeCurrentWindow();
    });
  });