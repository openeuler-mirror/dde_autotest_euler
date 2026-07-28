/**
 * 用例 PMSID: 1502429
 * 用例标题: 【控制中心】【电源管理】【通用】开启定时关机，重复设置项默认值检查
 * 生成时间: 2026-1-30 15:32:10
 * 用例编写人:UT000511(肖海燕)
 */

describe('1502429-【控制中心】【电源管理】【通用】开启定时关机，重复设置项默认值检查', () => {
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
  
    test('1502429-【控制中心】【电源管理】【通用】开启定时关机，重复设置项默认值检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      // 步骤 2: 点击电源管理-通用
      await agent.aiTap("电源管理");
      await agent.aiTap("通用");

      //步骤 3: 打开定时关机开关
      await agent.aiTap('定时关机的开关按钮');
      await agent.aiAssert('重复菜单最右端显示为“一次”');

      //步骤 3: 下拉菜单选择每天，检查默认选项显示
      await agent.aiTap('重复菜单下拉箭头');
      await agent.aiAssert('下拉框内容从上到下显示为一次，每天，工作日，自定义');

    }, { timeout: 600000, tags: ["1502429","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap('定时关机的开关按钮');
      await agent.aiAssert('定时关机的开关状态为关闭');
      await uos.closeCurrentWindow();
    });
  });
