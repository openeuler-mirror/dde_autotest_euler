/**
 * 用例 PMSID: 1810353
 * 用例标题:  埋点 - 首次启动文件管理器（其他功能唤醒）
 * 生成时间: 2026-08-19 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const usbFlash = process.env.USB_FLASH || 'uos';

// 辅助函数：带重试机制的日志断言（使用 aiBoolean）
async function monitorAndAssert(agent, device, actionKeyword) {
  console.log(`开始验证操作关键词: ${actionKeyword}`);  
  
  // 使用 aiBoolean 判断终端是否新增日志
  let isKey = await agent.aiBoolean(`终端新增一条日志，且内容包含${actionKeyword}关键词`);
  
  if (isKey) {
    console.log(`✅ 断言成功：终端新增一条日志，且内容包含${actionKeyword}关键词`);
    return true;
  } else {
    console.log(`⚠️ 第 1 次断言失败：终端未检测到包含${actionKeyword}关键词的日志`);
    
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
    isKey = await agent.aiBoolean(`终端新增一条日志，且内容包含${actionKeyword}关键词`);
    
    if (isKey) {
      console.log(`✅ 断言成功：终端新增一条日志，且内容包含${actionKeyword}关键词 (重试成功)`);
      return true;
    } else {
      console.log(`❌ 断言失败：终端未检测到包含${actionKeyword}关键词的日志 (重试失败)`);
      console.log(`❌ 操作关键词 "${actionKeyword}" 验证失败`);
      return false;
    }
  }
}

async function startLogMonitor(agent, device) {
  // 在终端中执行日志监控命令
  console.log('在终端中执行日志监控命令');
  await agent.aiTap("终端窗口的标题栏");
  await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");
  for (let j = 0; j < 3; j++) {
    await device.pressKey('Enter');
  }
}

async function stopLogMonitor(agent, device) {
  // 停止日志监控（Ctrl+C）并清空终端
  await agent.aiTap("终端窗口");
  await device.pressKey("Ctrl+C");
  await device.typeText("clear");
  await device.pressKey("Enter");
}

async function testRecycleBin(agent, device, system, uos) {
 
  // 启动日志监控
  await startLogMonitor(agent, device);
  
  // 点击桌面上的回收站图标
  console.log('步骤1：桌面点击“回收站”打开文管，检查是否上报埋点事件');
  await agent.aiDoubleClick("桌面上的回收站图标");
  await device.pressKey("Super+Left"); 
  // 验证预期结果：触发上报事件
  console.log('验证预期结果：触发上报事件 - 回收站');
  
  // 将终端窗口置顶以便查看
  await agent.aiTap("终端窗口的标题栏");
  
  // 使用 aiBoolean 重试机制进行断言验证（包含1次重试）
  const isSuccess = await monitorAndAssert(agent, device, 'dde-trash');
  
  if (isSuccess) {
    console.log(`✅ 回收站打开埋点验证通过`);
  } else {
    console.error(`❌ 回收站打开埋点验证失败，终止测试`);
    throw new Error(`回收站打开的埋点日志验证失败`);
  }
  await agent.aiTap("文件管理器的标题栏");   
  await agent.aiTap("文件管理器右上角的x关闭按钮"); 
  // 停止日志监控
  await stopLogMonitor(agent, device);
  
  console.log('========== 回收站测试完成 ==========');
}

async function testLauncherRecycleBin(agent, device, system, uos) {
 
  // 启动日志监控
  await startLogMonitor(agent, device);
  
  // 打开启动器
  console.log('步骤：打开启动器');
  await device.pressKey("Super");
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 在启动器中找到回收站
  console.log('步骤2：在启动器中找到回收站');
  await agent.aiTap("启动器中的搜索框");
  await device.typeText("回收站");
  await agent.aiTap("启动器中的回收站图标");
  await new Promise(resolve => setTimeout(resolve, 500));
  await device.pressKey("Super+Left");
  
  // 验证预期结果：触发上报事件
  console.log('验证预期结果：触发上报事件 - 启动器回收站');
  
  // 将终端窗口置顶以便查看
  await agent.aiTap("终端窗口的标题栏");
  
  // 使用 aiBoolean 重试机制进行断言验证（包含1次重试）
  const isSuccess = await monitorAndAssert(agent, device, 'dde-trash');
  
  if (isSuccess) {
    console.log(`✅ 启动器回收站打开埋点验证通过`);
  } else {
    console.error(`❌ 启动器回收站打开埋点验证失败，终止测试`);
    throw new Error(`启动器回收站打开的埋点日志验证失败`);
  }
  await agent.aiTap("文件管理器的标题栏");   
  await agent.aiTap("文件管理器右上角的x关闭按钮");   
  // 停止日志监控
  await stopLogMonitor(agent, device);
  
  console.log('========== 启动器回收站测试完成 ==========');
}

async function testUsbPath(agent, device, system, uos) {

  // 启动日志监控
  await startLogMonitor(agent, device);
  
  // 点击底部任务栏的磁盘图标
  console.log('步骤3：底部任务栏点击“磁盘”图标，点击外设路径');
  await agent.aiTap("任务栏上折叠按钮右侧的磁盘插件图标");
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 点击外设路径
  console.log(`步骤：点击外设路径 ${usbFlash}`);
  await agent.aiTap(`任务栏弹出菜单中的${usbFlash}`);
  await new Promise(resolve => setTimeout(resolve, 2000));
  await device.pressKey("Super+Left");  
  // 验证预期结果：触发上报事件
  console.log('验证预期结果：触发上报事件 - 外设路径');
  
  // 将终端窗口置顶以便查看
  await agent.aiTap("终端窗口的标题栏");
  
  // 使用 aiBoolean 重试机制进行断言验证（包含1次重试）
  const isSuccess = await monitorAndAssert(agent, device, '1000500007');
  
  if (isSuccess) {
    console.log(`✅ 外设路径打开埋点验证通过`);
  } else {
    console.error(`❌ 外设路径打开埋点验证失败，终止测试`);
    throw new Error(`外设路径打开的埋点日志验证失败`);
  }
    
  // 停止日志监控
  await stopLogMonitor(agent, device);
  
  console.log('========== 外设路径测试完成 ==========');
}

describe('1810353-埋点 - 首次启动文件管理器（其他功能唤醒）', () => {
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
        
        // 验证U盘是否挂载
        const usbPathResult = await system.exec(`df -h | grep /media/${userName}/${usbFlash} | awk '{print $6}'`);
        const usbPath = usbPathResult.stdout.trim();
        if (!usbPath) {
            console.warn(`警告：未找到U盘挂载路径，USB_FLASH: ${usbFlash}，外设路径测试将跳过`);
        } else {
            console.log(`U盘挂载路径: ${usbPath}`);
        }
    });

    test('1810353-埋点 - 首次启动文件管理器（其他功能唤醒）', async ({ device, agent, uos, env, system}) => {
        console.log('========== 开始执行所有打开文管方式测试 ==========');
        
        // 通过 Ctrl+Alt+T 快捷键打开终端
        console.log('通过 Ctrl+Alt+T 打开终端');
        await device.pressKey("Ctrl+Alt+T");
        await new Promise(resolve => setTimeout(resolve, 500));
        // 按 Super+Right 将终端窗口靠右
        console.log('按 Super+Right 将终端靠右');
        await device.pressKey("Super+Right");
        await agent.aiTap("终端窗口的标题栏");
        
        // 步骤1：桌面点击“回收站”打开文管，检查是否上报埋点事件
        await testRecycleBin(agent, device, system, uos);
        
        // 步骤2：启动器找到回收站
        await testLauncherRecycleBin(agent, device, system, uos);
        
        // 步骤3：底部任务栏点击磁盘图标 -> 外设路径
        // 检查U盘是否挂载
        const usbPathResult = await system.exec(`df -h | grep /media/${userName}/${usbFlash} | awk '{print $6}'`);
        const usbPath = usbPathResult.stdout.trim();
        if (usbPath) {
            await testUsbPath(agent, device, system, uos);
        } else {
            console.warn(`⚠️ 跳过外设路径测试：未找到U盘挂载路径，USB_FLASH: ${usbFlash}`);
        }
        
        console.log('\n========== 所有测试完成 ==========');
        
        // 关闭终端
        await agent.aiTap("终端窗口右上角的x关闭按钮");

    }, { timeout: 1800000, tags: ['1810353', 'level3', 'configuration', 'tracking', 'DITT', 'lanyanling'] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');

    });

    afterAll(async ({ uos, agent, device, env, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 关闭所有可能残留的进程
        await system.exec("killall dde-file-manager");
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -15 2>/dev/null || true");
        console.log('清理完成');
    });
});