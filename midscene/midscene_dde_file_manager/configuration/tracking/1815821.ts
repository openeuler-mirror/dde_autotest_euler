/**
 * 用例 PMSID: 1815821
 * 用例标题:  埋点，右键菜单项点击分布-添加到快捷访问
 * 生成时间: 2026-07-23 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

describe('1815821-埋点，右键菜单项点击分布-添加到快捷访问', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 清理环境
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true");
        await system.exec("ps -ef | grep deepin-movie | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true");
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await clearEnvironment(system);
        
        // 创建测试文件夹 1815821
        console.log('创建测试文件夹: 1815821');
        await system.exec(`mkdir -p /home/${userName}/Desktop/1815821 2>/dev/null || true`);

    });

    test('1815821-埋点，右键菜单项点击分布-添加到快捷访问-场景1', async ({ device, agent, uos, env, system }) => {
        console.log("步骤1: 打开文管，点击左侧栏的桌面，1815821文件夹，右键点击【添加到快捷访问】");

        // ========== 第一部分：在文件管理器中操作 ==========
        console.log('========== 在文件管理器中操作 ==========');       

        // 打开文件管理器
        await uos.openApp("文件管理器", 3000, 20000, true);
        await agent.aiTap("文件管理器左侧栏中的'桌面'");
        // 按 Super+Left 将窗口靠左
        console.log('按 Super+Left 将文件管理器靠左');
        await device.pressKey("Super+Left");
 
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
       
        // 在文件管理器中找到 1815821 文件夹
        console.log('在文件管理器中找到 1815821 文件夹');
        await agent.aiTap("文件管理器右侧文件列表中的'1815821'文件夹图标");
        
        // 右键点击 1815821 文件夹，选择【添加到快捷访问】
        console.log('右键点击 1815821 文件夹，选择【添加到快捷访问】');
        await agent.aiRightClick("文件管理器中的'1815821'文件夹");
        await agent.aiTap("添加到快捷访问");

        // 将终端窗口置顶以便查看
        await agent.aiTap("终端窗口的标题栏");
        // 预期：触发上报事件
        await agent.aiAssert("终端新增一条日志，且内容包含'添加到快捷访问'关键词");

        // 停止tail -f命令（Ctrl+C）
        console.log('停止日志监控');
        await device.pressKey("Ctrl+C");
        await agent.aiTap("终端窗口右上角的x关闭按钮"); 

    }, { timeout: 1800000, tags: ['1815821', 'level3', 'configuration', 'tracking', 'DITT', 'lanyanling'] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 清理可能残留的快捷访问记录（如有需要）
        // 注意：具体清理方式取决于系统实现，这里保留扩展点
        console.log('清理快捷访问记录（如有需要）');
    });

    afterAll(async ({ uos, agent, device, env, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 删除测试文件夹
        console.log("清理: 删除测试文件夹 1815821");
        await system.exec(`rm -rf /home/${userName}/Desktop/1815821 2>/dev/null || true`);
        
        // 关闭所有可能残留的进程
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -15");
        console.log('清理完成');
    });
});