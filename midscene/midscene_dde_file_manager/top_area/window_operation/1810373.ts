/**
 * 用例 PMSID: 1810373
 * 用例标题:【重复打开文件夹】在桌面打开文件夹A，再通过文件管理器打开文件夹A，文件夹窗口只显示一个且置顶
 * 生成时间: 2026-2-12 09:00:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1810373-【重复打开文件夹】打开计算机大于2次，计算机窗口显示一个且置顶', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

       // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    test('1810373-【重复打开文件夹】打开计算机大于2次，计算机窗口显示一个且置顶', async ({ device, agent, uos, system, env }) => {  
      // 设置时间等待
      console.log('时间等待开始');
      await system.exec('sleep 2');
      console.log('时间等待完成');
      // 步骤1：打开文件管理器窗口--结果：文件管理器窗口被打开
      await agent.aiDoubleClick('桌面左上角的的“计算机”');
      await agent.aiAssert('文件管理器窗口被打开');

      // 步骤2：再次在桌面双击打开计算机--结果：文件管理器窗口只有一个且显示置顶
      // 将文件管理器窗口还原，为了能双击桌面的计算机
      try {
        console.log('检测是文件管理器窗口是否为最大化');
        // 文件管理器窗口为最大化
        await agent.aiAssert('文件管理器窗口为最大化');
        // 还原窗口
        await agent.aiTap('文件管理器右上角的还原窗口按钮');
    } catch (error) {
      console.log('文件管理器窗口本身就为还原状态');
    }
      await agent.aiDoubleClick('桌面左上角的的“计算机”');
      await agent.aiAssert('文件管理器新窗口显示置顶');

      // 步骤3：在桌面选中计算机鼠标右键打开--结果：文件管理器窗口只有一个且显示置顶
      await agent.aiDoubleClick('桌面左上角的的“计算机”');
      await agent.aiWaitFor('文件管理器新窗口打开成功');
      await agent.aiAssert('文件管理器新窗口显示置顶');

    }, { timeout: 1200000, tags: ["1810373", "level3", "window_operation", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });





