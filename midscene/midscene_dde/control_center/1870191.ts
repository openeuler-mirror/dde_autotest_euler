/**
 * 用例 PMSID: 1870191
 * 用例标题: 【控制中心】【系统】【显示】单屏模式下，检查刷新率 
 * 生成时间: 2025-12-19 13：55：11
 * 用例编写人:UT000511(肖海燕)
 */

describe('1870191-【控制中心】【系统】【显示】单屏模式下，检查刷新率 ', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1870191-【控制中心】【系统】【显示】单屏模式下，检查刷新率 ', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp('控制中心', { maximizeWindow: true });
  
      // 步骤 2: 点击系统
      await agent.aiTap("系统");

      // 步骤 3: 点击显示
      await agent.aiTap("显示");

      //检查刷新率
      await agent.aiAssert("显示推荐的刷新率");

      // 步骤 4: 点击刷新率下拉菜单
      await agent.aiTap("刷新率下拉菜单");

      //检查下拉菜单
      await agent.aiAssert("显示支持的刷新率");
       
    }, { timeout: 1200000, tags: ["1870191","level2","smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  