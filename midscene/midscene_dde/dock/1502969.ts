/**
 * 用例 PMSID: 1502969
 * 用例标题:【任务栏】【快捷面板】【亮度】通过快捷面板的亮度面板跳转至“控制中心-显示”二级菜单
 * 生成时间: 2025-12-16 16:44:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1502969-【任务栏】【快捷面板】【亮度】通过快捷面板的亮度面板跳转至“控制中心-显示”二级菜单', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1502969-【任务栏】【快捷面板】【亮度】通过快捷面板的亮度面板跳转至“控制中心-显示”二级菜单', async ({ device, agent, uos }) => {
      // 步骤 1: 打开快捷设置面板
      await agent.aiTap("任务栏右下角声音图标", { deepThink: true });
      await agent.aiWaitFor("快捷设置面板已显示");

      // 步骤 2: 打开亮度面板
      await agent.aiTap("UOS系统控制中心快捷面板内，亮度调节条右端的笔记本形状功能按钮", { deepThink: true });
      await agent.aiWaitFor("亮度面板已显示");

      // 步骤 3: 跳转到控制中心显示二级菜单
      await agent.aiTap("显示设置", { deepThink: true });
      await agent.aiWaitFor("系统 / 显示");

      //检查: 显示模块展示
      await agent.aiAssert("显示和布局，亮度，分辨率，刷新率，方向，缩放，护眼模式，开启护眼模式");
  
    }, { timeout: 1200000, tags: ["1502969", "level2", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });