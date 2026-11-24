/**
 * 用例 PMSID: 1815825
 * 用例标题:  埋点，右键菜单项点击分布-标记信息
 * 生成时间: 2026-08-18 17:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;
const userName = process.env.TEST_USERNAME;
const testFolderName = '1815825';
const testFolderPath = `/home/${userName}/Desktop/${testFolderName}`;

// 辅助函数：带重试机制的日志断言（使用 aiBoolean）
async function monitorAndAssert(agent, device, fileType) {
  console.log(`开始验证文件类型: ${fileType.type}`);  
  
  // 使用 aiBoolean 判断终端是否新增日志
  let isKey = await agent.aiBoolean(`终端新增一条日志，且内容包含'标记信息'和${fileType.logKeyword}关键词`);
  
  if (isKey) {
    console.log(`✅ 断言成功：终端新增一条日志，且内容包含'标记信息'和${fileType.logKeyword}关键词`);
    return true;
  } else {
    console.log(`⚠️ 第 1 次断言失败：终端未检测到包含'标记信息'和${fileType.logKeyword}关键词的日志`);
    
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
    isKey = await agent.aiBoolean(`终端新增一条日志，且内容包含'标记信息'和${fileType.logKeyword}关键词`);
    
    if (isKey) {
      console.log(`✅ 断言成功：终端新增一条日志，且内容包含'标记信息'和${fileType.logKeyword}关键词 (重试成功)`);
      return true;
    } else {
      console.log(`❌ 断言失败：终端未检测到包含'标记信息'和${fileType.logKeyword}关键词的日志 (重试失败)`);
      console.log(`❌ 文件类型 "${fileType.type}" 验证失败`);
      return false;
    }
  }
}

async function tagInfoTest(uos, agent, device, system) {
  // 定义需要测试的文件类型及其在日志中对应的类型名称
  const fileTypes = [
      { name: 'maidian', type: '文件夹', logKeyword: 'inode/directory' },
      { name: 'maidian.txt', type: '文档', logKeyword: 'text/plain' },
      { name: 'maidian.png', type: '图片', logKeyword: 'image/png' },
      { name: 'maidian.mp4', type: '影片', logKeyword: 'video/mp4' },
      { name: 'maidian.wma', type: '音乐', logKeyword: 'audio' },
      { name: 'maidian.zip', type: '压缩文件', logKeyword: 'zip' },
      { name: 'maidian-desktop', type: '应用程序', logKeyword: 'desktop' },
      { name: 'maidian.sh', type: '可执行文件', logKeyword: 'x-shellscript' },
      { name: 'maidian.fig', type: '其他类型文件', logKeyword: 'application/x' }
  ];

  // 对每种文件类型执行右键标记信息操作
  for (let i = 0; i < fileTypes.length; i++) {
      const fileType = fileTypes[i];

      console.log(`\n========== 测试文件类型: ${fileType.type} ==========`);
      console.log(`步骤: 对"${fileType.type}"右键点击【标记信息】`);
      
      // 在终端中执行日志监控命令
      console.log('在终端中执行日志监控命令');
      await agent.aiTap("终端窗口的标题栏");
      await device.typeText("ls /var/lib/deepin/event-log/*.log | xargs tail -f");
      for (let j = 0; j < 3; j++) {
          await device.pressKey('Enter');
      }            
      
      // 点击文件管理器窗口激活
      await agent.aiTap("文件管理器窗口的标题栏");    

      // 右键点击对应的文件
      if (fileType.type === '文件夹') {            
          await agent.aiRightClick(`${fileType.name}文件夹的图标`);                   
      } else if (fileType.type === '图片') {
          await agent.aiRightClick("76.2", { deepThink: true });
      } else {
          await agent.aiRightClick(`${fileType.name}文件的图标`);
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 点击【标记信息】菜单项
      await agent.aiTap("右键菜单中的'标记信息'");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 关闭标记信息窗口（按 ESC 或点击关闭按钮）
      console.log('关闭标记信息窗口');
      await device.pressKey("Esc");
      await new Promise(resolve => setTimeout(resolve, 500));
     
      // 验证预期结果：触发上报事件
      console.log(`验证预期结果: 触发上报事件，文件类型: ${fileType.type}`);
      
      // 将终端窗口置顶以便查看
      await agent.aiTap("终端窗口的标题栏");
      
      // 使用 aiBoolean 重试机制进行断言验证（包含1次重试）
      const isSuccess = await monitorAndAssert(agent, device, fileType);
      
      if (isSuccess) {
        console.log(`✅ 文件类型 "${fileType.type}" 验证通过`);
      } else {
        console.error(`❌ 文件类型 "${fileType.type}" 验证失败，终止测试`);
        throw new Error(`文件类型 "${fileType.type}" 的埋点日志验证失败`);
      }
      
      // 停止日志监控（Ctrl+C）并清空终端，准备下一轮测试
      await agent.aiTap("终端窗口");
      await device.pressKey("Ctrl+C");
      await device.typeText("clear");
      await device.pressKey("Enter");
  }
  
  console.log('\n========== 所有文件类型测试完成 ==========');
}

describe('1815825-埋点，右键菜单项点击分布-标记信息', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
        console.log('1. beforeAll: 初始化测试套件');
        await uos.showDesktop();
        // 清理环境
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true");        
        await system.exec("killall dde-file-manager");
        const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await clearEnvironment(system);

        console.log('===== 准备测试素材 =====');
        await system.exec(`mkdir -p ${testFolderPath}`); 
        await system.exec(`mkdir -p ${testFolderPath}/maidian`);
        await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1816003/* ${testFolderPath}`);     
    });

    beforeEach(async ({ device, agent, system }) => {
        console.log('2. beforeEach: 每个测试前的准备');   
    });

    test('1815825-埋点，右键菜单项点击分布-标记信息-桌面操作', async ({ device, agent, uos, env, system}) => {

        const { closeAllTxt } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await uos.openApp("文本编辑器", 3000);        
        await device.pressKey("Win+Up");
        await closeAllTxt(agent, device); 

        // ========== 在桌面直接操作 ==========
        console.log('========== 在桌面直接操作 ==========');
        
        // 进入桌面上的1815825文件夹图标
        await agent.aiDoubleClick(`桌面上的${testFolderName}文件夹的图标`);
        await device.pressKey("Ctrl+2");
        // 按 Super+Left 将窗口靠左
        console.log('按 Super+Left 将文件管理器靠左');
        await device.pressKey("Super+Left");

        // 通过 Ctrl+Alt+T 快捷键打开终端
        console.log('通过 Ctrl+Alt+T 打开终端');
        await device.pressKey("Ctrl+Alt+T");
        // 按 Super+Right 将终端窗口靠右
        console.log('按 Super+Right 将终端靠右');
        await device.pressKey("Super+Right");
        await agent.aiTap("终端窗口的标题栏");
        await tagInfoTest(uos, agent, device, system);

    }, { timeout: 1800000, tags: ['1815825', 'level3', 'configuration', 'tracking', 'DITT', 'lanyanling'] });

    test('1815825-埋点，右键菜单项点击分布-标记信息-文管操作', async ({ device, agent, uos, env, system}) => {
        const { closeAllTxt } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        // ========== 在文件管理器中操作 ==========
        console.log('========== 在文件管理器中操作 ==========');
        
        // 关闭当前文件管理器，重新打开
        await system.exec("kill -TERM $(pidof dde-file-manager)");
        await uos.openApp("文本编辑器", 3000);
        await device.pressKey("Win+Up");
        await closeAllTxt(agent, device);
        
        // 重新复制测试素材，确保文件完整
        await system.exec(`rm -rf ${testFolderPath}`);
        await system.exec(`mkdir -p ${testFolderPath}`);
        await system.exec(`mkdir -p ${testFolderPath}/maidian`);
        await system.exec(`cp -r ${caseDir}midscene_dde_file_manager/resources/1816003/* ${testFolderPath}`);
        
        // 重新打开文件管理器
        await uos.openApp("文件管理器", 3000, 20000, true);
        await agent.aiTap("文件管理器左侧栏中的'桌面'");

        // 按 Super+Left 将窗口靠左
        console.log('按 Super+Left 将文件管理器靠左');
        await device.pressKey("Super+Left");
     
        // 双击进入1815825文件夹
        console.log(`双击进入${testFolderName}文件夹`);
        await agent.aiTap("文件管理器窗口的标题栏");
        await agent.aiDoubleClick(`桌面上的'${testFolderName}'文件夹的图标`);
        await device.pressKey("Ctrl+2");
       
        // 对每种文件类型执行右键标记信息操作（在文件夹内）
        await tagInfoTest(uos, agent, device, system);

    }, { timeout: 1800000, tags: ['1815825', 'level3', 'configuration', 'tracking', 'DITT', 'lanyanling'] });

    afterEach(async ({ device, agent, uos, system }) => {
        console.log('4. afterEach: 每个测试后的清理');
        // 关闭可能残留的标记信息窗口
        await device.pressKey("Esc");
    });

    afterAll(async ({ uos, agent, device, env, system }) => {
        console.log('5. afterAll: 清理测试套件');
        // 删除测试文件夹及其所有文件
        console.log(`清理: 删除${testFolderName}文件夹`);
        await system.exec(`rm -rf ${testFolderPath}`);

        // 关闭所有可能残留的进程
        await system.exec("killall dde-file-manager");
        await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -15 2>/dev/null || true");
        console.log('清理完成');
    });
});