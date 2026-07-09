/**
 * 用例 PMSID: 1813235
 * 用例标题:  【SMB】挂载smb-通过连接服务器挂载smb
 * 生成时间: 2025-3-19 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

// 获取环境变量
const caseDir = process.env.TESTCASE_DIR;
const testFolders = ["folder1", "folder2", "folder3"]; 
const smbIp = process.env.SMB_IP;
const smbDir = process.env.SMB_DIR;
const username = process.env.TEST_USERNAME;
const smbMountPath = `/media/${username}/smbmounts/smb-share:server=${smbIp},share=${smbDir}`;

// 环境清理：安静删除配置文件，关闭文件管理器
async function clearEnv(system) {
  try {
    await system.exec(`rm -rf ~/.config/deepin/dde-file-manager/*.json`);
    await system.exec(`rm -f ~/.config/deepin/dde-file-manager.json`);
    await system.exec('pkill -f dde-file-manager || true');
    console.log('文件管理器环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1813235-【SMB】挂载smb-通过连接服务器挂载smb', () => {
  // 全局初始化：环境清理+显示桌面
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();
  });

  // 每个测试前重置文管状态
  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 打开文管并最大化
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });
  });

  // Test1: 匿名访问smb服务器
  test('1813235-【SMB】挂载smb-通过连接服务器挂载smb-匿名', async ({ device, agent, uos, system }) => {
    // 前置1：确保关键环境变量存在（避免执行中崩溃）
    if (!smbIp || !smbDir || !username) {
      throw new Error('缺少SMB测试关键环境变量：SMB_IP/SMB_DIR/TEST_USERNAME');
    }
    try {
      // 步骤1：完全卸载已有SMB挂载
      console.log('===== 前置操作：卸载已有SMB挂载 =====');
      const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await cleanSmbMounts(agent, system);
      console.log('已有SMB挂载卸载完成');

      // 步骤2: 不传入参数，匿名挂载smb
      console.log('===== 步骤1: 挂载SMB目录并进入目标路径 =====');
      const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await SmbMount(agent, system, device);

      // 步骤3: 检查smb挂载状态
      const boolMount = await agent.aiBoolean(`弹窗提示不允许匿名挂载`);
      if (boolMount) {
        console.log('当前smb不允许匿名挂载');
        await agent.aiTap("弹窗中的确定");
        await agent.aiAssert(`文件管理器左侧边栏没有显示${smbIp}`);
      } else {
        console.log('当前smb正常匿名挂载');
        await agent.aiAssert(`文件管理器左侧边栏显示${smbIp}`);
        await agent.aiTap("侧边栏中的计算机");
        await agent.aiAssert(`磁盘列表下显示${smbIp}`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // 增加等待确保挂载稳定
      }

    } catch (mainError) {
      // 统一错误日志格式，抛出错误确保测试框架感知失败
      console.error('===== 测试执行出错 =====', mainError.message);
      throw mainError;
    }

  }, { timeout: 600000, tags: ['1813235', 'level2', 'smoke', 'smb_ftp', 'DITT', 'hujian'] });

  // Test2: 输入用户名和密码访问smb服务器
  test('1813235-【SMB】挂载smb-通过连接服务器挂载smb-非匿名', async ({ device, agent, uos, system }) => {
    // 前置1：确保关键环境变量存在（避免执行中崩溃）
    if (!smbIp || !smbDir || !username) {
      throw new Error('缺少SMB测试关键环境变量：SMB_IP/SMB_DIR/TEST_USERNAME');
    }
    try {
      // 步骤1：完全卸载已有SMB挂载
      console.log('===== 前置操作：卸载已有SMB挂载 =====');
      const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await cleanSmbMounts(agent, system);
      console.log('已有SMB挂载卸载完成');

      // 步骤2: 传入参数1，输入用户名和密码挂载smb服务器
      console.log('===== 步骤1: 挂载SMB目录并进入目标路径 =====');
      const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await SmbMount(agent, system, device, 1);

      // 步骤3: 检查smb挂载状态
      await agent.aiAssert(`文件管理器左侧边栏显示${smbIp}`);
      await agent.aiTap("侧边栏中的计算机");
      await agent.aiAssert(`磁盘列表下显示${smbIp}`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 增加等待确保挂载稳定

    } catch (mainError) {
      // 统一错误日志格式，抛出错误确保测试框架感知失败
      console.error('===== 测试执行出错 =====', mainError.message);
      throw mainError;
    }

  }, { timeout: 600000, tags: ['1813235', 'level2', 'smoke', 'smb_ftp', 'DITT', 'hujian'] });
 
  // 每个测试后卸载SMB并关闭文件管理器
  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');
    // 后置清理: 卸载SMB服务（优化日志格式，统一错误处理）
    console.log('==== 卸载SMB服务 ====');
      try {
        const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
        await cleanSmbMounts(agent, system);
        console.log('SMB服务卸载完成');
      } catch (unmountErr) {
        console.warn('SMB服务卸载失败:', unmountErr.message);
      }
    console.log('==== 关闭文件管理器窗口 ====');
    await uos.closeCurrentWindow();
  });

  // 全局清理，恢复测试环境
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await clearEnv(system);
    await uos.showDesktop();
  });
});