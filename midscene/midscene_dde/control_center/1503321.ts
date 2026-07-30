/**
 * 用例 PMSID: 1503321
 * 用例标题: 【控制中心】【电源管理】【通用】定时关机搜索功能检查
 * 生成时间: 2026-2-10 14:30:10
 * 用例编写人:UT000511(肖海燕)
 */

describe('1503321-【控制中心】【电源管理】【通用】定时关机搜索功能检查', () => {
    beforeAll(async ({ device, uos, agent, system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1503321-【控制中心】【电源管理】【通用】定时关机搜索功能检查', async ({ device, agent, uos }) => {
      //步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      //步骤 2: 点击搜索框，搜索框中输入定时关机
      await agent.aiTap("点击搜索框");
      await device.typeText("定时关机");
      await agent.aiAssert("显示电源管理/通用/定时关机")

      //步骤 3: 点击定时关机相关搜索结果
      await agent.aiTap("点击电源管理/通用/定时关机");

      //检查跳转至控制中心-电源管理-通用界面，界面显示关机设置
      await agent.aiAssert("跳转至控制中心-电源管理-通用界面，界面显示关机设置");
      await agent.aiTap("系统");

      //步骤 4: 打开快捷键shift+space
      await device.pressKey("Shift", "Space");
      await device.typeText("定时关机");
      await agent.aiWaitFor("显示电源管理/通用/定时关机");

      //步骤 5: 点击定时关机相关搜索结果
      await new Promise(resolve => setTimeout(resolve, 1000))
      await agent.aiTap("点击最佳匹配文案下方蓝色高亮‘电源管理/通用/定时关机’处");
      //await device.pressKey("Enter");

      //检查跳转至控制中心-电源管理-通用界面
      await agent.aiAssert("跳转至控制中心-电源管理-通用界面");
      
    }, { timeout: 600000, tags: ["1503321","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });