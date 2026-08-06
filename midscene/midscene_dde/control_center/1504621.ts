/**
 * 用例 PMSID: 1504621
 * 用例标题: 控制中心】【系统】【用户体验计划】中文环境下，用户体验计划隐私政策链接点击支持跳转网页
 * 生成时间: 2026-01-27 10:30:27
 * 用例编写人:UT000511(肖海燕)
 */

describe('1504621-控制中心】【系统】【用户体验计划】中文环境下，用户体验计划隐私政策链接点击支持跳转网页', () => {
    beforeAll(async ({ device, uos, agent, system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      //关闭浏览器
      system.exec('killall browser');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1504621-控制中心】【系统】【用户体验计划】中文环境下，用户体验计划隐私政策链接点击支持跳转网页', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      // 步骤 2: 点击系统-用户体验计划
      await agent.aiTap("系统");
      await agent.aiTap("用户体验计划");
      
      // 检查：界面显示系统/用户体验计划显示
      await agent.aiAssert("显示系统/用户体验计划");

      // 步骤 3: 点击隐私政策链接，正常打开默认浏览器跳转到其链接页面，显示相关隐私政策的协议文案
      await agent.aiTap('用户体验计划文本描述中以www开头的链接');
      await agent.aiWaitFor("浏览器打开成功");
      await agent.aiAssert("打开默认浏览器跳转到其链接页面，显示相关隐私政策的协议文案");
      
    }, { timeout: 600000, tags: ["1504621","level3"] });
  
    afterEach(async ({ agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      //关闭浏览器、控制中心
      system.exec('killall browser');
      await uos.closeCurrentWindow();
    });
  });
  





