/**
 * 用例 PMSID: 1815931
 * 用例标题: 长文件名功能(关闭) - 文件夹，以管理员身份打开
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/1/29
 */

describe('1815931-长文件名功能(关闭) - 文件夹，以管理员身份打开', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1815931-长文件名功能(关闭) - 文件夹，以管理员身份打开', async ({ device, agent, uos, system }) => {
    console.log('验证库目录，选择原长文件名的文件夹，右键以管理员身份打开')
    const pwd = process.env.TEST_PASSWORD
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器侧边栏的图片");
    await agent.aiRightClick("Wallpapers");
    await agent.aiTap("以管理员身份打开");
    await device.typeText(pwd);
    await device.pressKey("ENTER");
    await agent.aiRightClick("空白处");
    await agent.aiTap("在终端中打开");
    await agent.aiAssert("终端中当前用户为root");
    await uos.closeCurrentWindow();

    console.log('验证U盘内部，选择原长文件名的文件夹，右键以管理员身份打开')
    const usb_flash = process.env.USB_FLASH;
    const user =process.env.TEST_USERNAME;
    const test_dir = "1815931";
    await system.exec(`mkdir "/media/${user}/${usb_flash}/${test_dir}"`);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiDoubleClick(usb_flash);
    await agent.aiRightClick(test_dir);
    await agent.aiTap("以管理员身份打开");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText(pwd);
    await device.pressKey("ENTER");
    await agent.aiRightClick("空白处");
    await agent.aiTap("在终端中打开");
    await agent.aiAssert("终端中当前用户为root");
    await uos.closeCurrentWindow();

  }, { timeout: 1200000, tags: ["1815931", 'level3', 'other', 'DITT', 'xuqi'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const usb_flash = process.env.USB_FLASH;
    const user =process.env.TEST_USERNAME;
    const test_dir = "1815931";
    await system.exec(`rm -rf "/media/${user}/${usb_flash}/${test_dir}"`);
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
  });
});