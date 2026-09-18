/**
 * 用例 PMSID: 1815915
 * 用例标题: 长文件名功能(关闭) - 剪贴板
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/1/28
 */

describe('1815915-长文件名功能(关闭) - 剪贴板', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await device.pressKey("Super", "v");
    await agent.aiTap("剪贴板中的全部清除");
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1815915-长文件名功能(关闭) - 剪贴板', async ({ device, agent, uos, system }) => {
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器侧边栏的图片");
    await agent.aiRightClick("Wallpapers");
    await agent.aiTap("复制");
    await uos.closeCurrentWindow();
    await device.pressKey("Super", "v");
    await agent.aiAssert("剪贴板内展示了文件类型为文件,名称为Wallpapers的信息");
    await agent.aiTap("全部清除");

    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器侧边栏的图片");
    await agent.aiRightClick("Wallpapers");
    await agent.aiTap("剪切");
    await uos.closeCurrentWindow();
    await device.pressKey("Super", "v");
    await agent.aiAssert("剪贴板内展示了文件类型为文件,名称为Wallpapers的信息");

    await agent.aiDrag("剪贴板中的Wallpapers文件夹", "桌面");
    await agent.aiAssert("桌面展示了名称为Wallpapers的文件夹");

    await device.pressKey("Super", "v");
    await agent.aiTap("全部清除");
    await agent.aiAssert("剪贴板中无内容");
    await device.pressKey("Super", "v");

  }, { timeout: 1200000, tags: ["1815915", 'level3', 'other', 'DITT', 'xuqi'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
    const user = process.env.TEST_USERNAME;
    await system.exec(`rm -rf "/home/${user}/Desktop/Wallpapers"`);
  });
});