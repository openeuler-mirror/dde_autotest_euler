/**
 * 用例 PMSID: 1810369
 * 用例标题:【重复打开文件夹】文件管理器在计算机页面，再通过启动器侧边栏打开，对应窗口显示一个且置顶
 * 生成时间: 2026-2-12 10:50:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1810369-【重复打开文件夹】文件管理器在计算机页面，再通过启动器侧边栏打开，对应窗口显示一个且置顶', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
       // 初始化文管配置和进程
      await system.cleanupFileManager();
      console.log('文件管理器已初始化');
    });
  
    test('1810369-【重复打开文件夹】文件管理器在计算机页面，再通过启动器侧边栏打开，对应窗口显示一个且置顶', async ({ device, agent, uos, system, env }) => {  
      // 步骤1：在文件管理器中侧边栏点击【计算机】--结果：打开至对应目录
      await uos.openApp('文件管理器');
      await agent.aiTap('文件管理器窗口左侧的“计算机”');
      await agent.aiAssert('“系统盘”和“数据盘”');
      console.log('计算机目录打开成功');

      // 步骤2：再通过启动器点击文件管理器--结果：文件管理器窗口显示一个且置顶
      await uos.openApp('文件管理器');
      await agent.aiAssert('文件管理器新窗口显示置顶');
      console.log('文件管理器窗口显示置顶');

    }, { timeout: 1200000, tags: ["1810369", "level3", "window_operation", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system, uos}) => {
      console.log('4. afterEach: 每个测试后的清理');
      
      // 初始化文管配置和进程
      await system.cleanupFileManager();
      console.log('文件管理器已初始化');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
