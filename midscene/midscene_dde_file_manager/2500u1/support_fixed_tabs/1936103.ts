/**
 * 用例 PMSID: 1936103
 * 用例标题: 【支持固定标签页】添加特殊权限的目录为固定目录
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/07/15
 */


const caseDir = process.env.TESTCASE_DIR;

describe('1936103-【支持固定标签页】添加特殊权限的目录为固定目录', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log('1. beforeAll: 初始化测试套件');
        await closeFileManager(system);
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1936103-【支持固定标签页】添加特殊权限的目录为固定目录', async ({ device, agent, uos, system }) => {
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const userName = process.env.TEST_USERNAME;
        // 前置条件1：桌面上有只写权限的目录A和NA权限的目录B
        console.log("前置条件1：创建只写权限目录A和NA权限目录B");
        await system.exec(`mkdir -p /home/${userName}/Desktop/A`);
        await system.exec(`chmod 200 /home/${userName}/Desktop/A`);
        await system.exec(`mkdir -p /home/${userName}/Desktop/B`);
        await system.exec(`chmod 000 /home/${userName}/Desktop/B`);

        // 步骤1：打开文管，设置-基础设置-新窗口-自定义目录，添加桌面上的目录A和目录B
        console.log("步骤1：添加目录A到自定义目录");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
        await agent.aiWaitFor("弹出了下拉选项菜单");
        await agent.aiTap("设置", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
        await agent.aiTap("设置窗口左侧导航栏中'基础设置'分组下的'新窗口'菜单项，位于'打开行为'和'新标签'之间", { deepThink: true });
        await agent.aiTap("自定义目录右侧的+号", { deepThink: true });
        await agent.aiDoubleClick("文件选择对话框左侧导航栏中的'桌面'项", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 100));
        await agent.aiDoubleClick("文件选择对话框内容区中名为'A'的文件夹", { deepThink: true });
        await agent.aiTap("打开");
        // 预期1：添加A成功
        await agent.aiAssert(`自定义目录下显示路径：/home/${userName}/Desktop/A`);
        //添加：B
        await agent.aiTap("自定义目录右侧的+号");
        await agent.aiDoubleClick("文件选择对话框左侧导航栏中的'桌面'项");
        await new Promise(resolve => setTimeout(resolve, 100));
        await agent.aiDoubleClick("文件选择对话框内容区中名为'B'的文件夹");
        await agent.aiTap("打开");
        // 预期1：添加B成功
        await agent.aiAssert(`自定义目录下显示路径：/home/${userName}/Desktop/B`);
        await closeFileManager(system);
        // 步骤2：切换到目录A时，提示没有权限访问该文件夹
        console.log("步骤2：切换到目录A时，提示没有权限访问该文件夹");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器窗口有目录A的标签页");
        // 切换到目录A时，提示没有权限访问该文件夹
        await agent.aiTap("文件管理器窗口上方的目录A标签页");
        await new Promise(resolve => setTimeout(resolve, 500));
        await agent.aiAssert("提示没有权限访问该文件夹");
        await new Promise(resolve => setTimeout(resolve, 500));

        // 步骤3：打开新文管窗口，检查文管是否正常打开且有目录B的标签页
        console.log("步骤3：切换到目录B时，提示没有权限访问该文件夹");
        await agent.aiAssert("文件管理器窗口有目录B的标签页");
        // 切换到目录B时，提示没有权限访问该文件夹
        await agent.aiTap("文件管理器窗口上方的目录B标签页");
        await new Promise(resolve => setTimeout(resolve, 500));
        await agent.aiAssert("提示没有权限访问该文件夹");

        // // 关闭文件管理器
        await closeFileManager(system);
    }, { timeout: 1200000, tags: ["1936103", 'level3', 'fixed_tabs', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log('5. afterAll: 清理测试套件');
        const userName = process.env.TEST_USERNAME;

        // 删除自定义目录配置
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
        await agent.aiWaitFor("弹出了下拉选项菜单");
        await agent.aiTap("设置", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
        await agent.aiTap("设置窗口左侧导航栏中'基础设置'分组下的'新窗口'菜单项，位于'打开行为'和'新标签'之间", { deepThink: true });
        await agent.aiTap(`/home/${userName}/Desktop/A右侧的删除图标按钮`);
        await agent.aiTap(`/home/${userName}/Desktop/B右侧的删除图标按钮`);
        await agent.aiTap("当前弹出的窗口中对话框的关闭按钮:x", { deepThink: true });
        await closeFileManager(system);

        // 恢复目录权限并删除
        await system.exec(`chmod 755 /home/${userName}/Desktop/A`);
        await system.exec(`chmod 755 /home/${userName}/Desktop/B`);
        await system.exec(`rm -rf /home/${userName}/Desktop/A`);
        await system.exec(`rm -rf /home/${userName}/Desktop/B`);
    });
});
