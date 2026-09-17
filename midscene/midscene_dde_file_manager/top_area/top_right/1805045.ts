/**
 * 用例 PMSID: 1805045
 * 用例标题:  顶部菜单“关闭”_
 * 生成时间: 2026-3-3 15:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1805045-顶部区域布局改版', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

       // 初始化文管配置和进程
      await system.cleanupFileManager();

    });
  
    test('1805045-顶部区域布局改版', async ({ device, agent, uos, system, env }) => {  
      // 步骤1：打开文件管理器窗口
      await uos.openApp('文件管理器', { maximizeWindow: true });

      // 步骤2：打开文件管理器，在顶部工作栏点击关闭按钮X--结果：窗口被关闭
      await agent.aiTap('文件管理器窗口右上角的X');
      await agent.aiAssert('文件管理器窗口被关闭');

      // 步骤3：调整窗口大小或进行目录管理后点击关闭按钮X--结果：窗口被关闭，再次启动的话是新窗口。无之前的浏览记录
      await uos.openApp('文件管理器', { maximizeWindow: true });
      await agent.aiTap('文件管理器左侧边栏的音乐');
      await agent.aiTap('文件管理器窗口右上角的X');
      await agent.aiAssert('文件管理器窗口被关闭');
      await uos.openApp('文件管理器', { maximizeWindow: true });
      await agent.aiAssert('文件管理器窗口右侧文件区域有“系统盘”和“数据盘”');

    }, { timeout: 1200000, tags: ["1805045", "level3", "top_right", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
