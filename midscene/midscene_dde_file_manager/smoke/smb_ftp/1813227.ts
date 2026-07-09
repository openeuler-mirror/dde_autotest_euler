/**
 * 用例 PMSID: 1813227
 * 用例标题:  【SMB】挂载smb-勾选记住密码
 * 生成时间: 2025-3-24 10:00:00
 * 用例编写人: UT002411(胡戬)
 */

// 获取环境变量
const caseDir = process.env.TESTCASE_DIR;
const smbpwd = process.env.SMB_PASSWORD;
const smbname = process.env.SMB_USERNAME;
const password = process.env.TEST_PASSWORD;
const username = process.env.TEST_USERNAME;
const dir = process.env.SMB_DIR;
const ip = process.env.SMB_IP;
const smbMountPath = `/media/${username}/smbmounts/smb-share:server=${ip},share=${dir}`;

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

describe('1813227-【SMB】挂载smb-勾选记住密码', () => {
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

  // Test1: 【SMB】挂载smb-勾选记住密码
  test('1813227-【SMB】挂载smb-勾选记住密码', async ({ device, agent, uos, system }) => {
    // 前置1：确保关键环境变量存在（避免执行中崩溃）
    if (!ip || !dir || !username) {
      throw new Error('缺少SMB测试关键环境变量：SMB_IP/SMB_DIR/TEST_USERNAME');
    }
    try {
      // 步骤1：完全卸载已有SMB挂载
      console.log('===== 前置操作：卸载已有SMB挂载 =====');
      const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await cleanSmbMounts(agent, system);
      console.log('已有SMB挂载卸载完成');

      // 步骤2: 挂载smb-勾选记住密码
      console.log('===== 挂载smb-勾选记住密码 =====');
      await device.pressKey('Ctrl','l');
      await device.pressKey('Ctrl','a');
      await device.typeText(`smb://${ip}/${dir}`, true);
      await agent.aiWaitFor("出现需要授权来访问文本");
      await device.typeText(`${smbname}`);
      await agent.aiInput( `${smbpwd}`,'密码输入框');
      await agent.aiTap("记住密码文本");
      await agent.aiTap("连接选项");
      await system.exec("sleep 2");
      const boolA = await agent.aiBoolean(`页面挂载文件系统需要认证文本`);
      if (boolA) {
          console.log('触发弹窗认证，输入密码');
          await device.typeText(`${password}`, true);
      } else {
          console.log('未触发弹窗认证');
      }

      // 步骤3: 卸载smb
      console.log('===== 卸载smb =====');
      await agent.aiDoubleClick('侧边栏的计算机文本');
      await agent.aiRightClick(`侧边栏中的${ip}文本`);
      await agent.aiTap("右键菜单中的卸载选项");

      // 步骤4: 再次挂载smb，检查是否需要输入密码
      console.log('===== 再次挂载smb，检查是否需要输入密码 =====');
      await device.pressKey('Ctrl','l');
      await device.pressKey('Ctrl','a');
      await device.typeText(`smb://${ip}/${dir}`, true);
      await agent.aiAssert("没有出现授权的弹窗");  //检查无登录弹窗
      await agent.aiAssert(`文件管理器左侧边栏显示${ip}`); //检查smb已挂载

    } catch (mainError) {
      // 统一错误日志格式，抛出错误确保测试框架感知失败
      console.error('===== 测试执行出错 =====', mainError.message);
      throw mainError;
    }

  }, { timeout: 600000, tags: ['1813227', 'level2', 'smoke', 'smb_ftp', 'DITT', 'hujian'] });
 
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