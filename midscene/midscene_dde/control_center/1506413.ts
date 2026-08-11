/**
 * 用例 PMSID: 1506413
 * 用例标题: 【控制中心】【电源管理】【通用】通用界面性能模式显示检查 
 * 生成时间: 2025-12-11 20:13:01
 * 用例编写人:UT000511(肖海燕)
 */

describe('1506413-【控制中心】【电源管理】【通用】通用界面性能模式显示检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506413-【控制中心】【电源管理】【通用】通用界面性能模式显示检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心 
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      // 步骤 2: 点击电源管理
      await agent.aiTap("点击电源管理");
      await agent.aiWaitFor("电源管理被选中");
      await agent.aiAssert("界面存在通用和使用电源两个选项");
      
      // 步骤 3: 点击通用
      await agent.aiTap("点击通用");
      await agent.aiWaitFor("通用详情界面已显示");
      
      // 检查： 界面显示正常
      await agent.aiAssert("导航栏显示为：电源管理 / 通用");
      await agent.aiAssert("通用界面依次显示设置项：性能模式，节能设置，唤醒设置，关机设置");
      await agent.aiAssert("性能模式中存在选项：高性能模式，文案：性能优先，会显著提升功耗和发热");
      await agent.aiAssert("性能模式中存在选项：平衡模式，文案：兼顾性能和续航，根据使用情况自动调节");
      await agent.aiAssert("性能模式中存在选项：节能模式，文案：续航优先，系统会牺牲一些性能表现来降低功耗");
      
    }, { timeout: 1200000, tags: ["1506413","level1","smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  