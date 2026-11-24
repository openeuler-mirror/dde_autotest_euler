/**
 * 用例 PMSID: 1815847
 * 用例标题:  埋点，右键菜单项点击桌面设置
 * 生成时间: 2026-08-18 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;

// 辅助函数：带重试机制的日志断言（使用 aiBoolean）
async function monitorAndAssert(agent, device, logKeyword) {
  console.log(`开始验证日志关键词: ${logKeyword}`);
  
  // 第一次尝试
  let isKey = await agent.aiBoolean(`终端新增一条日志，且内容包含${logKeyword}关键词`);
  
  if (isKey) {
    console.log(`✅ 断言成功：终端新增一条日志，且内容包含${logKeyword}关键词`);
    return true;
  } else {
    console.log(`⚠️ 第 1 次断言失败：终端未检测到包含${logKeyword}关键词的日志`);
    
    // 执行清理操作：停止日志监控并清空终端
    await agent.aiTap("终端窗口");
    await device.pressKey("Ctrl+C");
    await device.typeText("clear");
    await device.pressKey("Enter");
    
    // 执行重新监控：重新打开日志监控
    await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");
    for (let j = 0; j < 3; j++) {
      await device.pressKey('Enter');
    }
    
    // 第二次尝试
    console.log(`第 2 次尝试验证...`);
    isKey = await agent.aiBoolean(`终端新增一条日志，且内容包含${logKeyword}关键词`);
    
    if (isKey) {
      console.log(`✅ 断言成功：终端新增一条日志，且内容包含${logKeyword}关键词 (重试成功)`);
      return true;
    } else {
      console.log(`❌ 断言失败：终端未检测到包含${logKeyword}关键词的日志 (重试失败)`);
      console.log(`❌ 日志关键词 "${logKeyword}" 验证失败`);
      return false;
    }
  }
}

describe('1815847-埋点，右键菜单项点击桌面设置', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');
        // 清理环境 - 清理可能残留的终端和文件管理器进程
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true");        
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await clearEnvironment(system);
    });

    test('1815847-埋点，右键菜单项点击桌面设置', async ({ device, agent, uos, env, system }) => {        

        // 通过 Ctrl+Alt+T 快捷键打开终端
        console.log('通过 Ctrl+Alt+T 打开终端');
        await device.pressKey("Ctrl+Alt+T");
        // 按 Super+Right 将终端窗口靠右
        console.log('按 Super+Right 将终端靠右');
        await device.pressKey("Super+Right");
        await new Promise(resolve => setTimeout(resolve, 500));      
        // 在终端中执行日志监控命令
        console.log('在终端中执行日志监控命令');
        await agent.aiTap("终端窗口的标题栏");
        await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");
        for (let j = 0; j < 3; j++) {
          await device.pressKey('Enter');
        }

        console.log("步骤1: 右键桌面空白处，点击【桌面设置】");      
        // 右键点击桌面空白处
        await agent.aiRightClick("桌面空白处");
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 点击【桌面设置】菜单项
        await agent.aiTap("右键菜单中的'桌面设置'选项");
        await new Promise(resolve => setTimeout(resolve, 500));
        await device.pressKey("Alt+F4");
        
        // 验证预期结果：触发上报事件
        console.log(`验证预期结果: 触发上报事件`);
        
        // 将终端窗口置顶以便查看
        await agent.aiTap("终端窗口的标题栏");
        
        // 使用带重试机制的断言验证（包含1次重试）
        const logKeyword = "桌面设置";
        const isSuccess = await monitorAndAssert(agent, device, logKeyword);
        
        if (isSuccess) {
          console.log(`✅ 桌面设置埋点验证通过`);
        } else {
          console.error(`❌ 桌面设置埋点验证失败，终止测试`);
          throw new Error(`桌面设置的埋点日志验证失败`);
        }        

    }, { timeout: 1800000, tags: ['1815847', 'level3', 'configuration', 'tracking', 'DITT', 'lanyanling'] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');

    });

    afterAll(async ({ uos, agent, device, env, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 关闭所有可能残留的进程
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9");
        await system.exec("ps -ef | grep dde-control-center | grep -v grep | awk '{print $2}' | xargs kill -9");
        console.log('清理完成');
    });
});