/**
 * 用例 PMSID: 1835673
 * 用例标题: 【控制中心】【电源管理】【通用】修改一周首日为星期四，检查自定义重复时间弹窗中重复时间排序
 * 生成时间: 2026-2-2 16:07:10
 * 用例编写人:UT000511(肖海燕)
 */

describe('1835673-【控制中心】【电源管理】【通用】修改一周首日为星期四，检查自定义重复时间弹窗中重复时间排序', () => {
    beforeAll(async ({ device, uos, agent, system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      //显示桌面
      await uos.showDesktop();
     
      //重复次数自定义为首次设置，重复次数为一次，开关为关闭
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power customShutdownWeekDays -v '[]'");
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power shutdownRepetition -v 0");
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power scheduledShutdownState -v false");

    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1835673-【控制中心】【电源管理】【通用】修改一周首日为星期四，检查自定义重复时间弹窗中重复时间排序', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心并最大化，修改一周首日为星期四
      await uos.openApp('控制中心', { maximizeWindow: true });
      await agent.aiTap("系统");
      await agent.aiTap("语言和区域");
      await agent.aiTap("一周首日菜单后面的下拉框");
      await agent.aiWaitFor('下拉菜单显示正常');
      await agent.aiTap('星期四');
      await agent.aiAssert("一周首日菜单右侧显示星期四");
      
      // 步骤 2: 点击电源管理-通用
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
      await agent.aiTap('星期三后面的框去勾选');
      await agent.aiTap('星期四后面的框去勾选');
      await agent.aiTap('星期五后面的框去勾选');
      await agent.aiTap('点击保存');
       await agent.aiAssert('重复菜单右下方显示：星期一，星期二');
      
      //步骤 5: 点击重复菜单右下方的编辑按钮，检查界面按序从上到下显示：星期四，星期五，星期六，星期日，星期一，星期二，星期三
      await agent.aiTap('点击重复菜单右下方的编辑按钮');
      await agent.aiWaitFor('弹出自定义重复时间窗口');
      await agent.aiAssert('界面按序从上到下显示：星期四，星期五，星期六，星期日，星期一，星期二，星期三');
       await agent.aiTap('点击保存按钮');

    }, { timeout: 600000, tags: ["1835673","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      //恢复一周首日为周一
      await agent.aiTap("系统");
      await agent.aiTap("语言和区域");
      await agent.aiTap("一周首日菜单后面的下拉框");
      await agent.aiWaitFor('下拉菜单显示正常');
      await agent.aiTap('星期一');
      await agent.aiAssert("一周首日菜单右侧显示星期一");
      //恢复定时关机默认值
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power customShutdownWeekDays -v '[]'");
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power shutdownRepetition -v 0");
      await system.exec("dde-dconfig set org.deepin.dde.daemon -r org.deepin.dde.daemon.power scheduledShutdownState -v false");       
      //恢复默认窗口大小(控制中心)
      await device.pressKey("super", "Down");
      await uos.closeCurrentWindow();
    });
  });