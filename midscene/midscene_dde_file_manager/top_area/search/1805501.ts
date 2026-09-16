
/**
 * 用例 PMSID: 1805501
 * 用例标题: 【搜索】【支持筛选搜索】文管单击&amp;amp;amp;quot;搜索&amp;amp;amp;quot;按钮后，输入关键字和筛选过滤条件，进行搜索
 * 生成时间: 2026-02-05 19:40:37
 * 用例编写人: UT000193（郑豪）
 */

describe('1805501-【搜索】【支持筛选搜索】文管单击&amp;amp;amp;quot;搜索&amp;amp;amp;quot;按钮后，输入关键字和筛选过滤条件，进行搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建测试文件
    await system.exec(`touch /home/${process.env.TEST_USERNAME}/Desktop/1805501.txt`);
    await system.exec(`touch /home/${process.env.TEST_USERNAME}/Desktop/1805501.jpg`);
    await system.exec(`touch /home/${process.env.TEST_USERNAME}/Desktop/1805501.mp3`);
  });

  test('1805501-【搜索】【支持筛选搜索】文管单击&amp;amp;amp;quot;搜索&amp;amp;amp;quot;按钮后，输入关键字和筛选过滤条件，进行搜索', async ({ device, agent, uos, env }) => {
    // 步骤1：打开文管，顶部工具栏，单击"搜索"按钮
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("左侧栏桌面");
    await agent.aiTap("文件管理界面右上角的搜索框");

    // 断言1：显示搜索输入框，输入框旁显示"筛选"按钮
    await agent.aiAssert("显示搜索输入框，右侧显示'筛选'图标");

    // 步骤2：单击"筛选"按钮，选择筛选过滤条件，然后搜索输入框键入关键字，然后按键Enter
    await device.typeText("1805501");
    await agent.aiWaitFor("显示以'1805501'开头的3个不同格式文件");
    await agent.aiTap("搜索框右侧的'筛选'图标");
    await agent.aiWaitFor("筛选条件面板已显示");
    await agent.aiTap("筛选条件中文件类型右侧的'下拉选择框'选项");
    await agent.aiWaitFor("下拉选择框出现");
    await agent.aiTap("下拉选择框中的'图片'");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 断言2：显示关键字和筛选都匹配的搜索结果
    await agent.aiAssert("搜索结果只显示1805501.jpg文件");
  }, { timeout: 600000, tags: ['1805501', 'level2', 'search', 'zhenghao'] });

  afterEach(async ({ device, system, env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理测试文件
    await system.exec(`rm /home/${process.env.TEST_USERNAME}/Desktop/1805501.txt`);
    await system.exec(`rm /home/${process.env.TEST_USERNAME}/Desktop/1805501.jpg`);
    await system.exec(`rm /home/${process.env.TEST_USERNAME}/Desktop/1805501.mp3`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
