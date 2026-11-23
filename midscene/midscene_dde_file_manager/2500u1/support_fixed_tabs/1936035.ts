/**
 * 用例 PMSID: 1936035
 * 用例标题: 【支持固定标签页】删除默认目录后，新窗口默认目录变为计算机
 * 用例编写人: UT005045(许琪)
 * 生成时间：2026/07/15
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1936035-【支持固定标签页】删除默认目录后，新窗口默认目录变为计算机', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log('1. beforeAll: 初始化测试套件');
        await closeFileManager(system);
        const userName = process.env.TEST_USERNAME;

        // 重置环境：恢复新窗口默认目录为计算机，清理其他用例可能残留的UrlOfNewWindow配置
        console.log("重置环境：UrlOfNewWindow恢复为computer");
        await system.exec(`mkdir -p /home/${userName}/.config/deepin/dde-file-manager && printf '{"ApplicationAttribute":{"IconSizeLevel":5,"UrlOfNewWindow":"computer:///"}}' > /home/${userName}/.config/deepin/dde-file-manager/dde-file-manager.json`);
        await uos.showDesktop();

        // 前置条件1：在视频，音乐，图片，文档目录下分别创建文件夹A1，B1，C1，D1，每个文件夹中放入一些文件
        console.log("前置条件1：创建测试文件夹和文件");
        await system.exec(`mkdir -p /home/${userName}/Videos/A1 /home/${userName}/Music/B1 /home/${userName}/Pictures/C1 /home/${userName}/Documents/D1`);
        await system.exec(`touch /home/${userName}/Videos/A1/file1.txt /home/${userName}/Videos/A1/file2.txt`);
        await system.exec(`touch /home/${userName}/Music/B1/file1.txt /home/${userName}/Music/B1/file2.txt`);
        await system.exec(`touch /home/${userName}/Pictures/C1/file1.txt /home/${userName}/Pictures/C1/file2.txt`);
        await system.exec(`touch /home/${userName}/Documents/D1/file1.txt /home/${userName}/Documents/D1/file2.txt`);
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1936035-【支持固定标签页】删除默认目录后，新窗口默认目录变为计算机', async ({ device, agent, uos, system }) => {
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        const userName = process.env.TEST_USERNAME;

        // 前置条件2：设置默认目录为视频-A1文件夹（直接写入UrlOfNewWindow配置，比设置界面导航更稳定）
        console.log("前置条件2：设置默认目录为视频-A1文件夹");
        await system.exec(`printf '{"ApplicationAttribute":{"IconSizeLevel":5,"UrlOfNewWindow":"file:///home/${userName}/Videos/A1"}}' > /home/${userName}/.config/deepin/dde-file-manager/dde-file-manager.json`);
        await closeFileManager(system);

        // 删除目录A1
        console.log("删除目录A1");

        await system.exec(`rm -rf /home/${userName}/Videos/A1`);

        // 步骤1：打开一个新文管窗口，检查文管设置中的默认目录是否变为计算机
        console.log("步骤1：打开新文管窗口，检查默认目录");
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        await agent.aiTap("窗口右上角主菜单按钮", { deepThink: true });
        await agent.aiWaitFor("弹出了下拉选项菜单");
        await agent.aiTap("设置", { deepThink: true });
        await agent.aiWaitFor("设置窗口已显示");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiTap("设置窗口左侧导航栏中'基础设置'分组下的'新窗口'菜单项，位于'打开行为'和'新标签'之间", { deepThink: true });
        // 预期1：默认目录变为计算机
        await agent.aiAssert("默认目录变为计算机");
        await agent.aiTap("设置窗口关闭按钮:x", { deepThink: true });

        // 步骤2：检查文管是否正常打开
        console.log("步骤2：检查文管是否正常打开");
        await agent.aiAssert("文管正常打开");
        // // 关闭文件管理器
        await closeFileManager(system);

    }, { timeout: 1200000, tags: ["1936035", 'level3', 'fixed_tabs', 'DITT', 'xuqi'] });

    afterEach(async ({ device, system, agent, uos }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        console.log('5. afterAll: 清理测试套件');
        const userName = process.env.TEST_USERNAME;
        await closeFileManager(system);

        // 恢复新窗口默认目录为计算机
        await system.exec(`printf '{"ApplicationAttribute":{"IconSizeLevel":5,"UrlOfNewWindow":"computer:///"}}' > /home/${userName}/.config/deepin/dde-file-manager/dde-file-manager.json`);

        // 删除测试文件夹和文件
        await system.exec(`rm -rf /home/${userName}/Videos/A1`);
        await system.exec(`rm -rf /home/${userName}/Music/B1`);
        await system.exec(`rm -rf /home/${userName}/Pictures/C1`);
        await system.exec(`rm -rf /home/${userName}/Documents/D1`);
    });
});
