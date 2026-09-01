/**
 * 用例 PMSID: 1787165
 * 用例标题: 【控制中心】【系统】【时间和日期】删除时区
 * 生成时间: 2026-05-07 14:00:00
 * 用例编写人:UT001707(陈慧)
 */

describe('1787165-【控制中心】【系统】【时间和日期】删除时区', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1787165-【控制中心】【系统】【时间和日期】删除时区', async ({ device, agent, uos,env }) => {
      // 步骤 1: 打开控制中心-系统-时间和日期
      await uos.openApp("控制中心");
      await agent.aiTap("系统");
      await agent.aiTap("时间和日期");

      // 检查: 出现系统/时间和日期页面
      await agent.aiAssert("出现系统/时间和日期页面");

      // 步骤 2: 点击系统时期右侧的下拉框
      await agent.aiTap("系统时区右侧的下拉框按钮");

      // 检查: 出现系统时区下拉框
      await agent.aiWaitFor('系统时区窗口弹出');
      await agent.aiAssert("显示系统时区列表，当前时区被勾选");

      // 步骤 3: 在系统时区下拉框中点击任意时区，鉴权通过后，检查系统时区显示
      await agent.aiTap('成都');
      await agent.aiTap('密码输入框')
      await device.typeText(env.testPassword);
      await device.pressKey("Enter");

      // 检查: 系统时区已显示为成都
      // 检查: 时区列表下方有原系统时区：北京
      await agent.aiAssert("系统时区已被修改为成都") 
      await agent.aiAssert("时区列表下方有:北京");
  
    }, { timeout: 1200000,
         tags: ['1787165','level2','smoke'] });

    afterEach(async ({ agent, device, system}) => {
      console.log('4. afterEach: 每个测试后的清理');
      //修改系统时区为北京
      await agent.aiTap("系统时区右侧的下拉框按钮");
      await agent.aiTap("搜索框");
      await device.typeText("北京");
      await device.pressKey("Enter");
      //删除时区列表下方：成都
      await agent.aiHover('时区列表下方时区区域');
      await agent.aiTap("时区区域后面的垃圾桶图标", { deepThink: true });
    });

    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });