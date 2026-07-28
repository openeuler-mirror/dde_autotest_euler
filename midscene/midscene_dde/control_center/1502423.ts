/**
 * 用例 PMSID: 1502423
 * 用例标题: 【控制中心】【电源管理】【通用】关机设置中设置项默认状态检查 
 * 生成时间: 2025-12-11 20:14:01
 * 用例编写人:UT000511(肖海燕)
 */

describe('1502423-【控制中心】【电源管理】【通用】关机设置中设置项默认状态检查', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
      //定时关机默认值为关闭
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power scheduledShutdownState -v false");      
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1502423-【控制中心】【电源管理】【通用】关机设置中设置项默认状态检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp('控制中心', { maximizeWindow: true });
  
      // 步骤 2: 点击电源管理
      await agent.aiTap("电源管理");

      // 步骤 3: 点击通用
      await agent.aiTap("通用");

      //检查：导航栏显示：电源管理 / 通用，定时关机开关默认为关闭状态
      await agent.aiAssert("导航栏显示：电源管理 / 通用");
      await agent.aiAssert("唤醒设置模块下方存在：关机设置");
      await agent.aiAssert("关机设置模块下方包含设置项：定时关机");
      await agent.aiAssert("定时关机开关默认为关闭状态");
  
    }, { timeout: 1200000, tags: ["1502423","level2","smoke"] });
  
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
  
