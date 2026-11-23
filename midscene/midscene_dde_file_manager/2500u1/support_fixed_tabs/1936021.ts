/**
 * 用例 PMSID: 1936021
 * 用例标题: 【支持固定标签页】默认配置测试
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/07/20
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1936021-【支持固定标签页】默认配置测试', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log('1. beforeAll: 初始化测试套件');
        await closeFileManager(system);
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1936021-【支持固定标签页】默认配置测试', async ({ device, agent, uos, system }) => {
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

        // 步骤1：打开文管，点击右上角的设置-基础设置，检查新窗口和新标签的默认配置
        console.log("步骤1：打开文管，检查设置中默认配置");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        await agent.aiTap("窗口右上角主菜单按钮", { deepThink: true });
        await agent.aiWaitFor("主菜单已显示");
        await agent.aiTap("设置", { deepThink: true });
        await agent.aiWaitFor("设置窗口已显示");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiTap("设置窗口左侧导航栏中'基础设置'分组下的'新窗口'菜单项，位于'打开行为'和'新标签'之间", { deepThink: true });
        // 预期1：新窗口的默认目录是：计算机，新标签的从新标签打开的默认配置是：当前目录。默认目录下方有自定义目录，列表为空
        await agent.aiAssert("新窗口的默认目录是计算机");
        await agent.aiAssert("新标签的从新标签打开的默认配置是当前目录");
        await agent.aiAssert("默认目录下方有自定义目录，列表为空");

        // 步骤2：点击默认目录下拉菜单，检查菜单选项，并菜单选项右键是否可删除
        console.log("步骤2：检查默认目录下拉菜单选项");
        await agent.aiTap("默认目录下拉菜单");
        // 预期2：下拉菜单有如下选项：计算机、主目录、桌面、视频、音乐、图片、文档、下载、指定目录，右键不可删除
        await agent.aiAssert("下拉菜单包含计算机、主目录、桌面、视频、音乐、图片、文档、下载、指定目录选项");
        await device.pressKey("Esc");
        await agent.aiRightClick("下拉菜单中的计算机选项");
        await agent.aiAssert("没有弹出右键菜单");

        // 步骤3：点击从新标签打开下拉菜单，检查菜单选项，并菜单选项右键是否可删除
        console.log("步骤3：检查从新标签打开下拉菜单选项");
        await agent.aiTap("从新标签打开下拉菜单");
        // 预期3：下拉菜单有如下选项：当前目录、计算机、主目录、桌面、视频、音乐、图片、文档、下载，右键不可删除
        await agent.aiAssert("下拉菜单包含当前目录、计算机、主目录、桌面、视频、音乐、图片、文档、下载选项");
        await device.pressKey("Esc");
        await agent.aiRightClick("下拉菜单中的当前目录选项");
        await agent.aiAssert("没有弹出右键菜单");

        // 步骤4：点击任务栏上的文件管理器图标，检查默认打开的目录
        console.log("步骤4：检查任务栏文件管理器图标默认打开目录");
        await closeFileManager(system);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiWaitFor("文件管理器已打开");
        // 预期4：默认打开计算机目录
        await agent.aiAssert("打开的窗口是计算机");

        // 步骤5：当前文管窗口新增一个标签页，检查新页签目录
        console.log("步骤5：当前文管窗口新增一个标签页，检查新页签目录");
        await device.pressKey("ctrl+t");
        await agent.aiWaitFor("窗口上方显示了2个标签页");
        // 预期5：还是计算机目录
        await agent.aiAssert("新打开的标签页显示的是计算机");

        // 关闭文件管理器
        await closeFileManager(system);


    }, { timeout: 1200000, tags: ["1936021", 'level3', 'fixed_tabs', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log('5. afterAll: 清理测试套件');
        await closeFileManager(system);
    });
});
