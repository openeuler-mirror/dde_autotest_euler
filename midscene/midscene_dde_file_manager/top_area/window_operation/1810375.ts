/**
 * 用例 PMSID: 1810375
 * 用例标题:【重复打开文件夹】在桌面打开文件夹A，再通过文件管理器打开文件夹A，文件夹窗口只显示一个且置顶
 * 生成时间: 2026-2-12 11:20:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1810375-【重复打开文件夹】在桌面打开文件夹A，再通过文件管理器打开文件夹A，文件夹窗口只显示一个且置顶', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
       // 初始化文管配置和进程
      await system.cleanupFileManager();
      console.log('文件管理器已初始化');

      // 前置条件：1、桌面存在文件夹A
      await system.exec('mkdir ~/Desktop/1810375');

      // 前置条件2：文管设置中，已经勾选【总是在新窗口打开文件夹】
      await uos.openApp('文件管理器');
      await agent.aiTap('文件管理器窗口右上角的第一行的第1个图标');
      await agent.aiWaitFor('包含设置的弹框出现');
      await agent.aiTap('设置');
      await agent.aiWaitFor('基础设置');
      try {
        await agent.aiAssert('"总是在新窗口打开文件夹"前面的复选框未被勾选');
        await agent.aiTap('"总是在新窗口打开文件夹"前面的复选框');
        await agent.aiAssert('"总是在新窗口打开文件夹"前面的复选框被勾选');
        console.log('"总是在新窗口打开文件夹"开启成功');
      } catch (error) {
        console.log('"总是在新窗口打开文件夹"已处于打开状态');
      }
      // 关闭文件管理器
      await system.exec('killall dde-file-manager');
    });
  
    test('1810375-【重复打开文件夹】在桌面打开文件夹A，再通过文件管理器打开文件夹A，文件夹窗口只显示一个且置顶', async ({ device, agent, uos, system, env }) => {  
      // 步骤1：在桌面第一次双击打开文件夹A--结果：打开文件夹A窗口
      await agent.aiDoubleClick('桌面的文件夹1810375的图标');
      await agent.aiAssert('文件夹1810375被成功打开');

      // 步骤2：打开文管-桌面，再次双击打开文件夹A--结果：	文件夹A窗口显示置顶
      await agent.aiTap('任务栏最右侧边缘');
      await agent.aiAssert('回到桌面');
      await agent.aiDoubleClick('桌面的文件夹1810375的图标');
      await agent.aiAssert('文件夹1810375的窗口显示置顶');

    }, { timeout: 600000, tags: ["1810375", "level3", "window_operation", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system, uos}) => {
      console.log('4. afterEach: 每个测试后的清理');
      // 删除文件夹，清理数据
      await system.exec('rm -r ~/Desktop/1810375');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
      console.log('文件管理器已初始化');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
