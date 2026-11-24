/**
 * 用例 PMSID: 1815831
 * 用例标题:  埋点，右键菜单项点击分布-新建文件夹
 * 生成时间: 2026-07-21 20:30:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

describe('1815831-埋点，右键菜单项点击分布-新建文件夹', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 清理环境
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true");
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await clearEnvironment(system);
        
        // 确保测试文件夹不存在
        await system.exec(`rm -rf /home/${userName}/Desktop/新建文件夹* 2>/dev/null || true`);
        await system.exec(`rm -rf /home/${userName}/Desktop/测试文件夹* 2>/dev/null || true`);
    });

    test('1815831-埋点，右键菜单项点击分布-新建文件夹-场景1', async ({ device, agent, uos, env, system }) => {
        console.log("步骤1: 空白地方，右键点击【新建文件夹】");

        // ========== 第一部分：在桌面直接操作 ==========
        console.log('========== 第一部分：在桌面直接操作 ==========');       

        // 通过 Ctrl+Alt+T 快捷键打开终端
        console.log('通过 Ctrl+Alt+T 快捷键打开终端');
        await device.pressKey("Ctrl+Alt+T");

        // 按 Super+Right 将终端窗口靠右
        console.log('按 Super+Right 将终端靠右');
        await device.pressKey("Super+Right");
        
        // 在终端中执行日志监控命令
        console.log('在终端中执行日志监控命令');
        await agent.aiTap("终端窗口的标题栏");
        await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");
        for (let i = 0; i < 5; i++) {
            await device.pressKey('Enter');
        } 
  
        // 在桌面空白处右键点击【新建文件夹】
        console.log('在桌面空白处右键点击【新建文件夹】');
        await agent.aiRightClick("桌面上左下角空白处");
        await agent.aiTap("新建文件夹");
        await agent.aiTap("桌面空白处");
        
        // 等待新建文件夹出现
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 将终端窗口置顶以便查看
        await agent.aiTap("终端窗口的标题栏");
        // 预期：触发上报事件
        await agent.aiAssert("终端新增一条日志，且内容包含'新建文件夹'关键词");

        // 删除刚刚创建的文件夹
        console.log('删除桌面上的新建文件夹');
        await agent.aiTap("桌面上名称为'新建文件夹'的图标");
        await device.pressKey("Delete");

        // ========== 第二部分：在文件管理器中操作 ==========
        console.log('========== 第二部分：在文件管理器中操作 ==========');
        console.log("步骤2: 打开文管，点击左侧栏的桌面，在桌面目录空白地方，右键点击【新建文件夹】");
        
        // 关闭当前文件管理器，重新打开
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 重新打开文件管理器
        await uos.openApp("文件管理器", 3000, 20000, true);
        await agent.aiTap("文件管理器左侧栏中的'桌面'");
        // 按 Super+Left 将窗口靠左
        console.log('按 Super+Left 将文件管理器靠左');
        await device.pressKey("Super+Left");
        
        // 停止tail -f命令（Ctrl+C）
        await agent.aiTap("终端窗口的标题栏");
        await device.pressKey("Ctrl+C");
        await device.typeText("clear");
        await device.pressKey("Enter");
        await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");
        for (let i = 0; i < 5; i++) {
            await device.pressKey('Enter');
        } 
        
        // 在文件管理器的桌面目录空白处右键点击【新建文件夹】
        console.log('在文件管理器的桌面目录空白处右键点击【新建文件夹】');
        await agent.aiTap("文件管理器窗口的标题栏");
        await agent.aiRightClick("文件管理器右侧文件列表的空白处");
        await agent.aiTap("新建文件夹");
        await agent.aiTap("桌面空白处");
        // 等待新建文件夹出现
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 将终端窗口置顶以便查看
        await agent.aiTap("终端窗口的标题栏");
        // 预期：触发上报事件
        await agent.aiAssert("终端新增一条日志，且内容包含'新建文件夹'关键词");
        
        // 停止tail -f命令（Ctrl+C）
        console.log('停止日志监控');
        await device.pressKey("Ctrl+C");

        // 删除文件管理器中的新建文件夹
        console.log('删除文件管理器中的新建文件夹');
        await agent.aiTap("文件管理器窗口的标题栏");
        await agent.aiTap("桌面上名称为'新建文件夹'的图标");
        await device.pressKey("Delete");

    }, { timeout: 1800000, tags: ['1815831', 'level3', 'configuration', 'tracking', 'DITT', 'lanyanling'] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 清理可能残留的新建文件夹
        await system.exec(`rm -rf /home/${userName}/Desktop/新建文件夹* 2>/dev/null || true`);
        await system.exec(`rm -rf /home/${userName}/Desktop/测试文件夹* 2>/dev/null || true`);

    });

    afterAll(async ({ uos, agent, device, env, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 删除所有测试文件夹
        console.log("清理: 删除测试文件夹");
        await system.exec(`rm -rf /home/${userName}/Desktop/新建文件夹* 2>/dev/null || true`);
        await system.exec(`rm -rf /home/${userName}/Desktop/测试文件夹* 2>/dev/null || true`);
        
        // 关闭所有可能残留的进程
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -15");
        console.log('清理完成');
    });
});