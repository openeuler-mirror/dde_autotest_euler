/**
 * 用例 PMSID: 1835671
 * 用例标题: 【控制中心】【电源管理】【通用】已保存自定义重复时间，可再次修改自定义重复时间
 * 生成时间: 2026-2-10 13:11:10
 * 用例编写人:UT000511(肖海燕)
 */

describe('1835671-【控制中心】【电源管理】【通用】已保存自定义重复时间，可再次修改自定义重复时间', () => {
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
  
    test('1835671-【控制中心】【电源管理】【通用】已保存自定义重复时间，可再次修改自定义重复时间', async ({ device, agent, uos }) => {
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

      //步骤 5: 设置重复时间为：星期一，星期二
      await agent.aiTap('去掉星期三后面的勾选按钮');
      await agent.aiTap('去掉星期四后面的勾选按钮');
      await agent.aiTap('去掉星期五后面的勾选按钮');
      await agent.aiTap('点击保存');
      await agent.aiAssert('重复设置项下方显示重复时间星期一，星期二');

      //步骤 6: 设置重复时间为：星期一，星期二，星期三
       await agent.aiTap('点击星期一，星期二后面的编辑按钮');
       await agent.aiWaitFor('弹出自定义重复时间窗口');
       await agent.aiTap('点击星期三后面的复选框');
       await agent.aiAssert('星期三后面的选框为蓝色高亮，选中状态');
       await agent.aiTap('点击保存');

       //检查重复设置项下方显示重复时间星期一，星期二，星期三
       await agent.aiAssert('重复设置项下方显示重复时间星期一，星期二，星期三');

    }, { timeout: 600000, tags: ["1835671","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      //恢复默认设置
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power customShutdownWeekDays -v '[]'");
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power shutdownRepetition -v 0");
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power scheduledShutdownState -v false");
      await uos.closeCurrentWindow();
    });
  });