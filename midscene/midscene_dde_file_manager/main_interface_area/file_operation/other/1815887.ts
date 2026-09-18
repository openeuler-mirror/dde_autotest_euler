/**
 * 用例 PMSID: 1815887
 * 用例标题:  长文件名功能(关闭) - 在终端中打开
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/1/27
 */

describe('1815887-长文件名功能(关闭) - 在终端中打开', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1815887-长文件名功能(关闭) - 在终端中打开', async ({ device, agent, uos, system }) => {
    console.log('验证右键在终端中打开');
    const new_dir = "1815887-1";
    const user = process.env.TEST_USERNAME;
    const expected_path = `/home/${user}/Documents/${new_dir}`;
    await system.exec(`mkdir "/home/${user}/Documents/${new_dir}"`);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器侧边栏的文档");
    await agent.aiRightClick(new_dir);
    await agent.aiTap('在终端中打开');
    await agent.aiAssert(expected_path);

    console.log('关闭终端窗口');
    await device.pressKey("ALT+F4");

    console.log('验证进入文件夹内部，在终端中打开');
    await agent.aiDoubleClick(new_dir);
    await agent.aiRightClick("空白处");
    await agent.aiTap('在终端中打开');
    await agent.aiAssert('终端已打开');
    await agent.aiAssert(expected_path);
    console.log('关闭终端窗口');
    await device.pressKey("ALT+F4");

    console.log('验证进入文件夹内部，在终端中打开');
    const usb_dir = '1815887-2';
    const usb_flash = process.env.USB_FLASH;
    const usb_expected_path = `/media/${user}/${usb_flash}/${usb_dir}`;
    await system.exec(`mkdir "/media/${user}/${usb_flash}/${usb_dir}"`);
    await agent.aiTap("文件管理器侧边栏的计算机");
    await agent.aiDoubleClick(usb_flash);
    await agent.aiRightClick(usb_dir);
    await agent.aiTap('在终端中打开');
    await agent.aiAssert(usb_expected_path);

    console.log('关闭终端窗口');
    await device.pressKey("ALT+F4");

    await agent.aiDoubleClick(usb_dir);
    await agent.aiRightClick("空白处");
    await agent.aiTap('在终端中打开');
    await agent.aiAssert('终端已打开');
    await agent.aiAssert(usb_expected_path);
    await uos.closeCurrentWindow();

  }, { timeout: 1200000, tags: ["1815887", 'level3', 'other', 'DITT', 'xuqi'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const new_dir = "test123";
    const usb_dir = 'test456';
    const usb_flash = process.env.USB_FLASH;
    const user = process.env.TEST_USERNAME;
    await system.exec(`rm -rf "/home/${user}/Documents/${new_dir}"`);
    await system.exec(`rm -rf "/media/${user}/${usb_flash}/${usb_dir}"`);
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
  });
});