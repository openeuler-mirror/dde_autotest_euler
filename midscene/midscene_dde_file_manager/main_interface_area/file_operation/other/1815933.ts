/**
 * 用例 PMSID: 1815933
 * 用例标题: 长文件名功能(关闭) - 文件夹/文件，以打开方式打开
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/1/29
 */


describe('1815933-长文件名功能(关闭) - 文件夹/文件，以打开方式打开', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1815933-长文件名功能(关闭) - 文件夹/文件，以打开方式打开', async ({ device, agent, uos, system }) => {
    const caseDir = process.env.TESTCASE_DIR;
    const { closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    console.log('验证库目录右键打开方式-文件管理器打开')
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器侧边栏的图片");
    await agent.aiHover("Wallpapers");
    await agent.aiRightClick("Wallpapers");
    await agent.aiTap("打开方式");
    await agent.aiTap("文件管理器");
    await agent.aiAssert("文件管理器打开了Wallpapers文件夹");
    await closeAllWindows(device, agent);

    console.log('验证U盘右键打开方式-文本编辑器打开')
    const usb_flash = process.env.USB_FLASH;
    const user = process.env.TEST_USERNAME;
    const test_file = "1815933.txt";
    await system.exec(`touch "/media/${user}/${usb_flash}/${test_file}"`);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiDoubleClick(usb_flash);
    await agent.aiHover(test_file);
    await agent.aiRightClick(test_file);
    await agent.aiTap("打开方式");
    await agent.aiTap("文本编辑器");
    await agent.aiAssert("文本编辑器");
    await agent.aiAssert(test_file);
    await closeAllWindows(device, agent);
  }, { timeout: 1200000, tags: ["1815933", 'level3', 'other', 'DITT', 'xuqi'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const usb_flash = process.env.USB_FLASH;
    const user = process.env.TEST_USERNAME;
    const test_file = "1815933.txt";
    await system.exec(`rm -rf "/media/${user}/${usb_flash}/${test_file}"`);
    await uos.closeCurrentWindow();
  });
});