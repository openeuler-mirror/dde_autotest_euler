/**
 * 用例 PMSID: 1787169
 * 用例标题:  【控制中心】【系统】【时间和日期】编辑时区列表
 * 生成时间: 2025-12-17
 * 用例编写人:UT005571(王艺桥)
 */

describe('1787169-【控制中心】【系统】【时间和日期】编辑时区列表 ', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1787169-【控制中心】【系统】【时间和日期】编辑时区列表 ', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心-系统-时间和日期
      await uos.openApp("控制中心");
      await agent.aiTap("系统");
      await agent.aiTap("时间和日期");

      // 检查: 出现系统/时间和日期页面
      await agent.aiAssert("出现系统/时间和日期页面");

      // 步骤 2: 添加多个时区：安道尔，迪拜
      await agent.aiTap("时区列表后面的：添加按钮");
      await agent.aiWaitFor('弹出窗口');
      await agent.aiTap("安道尔");
      await agent.aiAssert("安道尔在时区列表下方");
      await agent.aiTap("时区列表后面的：添加按钮");
      await agent.aiWaitFor('弹出窗口');
      await agent.aiTap("迪拜");
      await agent.aiAssert("迪拜添在安道尔时区下方");

      // 检查: 时区列表下方有刚才添加的时区：安道尔，迪拜
      await agent.aiAssert("时区列表下方有:安道尔，迪拜两个时区");

      // 步骤 3: 鼠标hover显示垃圾桶图标
      await agent.aiHover('安道尔时区区域');

      // 检查: 鼠标hover后有垃圾桶图标
      await agent.aiAssert("安道尔列表后显示垃圾桶图标");

      // 步骤 4: 删除所有时区
      await agent.aiHover('迪拜时区区域');
      await agent.aiTap("迪拜后面垃圾桶图标", { deepThink: true });
      await agent.aiWaitFor('时区列表下方无迪拜时区');
      await agent.aiHover('时区列表下方安道尔区域');
      await agent.aiTap("安道尔后面垃圾桶图标", { deepThink: true });
      await agent.aiWaitFor('时区列表下方无安道尔时区');

      // 检查：时区删除成功，列表下方无时区数据
      await agent.aiAssert("时区列表下方无数据");

    }, { timeout: 1200000,
         tags: ['1787169','level2','smoke'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  