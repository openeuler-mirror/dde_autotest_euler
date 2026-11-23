/**
 * 用例 PMSID: 1940833
 * 用例标题: 【支持固定标签页】添加自定义目录后打开文管，切换目录
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/07/15
 */


const caseDir = process.env.TESTCASE_DIR;

describe('1940833-【支持固定标签页】添加自定义目录后打开文管，切换目录', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        const { closeFileManager, setDconfig } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        await closeFileManager(system);
        const userName = process.env.TEST_USERNAME;

        // 重置环境：恢复新窗口默认目录为计算机，清空自定义目录配置，删除残留测试目录
        console.log("重置环境：UrlOfNewWindow恢复为computer并清空自定义目录");
        await system.exec(`mkdir -p /home/${userName}/.config/deepin/dde-file-manager && printf '{"ApplicationAttribute":{"IconSizeLevel":5,"UrlOfNewWindow":"computer:///"}}' > /home/${userName}/.config/deepin/dde-file-manager/dde-file-manager.json`);
        await setDconfig(system, 'dfm.custom.fixedtab', '[]');
        await system.exec(`rm -rf /home/${userName}/Desktop/A1`);

        // 前置条件1：桌面创建A1文件夹
        console.log("前置条件1：创建桌面A1文件夹");
        await system.exec(`mkdir -p /home/${userName}/Desktop/A1`);

        // 前置条件2：在文件管理器-主菜单-设置-新窗口-自定义目录 添加桌面A1文件夹
        console.log("前置条件2：添加桌面A1文件夹到自定义目录");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        await agent.aiTap("窗口右上角主菜单按钮", { deepThink: true });
        await agent.aiTap("设置", { deepThink: true });
        await agent.aiWaitFor("设置窗口已显示");
        await agent.aiTap("设置窗口左侧导航栏中'基础设置'分组下的'新窗口'菜单项，位于'打开行为'和'新标签'之间", { deepThink: true });
        await agent.aiTap("自定义目录右侧的+号", { deepThink: true });
        await agent.aiDoubleClick("文件选择对话框左侧导航栏中的'桌面'项", { deepThink: true });
        await agent.aiDoubleClick("文件选择对话框内容区中名为'A1'的文件夹", { deepThink: true });
        await agent.aiTap("打开");
        await agent.aiTap("当前对话框的关闭按钮:x", { deepThink: true });
        await closeFileManager(system);
        await new Promise(resolve => setTimeout(resolve, 2000));
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1940833-【支持固定标签页】添加自定义目录后打开文管，切换目录', async ({ device, agent, uos, system }) => {
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        // 步骤1：打开1个新文管窗口，检查是否有两个标签页
        console.log("步骤1：打开新文管窗口，检查标签页");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        // 预期1：有两个标签页，一个是计算机目录，一个是A1目录
        await agent.aiAssert("标签栏中存在'计算机'标签页和'A1'标签页，共两个标签页");

        // 步骤2：切换到A1目录标签页后点击左侧栏的计算机
        console.log("步骤2：切换到A1目录标签页后点击左侧栏的计算机");
        await agent.aiTap("窗口顶部上方的'A1'标签页", { deepThink: true });
        await agent.aiTap("窗口顶部上方的'计算机'标签页", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 预期2：A1目录变为计算机界面
        await agent.aiAssert("当前已切换为计算机目录");

        // 步骤3：不停切换计算机的标签页和A1的标签页，每次切换后验证标签页是否切换成功
        console.log("步骤3：不停切换两个标签页并验证");
        await agent.aiTap("第一个标签页的'计算机'文本", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        await agent.aiAssert("当前已切换为计算机目录");
        await agent.aiTap("第二个标签页的'A1'文本");
        await new Promise(resolve => setTimeout(resolve, 500));
        await agent.aiAssert("当前已切换为A1目录");
        await agent.aiTap("第一个标签页的'计算机'文本", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 500));
        await agent.aiAssert("当前已切换为计算机目录");
        await agent.aiTap("第二个标签页 的'A1'文本");
        await new Promise(resolve => setTimeout(resolve, 500));
        await agent.aiAssert("当前已切换为A1目录");

        // 关闭文件管理器
        await closeFileManager(system);

    }, { timeout: 1200000, tags: ["1940833", 'level3', 'fixed_tabs', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        const { closeFileManager, setDconfig } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log('5. afterAll: 清理测试套件');
        const userName = process.env.TEST_USERNAME;
        await closeFileManager(system);

        // 删除自定义目录A1配置（直接清空dconfig配置，比UI操作更稳定）
        await setDconfig(system, 'dfm.custom.fixedtab', '[]');
        // 恢复新窗口默认目录为计算机
        await system.exec(`printf '{"ApplicationAttribute":{"IconSizeLevel":5,"UrlOfNewWindow":"computer:///"}}' > /home/${userName}/.config/deepin/dde-file-manager/dde-file-manager.json`);

        // 删除桌面A1文件夹
        await system.exec(`rm -rf /home/${userName}/Desktop/A1`);
    });
});
