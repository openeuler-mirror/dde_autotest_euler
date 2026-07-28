/**
 * 用例 PMSID: 1502425
 * 用例标题: 【控制中心】【电源管理】【通用】开关定时关机开关 
 * 生成时间: 2025-12-11 20:14:01
 * 用例编写人:UT000511(肖海燕)
 */

describe('1502425-【控制中心】【电源管理】【通用】开关定时关机开关', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      //定时关机默认值为关闭
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power scheduledShutdownState -v false");
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1502425-【控制中心】【电源管理】【通用】开关定时关机开关', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp('控制中心', { maximizeWindow: true });
  
      // 步骤 2: 点击电源管理
      await agent.aiTap("电源管理");

      // 步骤 3: 点击通用
      await agent.aiTap("通用");

      // 步骤 4: 点击定时关机按钮
      await agent.aiTap("点击定时关机文案后面灰色开关按钮");
      await agent.aiWaitFor('定时关机后面的开关按钮显示为蓝色高亮')

      // 检查: 定时关机下方显示：时间，重复
      await agent.aiAssert("定时关机下方显示：时间，重复");

      // 步骤 5: 再次点击定时关机按钮
      await agent.aiTap("再次点击定时关机文案后面的开关按钮");

      // 检查: 定时关机开关关闭，时间，重复隐藏
      await agent.aiAssert("定时关机下方不显示：时间，重复");
       
    }, { timeout: 1200000, tags: ["1502425","level2","smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      //恢复默认窗口大小(控制中心)
      await device.pressKey("super", "Down");
      await uos.closeCurrentWindow();
    });
  });
  
