/**
 * 用例 PMSID: 1810371
 * 用例标题:【重复打开文件夹】在桌面打开文件管理器，再通过任务栏打开文件管理器，文件管理器窗口显示一个且置顶
 * 生成时间: 2026-2-12 10:55:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1810371-【重复打开文件夹】在桌面打开文件管理器，再通过任务栏打开文件管理器，文件管理器窗口显示一个且置顶', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
       // 初始化文管配置和进程
      await system.cleanupFileManager();
      console.log('文件管理器已初始化');

      // 前置条件
      await uos.openLauncher();
      await uos.searchInLauncher('文件管理器');
      await agent.aiRightClick('启动器中搜索出来的“文件管理器“图标')
      await agent.aiTap('右键弹框中的“发送到桌面”');
      await agent.aiTap('任务栏左边第一个图标“启动器”图标');
      console.log('文件管理器已发送到桌面');
    });
  
    test('1810371-【重复打开文件夹】在桌面打开文件管理器，再通过任务栏打开文件管理器，文件管理器窗口显示一个且置顶', async ({ device, agent, uos, system, env }) => {  
      // 步骤1：在桌面双击打开文件管理器--结果：打开文件管理器
      await agent.aiDoubleClick('桌面上“文件管理器”图标');
      await agent.aiAssert('文件管理器窗口打开');
      console.log('文件管理器窗口打开');

      // 步骤2：在任务栏上鼠标右键打开文件管理器--结果：文件管理器窗口显示置顶
      await agent.aiRightClick('任务栏左侧的“文件管理器”图标');
      await agent.aiAssert('右键弹框中存在“文件管理器”字段');
      await agent.aiTap('右键菜单中的“文件管理器”');
      await agent.aiAssert('新打开的文件管理器窗口显示置顶');
      console.log('文件管理器窗口显示置顶');

    }, { timeout: 1200000, tags: ["1810371", "level3", "window_operation", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system, uos}) => {
      console.log('4. afterEach: 每个测试后的清理');
      // 将文件管理器从桌面移除
      await uos.openLauncher();
      await uos.searchInLauncher('文件管理器');
      await agent.aiRightClick('启动器中搜索出来的“文件管理器“图标')
      await agent.aiTap('右键弹框中的“从桌面上移除”');
      await agent.aiTap('任务栏左边第一个图标“启动器”图标');
      console.log('文件管理器从桌面上移除');
      
      // 初始化文管配置和进程
      await system.cleanupFileManager();
      console.log('文件管理器已初始化');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
