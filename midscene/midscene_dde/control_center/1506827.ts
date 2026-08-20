/**
 * 用例 PMSID: 1506827
 * 用例标题: 【控制中心】【电源管理】【使用电源】笔记本合盖时设置项检查
 * 生成时间: 2025-12-17 14:53:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1506827-【控制中心】【电源管理】【使用电源】笔记本合盖时设置项检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506827-【控制中心】【电源管理】【使用电源】笔记本合盖时设置项检查 ', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心且最大化控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击控制中心-电源管理-使用电源-点击笔记本合盖时设置项
      await agent.aiTap("电源管理", { deepThink: true });
      await agent.aiTap("使用电源", { deepThink: true });
      await agent.aiTap("点击笔记本合盖时右侧的﹀", { deepThink: true });
    
      //检查: 笔记本合盖时设置项展示
      await agent.aiAssert("设置项中包含：待机、休眠、关闭显示器、无任何操作");

    }, { timeout: 1200000, tags: ["1506827", "level2", "smoke", "laptop"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });