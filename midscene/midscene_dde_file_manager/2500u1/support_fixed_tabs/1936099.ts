/**
 * 用例 PMSID: 1936099
 * 用例标题: 【支持固定标签页】固定目录已被打开后删除固定目录
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/07/16
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1936099-【支持固定标签页】固定目录已被打开后删除固定目录', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        const { closeFileManager, setDconfig } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log('1. beforeAll: 初始化测试套件');
        await closeFileManager(system);
        const userName = process.env.TEST_USERNAME;

        // 重置环境：恢复新窗口默认目录为计算机，清空自定义目录配置，删除残留测试目录
        console.log("重置环境：UrlOfNewWindow恢复为computer并清空自定义目录");
        await system.exec(`mkdir -p /home/${userName}/.config/deepin/dde-file-manager && printf '{"ApplicationAttribute":{"IconSizeLevel":5,"UrlOfNewWindow":"computer:///"}}' > /home/${userName}/.config/deepin/dde-file-manager/dde-file-manager.json`);
        await setDconfig(system, 'dfm.custom.fixedtab', '[]');
        await system.exec(`rm -rf /home/${userName}/Desktop/A /home/${userName}/Desktop/A-1 /home/${userName}/Desktop/A-2`);
        await uos.showDesktop();

        // 前置条件1：创建目录A
        console.log("前置条件1：创建目录A");
        await system.exec(`mkdir -p /home/${userName}/Desktop/A`);

    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1936099-【支持固定标签页】固定目录已被打开后删除固定目录', async ({ device, agent, uos, system }) => {
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const userName = process.env.TEST_USERNAME;

        // 前置条件：打开文管，设置-基础设置-新窗口-自定义目录，添加目录A
        console.log("前置条件：添加自定义目录A");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        await agent.aiTap("窗口右上角主菜单按钮", { deepThink: true });
        await agent.aiWaitFor("弹出了下拉选项菜单");
        await agent.aiTap("设置");
        await agent.aiWaitFor("设置窗口已显示");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiTap("设置窗口左侧导航栏中'基础设置'分组下的'新窗口'菜单项，位于'打开行为'和'新标签'之间", { deepThink: true });
        await agent.aiTap("自定义目录右侧的+号");
        await agent.aiDoubleClick("打开的对话框中左侧桌面导航栏");
        await agent.aiDoubleClick("A文件夹图标");
        await agent.aiTap("打开");
        await closeFileManager(system);

        await new Promise(resolve => setTimeout(resolve, 1000));

        // 步骤1：点击任务栏上的文管图标打开文管
        console.log("步骤1：点击任务栏上的文管图标打开文管");
        await uos.openApp('文件管理器', 3000, 20000, true);
        // 预期1：打开的文管窗口有目录A的标签页
        await agent.aiAssert("打开的文管窗口有目录A的标签页");
        await agent.aiTap("当前对话框窗口右上角关闭按钮:x");

        // 步骤2：重命名目录A为A-1
        console.log("步骤2：重命名目录A为A-1");
        await system.exec(`mv /home/${userName}/Desktop/A /home/${userName}/Desktop/A-1`);
        // 预期2：验证重命名成功
        await agent.aiAssert("桌面存在目录A-1");

        // 步骤3：激活步骤1的文管窗口，检查目录A标签页是否自动删除
        console.log("步骤3：检查目录A标签页是否自动删除");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiWaitFor("文件管理器已打开");
        await agent.aiTap("窗口最上方的A标签页");
        await agent.aiAssert("提示找不到该目录，是否移除？");
        await agent.aiTap("移除", { deepThink: true });
        await agent.aiAssert("打开的文管窗口没有目录A的标签页");

        // 步骤4：打开文管，设置-基础设置-新窗口-自定义目录，添加目录A-1
        console.log("步骤4：添加自定义目录A-1");
        await agent.aiTap("窗口右上角主菜单按钮", { deepThink: true });
        await agent.aiWaitFor("弹出了下拉选项菜单");
        await agent.aiTap("设置");
        await agent.aiWaitFor("设置窗口已显示");
        await agent.aiTap("设置窗口左侧导航栏中'基础设置'分组下的'新窗口'菜单项，位于'打开行为'和'新标签'之间", { deepThink: true });
        await agent.aiTap("自定义目录右侧的+号");
        await agent.aiDoubleClick("打开的对话框中左侧桌面导航栏");
        await agent.aiDoubleClick("A-1文件夹图标");
        await agent.aiTap("打开");
        await agent.aiAssert(`自定义目录下显示路径：/home/${userName}/Desktop/A-1`);
        await closeFileManager(system);
        await new Promise(resolve => setTimeout(resolve, 1000));
        // 预期4：添加成功

        // 步骤5：打开两个文管窗口，分别对应文管窗口1和文管窗口2（活动窗口）
        console.log("步骤5：打开两个文管窗口");
        await agent.aiDoubleClick("计算机");
        await agent.aiAssert("已打开的文管窗口上方有目录A-1的标签页");
        await device.pressKey("super+right");
        await new Promise(resolve => setTimeout(resolve, 100));
        await agent.aiDoubleClick("最左侧桌面上主目录", { deepThink: true });
        await agent.aiAssert("已打开的文管窗口上方有主目录标签页和A-1的标签页");
        await closeFileManager(system);
        await agent.aiWaitFor("桌面展示了A-1文件夹");

        // 步骤6：重命名目录A-1为A-2
        console.log("步骤6：重命名目录A-1为A-2");
        await system.exec(`mv /home/${userName}/Desktop/A-1 /home/${userName}/Desktop/A-2`);
        // 预期6：重命名成功
        await agent.aiAssert("桌面存在目录A-2");

        // 步骤7：检查步骤5的两个文管窗口是否自动删除目录A-1标签页
        console.log("步骤7：检查两个文管窗口是否自动删除目录A-1标签页");
        await agent.aiDoubleClick("桌面的计算机图标", { deepThink: true });
        await agent.aiWaitFor("计算机窗口已打开");
        await agent.aiTap("窗口最上方的A-1标签页");
        await agent.aiAssert("提示找不到该目录，是否移除？");
        await agent.aiTap("移除", { deepThink: true });
        await agent.aiAssert("打开的文管窗口没有目录A-1的标签页");
        await closeFileManager(system);
        await new Promise(resolve => setTimeout(resolve, 1000));

        await agent.aiDoubleClick("桌面的计算机图标", { deepThink: true });
        await agent.aiWaitFor("计算机窗口已打开");
        await agent.aiAssert("打开的文管窗口没有目录A-1的标签页");

        // 关闭文件管理器        
        await closeFileManager(system);
    }, { timeout: 1200000, tags: ["1936099", 'level3', 'fixed_tabs', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        const { closeFileManager, setDconfig } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log('5. afterAll: 清理测试套件');
        const userName = process.env.TEST_USERNAME;
        await closeFileManager(system);
        await system.exec(`rm -rf /home/${userName}/Desktop/A /home/${userName}/Desktop/A-1 /home/${userName}/Desktop/A-2`);
        // 清理自定义目录配置，并恢复新窗口默认目录为计算机
        await setDconfig(system, 'dfm.custom.fixedtab', '[]');
        await system.exec(`printf '{"ApplicationAttribute":{"IconSizeLevel":5,"UrlOfNewWindow":"computer:///"}}' > /home/${userName}/.config/deepin/dde-file-manager/dde-file-manager.json`);
    });
});
