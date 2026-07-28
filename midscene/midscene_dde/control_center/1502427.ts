/**
 * 用例 PMSID: 1502427
 * 用例标题: 【控制中心】【电源管理】【通用】开启定时关机，时间设置项默认值检查
 * 生成时间: 2026-2-2 14:55:10
 * 用例编写人:UT000511(肖海燕)
 */

describe('1502427-【控制中心】【电源管理】【通用】开启定时关机，时间设置项默认值检查', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
      //重复次数自定义为首次设置，重复次数为一次，开关为关闭
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power customShutdownWeekDays -v '[]'");
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power shutdownRepetition -v 0");
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power scheduledShutdownState -v false");
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1502427-【控制中心】【电源管理】【通用】开启定时关机，时间设置项默认值检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      // 步骤 2: 点击电源管理-通用
      await agent.aiTap("电源管理");
      await agent.aiTap("通用");

      // 步骤 3: 打开定时开关，检查默认时间值显示
      await agent.aiTap('定时关机的开关按钮');
      await agent.aiAssert('时间对应默认显示为19:00');

    }, { timeout: 600000, tags: ["1502427","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap('定时关机的开关按钮');
      await uos.closeCurrentWindow();
    });
  });
  
