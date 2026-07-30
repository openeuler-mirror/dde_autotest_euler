/**
 * 用例 PMSID: 1504371
 * 用例标题: 【控制中心】【系统】【辅助信息】全局搜索系统信息模块功能正常
 * 生成时间: 2026-3-18 09:23:10
 * 用例编写人:UT000511(肖海燕)
 */


describe('1504371-【控制中心】【系统】【辅助信息】全局搜索系统信息模块功能正常', () => {
    beforeAll(async ({ device, uos, agent, system}) => {
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1504371-【控制中心】【系统】【辅助信息】全局搜索系统信息模块功能正常', async ({ device, agent, uos }) => {
      //步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      //步骤 2: shift+空格 组合键打开全局搜索，输入框输入'本机'
      await device.pressKey("shift+space");
      await device.typeText("本机");

      //检查下拉列表中有 系统-辅助信息-->关于本机模块选项
      await agent.aiAssert("系统/关于本机");

      //步骤 3：点击下拉列表中任一 系统-辅助信息-->关于本机模块选项
      await new Promise(resolve => setTimeout(resolve, 1000));         //等待1s
      await agent.aiTap("点击最佳匹配文案下方蓝色高亮‘系统/关于本机’处");
      await device.pressKey("Enter");

      //检查正常跳转到 控制中心-系统-关于本机页面
      await agent.aiAssert("页面左上角导航栏显示：系统/关于本机");

      //步骤 4: shift+空格 组合键打开全局搜索，输入框输入'开源'
      await agent.aiTap("系统");
      await device.pressKey("shift+space");
      await device.typeText("开源");

      //检查下拉列表中有 系统-辅助信息-->开源软件声明 模块选项
      await agent.aiAssert("系统/开源软件声明");

      //步骤 5：点击下拉列表中任一 系统-辅助信息-->开源软件声明 模块选项
      await new Promise(resolve => setTimeout(resolve, 1000));          //等待1s
      await device.pressKey("Enter");                                

      //检查正常跳转至控制中心-系统-开源软件声明
      await agent.aiAssert("页面左上角导航栏显示：系统/开源软件声明");

      //步骤 6: shift+空格 组合键打开全局搜索，输入框输入'用户许可'
      await agent.aiTap("系统");
      await device.pressKey("shift+space");
      await device.typeText("用户许可");

      //检查下拉列表中有 系统-辅助信息-->最终用户许可协议 模块选项
      await agent.aiAssert("系统/用户许可协议");

      //步骤 7：点击下拉列表中任一 系统-辅助信息-->最终用户许可协议 模块选项
      await new Promise(resolve => setTimeout(resolve, 1000));          //等待1s
      await device.pressKey("Enter");

      //检查跳转至控制中心-系统-用户许可协议页面
      await agent.aiAssert("页面左上角导航栏显示：系统/用户许可协议");

     //步骤 8: shift+空格 组合键打开全局搜索，输入框输入'隐私'
      await agent.aiTap("系统");
      await device.pressKey("shift+space");
      await device.typeText("隐私");

      //检查下拉列表中有 系统-辅助信息 --> 隐私政策 模块选项
      await agent.aiAssert("系统/隐私政策");

      //步骤 9：点击下拉列表中任一 系统-辅助信息 --> 隐私政策 模块选项
      await new Promise(resolve => setTimeout(resolve, 1000));          //等待1s
      await device.pressKey("Enter");

      //检查正常跳转到 控制中心-系统-辅助信息-隐私政策页面
      await agent.aiAssert("页面左上角导航栏显示：系统/隐私政策");
        
    }, { timeout: 600000, tags: ["1504371","level3"] });
  
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