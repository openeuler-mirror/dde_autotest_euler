/**
 * 用例 PMSID: 1816023
 * 用例标题: 埋点-打开任意目录检查上传时间
 * 生成时间: 2026-7-15 21:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

describe('1816023-埋点-打开任意目录检查上传时间', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();

    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 清理环境
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9");        
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await clearEnvironment(system);
    });

    test('1816023-埋点-打开任意目录检查上传时间', async ({ device, agent, uos, env, system }) => {
        // 步骤1：打开任意目录
        console.log("步骤1: 打开任意目录");
        
        // 打开文件管理器
        await uos.openApp("文件管理器", 3000, 20000, true);

        // 按 Super+Left 将窗口靠左
        console.log('按 Super+Left 将文件管理器靠左');
        await device.pressKey("Super+Left");

        // 通过 Ctrl+Alt+T 快捷键打开终端
        console.log('通过 Ctrl+Alt+T 打开终端');
        await device.pressKey("Ctrl+Alt+T");

        // 按 Super+Right 将终端窗口靠右
        console.log('按 Super+Right 将终端靠右');
        await device.pressKey("Super+Right");

        // 在终端中执行命令：ls /var/lib/deepin/event-log/*.log | xargs tail -f
        console.log('在终端中执行日志监控命令');
        await agent.aiTap("终端窗口的标题栏");
        await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");
        // 多次回车确保命令执行
        for (let i = 0; i < 6; i++) {
            await device.pressKey('Enter');
        }

        // 点击左侧栏桌面
        console.log('点击左侧栏的"桌面"');
        await agent.aiTap("文件管理器窗口的标题栏");
        await agent.aiTap("文件管理器左侧栏中的'桌面'");

        // 验证预期结果：终端上有一条新的日志，里面带有关键词：Open
        console.log("验证预期结果: 正常记录打开时间");
        
        // 将终端窗口置顶以便查看
        await agent.aiTap("终端窗口的标题栏");
        
        // 检查终端输出中是否包含"Open"关键词
        // 使用AI断言检查终端内容
        await agent.aiAssert("终端新增一条日志，且内容包含'Open'关键词");
        
        // 停止tail -f命令（Ctrl+C）
        console.log('停止日志监控');
        await agent.aiTap("终端窗口");
        await device.pressKey("Ctrl+C");

    }, { timeout: 1800000, tags: ['1816023', 'level3', 'configuration', 'tracking', 'DITT', 'lanyanling'] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');

    });

    afterAll(async ({ uos, agent, device, env, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 关闭所有可能残留的进程
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -15");
        console.log('清理完成');
    });
});