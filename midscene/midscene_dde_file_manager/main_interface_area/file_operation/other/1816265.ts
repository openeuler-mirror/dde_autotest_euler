/**
 * 用例 PMSID: 1816265
 * 用例标题:  组策略开启反选后，不影响反选快捷键
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/2/4
*/

const caseDir = process.env.TESTCASE_DIR;

describe('1816265-组策略开启反选后，不影响反选快捷键', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1816265-组策略开启反选后，不影响反选快捷键', async ({ device, agent, uos, system }) => {
        console.log('验证桌面，选中文件，使用快捷键Ctrl + Shift + i');
        const folder1 = "1816265-1";
        const folder2 = "1816265-2";
        const user = process.env.TEST_USERNAME;
        await system.exec(`mkdir "/home/${user}/Desktop/${folder1}"; mkdir "/home/${user}/Desktop/${folder2}"`);
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器侧边栏的桌面");
        await agent.aiTap("列表视图(右侧第二个)")
        await device.keyDown("ctrl");
        await agent.aiTap(folder1);
        await agent.aiTap(folder2);
        await device.keyUp("ctrl");
        await device.pressKey("ctrl+shift+i");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiAssert('“${folder1}和${folder2}图标没有被选中”');

        console.log('验证文管目录，选中文件，使用快捷键Ctrl + Shift + i');
        const folders = ["folder1", "folder2", "folder3"];
        for (const folder of folders) {
            await system.exec(`mkdir "/home/${user}/Documents/${folder}"`);
        }
        await agent.aiTap("文件管理器侧边栏的文档");
        await device.keyDown("ctrl");
        await agent.aiTap("folder1");
        await agent.aiTap("folder2");
        await device.keyUp("ctrl");
        await device.pressKey("ctrl+shift+i");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiAssert('“${folder1}和${folder2}图标没有蓝色背景”');
        await uos.closeCurrentWindow();
    }, { timeout: 1200000, tags: ["1816265", 'level3', 'other', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const folder1 = "1816265-1";
        const folder2 = "1816265-2";
        const user = process.env.TEST_USERNAME;
        const folders = ["folder1", "folder2", "folder3"];
        for (const folder of folders) {
            await system.exec(`rm -rf "/home/${user}/Documents/${folder}"`);
            console.log(`已删除文件夹: ${folder}`);
        }
        await system.exec(`rm -rf "/home/${user}/Desktop/${folder1}"; rm -rf "/home/${user}/Desktop/${folder2}"`);
        const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await closeFileManager(system);
        await clearEnvironment(system);
        await uos.closeCurrentWindow();
    });
});