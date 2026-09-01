
/**
 * 用例 PMSID: 1813055
 * 用例标题: 文管设置：隐藏 Samba共享常驻，所有目录都为卸载状态
 * 生成时间: 2026-02-28 15:48:13
 * 用例编写人：UT006252(杨通)
 */

describe('1813055-文管设置：隐藏 Samba共享常驻，所有目录都为卸载状态', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const caseDir = process.env.TESTCASE_DIR;
    // 打开文管并全屏显示
    await device.pressKey('Super+E');
    await system.exec(`sleep 3`);
    console.log('全屏显示文件管理器');
    await uos.maximizeWindow();
    // 前置完全卸载smb
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    // 重置smb密码
    const {ResetSmbPwd}= await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await ResetSmbPwd(system);
    // 用户名挂载smb
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device, 1);
    // 修改组策略值为true（隐藏 Samba 共享常驻）
    await system.exec(`dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.samba.permanent -v true`);
    // 卸载smb，确保所有目录为卸载状态
    const username = process.env.SMB_USERNAME;
    const password = process.env.SMB_PASSWORD;
    const ip = process.env.SMB_IP;
    const dir = process.env.SMB_DIR;
    await system.exec(`echo ${password}| sudo -S umount "/media/${username}/smbmounts/smb-share:server=${ip},share=${dir}"`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1813055-文管设置：隐藏 Samba共享常驻，所有目录都为卸载状态', async ({ device, agent, uos, system }) => {
    const ip = process.env.SMB_IP;
    // 返回计算机界面
    await agent.aiTap('计算机');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 设置 SMB 共享端常驻显示挂载入口为隐藏（保持不显示）
    await agent.aiTap('文件管理器主菜单按钮');
    await agent.aiWaitFor('设置');
    await agent.aiTap('设置');
    await agent.aiWaitFor('打开行为');
    await agent.aiTap('高级设置下方的搜索');
    await agent.aiWaitFor('自动挂载');
    await agent.aiTap('Samba共享端常驻显示挂载入口');
    await agent.aiTap('设置窗口右上角关闭按钮:X');
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 检查侧边栏和计算机视图内是否显示Samba挂载入口（期望都不显示）
    await agent.aiAssert(`侧边栏不显示${ip}`);
    const caseDir = process.env.TESTCASE_DIR;
    // 清理环境并打开文本编辑器
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    // 打开文本编辑器
    await uos.openApp('文本编辑器', 2000, 100000);
    // 分别打开文件选择对话框和文件保存对话框
    await agent.aiTap('文本编辑器主菜单按钮');
    await agent.aiWaitFor('打开文件');
    await agent.aiTap('打开文件');
    await agent.aiScroll('侧边栏的桌面文本', { direction: 'down', distance: 1000 });
    await agent.aiWaitFor('网络邻居');
    await agent.aiAssert(`侧边栏不显示${ip}`);
    await agent.aiTap('窗口右上角关闭按钮:X');
    await agent.aiTap('文本编辑器主菜单按钮');
    await agent.aiWaitFor('保存');
    await agent.aiTap('另存为');
    await agent.aiScroll('侧边栏的桌面文本', { direction: 'down', distance: 1000 });
    await agent.aiWaitFor('网络邻居');
    await agent.aiAssert(`侧边栏不显示${ip}`);
    await agent.aiTap('窗口右上角关闭按钮:X');
    // 查看组策略 Samba共享常驻配置值是否为false（隐藏）
    const result = await system.exec(`dde-dconfig --get -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager -k dfm.samba.permanent`);
    if (result.stdout.trim() === 'false') {
      console.log('✅ 验证通过：隐藏配置项值为 false');
    } else {
      console.error(`❌ 验证失败：期望 'false'，实际得到 '${result.stdout}'`);
      throw new Error(`配置项检查失败：预期为 false，但实际值为 ${result.stdout}`);
    }
  }, { timeout: 1200000, tags: ['1813055', 'level3', 'smb', 'DITT', 'yangtong'] });

  afterEach(async ({ device, uos, system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const caseDir = process.env.TESTCASE_DIR;
    // 打开文管并全屏显示
    await uos.openApp('文件管理器', 2000, 100000);
    console.log('全屏显示文件管理器');
    await uos.maximizeWindow();
    // 卸载smb
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    // 清理文本编辑器环境
    await system.exec('killall deepin-editor');
    await system.exec('rm ~/.config/deepin/deepin-editor/config.conf');
  });
});
