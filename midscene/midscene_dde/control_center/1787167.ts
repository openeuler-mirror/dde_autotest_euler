/**
 * 用例 PMSID: 1787167
 * 用例标题: 【控制中心】【系统】【时间和日期】添加时区
 * 生成时间: 2025-12-18
 * 用例编写人:UT005571(王艺桥)
 */

describe('1787167-【控制中心】【系统】【时间和日期】添加时区 ', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1787167-【控制中心】【系统】【时间和日期】添加时区 ', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心-系统-时间和日期
      await uos.openApp("控制中心");
      await agent.aiTap("系统");
      await agent.aiTap("时间和日期");

      // 检查: 出现系统/时间和日期页面
      await agent.aiAssert("出现系统/时间和日期页面");

      // 步骤 2: 点击时区列表后面的添加按钮
      await agent.aiTap("时区列表后面的添加按钮");

      // 等待添加时区窗口弹出
      await agent.aiWaitFor('添加时区窗口弹出');

      // 步骤 3: 点击搜索框下方任意时区
      await agent.aiTap("搜索框下方时区区域");

      // 检查: 无需授权，此时区直接被添加到时区列表下方
      await agent.aiAssert("未出现授权弹窗，该时区直接被添加到时区列表下方");
  
    }, { timeout: 1200000,
         tags: ['1787167','level2','smoke'] });
  
    afterEach(async ({ agent,device }) => {
      console.log('4. afterEach: 每个测试后的清理');
      await agent.aiHover('时区列表下方时区区域');
      await agent.aiTap("时区区域后面垃圾桶图标", { deepThink: true });
      await agent.aiAssert("时区列表下方无时区数据");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  