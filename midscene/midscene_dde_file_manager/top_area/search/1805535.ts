
/**
 * 用例 PMSID: 1805535
 * 用例标题: 【搜索】【支持筛选搜索】文管单击&quot;搜索&quot;按钮后，输入关键字进行搜索
 * 生成时间: 2026-02-04 19:10:36
 * 用例编写人: UT000193（郑豪）
 */

describe('1805535-【搜索】【支持筛选搜索】文管单击&quot;搜索&quot;按钮后，输入关键字进行搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('rm ~/Desktop/1805535.txt');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec(`touch /home/${process.env.TEST_USERNAME}/Desktop/1805535.txt`);
  });

  test('1805535-【搜索】【支持筛选搜索】文管单击&quot;搜索&quot;按钮后，输入关键字进行搜索', async ({ device, agent, uos }) => {
    // 步骤1：打开文管，顶部工具栏，单击"搜索"按钮
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("左侧栏桌面");
    await agent.aiTap("文件管理界面右上角的搜索框");

    // 断言1：显示搜索输入框，输入框旁显示"筛选"按钮
    await agent.aiAssert("显示搜索输入框，右侧显示漏斗形状的'筛选'图标");

    // 步骤2：搜索输入框键入关键字，然后按键Enter
    await device.typeText("1805535");
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 500));

    // 断言2：显示匹配的搜索结果
    await agent.aiAssert("搜索结果只显示1805535.txt文件");
  }, { timeout: 300000, tags: ['1805535', 'level2', 'search', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('rm ~/Desktop/1805535.txt');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
