/**
 * 用例 PMSID: 1809167
 * 用例标题: 网络挂载-设置快捷访问后卸载网络挂载，然后进入快捷访问
 * 生成时间: 2026-11-16
 * 用例编写人: UT000686(李双双)
 * 参考: main_interface_area/fixed_directory/sidebar/1809171.ts（快捷访问）、common.ts SmbMount/cleanSmbMounts
 * 追溯: PMS 1809167 步骤1-5 与期望1-5（前置"已挂载smb/ftp/sftp"取 smb 代表实现，见交付说明）
 */
const caseDir = process.env.TESTCASE_DIR;
const SMB_IP = process.env.SMB_IP;
const SMB_DIR = process.env.SMB_DIR;

describe('1809167-网络挂载-设置快捷访问后卸载网络挂载，然后进入快捷访问', () => {
  let common = null;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    common = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await common.closeFileManager(system);
    await common.clearEnvironment(system);
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await common.closeFileManager(system);
    await uos.showDesktop();

    // 前置：文管已启动
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });

    // 前置：确保smb未挂载（清理环境）
    await common.cleanSmbMounts(agent, system);

    // 前置：已挂载smb（用户名方式）
    console.log('前置：挂载smb共享');
    await common.SmbMount(agent, system, device, 1);
    // 校验挂载成功：地址栏显示 smb 共享路径
    await agent.aiWaitFor(`地址栏显示${SMB_IP}上的${SMB_DIR}共享目录`, { timeoutMs: 30000 });
    // 在共享内创建步骤1要右键的目录（经挂载点写入，与1808675同路径约定）
    const mountBase = `/media/${process.env.TEST_USERNAME}/smbmounts/smb-share:server=${SMB_IP},share=${SMB_DIR}`;
    await system.exec(`sudo -u '${process.env.TEST_USERNAME}' mkdir -p '${mountBase}/1809167dir'`, 15000);
    await agent.aiWaitFor('文件列表中出现1809167dir文件夹', { timeoutMs: 20000 });
  });

  test('1809167-网络挂载-设置快捷访问后卸载网络挂载，然后进入快捷访问', async ({ device, agent, uos, system }) => {
    // 步骤1：右键点击smb中的任意目录（共享内的1809167dir文件夹）
    console.log('===== 步骤1：右键smb共享内的目录 =====');
    await agent.aiRightClick('文件列表中的1809167dir文件夹');
    // 期望1：唤起右键菜单
    await agent.aiWaitFor('右键菜单已弹出', { timeoutMs: 10000 });
    await agent.aiAssert('右键菜单已唤起且包含添加到快捷访问选项');

    // 步骤2：点击【添加到快捷访问】
    console.log('===== 步骤2：添加到快捷访问 =====');
    await agent.aiTap('右键菜单中的添加到快捷访问', { deepThink: true });
    // 期望2：添加成功（条目出现在侧边栏；V25 实测 smb 目录的快捷访问条目位于"分区"标题上方区域）
    await agent.aiWaitFor('侧边栏中出现1809167dir条目', { timeoutMs: 30000 });
    await agent.aiAssert('侧边栏中已出现1809167dir的快捷访问条目，添加成功');

    // 步骤3：卸载smb/ftp/sftp（右键挂载条目选择卸载）
    console.log('===== 步骤3：卸载smb挂载 =====');
    await agent.aiRightClick(`侧边栏中的${SMB_IP}文本`);
    await agent.aiWaitFor('右键菜单已弹出', { timeoutMs: 10000 });
    const hasForgetUnmount = await agent.aiBoolean('右键菜单中出现取消记住密码并卸载选项');
    if (hasForgetUnmount) {
      await agent.aiTap('取消记住密码并卸载选项');
    } else {
      await agent.aiAssert('右键菜单中出现卸载选项');
      await agent.aiTap('卸载选项');
    }
    // 卸载可能触发系统授权弹窗
    const needAuth = await agent.aiBoolean('页面出现卸载文件系统需要认证的密码弹窗');
    if (needAuth) {
      await agent.aiTap('认证弹窗中的密码输入框');
      await device.pressKey('ctrl+a');
      await device.typeText(`${process.env.TEST_PASSWORD}`, true);
      await agent.aiTap('认证弹窗中的确定按钮');
    }
    // 期望3：卸载成功（本用例的smb共享条目不再以已挂载状态出现在侧边栏；环境中可能存在其他主机的挂载，不纳入判定）
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiAssert(`侧边栏中不再显示已挂载状态的${SMB_IP} smb共享条目`);

    // 步骤4：点击文管左侧边栏上smb的快捷访问
    console.log('===== 步骤4：点击快捷访问中的1809167dir条目 =====');
    await agent.aiTap('侧边栏中的1809167dir快捷访问条目');
    // 期望4：自动跳转到挂载登录页面
    await agent.aiWaitFor('出现需要授权来访问的账号密码认证弹窗', { timeoutMs: 30000 });

    // 步骤5：输入账号密码登录（弹窗可能因会话缓存凭据自动完成挂载而关闭，两种路径均校验最终进入目录）
    console.log('===== 步骤5：输入账号密码登录 =====');
    const dialogStill = await agent.aiBoolean('需要授权的账号密码认证弹窗仍然显示在界面上');
    if (dialogStill) {
      await agent.aiTap('认证弹窗中的用户名输入框');
      await device.pressKey('ctrl+a');
      await device.typeText(`${process.env.SMB_USERNAME}`, true);
      const pwdStill = await agent.aiBoolean('认证弹窗仍然显示且包含密码输入框');
      if (pwdStill) {
        await agent.aiTap('认证弹窗中的密码输入框');
        await device.pressKey('ctrl+a');
        await device.typeText(`${process.env.SMB_PASSWORD}`, true);
        await agent.aiTap('认证弹窗中的连接按钮');
      } else {
        console.log('输入用户名后认证弹窗已关闭（凭据缓存自动挂载）');
      }
    } else {
      console.log('点击快捷访问后未停留认证弹窗（凭据缓存自动挂载）');
    }

    // 挂载可能触发系统授权弹窗（common.ts 的 handleAuthPopup 未导出，这里内联等价处理）
    const needSysAuth = await agent.aiBoolean('页面出现卸载文件系统需要认证文本');
    if (needSysAuth) {
      console.log('触发弹窗认证，输入密码');
      await device.typeText(`${process.env.TEST_PASSWORD}`, true);
    } else {
      console.log('未触发弹窗认证');
    }
    // 期望5：挂载成功，进入smb快捷访问的内部
    await agent.aiWaitFor(`地址栏显示${SMB_IP}上的${SMB_DIR}共享目录`, { timeoutMs: 60000 });
    await agent.aiWaitFor('文件列表中出现1809167dir文件夹或已进入该目录', { timeoutMs: 30000 });
    await agent.aiAssert('已进入smb快捷访问对应的目录内部，文件列表正常显示');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 900000, tags: ['1809167', 'level3', 'fixed_directory', 'sidebar', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 卸载smb挂载
    try {
      await common.cleanSmbMounts(agent, system, 1);
    } catch (err) {
      console.log('UI卸载smb异常，继续shell兜底:', String((err && err.message) || err).split('\n')[0]);
      await system.exec(`gio mount -u "smb://${SMB_IP}/${SMB_DIR}" 2>/dev/null || true`);
    }
    await device.pressKey('Esc');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 移除快捷访问条目（右键-从快捷访问移除），失败时忽略（可能已随卸载移除）
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
    try {
      await agent.aiRightClick('侧边栏快捷访问中的1809167dir条目');
      await agent.aiWaitFor('右键菜单已弹出', { timeoutMs: 8000 });
      const menuText = await agent.aiQuery('右键菜单中的全部选项文本，返回字符串数组；没有菜单则返回空数组');
      console.log('快捷访问条目右键菜单:', JSON.stringify(menuText));
      const removed = await agent.aiBoolean('右键菜单中包含移除相关的选项（如移除/从快捷访问移除/删除快捷访问）');
      if (removed) {
        await agent.aiTap('右键菜单中的移除选项', { deepThink: true });
      } else {
        await device.pressKey('Esc');
      }
    } catch (err) {
      console.log('快捷访问条目未找到或移除失败，可能已随卸载移除:', String((err && err.message) || err).split('\n')[0]);
    }
    await common.closeFileManager(system);
    await common.clearEnvironment(system);
    await uos.showDesktop();
  });
});
