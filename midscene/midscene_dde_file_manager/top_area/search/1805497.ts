/**
 * 用例 PMSID: 1805497
 * 用例标题: 【搜索】【支持筛选搜索】文管单击&amp;amp;quot;搜索&amp;amp;quot;按钮后，输入关键字进行搜索
 * 生成时间: 2026-02-05 20:58:16
 * 用例编写人: UT000193（郑豪）
 */

describe('1805497-【搜索】【支持筛选搜索】文管单击&amp;amp;quot;搜索&amp;amp;quot;按钮后，输入关键字进行搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建测试文件
    await system.exec(`touch /home/${process.env.TEST_USERNAME}/Desktop/1805497.txt`);
    await system.exec(`touch /home/${process.env.TEST_USERNAME}/Desktop/1805497.jpg`);
    await system.exec(`touch /home/${process.env.TEST_USERNAME}/Desktop/1805497.mp3`);
  });

  test('1805497-【搜索】【支持筛选搜索】文管单击&amp;amp;quot;搜索&amp;amp;quot;按钮后，输入关键字进行搜索', async ({ device, agent, uos }) => {

    // 步骤1：打开文管，顶部工具栏，单击"搜索"按钮
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("左侧栏桌面");
    await agent.aiTap("文件管理界面右上角的搜索框");

    // 断言2：显示搜索输入框，输入框旁显示"筛选"按钮
    await agent.aiAssert("显示搜索输入框，右侧显示'筛选'图标");

    // 步骤2：搜索输入框键入关键字，然后按键Enter
    await device.typeText("1805497");
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 500));

    // 断言2：显示匹配的搜索结果
    await agent.aiAssert("搜索结果显示以'1805497'开头的3个不同格式文件");

  }, { timeout: 300000, tags: ['1805497', 'level2', 'search', 'zhenghao'] });

  afterEach(async ({ device, system, env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理测试文件
    await system.exec(`rm /home/${process.env.TEST_USERNAME}/Desktop/1805497.txt`);
    await system.exec(`rm /home/${process.env.TEST_USERNAME}/Desktop/1805497.jpg`);
    await system.exec(`rm /home/${process.env.TEST_USERNAME}/Desktop/1805497.mp3`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
