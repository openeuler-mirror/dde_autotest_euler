// @ts-nocheck
/**
 * 用例 PMSID: 1957271
 * 用例标题: 【网络共享目录设置备注】文件选择对话框显示备注名
 * 生成时间: 2026-07-30
 * 用例编写人: UT000649（黄甜）
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1957271-【网络共享目录设置备注】文件选择对话框显示备注名', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('killall dde-file-manager', 500);
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await uos.maximizeWindow();
    await system.exec(`touch ~/Desktop/1957271_test.txt`, 500);
    // 前置完全卸载smb
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    // 用户名挂载smb
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device, 1);
    const ip = process.env.SMB_IP;
    await agent.aiAssert(`侧边栏出现${ip}文本`);

    await system.exec(`touch ~/Desktop/1957271_test.txt`, 500);
  });

  test('1957271-【网络共享目录设置备注】文件选择对话框显示备注名', async ({ device, agent, uos, system, env }) => {
    const ip = process.env.SMB_IP;
    const SMB_DIR = process.env.SMB_DIR;

    // 前置条件：smb共享目录已设置备注名称
    console.log('前置条件：为smb共享目录设置备注名称');
    await agent.aiRightClick(`侧边栏中的${ip}文本`);
    await agent.aiTap("重命名");
    await device.typeText(SMB_DIR);
    await device.pressKey('Enter');
    await agent.aiAssert(`侧边栏出现${SMB_DIR}文本`);
    await agent.aiTap("文件管理器右上角关闭按钮：x");

    // 步骤1：新建文本文件，选择另存为，在弹出的对话框中，检查左侧的共享目录是否显示为备注名称
    console.log('步骤1：新建文本文件，选择另存为，检查左侧共享目录是否显示为备注名称');

    // 双击打开文本文件
    await agent.aiDoubleClick("桌面上的1957271_test.txt");
    await agent.aiWaitFor("文本编辑器界面已显示");
    // 点击主菜单，选择另存为
    await agent.aiTap("文本编辑器右上角主菜单");
    await agent.aiTap("另存为");
    // 滚动侧边栏查看网络共享目录
    await agent.aiScroll('侧边栏的桌面文本', { direction: 'down', distance: 10 });
    // 预期1：显示为备注名称
    await agent.aiAssert(`另存为对话框左侧的共享目录显示为备注名称${SMB_DIR}`);
    await agent.aiTap("文件保存对话框右上角关闭按钮：x");

  }, { timeout: 600000, tags: ['1957271', 'level3', '2500u1', 'network_sharing_remarks', 'DITT', 'huangtian'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理：关闭对话框和文本编辑器    
    await system.exec('killall deepin-editor', 500);
    await system.exec('rm -f ~/Desktop/1957271_test.txt', 500);

    // 恢复smb名称为IP，便于后续清理
    const SMB_DIR = process.env.SMB_DIR;
    const ip = process.env.SMB_IP;
    await uos.openApp("文件管理器");
    await agent.aiScroll('侧边栏的桌面文本', { direction: 'down', distance: 10 });
    await agent.aiRightClick(`侧边栏中的${SMB_DIR}文本`);
    await agent.aiTap("重命名");
    await device.typeText(ip);
    await device.pressKey('Enter');
    await agent.aiWaitFor(`侧边栏出现${ip}文本`, { timeoutMs: 5000 });

    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);

    await system.exec('killall dde-file-manager', 500);
    await system.exec('killall deepin-editor', 500);
    await uos.showDesktop();

  });
});
