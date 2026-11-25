/**
 * 用例 PMSID: 1810655
 * 用例标题: 适配不同的图标主题
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/07/14
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1810655-适配不同的图标主题', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1810655-适配不同的图标主题', async ({ device, agent, uos, system }) => {
        const { closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

        // 步骤1：切换系统图标主题分别为flow、origin、bloom，查看我的目录主题图标是否正常
        console.log("步骤1：切换图标主题为flow、origin、bloom，查看我的目录主题图标");
        const themes = ['flow', 'origin', 'bloom'];
        for (const theme of themes) {
            console.log(`切换图标主题为${theme}`);
            await system.exec(`busctl --user call org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 Set "ss" "globaltheme" "${theme}"`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            await uos.openApp('文件管理器', 3000, 20000, true);
            await agent.aiAssert("打开了文件管理器");
            // 会话恢复可能打开设置页等非主目录视图，先导航到主目录再断言图标
            await agent.aiTap("侧边栏中的主目录");
            await new Promise(resolve => setTimeout(resolve, 1500));
            await agent.aiAssert(`${theme}主题下我的目录主题图标显示正常`);
            await closeAllWindows(device, agent);
        }

        // 步骤2：再次切换到nirvana默认图标，查看我的目录主题图标是否显示正常
        console.log("步骤2：切换回nirvana默认图标主题");
        await system.exec(`busctl --user call org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 Set "ss" "globaltheme" "nirvana"`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("打开了文件管理器");
        await agent.aiTap("侧边栏中的主目录");
        await new Promise(resolve => setTimeout(resolve, 1500));
        await agent.aiAssert("nirvana默认系统图标主题下我的目录主题图标显示正常");
        await closeAllWindows(device, agent);

    }, { timeout: 1200000, tags: ["1810655", 'level3', 'interaction_upgrade', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 恢复默认图标主题
        await system.exec(`busctl --user call org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 Set "ss" "globaltheme" "nirvana"`);
        await uos.closeCurrentWindow();
    });
});