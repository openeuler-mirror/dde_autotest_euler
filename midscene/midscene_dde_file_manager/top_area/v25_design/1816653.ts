/**
 * 用例 PMSID: 1816653
 * 用例标题: 顶部区域布局改版
 * 生成时间: 2026-2-5 17:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1816653-顶部区域布局改版', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

       // 初始化文管配置和进程
      await system.cleanupFileManager();

    });
  
    test('1816653-顶部区域布局改版', async ({ device, agent, uos, system, env }) => {  
      // 步骤1：打开文件管理器窗口
      await uos.openApp('文件管理器', { maximizeWindow: true });

      // 步骤2：检查左侧区域--结果：侧边栏通顶
      await agent.aiAssert('文件管理器的左侧边栏顶部与窗口顶部对齐');

      // 步骤3：右侧区域--结果：上方为标题栏，下方为工作区
      await agent.aiAssert('文件管理器的右侧区域，上方为标题栏，下方为工作区');

    }, { timeout: 1200000, tags: ["1816653", "level2", "v25_design", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
