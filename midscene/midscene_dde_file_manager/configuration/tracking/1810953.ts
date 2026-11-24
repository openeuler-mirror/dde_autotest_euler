/**
 * 用例 PMSID: 1810953
 * 用例标题:  埋点，侧边栏各目录去重后的点击分布-主目录
 * 生成时间: 2026-08-03 16:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

async function clickDesktopSidebar(uos, agent, device, system) {
    // 定义需要测试的场景
    const testScenarios = [
        { name: '主目录', logKeyword: 'Open' }
    ];

    for (const scenario of testScenarios) {
        // 在终端中执行日志监控命令
        console.log('在终端中执行日志监控命令');
        await agent.aiTap("终端窗口的标题栏");
        await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");
        await device.pressKey('Enter');
        console.log(`步骤: 点击左侧边栏的"${scenario.name}"`);
        
        // 多次回车确保命令执行
        await agent.aiTap("终端窗口的标题栏");
        for (let i = 0; i < 3; i++) {
            await device.pressKey('Enter');
        }
        
        // 点击文件管理器窗口激活
        await agent.aiTap("文件管理器窗口的标题栏");
        
        // 点击左侧边栏的"桌面"
        await agent.aiTap("文件管理器左侧栏中的'主目录'");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 验证预期1结果：触发上报事件
        console.log(`验证预期结果: 触发上报事件，点击: ${scenario.name}`);
        
        // 将终端窗口置顶以便查看
        await agent.aiTap("终端窗口的标题栏");
        await agent.aiAssert(`终端新增一条日志，且内容包含'${scenario.logKeyword}'和'主目录'关键词`);
        
        // 停止日志监控（Ctrl+C）
        console.log('停止日志监控');
        await agent.aiTap("终端窗口");
        await device.pressKey("Ctrl+C");
        await device.typeText("clear");
        await device.pressKey("Enter");
    }
}

describe('1810953-埋点，侧边栏各目录去重后的点击分布-主目录', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        // 清理环境
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true");
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await clearEnvironment(system);
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1810953-埋点，侧边栏各目录去重后的点击分布-主目录', async ({ device, agent, uos, env, system }) => {
        const { closeAllTxt } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        
        // ========== 第一部分：在文件管理器中操作 ==========
        console.log('========== 步骤1:打开文管，点击左侧边栏 - 主目录 ==========');
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
        
        // 执行左侧边栏点击操作
        await clickDesktopSidebar(uos, agent, device, system);

    }, { timeout: 1800000, tags: ['1810953', 'level2', 'configuration', 'tracking', 'DITT', 'lanyanling'] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, env, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 关闭所有可能残留的进程
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -15 2>/dev/null || true");
        console.log('清理完成');
    });
});