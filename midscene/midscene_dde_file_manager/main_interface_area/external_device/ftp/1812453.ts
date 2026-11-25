/**
 * 用例 PMSID: 1812453
 * 用例标题: 右键菜单-挂载ftp目录下右键病毒查杀
 * 生成时间：2026-07-21
 * 用例编写人：UT005045(许琪)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1812453-右键菜单-挂载ftp目录下右键病毒查杀', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system, uos }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        const { cleanFtpMounts, FtpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        // 前置完全卸载ftp
        await cleanFtpMounts(agent, system, 1);        // 用户名挂载ftp
        await uos.openApp('文件管理器', 3000, 20000, true);
        await agent.aiAssert("文件管理器界面已显示");
        await FtpMount(agent, system, device, 1);
    });

    test('1812453-右键菜单-挂载ftp目录下右键病毒查杀', async ({ device, agent, uos, system }) => {
        const ip = process.env.FTP_IP;

        // 通过命令在ftp目录下创建1812453文件夹、，刷新后验证展示
        console.log("通过命令创建1812453文件夹");
        await system.exec(`mkdir -p /run/user/1000/gvfs/ftp\\:host\\=${ip}/1812453`, 500);
        await device.pressKey("F5");
        await device.pressKey("F5");
        await agent.aiWaitFor("1812453文件夹已显示");

        // 步骤1：选中单个文件夹-右键-点击病毒查杀
        console.log("步骤1：选中单个文件夹，右键点击病毒查杀");
        await agent.aiRightClick("1812453");
        await agent.aiTap("病毒查杀");
        // 预期1：正常调起安全中心
        await agent.aiAssert("安全中心病毒查杀界面已打开");
        // 关闭安全中心
        await agent.aiTap("安全中心窗口关闭按钮");

        // 步骤2：选中单个文件-右键-点击病毒查杀
        console.log("步骤2：选中单个文件，右键点击病毒查杀");
        await agent.aiDoubleClick("1812453");
        await agent.aiRightClick("文件管理器窗口空白处");
        await agent.aiTap("新建文档");
        await agent.aiTap("文本文档");
        await device.typeText("1812453_file");
        await device.pressKey("enter");
        await agent.aiWaitFor("1812453_file.txt文件已创建");
        await agent.aiRightClick("1812453_file.txt");
        await agent.aiTap("病毒查杀");
        // 预期2：正常调起安全中心
        await agent.aiAssert("安全中心病毒查杀界面已打开");

        // 关闭安全中心
        await agent.aiTap("安全中心窗口关闭按钮");

    }, { timeout: 600000, tags: ['1812453', 'level3', 'ftp', 'DITT', 'xuqi'] });

    afterEach(async ({ device }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const ip = process.env.FTP_IP;
        // 清除ftp目录下的测试文件和文件夹
        await system.exec(`rm '/run/user/1000/gvfs/ftp:host=${ip}/1812453_file.txt'`, 500);
        await system.exec(`rm -rf '/run/user/1000/gvfs/ftp:host=${ip}/1812453'`, 500);
        // 卸载ftp
        const { cleanFtpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await cleanFtpMounts(agent, system, 1);
        await system.exec("kill -TERM $(pidof dde-file-manager)");
    });
});
