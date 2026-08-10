/**
 * 用例 PMSID: 1805955
 * 用例标题: 【文件管理器】【新标签页】文件管理器新标签页功能测试
 * 生成时间: 2025-12-12 16:28:00
 * 用例编写人: UT000211
 */


describe('1805955-【计算机】我的目录-双击打开目录', () => { 
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.openApp('文件管理器',2000,100000);
    });
    
	// 用例级别前置条件钩子
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      // 清理状态、重置数据等
    });
  

    test('1805955-【计算机】我的目录-双击打开目录', async ({ device, agent, uos }) => {
      //  打开桌面目录，打开视频目录，打开音乐目录，打开图片目录，打开文档目录，打开下载目录
      await agent.aiDoubleClick('左侧导航栏的桌面目录');
      await agent.aiAssert('跳转桌面目录，侧边栏桌面目录高亮');
      await agent.aiDoubleClick('左侧导航栏的视频目录');
      await agent.aiAssert('跳转视频目录，侧边栏视频目录高亮');
      await agent.aiDoubleClick('左侧导航栏的音乐目录');
      await agent.aiAssert('跳转音乐目录，侧边栏音乐目录高亮');
      await agent.aiDoubleClick('左侧导航栏的图片目录');
      await agent.aiAssert('跳转图片目录，侧边栏图片目录高亮');
      await agent.aiDoubleClick('左侧导航栏的文档目录');
      await agent.aiAssert('跳转文档目录，侧边栏文档目录高亮');
      await agent.aiDoubleClick('左侧导航栏的下载目录');
      await agent.aiAssert('跳转下载目录，侧边栏下载目录高亮');
    }, { 
        timeout: 120000,  // 超时时间
        tags: ["1805955",'level2', 'smoke','chenyi'] 
    });
    // 用例级别环境清理钩子
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
      // 清理步骤，包括窗口关闭、文件清理等
    });
  
    // 模块级别环境清理钩子
	// 每个脚本结束应有测试清理步骤，包含所有对桌面环境的操作，包括窗口关闭、文件清理等
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      // 关闭应用、清理文件等
      await uos.showDesktop();
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  
