/**
 * 用例 PMSID: 1815917
 * 用例标题: 长文件名功能(关闭) - 拖拽
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/1/28
 */

describe('1815917-长文件名功能(关闭) - 拖拽', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1815917-长文件名功能(关闭) - 拖拽', async ({ device, agent, uos, system }) => {
    const test_dir = "1815917";
    const user = process.env.TEST_USERNAME;
    await system.exec(`mkdir "/home/${user}/Pictures/${test_dir}"`);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器侧边栏的图片");

    console.log("验证拖拽到其他库目录");
    await agent.aiDrag(test_dir, "文件管理器侧边栏的文档");
    await agent.aiTap("文件管理器侧边栏的文档");
    await agent.aiAssert(test_dir);

    console.log("验证拖拽到桌面");
    await agent.aiDrag(test_dir, "桌面");
    await uos.closeCurrentWindow();
    await agent.aiAssert(test_dir);

    console.log("验证U盘拖拽到库目录");
    const usb_flash = process.env.USB_FLASH;
    await system.exec(`mkdir "/media/${user}/${usb_flash}/${test_dir}"`);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiDoubleClick(usb_flash);
    await agent.aiAssert(test_dir);
    await agent.aiDrag(test_dir, "文件管理器侧边栏的视频");
    await agent.aiTap("文件管理器侧边栏的视频");
    await agent.aiAssert(test_dir);
    await uos.closeCurrentWindow();

    console.log("验证桌面拖拽到U盘");
    await uos.openApp('文件管理器', 3000, 20000, true);
    await device.pressKey("super+right");
    await agent.aiDrag(test_dir, usb_flash);
    await agent.aiDoubleClick(usb_flash);
    await device.pressKey("super+up");
    await agent.aiAssert(test_dir);
    await uos.closeCurrentWindow();

  }, { timeout: 600000, tags: ["1815917", 'level3', 'other', 'DITT', 'xuqi'] });

  afterEach(async ({ device, agent, }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const usb_flash = process.env.USB_FLASH;
    const user = process.env.TEST_USERNAME;
    const test_dir = "1815917";
    await system.exec(`rm -rf "/home/${user}/Desktop/${test_dir}"`);
    await system.exec(`rm -rf "/home/${user}/Videos/${test_dir}"`);
    await system.exec(`rm -rf "/media/${user}/${usb_flash}/${test_dir}"`);
    await uos.closeCurrentWindow();
  });
});