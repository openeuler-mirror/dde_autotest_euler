/**
 * 用例 PMSID: 1815885
 * 用例标题:  长文件名功能(关闭) - 共享文件夹
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/2/4
 */

describe('1815885-长文件名功能(关闭) - 共享文件夹', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1815885-长文件名功能(关闭) - 共享文件夹', async ({ device, agent, uos, system }) => {
        console.log('验证库目录，原长文件名的文件夹，右键"共享文件夹"');
        const pwd = process.env.TEST_PASSWORD
        const test_dir = "test1815885";
        const user = process.env.TEST_USERNAME;
        await system.exec(`mkdir "/home/${user}/Pictures/${test_dir}"`);
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的图片");
        await agent.aiHover(test_dir);
        await agent.aiRightClick(test_dir);
        await agent.aiHover('共享文件夹');
        await agent.aiTap("共享文件夹");
        await agent.aiTap("共享管理");
        await agent.aiAssert("弹出属性窗口，并展开共享管理卡片区域");
        await agent.aiTap("共享此文件夹");
        await device.pressKey("esc");
        await uos.closeCurrentWindow();

        console.log('验证库目录，原长文件名的文件夹(共享中)，右键"取消共享"');
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的图片");
        await agent.aiHover(test_dir);
        await agent.aiRightClick(test_dir);
        await agent.aiHover('取消共享');
        await agent.aiTap("取消共享");
        await device.pressKey(pwd);
        await device.pressKey("ENTER");
        await agent.aiAssert(`${test_dir}文件夹未共享`);
        await uos.closeCurrentWindow();

        console.log('验证U盘内部，原长文件名的文件夹，右键"共享文件夹"');
        const usb_flash = process.env.USB_FLASH;
        await system.exec(`mkdir "/media/${user}/${usb_flash}/${test_dir}"`);
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiDoubleClick(usb_flash);
        await agent.aiHover(test_dir);
        await agent.aiRightClick(test_dir);
        await agent.aiHover('共享文件夹');
        await agent.aiTap("共享文件夹");
        await agent.aiTap("共享管理");
        await agent.aiAssert("弹出属性窗口，并展开共享管理卡片区域");
        await agent.aiTap("共享此文件夹");
        await device.pressKey("esc");
        await uos.closeCurrentWindow();

        console.log('验证U盘内部，原长文件名的文件夹(共享中)，右键"取消共享"');
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiDoubleClick(usb_flash);
        await agent.aiHover(test_dir);
        await agent.aiRightClick(test_dir);
        await agent.aiHover('取消共享');
        await agent.aiTap("取消共享");
        await device.pressKey(pwd);
        await device.pressKey("ENTER");
        await agent.aiAssert(`${test_dir}文件夹未共享`);
        await uos.closeCurrentWindow();

    }, { timeout: 1200000, tags: ["1815885", 'level3', 'other', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const test_dir = "test1815885";
        const user = process.env.TEST_USERNAME;
        const usb_flash = process.env.USB_FLASH;
        await system.exec(`rm -rf "/home/${user}/Pictures/${test_dir}"`);
        await system.exec(`rm -rf "/media/${user}/${usb_flash}/${test_dir}"`);
        await uos.closeCurrentWindow();
    });
});