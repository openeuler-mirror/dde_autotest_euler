/**
 * 用例 PMSID: 1835663
 * 用例标题: 【控制中心】【电源管理】【通用】首次设置定时关机重复次数为自定义，取消自定义设置，恢复上一次重复次数
 * 生成时间: 2026-2-9 14:11:10
 * 用例编写人:UT000511(肖海燕)
 */

describe('1835663-【控制中心】【电源管理】【通用】首次设置定时关机重复次数为自定义，取消自定义设置，恢复上一次重复次数', () => {
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
  
    test('1835663-【控制中心】【电源管理】【通用】首次设置定时关机重复次数为自定义，取消自定义设置，恢复上一次重复次数', async ({ device, agent, uos }) => {
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
      await agent.aiWaitFor('弹出自定义重复时间窗口');

      //检查点击取消按钮，定时关机中重复次数为一次
      await agent.aiTap('点击取消按钮');
      await agent.aiAssert('定时关机中重复次数为一次');

      //检查点击右上角的"X"，定时关机中重复次数为一次
      await agent.aiTap('重复菜单下拉箭头');
      await agent.aiTap('自定义');
      await agent.aiTap('自定义重复时间弹窗中，点击右上角的"X"');
      await agent.aiAssert('重复菜单右侧显示为一次');    
      
    }, { timeout: 600000, tags: ["1835663","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      //恢复默认值
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power customShutdownWeekDays -v '[]'");
      await agent.aiTap('重复菜单下拉箭头');
      await agent.aiTap('一次');
      await agent.aiTap('定时关机的开关按钮');
      await agent.aiAssert('定时关机的开关状态为关闭');
      await uos.closeCurrentWindow();
    });
  });