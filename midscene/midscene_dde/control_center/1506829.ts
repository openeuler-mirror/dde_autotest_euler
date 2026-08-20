/**
 * 用例 PMSID: 1506829
 * 用例标题: 【控制中心】【电源管理】【使用电池】笔记本合盖时设置项检查 
 * 生成时间: 2025-12-11 15:10:26
 * 用例编写人:UT000511(肖海燕)
 */

describe('1506829-【控制中心】【电源管理】【使用电池】笔记本合盖时设置项检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506829-【控制中心】【电源管理】【使用电池】笔记本合盖时设置项检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp('控制中心', { maximizeWindow: true });
  
      // 步骤 2: 点击电源管理
      await agent.aiTap("电源管理");

      // 步骤 3: 点击使用电池
      await agent.aiTap("使用电池");

      // 步骤 4: 点击笔记本合盖时设置项
      await agent.aiTap("笔记本合盖时设置项后面下拉箭头菜单");

      //检查：设置项中包含：待机、休眠、关闭显示器、无任何操作
      await agent.aiAssert("设置项中包含：待机、休眠、关闭显示器、无任何操作");
  
    }, { timeout: 1200000, tags: ["1506829","level2","smoke","laptop"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  