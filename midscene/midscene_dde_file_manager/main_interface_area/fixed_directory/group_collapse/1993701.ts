/**
 * 用例 PMSID: 1993701
 * 用例标题: 分组折叠-sftp选中单个/多个文件夹右键添加到快捷访问
 * 生成时间: 2026-04-10 9:42:34
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;
const testFolders = ["folder1", "folder2", "folder3"]; // 统一测试文件夹名称

describe('1993701-分组折叠-sftp选中单个/多个文件夹右键添加到快捷访问', () => {
  // 全局初始化：清理环境+关闭文管
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 引用公共方法清理应用进程和文管配置
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });

  // 每个测试前重置文管状态
  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);

    // 打开文管并最大化
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });
  });

  // SFTP目录快捷访问测试
  test('1993701-分组折叠-sftp选中单个/多个文件夹右键添加到快捷访问', async ({ device, agent, uos, system }) => {

    // 1. 获取环境变量
    const sftpIp = process.env.SFTP_IP;
    const sftpUsername = process.env.SFTP_USERNAME;
    const sftpMountPath = `/run/user/1000/gvfs/sftp:host=${sftpIp}/sftp/upload`;

    // 2. 前置检查：确保关键环境变量存在
    if (!sftpIp || !sftpUsername) {
      throw new Error('缺少SFTP测试关键环境变量：SFTP_IP/SFTP_USERNAME');
    }

    // 前置操作：卸载已有SFTP挂载
    console.log('===== 前置操作：卸载已有Sftp挂载 =====');
    const { cleanSftpMounts, SftpMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSftpMounts(agent, system);
    console.log('已有Sftp挂载卸载完成');

    // 步骤1: 挂载SFTP目录并进入
    console.log('===== 步骤1: 挂载SFTP目录并进入目标路径 =====');
    await SftpMount(agent, system, device);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 步骤2: 创建测试文件夹
    console.log('===== 步骤2: 创建folder1/folder2/folder3文件夹 =====');
    await Promise.all(testFolders.map(folder =>
      system.exec(`mkdir -p ${sftpMountPath}/${folder}`)
    ));
    await device.pressKey("F5");
    const foldersVisible = await agent.aiBoolean("当前窗口目录已显示folder1、folder2、folder3文件夹", { deepThink: true });
    if (!foldersVisible) {
      throw new Error('测试文件夹创建后未在文管中显示，请检查SFTP挂载状态');
    }

    // 步骤3: 单个文件夹添加快捷访问
    console.log('===== 步骤3: 右键folder1添加至快捷访问 =====');
    await agent.aiRightClick("folder1文件夹");
    await agent.aiWaitFor("弹出右键菜单", { deepThink: true });
    await agent.aiTap("添加到快捷访问");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤4: 断言folder1出现在侧边栏
    console.log('===== 步骤4: 断言侧边栏显示folder1 =====');
    await agent.aiAssert("左侧边栏窗口显示folder1选项");

    // 步骤5: 全选后添加folder2快捷访问，断言显示folder2、folder3
    console.log('===== 步骤5: 全选文件夹后添加folder2至快捷访问 =====');
    await device.pressKey("Ctrl+A");
    await agent.aiRightClick("folder2文件夹");
    await agent.aiWaitFor("弹出右键菜单", { deepThink: true });
    await agent.aiTap("添加到快捷访问");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("左侧边栏窗口显示folder2选项且显示folder3选项");

    // 步骤6: 移除folder3快捷访问，断言folder1消失
    console.log('===== 步骤6: 右键folder3移除快捷访问，断言folder1不显示 =====');
    await agent.aiRightClick("folder3文件夹");
    await agent.aiWaitFor("弹出右键菜单", { deepThink: true });
    await agent.aiTap("从快捷访问移除");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("左侧边栏窗口不显示folder1选项");

  }, { timeout: 1200000, tags: ['1993701', 'level3', 'group_collapse', 'DITT', 'sushanshan', 'sftp', 'shortcut'] });

  // 每个测试后清理：删除测试文件夹并卸载SFTP
  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    // 删除测试文件夹
    const sftpIp = process.env.SFTP_IP;
    const sftpMountPath = `/run/user/1000/gvfs/sftp:host=${sftpIp}/sftp/upload`;
    console.log('===== 删除测试文件夹 =====');
    for (const folder of testFolders) {
      try {
        await system.exec(`rm -rf ${sftpMountPath}/${folder}`);
        console.log(`已删除SFTP文件夹: ${folder}`);
      } catch (err) {
        console.warn(`删除SFTP文件夹${folder}失败:`, err.message);
      }
    }
    await device.pressKey("F5");

    // 卸载SFTP服务
    console.log('===== 卸载SFTP服务 =====');
    try {
      const { cleanSftpMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await cleanSftpMounts(agent, system);
      console.log('SFTP服务卸载完成');
    } catch (unmountErr) {
      console.warn('SFTP服务卸载失败:', unmountErr.message);
    }

    console.log('[步骤] 关闭文件管理器窗口');
    await uos.closeCurrentWindow();
  });

  // 全局清理
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });

});
