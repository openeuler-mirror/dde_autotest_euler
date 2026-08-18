/**
 * 用例 PMSID: 1506577
 * 用例标题:【控制中心】【电源管理】【通用】通用界面，节能设置中节能模式时降低屏幕亮度默认值检查
 * 生成时间: 2025-12-17 15:28:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1506577-【控制中心】【电源管理】【通用】通用界面，节能设置中节能模式时降低屏幕亮度默认值检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506577-【控制中心】【电源管理】【通用】通用界面，节能设置中节能模式时降低屏幕亮度默认值检查 ', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心且最大化控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击控制中心-电源管理-通用
      await agent.aiTap("电源管理", { deepThink: true });
      await agent.aiTap("通用", { deepThink: true });
    
      //检查: 检查节能设置中节能模式时降低屏幕亮度默认值
      await agent.aiAssert("节能设置下包含: 节能模式时降低屏幕亮度设置值依次为: 10%,20%,30%,40%; 默认选中20%");

    }, { timeout: 1200000, tags: ["1506577", "level1", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });