/**
 * 用例 PMSID: 1815883
 * 用例标题:  长文件名功能(关闭) - 病毒查杀
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/2/4
 */

describe('1815883-长文件名功能(关闭) - 病毒查杀', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1815883-长文件名功能(关闭) - 病毒查杀', async ({ device, agent, uos, system }) => {
        console.log('验证库目录，选择原长文件名的文件夹(内部若干文件)，右键"病毒查杀"');
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的图片");
        await agent.aiRightClick("Wallpapers");
        await agent.aiTap("病毒查杀");
        await agent.aiAssert("弹出安全中心窗口");

        console.log('验证安全中心窗口，点击"立即体检"');
        await agent.aiTap("系统体检");
        await agent.aiTap("立即体检");
        await agent.aiAssert("正在进行体检");
        await agent.aiTap("取消");
        await agent.aiTap("右上角的关闭按钮X");

        console.log('U盘内部，选择原长文件名的文件夹(内部若干文件)，右键"病毒查杀"');
        const folder = "test1815883";
        const usb_flash = process.env.USB_FLASH;
        const user = process.env.TEST_USERNAME;
        await system.exec(`mkdir "/media/${user}/${usb_flash}/${folder}"`);
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap(usb_flash);
        await agent.aiRightClick(folder);
        await agent.aiTap("病毒查杀");
        await agent.aiAssert("弹出安全中心窗口");

        console.log('验证安全中心窗口，点击"立即体检"');
        await agent.aiTap("系统体检");
        await agent.aiTap("立即体检");
        await agent.aiAssert("正在进行体检");
        await agent.aiTap("取消");
        await agent.aiTap("右上角的关闭按钮X");
        await uos.closeCurrentWindow();
    }, { timeout: 1200000, tags: ["1815883", 'level3', 'other', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const folder = "test1815883";
        const usb_flash = process.env.USB_FLASH;
        const user = process.env.TEST_USERNAME;
        await system.exec(`rm -rf "/media/${user}/${usb_flash}/${folder}"`);
        await uos.closeCurrentWindow();
    });
});