/**
 * 用例 PMSID: 1835669
 * 用例标题: 【控制中心】【电源管理】【通用】设置定时关机重复次数为自定义，修改自定义重复时间，可以被保存
 * 生成时间: 2026-2-9 15:11:10
 * 用例编写人:UT000511(肖海燕)
 */

describe('1835669-【控制中心】【电源管理】【通用】设置定时关机重复次数为自定义，修改自定义重复时间，可以被保存', () => {
    beforeAll(async ({ device, uos, agent, system}) => {
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
  
    test('1835669-【控制中心】【电源管理】【通用】设置定时关机重复次数为自定义，修改自定义重复时间，可以被保存', async ({ device, agent, uos }) => {
      //步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      //步骤 2: 点击电源管理-通用
      await agent.aiTap("电源管理");
      await agent.aiTap("通用");

      //步骤 3: 打开定时关机开关
      await agent.aiTap("定时关机开关");
      await agent.aiAssert("定时关机开关为打开状态");

      //步骤 4: 点击下拉菜单选择自定义
      await agent.aiTap('重复菜单下拉箭头');
      await agent.aiWaitFor('下拉菜单显示正常');
      await agent.aiTap('自定义');
      await agent.aiAssert('弹出自定义重复时间窗口');

      //步骤 5: 选中星期六，点击保存按钮，检查重复设置项下方显示重复时间：星期一至星期六
      await agent.aiTap('星期六后面的复选菜单');
      await agent.aiAssert('星期六后面的复选菜单为打钩选中状态');
      await agent.aiTap('点击保存');
      await agent.aiAssert('重复设置项下方显示重复时间星期一至星期六');

    }, { timeout: 600000, tags: ["1835669","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power customShutdownWeekDays -v '[]'");
      await agent.aiTap('重复菜单下拉箭头');
      await agent.aiTap('一次');
      await agent.aiAssert('重复菜单后面显示一次');
      await agent.aiTap('定时关机的开关按钮');
      await agent.aiAssert('定时关机的开关状态为关闭');
      await uos.closeCurrentWindow();
    });
  });