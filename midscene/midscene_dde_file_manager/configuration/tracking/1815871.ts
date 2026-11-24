/**
 * 用例 PMSID: 1815871
 * 用例标题:  埋点-右键菜单项点击分布-特殊场景，保险箱
 * 生成时间: 2026-07-20 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

describe('1815871-埋点-右键菜单项点击分布-特殊场景，保险箱', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();

    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 清理环境
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -15");
        await system.exec("ps -ef | grep deepin-movie | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true");
        const { clearEnvironment, rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await clearEnvironment(system);
        await rmVault(system);
    });

    test('1815871-埋点-右键菜单项点击分布-特殊场景，保险箱', async ({ device, agent, uos, env, system }) => {

        const { createPasswordVault, UiRmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

        // 步骤1：右键左侧栏的保险箱，分别点击创建和删除
        // ========== 测试点1：创建保险箱并验证上报事件 ==========
        console.log("测试点1: 创建保险箱并验证上报事件");
        await createPasswordVault(uos, env, agent, device, system);
        
        // 在终端中执行命令监控日志
        console.log('在终端中执行日志监控命令');
        await device.pressKey("Ctrl+Alt+T"); 
        await agent.aiTap("终端窗口的标题栏");
        await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");
        await device.pressKey('Enter');

        //await agent.aiTap("终端窗口的标题栏");
        await agent.aiAssert("终端新增一条日志，且内容包含'serial'和'dde-file-dialog'关键词");
        await device.pressKey("Ctrl+C");
        await agent.aiTap("终端窗口的x关闭按钮");
        await agent.aiTap("文件管理器窗口的x关闭按钮");
        // ========== 测试点2：删除保险箱并验证上报事件 ==========
        console.log("测试点2: 删除保险箱并验证上报事件");
        await UiRmVault(device, agent, uos, env, system);

        console.log('在终端中执行日志监控命令');
        await device.pressKey("Ctrl+Alt+T"); 
        await device.pressKey("Super+Up");
        await new Promise(resolve => setTimeout(resolve, 3000));
        await agent.aiTap("终端窗口的标题栏");
        // 验证删除保险箱的上报事件
        console.log("验证删除保险箱的上报事件");
        await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");
        await device.pressKey('Enter');
        await agent.aiAssert("终端新增一条日志，且内容包含'删除保险箱'关键词");

        // 停止日志监控
        console.log('停止日志监控');
        await device.pressKey("Ctrl+C");

        // 关闭终端
        await agent.aiTap("终端窗口的x关闭按钮");

    }, { timeout: 1800000, tags: ['1815871', 'level4', 'configuration', 'tracking', 'vault', 'DITT', 'lanyanling'] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, env, system }) => {
        console.log('5. afterAll: 清理测试套件');
        const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await rmVault(system);        
        // 关闭所有可能残留的进程
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9");
        console.log('清理完成');
    });
});