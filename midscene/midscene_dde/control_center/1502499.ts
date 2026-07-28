/**
 * 用例 PMSID: 1502499
 * 用例标题: 【控制中心】【系统】【辅助信息】1070版本，关于本机三级页面，在[版本授权]字段下方新增[系统安装日期]字段
 * 生成时间: 2025-12-16 16:00:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1502499-【控制中心】【系统】【辅助信息】1070版本, 关于本机三级页面, 在[版本授权]字段下方新增[系统安装日期]字段', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1502499-【控制中心】【系统】【辅助信息】1070版本, 关于本机三级页面, 在[版本授权]字段下方新增[系统安装日期]字段', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心且最大化控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击关于本机
      await agent.aiTap("关于本机", { deepThink: true });
      await agent.aiAssert("导航栏显示：系统 / 关于本机");

      //检查: 系统安装日期字段位置及格式展示
      await agent.aiAssert("版本授权字段下方展示系统安装日期字段，字段为yyyy/mm/dd格式");
  
    }, { timeout: 1200000, tags: ["1502499", "level2", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });