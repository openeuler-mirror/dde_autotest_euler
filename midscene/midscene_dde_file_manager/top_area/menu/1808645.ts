/**
 * 用例 PMSID: 1808645
 * 用例标题: 【工作区视图插件显示隐藏】文管设置，高级设置-挂载-Samba共享端常驻显示挂载入口
 * 生成时间: 2026-05-08
 * 用例编写人: UT000649（黄甜）
 */

describe('1808645-【工作区视图插件显示隐藏】文管设置，高级设置-挂载-Samba共享端常驻显示挂载入口', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await system.exec('killall dde-file-manager', 500);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
      });

  test('1808645-【工作区视图插件显示隐藏】文管设置，高级设置-挂载-Samba共享端常驻显示挂载入口', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1808645-Samba共享端常驻显示挂载入口 ===');

    console.log('步骤1: 打开文件管理器');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    const caseDir = process.env.TESTCASE_DIR;
    // 用户名挂载smb
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device, 1);
    await agent.aiTap('侧边栏的计算机');

    console.log('步骤2: 打开设置窗口，进入高级设置-挂载');
    await agent.aiTap('窗口主菜单');
    await agent.aiTap('设置');
    await agent.aiTap('高级设置');

    console.log('步骤3: 检查默认值');
    await agent.aiAssert("Samba共享端常驻显示挂载入口左侧复选框显示蓝色√");
    console.log('✅ 默认值已勾选');

    console.log('步骤4: 取消勾选Samba共享端常驻显示挂载入口');
    await agent.aiTap("Samba共享端常驻显示挂载入口左侧方框");
    await agent.aiAssert("Samba共享端常驻显示挂载入口左侧复选框没有蓝色√");
    await agent.aiTap('设置窗口关闭按钮');

    console.log('步骤5: 卸载SMB后检查入口是否消失');
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    await agent.aiAssert("侧边栏SMB入口已消失");
    console.log('✅ SMB入口已消失，不会常驻显示');
    
    console.log('✅ 1808645用例测试完成');
  }, { timeout: 600000, tags: ["1808645", "level3", "menu", "DITT", "huangtian"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const caseDir = process.env.TESTCASE_DIR;
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    await agent.aiTap('窗口主菜单');
    await agent.aiTap('设置');
    await agent.aiTap('高级设置');
    await agent.aiTap("Samba共享端常驻显示挂载入口左侧方框");
    await agent.aiTap('设置窗口关闭按钮');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
  });
});