/**
 * 用例 PMSID: 1805049
 * 用例标题: 顶部右键-最小化_
 * 生成时间: 2026-3-4 15:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1805049- 顶部右键-最小化_', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

       // 初始化文管配置和进程
      await system.cleanupFileManager();

    });
  
    test('1805049- 顶部右键-最小化_', async ({ device, agent, uos, system, env }) => {  
      // 步骤1：打开文件管理器窗口
      await uos.openApp('文件管理器', { maximizeWindow: true });

      // 步骤2：在顶部工作栏点击最小化按钮——--结果：窗口最小化，窗口不可见
      await agent.aiTap('文件管理器窗口右上角的第一行第2个图标“一”');
      await agent.aiAssert('文件管理器窗口最小化成功');

      // 步骤3：再次启动文件管理器--结果：显示窗口
      await agent.aiTap('任务栏的文件管理器图标');
      await agent.aiAssert('文件管理器窗口成功打开');

      // 步骤4：手动调整窗口大小之后点击最小化--结果：窗口最小化，窗口不可见
      await agent.aiTap('文件管理器窗口右上角的第一行第3个图');
      await agent.aiAssert('文件管理器窗口大小改变');
      await agent.aiTap('文件管理器窗口右上角的第一行第2个图标“一”');
      await agent.aiAssert('文件管理器窗口最小化成功');

      // 步骤5：再次启动文件管理器-结果：显示窗口，大小为修改后的大小
      await agent.aiTap('任务栏的文件管理器图标');
      await agent.aiAssert('文件管理器窗口成功打开');
      await agent.aiAssert('文件管理器窗口大小为非最大化窗口');

    }, { timeout: 600000, tags: ["1805049", "level3", "top_right", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
