/**
 * 用例 PMSID: 1805051
 * 用例标题: 顶部右键-最大化_
 * 生成时间: 2026-3-3 15:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1805051-顶部右键-最大化', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');

       // 初始化文管配置和进程
      await system.cleanupFileManager();

    });
  
    test('1805051-顶部右键-最大化', async ({ device, agent, uos, system, env }) => {  
      // 步骤1：打开文件管理器窗口
      await uos.openApp('文件管理器', { maximizeWindow: false });

      // 步骤2：打开文件管理器，在顶部工作栏点击最大化按钮--结果：窗口最大化，铺满桌面。
      await agent.aiAssert('文件管理器窗口右上角第一行第3个图标为“□”');
      await agent.aiTap('文件管理器窗口右上角第一行第3个图标为“□”');
      await agent.aiAssert('文件管理器窗口铺面除底部任务栏的整个桌面');

      // 步骤3：查看文件管理器窗口--结果：窗口显示正常；最大化变成双层方框图标
      await agent.aiAssert('文件管理器窗口右上角第一行第3个图标双层方框');

      // 步骤4：再次点击最大化按钮--结果：窗口恢复到最大化之前大小
      await agent.aiTap('文件管理器窗口右上角的第一行第3个图标');
      await agent.aiAssert('文件管理器窗口大小变小');
      await agent.aiAssert('文件管理器窗口右上角第一行第3个图标为“□”');

    }, { timeout: 1200000, tags: ["1805051", "level3", "top_right", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 初始化文管配置和进程
      await system.cleanupFileManager();
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
