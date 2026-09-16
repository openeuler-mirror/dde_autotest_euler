
/**
 * 用例 PMSID: 1805487
 * 用例标题: 【搜索】【支持筛选搜索】文管单击&amp;amp;amp;quot;搜索&amp;amp;amp;quot;按钮后，&amp;amp;amp;quot;筛选&amp;amp;amp;quot;按钮显示
 * 生成时间: 2026-02-06 11:05:51
 * 用例编写人: UT000193（郑豪）
 */

describe('1805487-【搜索】【支持筛选搜索】文管单击&amp;amp;amp;quot;搜索&amp;amp;amp;quot;按钮后，&amp;amp;amp;quot;筛选&amp;amp;amp;quot;按钮显示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805487-【搜索】【支持筛选搜索】文管单击&amp;amp;amp;quot;搜索&amp;amp;amp;quot;按钮后，&amp;amp;amp;quot;筛选&amp;amp;amp;quot;按钮显示', async ({ device, agent, uos }) => {
    // 步骤1：打开文管，顶部工具栏，单击"搜索"按钮
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("左侧栏桌面");
    await agent.aiTap("文件管理界面右上角的搜索框");

    // 断言1：显示搜索输入框，输入框旁显示"筛选"按钮
    await agent.aiAssert("显示搜索输入框，右侧显示'筛选'图标");
    
  }, { timeout: 600000, tags: ['1805487', 'level2', 'search', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('killall dde-file-manager');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
