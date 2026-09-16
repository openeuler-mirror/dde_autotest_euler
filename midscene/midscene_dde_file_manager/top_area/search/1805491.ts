/**
 * 用例 PMSID: 1805491
 * 用例标题: 【搜索】【支持筛选搜索】文管单击&amp;amp;amp;quot;搜索&amp;amp;amp;quot;按钮后，单击&amp;amp;amp;quot;筛选&amp;amp;amp;quot;按钮
 * 生成时间: 2026-02-06 11:01:18
 * 用例编写人: UT000193（郑豪）
 */

describe('1805491-【搜索】【支持筛选搜索】文管单击&amp;amp;amp;quot;搜索&amp;amp;amp;quot;按钮后，单击&amp;amp;amp;quot;筛选&amp;amp;amp;quot;按钮', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805491-【搜索】【支持筛选搜索】文管单击&amp;amp;amp;quot;搜索&amp;amp;amp;quot;按钮后，单击&amp;amp;amp;quot;筛选&amp;amp;amp;quot;按钮', async ({ device, agent, uos }) => {
    // 步骤1：打开文管，顶部工具栏，单击"搜索"按钮
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("左侧栏桌面");
    await agent.aiTap("文件管理界面右上角的搜索框");

    // 断言1：显示搜索输入框，输入框旁显示"筛选"按钮
    await agent.aiAssert("显示搜索输入框，右侧显示漏斗形状的'筛选'图标");

    // 步骤2: 单击"筛选"按钮
    await agent.aiTap("搜索框右侧漏斗形状的'筛选'图标");

    // 断言2：显示高级搜索的筛选栏
    await agent.aiAssert("文件管理器顶部弹出高级搜索菜单，包含搜索范围、文件类型、访问时间、文件大小、修改时间、创建时间多个类型");

    // 步骤3：再次单击"筛选"按钮
    await agent.aiTap("搜索框右侧漏斗形状的'筛选'图标");

    // 断言3：	隐藏高级搜索的筛选栏
    await agent.aiAssert("文件管理器顶部弹出的高级搜索菜单已隐藏");
    
  }, { timeout: 600000, tags: ['1805491', 'level2', 'search', 'zhenghao'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
