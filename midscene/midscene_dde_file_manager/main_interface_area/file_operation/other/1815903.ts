/**
 * 用例 PMSID: 1815903
 * 用例标题: 长文件名功能(关闭) - 删除、撤销
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/1/21
 */



describe('1815903-长文件名功能(关闭) - 删除、撤销', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1815903-长文件名功能(关闭) - 删除、撤销', async ({ device, agent, uos, system }) => {
    const test_file = '1815903.txt';
    const user = process.env.TEST_USERNAME;
    await system.exec(`touch "/home/${user}/Documents/${test_file}"`);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器侧边栏的文档");
    await agent.aiRightClick("1815903.txt");
    await agent.aiTap("删除");
    await agent.aiAssert(`${test_file}不存在`);
    await device.pressKey("Ctrl+Z");
    await agent.aiAssert(test_file);
    await uos.closeCurrentWindow();
  }, { timeout: 1200000, tags: ["1815903", 'level3', 'file_operation', 'DITT', 'xuqi'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    const test_file = "1815903.txt";
    const user = process.env.TEST_USERNAME;
    await system.exec(`rm -rf "/home/${user}/Documents/${test_file}"`);
    await uos.closeCurrentWindow();
  });
});