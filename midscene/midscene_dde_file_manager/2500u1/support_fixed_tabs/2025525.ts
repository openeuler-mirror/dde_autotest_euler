/**
 * 用例 PMSID: 2025525
 * 用例标题: 【支持固定标签页】文件选择/保存对话框中的固定标签页
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/07/16
 */

const caseDir = process.env.TESTCASE_DIR;

describe('2025525-【支持固定标签页】文件选择/保存对话框中的固定标签页', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        await closeFileManager(system);
        const userName = process.env.TEST_USERNAME;

        // 前置条件1：创建测试文件夹A1
        console.log("前置条件1：创建测试文件夹A1");
        await system.exec(`mkdir -p /home/${userName}/Desktop/A1`);

        // 前置条件2：在桌面创建一个文本文件
        console.log("前置条件2：在桌面创建文本文件");
        await system.exec(`touch /home/${userName}/Desktop/test.txt`);
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('2025525-【支持固定标签页】文件选择/保存对话框中的固定标签页', async ({ device, agent, uos, system }) => {
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const userName = process.env.TEST_USERNAME;

        // 前置条件：设置固定标签页，目录为A1
        console.log("前置条件：设置固定标签页，目录为A1");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        await agent.aiTap("文件管理器窗口右上角主菜单按钮", { deepThink: true });
        await agent.aiTap("设置", { deepThink: true });
        await agent.aiWaitFor("设置窗口已显示");
        await agent.aiTap("设置窗口左侧导航栏中'基础设置'分组下的'新窗口'菜单项，位于'打开行为'和'新标签'之间", { deepThink: true });
        await agent.aiTap("默认目录右侧的'计算机'下拉框", { deepThink: true });
        await agent.aiWaitFor("'指定目录'已显示");
        await agent.aiTap("指定目录");
        await new Promise(resolve => setTimeout(resolve, 100));
        await agent.aiDoubleClick("弹出的对话框中的左侧的桌面文本");
        await new Promise(resolve => setTimeout(resolve, 100));
        await agent.aiDoubleClick("'A1'文本");
        await new Promise(resolve => setTimeout(resolve, 100));
        await agent.aiTap("打开");
        await agent.aiTap("当前小窗口对话框右上角关闭按钮:x", { deepThink: true });

        // 关闭文件管理器
        await closeFileManager(system);

        // 步骤1：打开一个文本文件，点击打开文件，检查弹出的对话框中固定标签页是否和设置的固定标签页一致
        console.log("步骤1：打开文本文件，检查文件选择对话框中的固定标签页");
        await agent.aiWaitFor("桌面上展示了test.txt文件");
        await agent.aiDoubleClick("test.txt");
        await agent.aiWaitFor("文本编辑器已打开");
        await agent.aiTap("窗口右上角主菜单按钮", { deepThink: true });
        await agent.aiTap("打开");
        await agent.aiWaitFor("打开文件对话框已显示");
        // 预期1：文件选择对话框不显示设置的自定义目录，只显示被指定目录（一般是桌面）
        await agent.aiAssert("打开的文件管理器对话框中最上方的页签只显示了桌面，没有显示A1页签");
        await agent.aiTap("取消");

        // 步骤2：编辑之后选择另存为，检查弹出的对话框中固定标签页是否和设置的固定标签页一致
        console.log("步骤2：编辑后另存为，检查保存对话框中的固定标签页");
        await agent.aiTap("文本编辑器右上角主菜单按钮", { deepThink: true });
        await agent.aiTap("另存为");
        await agent.aiWaitFor("另存为对话框已显示");
        // 预期3：另存为对话框不显示设置的自定义目录
        await agent.aiAssert("打开的另存为对话框中最上方的页签只显示了桌面，没有显示A1页签");

        // 步骤3：选择任意目录进行保存
        console.log("步骤3：选择目录进行保存");
        await agent.aiTap("左侧导航栏的'视频'文本", { deepThink: true });
        await agent.aiTap("保存");
        // 预期4：保存成功
        await agent.aiTap("文本编辑器右上角主菜单", { deepThink: true });
        await agent.aiTap("打开");
        await agent.aiWaitFor("打开文件对话框已显示");
        await agent.aiTap("当前弹出的对话框中左侧的'视频'导航文本", { deepThink: true });
        await agent.aiAssert("视频文件夹中显示了test.txt文件");

        // 关闭文件管理器和文本编辑器
        await closeFileManager(system);
        await system.exec("kill -TERM $(pidof deepin-editor)");

    }, { timeout: 1200000, tags: ["2025525", 'level3', 'fixed_tabs', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log('5. afterAll: 清理测试套件');
        const userName = process.env.TEST_USERNAME;

        // 删除测试文件夹和文件
        await system.exec(`rm -rf /home/${userName}/Desktop/A1`);
        await system.exec(`rm -f /home/${userName}/Desktop/test.txt`);
        await system.exec(`rm -f /home/${userName}/Videos/test.txt`);
        await closeFileManager(system);
        await system.exec("kill -TERM $(pidof deepin-editor)");
    });
});
