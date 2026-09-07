/**
 * 用例 PMSID: 1812081
 * 用例标题: Bug200815转：长文件名开启，回收站还原原始目录已存在同名文件的
 * 生成时间: 2026-06-09
* 用例编写人: UT000686（李双双）
 */

describe('1812081-长文件名开启-回收站还原同名文件处理', () => {
  const longFileName = "2285长文件名开启回收站还原原始目录已存在同名文件的长文件名开启回收站还原原始目录已存在同名文件的长文件名开启回收站还原原始目录已存在同名文件的长文件名开启回收站还原原始目录81";
  const docPath = `/home/${process.env.TEST_USERNAME}/Documents`;
  
  // 创建长文件名的函数
  const createLongFileName = async (system) => {
    console.log('调用创建长文件名函数');
    await system.exec(`mkdir -p ${docPath}/${longFileName}`, 500);
    console.log(`长文件名文件夹创建完成: ${longFileName}`);
  };

  // 删除长文件名的函数
  const deleteLongFileName = async (system) => {
    console.log('调用删除长文件名函数');
    await system.exec(`rm -rf ${docPath}/${longFileName}`, 500);
    await system.exec(`rm -rf "${docPath}/${longFileName} (副本)"`, 500);
    console.log('长文件名文件夹删除完成');
  };

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.cleanupFileManager();
    await deleteLongFileName(system);
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await deleteLongFileName(system);
    await system.exec('rm -rf ~/.local/share/Trash/files/' + longFileName, 500);
    await system.exec('rm -rf ~/.local/share/Trash/info/' + longFileName + '.trashinfo', 500);
  });

  test('1812081-长文件名开启-回收站还原同名文件处理', async ({ device, agent, uos, system }) => {
    // 步骤 1: 调用创建长文件名的函数
    console.log("=== 步骤1: 调用创建长文件名的函数 ===");
    await createLongFileName(system);
    console.log("步骤1完成");

    // 步骤 2: 打开文件管理器，删除文件到回收站
    console.log("=== 步骤2: 删除文件到回收站 ===");
    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("文件管理器左侧栏的文档目录");
    await agent.aiWaitFor("文档目录页面加载完成");
    await agent.aiRightClick("以 2285长 开头的文件夹");
    await agent.aiTap("删除");
    console.log("步骤2完成：文件已删除到回收站");

    // 步骤 3: 再次调用创建长文件名的函数（在原始目录创建同名文件）
    console.log("=== 步骤3: 再次调用创建长文件名的函数 ===");
    await createLongFileName(system);
    console.log("步骤3完成：已在原始目录创建同名文件夹");

    // 步骤 4: 还原到已存在同名文件的目录，选择"合并"
    console.log("=== 步骤4: 还原文件并选择合并 ===");
    await agent.aiTap("文件管理器左侧栏的回收站目录");
    await agent.aiWaitFor("回收站已打开");
    await agent.aiRightClick("以 2285长 开头的文件夹");
    await agent.aiTap("还原");
    await agent.aiWaitFor("还原确认弹框已显示");
    await agent.aiTap("合并");
    
    // 断言：回收站目录无"2285长"开头的文件
    await agent.aiAssert("回收站目录不存在以 2285长 开头的文件");
    
    // 断言：文档目录有一个"2285长"开头的文件
    await agent.aiTap("文件管理器左侧栏的文档目录");
    await agent.aiWaitFor("文档目录页面加载完成");
    await agent.aiAssert("文档目录存在一个以 2285长 开头的文件夹");
    console.log("步骤4完成：合并操作成功");

    // 步骤 5: 删除文档目录中的文件
    console.log("=== 步骤5: 删除文档目录中的文件 ===");
    await agent.aiRightClick("以 2285长 开头的文件夹");
    await agent.aiTap("删除");
    console.log("步骤5完成：文件已删除到回收站");

    // 步骤 6: 调用创建长文件名的函数（在原始目录创建同名文件）
    console.log("=== 步骤6: 调用创建长文件名的函数 ===");
    await createLongFileName(system);
    console.log("步骤6完成：已在原始目录创建同名文件夹");

    // 步骤 7: 还原到已存在同名文件的目录，选择"共存"
    console.log("=== 步骤7: 还原文件并选择共存 ===");
    await agent.aiTap("文件管理器左侧栏的回收站目录");
    await agent.aiWaitFor("回收站已打开");
    await agent.aiRightClick("以 2285长 开头的文件夹");
    await agent.aiTap("还原");
    await agent.aiWaitFor("还原确认弹框已显示");
    await agent.aiTap("共存");
    
    // 断言：回收站目录无"2285长"开头的文件
    await agent.aiAssert("回收站目录不存在以 2285长 开头的文件");
    
    // 断言：文档目录有两个"2285长"开头的文件
    await agent.aiTap("文件管理器左侧栏的文档目录");
    await agent.aiWaitFor("文档目录页面加载完成");
    await agent.aiAssert("文档目录存在两个以 2285长 开头的文件夹");
    console.log("步骤7完成：共存操作成功");

    console.log("===1812081-长文件名开启-回收站还原同名文件处理,执行成功===");

  }, { timeout: 600000, tags: ["1812081", "level2", "smoke/file_operations", 'remote', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await deleteLongFileName(system);
    await system.exec('rm -rf ~/Documents/2285长*', 500);
    await system.exec('rm -rf ~/.local/share/Trash/files/' + longFileName, 500);
    await system.exec('rm -rf ~/.local/share/Trash/info/' + longFileName + '.trashinfo', 500);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    try {
      if (system && typeof system.exec === 'function') {
        await system.exec('killall dde-file-manager', 500);
        await deleteLongFileName(system);
      }
    } catch (error) {
      console.log('afterAll 执行系统命令时出现异常:', error);
    }
    try {
      if (device && typeof device.pressKey === 'function') {
        await device.pressKey('Esc');
      }
      if (uos && typeof uos.showDesktop === 'function') {
        await uos.showDesktop();
      }
    } catch (error) {
      console.log('afterAll 恢复桌面时出现异常:', error);
    }
  });
});