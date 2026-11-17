// @ts-nocheck
/**
 * 用例 PMSID: 1919157
 * 用例标题: 【网络共享目录设置备注】设置备注-异常系
 * 生成时间: 2026-07-30
 * 用例编写人: UT000649（黄甜）
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1919157-【网络共享目录设置备注】设置备注-异常系', () => {
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
    // 前置完全卸载smb
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    // 用户名挂载smb
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device, 1);
    const ip = process.env.SMB_IP;
    await agent.aiAssert(`侧边栏出现${ip}文本`);
  });

  test('1919157-【网络共享目录设置备注】设置备注-异常系', async ({ device, agent, uos, system, env }) => {
    const ip = process.env.SMB_IP;

    // 步骤1：打开文管，进入计算机界面，右键smb目录，选择重命名，设置名称为空，回车
    console.log('步骤1：进入计算机界面，右键smb目录，设置空名称，回车');
    await agent.aiTap('左侧边栏的计算机');
    await agent.aiWaitFor("计算机界面已显示");
    await agent.aiRightClick(ip);
    await agent.aiTap("重命名");
    // 清空名称
    await device.pressKey('Ctrl', 'a');
    await device.pressKey('Backspace');
    await device.pressKey('Enter');
    // 预期1：名称自动恢复原始IP名称
    await agent.aiAssert(`smb目录名称显示为IP名称${ip}`);

    // 步骤2：设置40个字符新名称：123aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa123，检查是否命名成功
    console.log('步骤2：设置40个字符新名称');
    await agent.aiRightClick(ip);
    await agent.aiTap("重命名");
    await device.typeText(`123aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa123`);
    await device.pressKey('Enter');
    // 预期2：重命名成功
    await agent.aiAssert(`smb目录名称显示为123aaaaa····aaaaa123`);

    // 步骤3：设置40个字符新名称：smb名称长度测试 12！@#$%……^&*（）——+ {}:"|?><ABCD，检查是否命名成功
    console.log('步骤3：设置40个字符含中文特殊字符新名称');
    await agent.aiRightClick(`123aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa123`);
    await agent.aiTap("重命名");
    await device.typeText(`smb名称长度测试 12！@#$%……^&*（）——+ {}:"|?><ABCD`);
    await device.pressKey('Enter');
    // 预期3：重命名成功，为截取前40字符作为新名称
    await agent.aiAssert(`smb目录名称显示为：smb名称长…%……^&*`);
    // 双击后可进入smb目录
    await agent.aiDoubleClick(`smb名称长度测试 12！@#$%……^&*`);
    await agent.aiAssert("成功进入smb目录");

  }, { timeout: 600000, tags: ['1919157', 'level3', '2500u1', 'network_sharing_remarks', 'DITT', 'huangtian'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const ip = process.env.SMB_IP;
    await uos.openApp("文件管理器");
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap('左侧边栏的计算机');
    await agent.aiWaitFor("计算机界面已显示");

    // 尝试将smb目录重命名回IP（处理两种可能的最终名称）
    console.log('恢复smb名称为IP');
    const possibleNames = [
      `smb名称长度测试 12！@#$%……^&*`,
      `123aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa123`,
    ];
    let renamed = false;
    for (const name of possibleNames) {
      try {
        await agent.aiRightClick(name);
        await agent.aiTap("重命名");
        await device.typeText(ip);
        await device.pressKey('Enter');
        console.log(`已将smb目录"${name}"重命名回IP: ${ip}`);
        renamed = true;
        break;
      } catch (e) {
        console.log(`尝试重命名"${name}"失败，继续尝试...`);
      }
    }
    if (!renamed) {
      console.log('smb目录已是IP名称或无需重命名');
    }

    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);

    await system.exec('killall dde-file-manager', 500);
    await uos.showDesktop();
  });
});
