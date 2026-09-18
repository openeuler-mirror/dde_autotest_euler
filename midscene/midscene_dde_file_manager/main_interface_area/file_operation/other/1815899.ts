/**
 * 用例 PMSID: 1815899
 * 用例标题: 长文件名功能(关闭) - 文件和文件夹混合排序
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/2/5
 */

describe('1815899-长文件名功能(关闭) - 文件和文件夹混合排序', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        const caseDir = process.env.TESTCASE_DIR;
        const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
        await uos.showDesktop();
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
        await agent.aiTap("点击设置");
        await agent.aiTap("新窗口");
        await agent.aiTap("文件和文件夹混合排序");
        await uos.closeCurrentWindow();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1815899-长文件名功能(关闭) - 文件和文件夹混合排序', async ({ device, agent, uos, system }) => {
        const folder1 = "a";
        const folder2 = "ab";
        const file1 = "aa";
        const user = process.env.TEST_USERNAME;
        const usb_flash = process.env.USB_FLASH;
        await system.exec(`mkdir -p "/home/${user}/Documents/test/${folder1}"; mkdir -p "/home/${user}/Documents/test/${folder2}"`);
        await system.exec(`touch "/home/${user}/Documents/test/${file1}"`);
        await system.exec(`mkdir -p "/media/${user}/${usb_flash}/test/${folder1}"; mkdir -p "/media/${user}/${usb_flash}/test/${folder2}"`);
        await system.exec(`touch "/media/${user}/${usb_flash}/test/${file1}"`);
        await system.exec(`mkdir -p "/home/${user}/Desktop/test/${folder1}"; mkdir -p "/home/${user}/Desktop/test/${folder2}"`);
        await system.exec(`touch "/home/${user}/Desktop/test/${file1}"`);

        console.log("验证库目录，文件和文件夹混合排序");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的文档");
        await agent.aiDoubleClick("test");
        await agent.aiAssert("按排序顺序依次展示为${folder1},${file1},${folder2}");
        await uos.closeCurrentWindow();

        console.log("验证U盘内部，文件和文件夹混合排序");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的${usb_flash}");
        await agent.aiDoubleClick("test");
        await agent.aiAssert("按排序顺序依次展示为${folder1},${file1},${folder2}");
        await uos.closeCurrentWindow();

        console.log("验证桌面，文件和文件夹混合排序");
        await agent.aiDoubleClick("test");
        await agent.aiAssert("桌面图标中，其中3个图标的顺序是${folder1},${file1},${folder2}");
        await uos.closeCurrentWindow();

    }, { timeout: 1200000, tags: ["1815899", 'level3', 'other', 'DITT', 'xuqi'] });

    afterEach(async ({ device, agent, system }) => {
        console.log('4. afterEach: 每个测试后的清理');

    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const user = process.env.TEST_USERNAME;
        const usb_flash = process.env.USB_FLASH;
        await system.exec(`rm -rf "/home/${user}/Desktop/test/"`);
        await system.exec(`rm -rf "/home/${user}/Documents/test/"`);
        await system.exec(`rm -rf "/media/${user}/${usb_flash}/test"`);
        const caseDir = process.env.TESTCASE_DIR;
        const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
        await uos.closeCurrentWindow();
    });
});