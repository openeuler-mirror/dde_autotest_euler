/**
 * 用例 PMSID: 1815909
 * 用例标题:  长文件名功能(关闭) - 批量重命名，添加文本
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/3/2
 */

describe('1815909-长文件名功能(关闭) - 批量重命名，添加文本', () => {
    beforeAll(async ({ device, uos, agent }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1815909-长文件名功能(关闭) - 批量重命名，添加文本', async ({ device, agent, uos, system }) => {
        console.log("验证库目录，选择多个原长文件名的文件/文件夹，重命名，添加文本");
        const folder1 = "1815909-1";
        const folder2 = "1815909-2";
        const searchStr = "1815909";
        const replaceStr = "t";
        const user = process.env.TEST_USERNAME;
        await system.exec(`mkdir "/home/${user}/Documents/${folder1}"; mkdir "/home/${user}/Documents/${folder2}"`);
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的文档");
        await device.keyDown("ctrl");
        await agent.aiTap(folder1);
        await agent.aiTap(folder2);
        await device.keyUp("ctrl");
        await agent.aiRightClick(folder2);
        await agent.aiTap('重命名(M)');
        await device.typeText(searchStr);
        await device.pressKey("TAB");
        await device.typeText(replaceStr);
        await agent.aiTap("右侧的重命名");
        await agent.aiAssert("文件名称重命名为t-1和t-2");

        console.log("验证U盘内部，选择多个原长文件名的文件/文件夹，重命名，添加文本");
        const usb_flash = process.env.USB_FLASH;
        await system.exec(`mkdir "/media/${user}/${usb_flash}/${folder1}"; mkdir "/media/${user}/${usb_flash}/${folder2}"`);
        await agent.aiTap("文件管理器侧边栏的计算机");
        await agent.aiDoubleClick(usb_flash);
        await device.keyDown("ctrl");
        await agent.aiTap(folder1);
        await agent.aiTap(folder2);
        await device.keyUp("ctrl");
        await agent.aiRightClick(folder2);
        await agent.aiTap('重命名(M)');
        await device.typeText(searchStr);
        await device.pressKey("TAB");
        await device.typeText(replaceStr);
        await agent.aiTap("右侧的重命名");
        await agent.aiAssert("文件名称重命名为t-1和t-2");
        await uos.closeCurrentWindow();

        console.log("验证桌面，选择多个原长文件名的文件/文件夹，重命名，添加文本");
        await system.exec(`mkdir "/home/${user}/Desktop/${folder1}"; mkdir "/home/${user}/Desktop/${folder2}"`);
        await device.keyDown("ctrl");
        await agent.aiTap(folder1);
        await agent.aiTap(folder2);
        await device.keyUp("ctrl");
        await agent.aiRightClick(folder2);
        await agent.aiTap('重命名(M)');
        await device.typeText(searchStr);
        await device.pressKey("TAB");
        await device.typeText(replaceStr);
        await agent.aiTap("重命名");
        await agent.aiAssert("文件名称重命名为t-1和t-2");
    }, { timeout: 1200000, tags: ["1815909", 'level3', 'other', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
        await device.keyUp("ctrl");
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        await uos.closeCurrentWindow();
        const usb_flash = process.env.USB_FLASH;
        const user = process.env.TEST_USERNAME;
        const folder1 = "t-1";
        const folder2 = "t-2";
        await system.exec(`rm -rf "/home/${user}/Documents/${folder1}"; rm -rf "/home/${user}/Documents/${folder2}"`);
        await system.exec(`rm -rf "/home/${user}/Desktop/${folder1}"; rm -rf "/home/${user}/Desktop/${folder2}"`);
        await system.exec(`rm -rf "/media/${user}/${usb_flash}/${folder1}"; rm -rf "/media/${user}/${usb_flash}/${folder2}"`);
    });
});