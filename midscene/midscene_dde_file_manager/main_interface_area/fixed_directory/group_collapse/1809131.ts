/**
 * 用例 PMSID: 1809131
 * 用例标题: 分组折叠-smb选中单个/多个文件夹右键添加到快捷访问
 * 生成时间: 2026-03-12 15:42:34
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;
const testFolders = ["folder1", "folder2", "folder3"]; // 统一测试文件夹名称

describe('1809131-分组折叠-smb选中单个/多个文件夹右键添加到快捷访问', () => {
  // 全局初始化：清理环境+关闭文管
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 引用公共方法清理应用进程和文管配置
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);
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

  // Test1: SMB目录快捷访问测试
  test('1809131-分组折叠-smb选中单个/多个文件夹右键添加到快捷访问', async ({ device, agent, uos, system }) => {

    // 1. 获取环境变量
    const smbIp = process.env.SMB_IP;
    const smbDir = process.env.SMB_DIR;
    const username = process.env.TEST_USERNAME;
    const smbMountPath = `/media/${username}/smbmounts/smb-share:server=${smbIp},share=${smbDir}`;

    // 2. 前置检查：确保关键环境变量存在
    if (!smbIp || !smbDir || !username) {
      throw new Error('缺少SMB测试关键环境变量：SMB_IP/SMB_DIR/TEST_USERNAME');
    }

    // 前置操作：卸载已有SMB挂载
    console.log('===== 前置操作：卸载已有SMB挂载 =====');
    const { cleanSmbMounts, SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    console.log('已有SMB挂载卸载完成');

    // 步骤1: 挂载SMB目录并进入
    console.log('===== 步骤1: 挂载SMB目录并进入目标路径 =====');
    await SmbMount(agent, system, device, 1);
    await agent.aiAssert(`文件管理器左侧边栏显示${smbIp}`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤2: 创建测试文件夹
    console.log('===== 步骤2: 创建folder1/folder2/folder3文件夹 =====');
    await Promise.all(testFolders.map(folder =>
      system.exec(`mkdir -p ${smbMountPath}/${folder}`)
    ));
    await device.pressKey("F5");
    const foldersVisible = await agent.aiBoolean("当前窗口目录已显示folder1、folder2、folder3文件夹", { deepThink: true });
    if (!foldersVisible) {
      throw new Error('测试文件夹创建后未在文管中显示，请检查SMB挂载状态');
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

  }, { timeout: 1200000, tags: ['1809131', 'level3', 'group_collapse', 'DITT', 'sushanshan', 'smb', 'shortcut'] });

  // 每个测试后清理：删除测试文件夹并卸载SMB
  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    // 删除测试文件夹
    const smbIp = process.env.SMB_IP;
    const smbDir = process.env.SMB_DIR;
    const username = process.env.TEST_USERNAME;
    const smbMountPath = `/media/${username}/smbmounts/smb-share:server=${smbIp},share=${smbDir}`;
    console.log('===== 删除测试文件夹 =====');
    for (const folder of testFolders) {
      try {
        await system.exec(`rm -rf ${smbMountPath}/${folder}`);
        console.log(`已删除SMB文件夹: ${folder}`);
      } catch (err) {
        console.warn(`删除SMB文件夹${folder}失败:`, err.message);
      }
    }

    // 卸载SMB服务
    console.log('===== 卸载SMB服务 =====');
    try {
      const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await cleanSmbMounts(agent, system);
      console.log('SMB服务卸载完成');
    } catch (unmountErr) {
      console.warn('SMB服务卸载失败:', unmountErr.message);
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
