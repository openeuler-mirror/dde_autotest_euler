/**
 * 用例 PMSID: 1808657
 * 用例标题: 【新建标签页】文管SMB页面，菜单-新建标签页
 * 生成时间: 2026-05-08
 * 用例编写人: UT000649（黄甜）
 */

describe('1808657-【新建标签页】文管SMB页面，菜单-新建标签页', () => {
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

  test('1808657-【新建标签页】文管SMB页面，菜单-新建标签页', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1808657-SMB页面新建标签页 ===');

    console.log('步骤1: 打开文件管理器');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');
    console.log('✅ 文件管理器已打开');

    const caseDir = process.env.TESTCASE_DIR;
    // 前置完全卸载smb
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system);
    // 用户名挂载smb
    const { SmbMount } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await SmbMount(agent, system, device, 1);

    console.log('✅ 已挂载并进入SMB页面');

    console.log('步骤2: 点击顶部工具栏菜单按钮下的新建标签页');
    await agent.aiTap("窗口主菜单");
    await agent.aiTap("新建标签页");

    console.log('步骤3: 验证新建标签页是否为SMB页面');
    await agent.aiAssert("新标签页显示SMB页面内容");
    console.log('✅ 新建标签页为SMB页面');

    console.log('✅ 1808657用例测试完成');
  }, { timeout: 600000, tags: ["1808657", "level3", "menu", "DITT", "huangtian"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const caseDir = process.env.TESTCASE_DIR;
    const { cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await cleanSmbMounts(agent, system, 1);
    await system.cleanupFileManager();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});