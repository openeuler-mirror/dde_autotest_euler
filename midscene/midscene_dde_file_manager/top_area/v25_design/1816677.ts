/**
 * 用例 PMSID: 1816677
 * 用例标题:  搜索框-点击激活并搜索
 * 生成时间: 2026-2-5 17:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816677- 搜索框-点击激活并搜索', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

       // 初始化文管配置和进程
      await system.cleanupFileManager();

      // 打开文件管理器窗口
      await uos.openApp('文件管理器', { maximizeWindow: true });
    });
  
    test('1816677- 搜索框-点击激活并搜索', async ({ device, agent, uos, system, env }) => {  
      // 步骤1：单击搜索框--结果：激活搜索框，搜索框左侧显示高级筛选按钮
      await agent.aiTap('文件管理器右上角的放大镜图标');
      await agent.aiAssert('搜索框右侧显示高级筛选按钮');

      // 步骤2：单击高级筛选按钮--结果：显示筛选栏
      await agent.aiTap('文件管理器右上角搜索框右边的高级筛选按钮');
      await agent.aiAssert('文件管理器窗口新增搜索栏');

      // 步骤3：输入本地没有的文件名，按enter键触发搜索--结果：无搜索结果
      await agent.aiTap('文件管理器右上角的放大镜图标');
      await device.typeText('abc1816677abc');
      await device.pressKey('Enter', 20000);
      await agent.aiWaitFor('无搜索结果');
      await agent.aiAssert('无搜索结果');

    }, { timeout: 1200000, tags: ["1816677", "level2", "v25_design", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
