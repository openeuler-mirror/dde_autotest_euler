/**
 * 用例 PMSID: 1815823
 * 用例标题:  埋点，右键菜单项点击分布-设置壁纸
 * 生成时间: 2026-07-23 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

describe('1815823-埋点，右键菜单项点击分布-设置壁纸', () => {
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

        // 前置条件：在桌面上创建1815823.png测试图片
        console.log('前置条件: 创建1815823.png图片');
        await system.exec(`cp /usr/share/wallpapers/deepin/nirvana-wallpaper-light.jpg /home/${userName}/Desktop/1815823.png`);
    });

    test('1815823-埋点，右键菜单项点击分布-设置壁纸-场景1', async ({ device, agent, uos, env, system }) => {

        // 步骤1：图片，右键点击【设置壁纸】
        console.log("步骤1: 图片，右键点击【设置壁纸】");

        // ========== 第一部分：在桌面直接操作 ==========
        console.log('========== 第一部分：在桌面直接操作 ==========');

        // 通过 Ctrl+Alt+T 快捷键打开终端
        console.log('通过 Ctrl+Alt+T 快捷键打开终端');
        await device.pressKey("Ctrl+Alt+T");

        // 按 Super+Right 将终端窗口靠右
        console.log('按 Super+Right 将终端靠右');
        await device.pressKey("Super+Right");
        // 在终端中执行命令：ls /var/lib/deepin/event-log/*.log | xargs tail -f
        console.log('在终端中执行日志监控命令');
        await agent.aiTap("终端窗口的标题栏");
        await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");
        for (let i = 0; i < 5; i++) {
            await device.pressKey('Enter');
        } 
  
        // 在桌面上右键点击1815823.png图片，选择【设置壁纸】
        console.log('在桌面上右键点击1815823.png图片，选择【设置壁纸】');
        await agent.aiTap("桌面空白处");
        await agent.aiRightClick("桌面上的1815823.png图片");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiTap("设置壁纸");
        
        // 将终端窗口置顶以便查看
        await agent.aiTap("终端窗口的标题栏");
        // 预期：触发上报事件
        await agent.aiAssert("终端新增一条日志，且内容包含'设置壁纸'关键词");

        // ========== 第二部分：在文件管理器中操作 ==========
        console.log('========== 第二部分：在文件管理器中操作 ==========');
        console.log("步骤2: 打开文管，点击左侧栏的桌面，右键1815823.png图片,点击【设置壁纸】");
        
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
        
        // 在文件管理器中右键点击1815823.png图片，选择【设置壁纸】
        console.log('在文件管理器中右键点击1815823.png图片，选择【设置壁纸】');
        await agent.aiTap("文件管理器窗口的标题栏");
        await agent.aiRightClick("文件管理器中的1815823.png图片");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiTap("设置壁纸");
        
        // 将终端窗口置顶以便查看
        await agent.aiTap("终端窗口的标题栏");
        // 预期：触发上报事件
        await agent.aiAssert("终端新增一条日志，且内容包含'设置壁纸'关键词");
        
        // 停止tail -f命令（Ctrl+C）
        console.log('停止日志监控');
        await device.pressKey("Ctrl+C");
        await agent.aiTap("终端窗口右上角的x关闭按钮"); 

    }, { timeout: 1800000, tags: ['1815823', 'level3', 'configuration', 'tracking', 'DITT', 'lanyanling'] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');

    });

    afterAll(async ({ uos, agent, device, env, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 删除测试图片
        console.log("清理: 删除1815823.png图片");
        await system.exec(`rm -rf /home/${userName}/Desktop/1815823.png`);
     
        // 关闭所有可能残留的进程
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -15");
        console.log('清理完成');
    });
});