/**
 * 用例 PMSID: 1810923
 * 用例标题:   埋点，侧边栏各目录去重后的点击分布-我的共享
 * 生成时间: 2026-08-11 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const userPassword = process.env.TEST_PASSWORD;
const smbPassword = "Aa123";

// 辅助函数：带重试机制的日志断言（使用 aiBoolean）
async function monitorAndAssert(agent, device, logKeyword) {
  console.log(`开始验证日志关键词: ${logKeyword}`);
  
  // 第一次尝试
  let isKey = await agent.aiBoolean(`终端新增一条日志，且内容包含'${logKeyword}'关键词或相关埋点事件`);
  
  if (isKey) {
    console.log(`✅ 断言成功：终端新增一条日志，且内容包含'${logKeyword}'关键词或相关埋点事件`);
    return true;
  } else {
    console.log(`⚠️ 第 1 次断言失败：终端未检测到包含'${logKeyword}'关键词或相关埋点事件的日志`);
    
    // 执行清理操作：停止日志监控并清空终端
    console.log('步骤1: 停止日志监控并清空终端');
    await agent.aiTap("终端窗口");
    await device.pressKey("Ctrl+C");
    await device.typeText("clear");
    await device.pressKey("Enter");
    
    // 执行重新监控：重新打开日志监控
    console.log('步骤2: 重新打开日志监控');
    await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");
    for (let j = 0; j < 3; j++) {
      await device.pressKey('Enter');
    }
    
    // 第二次尝试
    console.log(`第 2 次尝试验证...`);
    isKey = await agent.aiBoolean(`终端新增一条日志，且内容包含'${logKeyword}'关键词或相关埋点事件`);
    
    if (isKey) {
      console.log(`✅ 断言成功：终端新增一条日志，且内容包含'${logKeyword}'关键词或相关埋点事件 (重试成功)`);
      return true;
    } else {
      console.log(`❌ 断言失败：终端未检测到包含'${logKeyword}'关键词或相关埋点事件的日志 (重试失败)`);
      console.log(`❌ 日志关键词 "${logKeyword}" 验证失败`);
      return false;
    }
  }
}

describe('1810923- 埋点，侧边栏各目录去重后的点击分布-我的共享', () => {
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
        console.log('前置条件: 创建1810923文件夹并设置共享');
        await system.exec(`mkdir -p /home/${userName}/Desktop/1810923`);    
    });

    test('1810923- 埋点，侧边栏各目录去重后的点击分布-我的共享-场景1', async ({ device, agent, uos, env, system }) => {
       
        // 右键点击文件夹，设置共享
        console.log('设置文件夹共享');
        await agent.aiTap("桌面上的1810923文件夹的图标");
        await agent.aiRightClick("桌面上的1810923文件夹的图标");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiTap("共享文件夹");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 如果弹出属性窗口，则设置共享
        const isAttribute = await agent.aiBoolean("是否看到1810923文件夹的属性窗口");
        if (isAttribute) {
            await agent.aiTap("共享此文件夹左侧复选框的中心");
            const isShare = await agent.aiBoolean("是否看到请输入共享密码窗口");
            if (isShare) {
                await device.typeText(`${smbPassword}`, true);
                //await agent.aiTap("确定按钮");
            }
            const isChange = await agent.aiBoolean("是否看到修改您的共享信息需要认证窗口");
            if (isChange) {
                await device.typeText(`${userPassword}`, true);
                //await agent.aiTap("确定按钮");
            }
            const isSystem = await agent.aiBoolean("是否看到管理系统服务或单元文件需要认证窗口");
            if (isSystem) {
                await device.typeText(`${userPassword}`, true);
                //await agent.aiTap("确定按钮");
            }
            await agent.aiTap("属性窗口右上角x关闭按钮");

        } else {
            console.log("共享时未弹出属性窗口，直接共享成功");
        }        
        console.log('前置条件完成: 已创建1810923文件夹并设置共享');

        console.log("步骤1: 打开文管，点击左侧边栏 - 我的共享");
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
        for (let i = 0; i < 3; i++) {
            await device.pressKey('Enter');
        } 
  
        // 打开文件管理器
        console.log('打开文件管理器');
        await uos.openApp("文件管理器", 3000, 20000, true);
        
        // 按 Super+Left 将文件管理器靠左
        console.log('按 Super+Left 将文件管理器靠左');
        await device.pressKey("Super+Left");
        
        // 点击左侧边栏的"我的共享"
        console.log('点击左侧边栏的"我的共享"');
        await agent.aiTap("文件管理器左侧边栏中的'我的共享'");
        
        // 将终端窗口置顶以便查看
        await agent.aiTap("终端窗口的标题栏");
        
        // 预期：触发上报事件 - 使用带重试机制的断言验证
        console.log('验证预期结果: 触发上报事件');
        const logKeyword = "UserShare";
        const isSuccess = await monitorAndAssert(agent, device, logKeyword);
        
        if (isSuccess) {
            console.log(`✅ 日志验证通过`);
        } else {
            console.error(`❌ 日志验证失败，终止测试`);
            throw new Error(`埋点日志验证失败：未检测到包含'${logKeyword}'关键词的日志`);
        }
        
        // 停止tail -f命令（Ctrl+C）
        console.log('停止日志监控');
        await agent.aiTap("终端窗口");
        await device.pressKey("Ctrl+C");
        await device.typeText("clear");
        await device.pressKey("Enter");      
        // 关闭终端
        await agent.aiTap("终端窗口右上角的x按钮");
    }, { timeout: 1800000, tags: ['1810923', 'level3', 'configuration', 'tracking', 'DITT', 'lanyanling'] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, env, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 删除测试文件夹
        console.log("清理: 删除1810923文件夹");
        await system.exec(`rm -rf /home/${userName}/Desktop/1810923`);
        
        // 关闭所有可能残留的进程
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -15 2>/dev/null || true");
        console.log('清理完成');
    });
});