// @ts-nocheck
/**
 * 用例 PMSID: 1807719
 * 用例标题: 【文件右键】右键刷新功能
 * 生成时间: 2026-04-28
 * 用例编写人: UT000686(李双双)
 */

describe('1807719-【文件右键】右键刷新功能', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager');
    await uos.showDesktop();
    // 打开文件管理器并最大化
    await device.pressKey('Super+E');
    await uos.maximizeWindow();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('Escape');
  });

  test('1807719-【文件右键】右键刷新功能', async ({ device, agent, uos, system }) => {

    // 步骤1：在文件管理器-文档目录空白处右键，断言右键菜单存在"刷新"，点击"刷新"，文件管理器显示正常
    console.log('步骤1: 文档目录空白处右键刷新');

    // 导航到文档目录
    await agent.aiTap('文件管理器左侧栏的文档');
    await agent.aiWaitFor('文档目录已加载');

    // 空白处右键
    await agent.aiRightClick('文档目录空白区域');
    await agent.aiWaitFor('右键菜单已显示');

    // 断言右键菜单存在"刷新"
    await agent.aiAssert('右键菜单中包含刷新选项');

    // 点击刷新
    await agent.aiTap('刷新');
    await agent.aiWaitFor('文档目录刷新完成');

    // 断言文件管理器显示正常
    await agent.aiAssert('文档目录正常显示，无异常');
    console.log('✅ 步骤1验证通过：文档目录右键刷新功能正常');

    // 步骤2：在桌面空白处右键，断言右键菜单存在"刷新"，点击"刷新"，文件管理器显示正常
    console.log('步骤2: 桌面空白处右键刷新');

    // 导航到桌面
    await uos.showDesktop();
    await agent.aiWaitFor('桌面已加载');

    // 空白处右键
    await agent.aiRightClick('桌面空白区域');
    await agent.aiWaitFor('右键菜单已显示');

    // 断言右键菜单存在"刷新"
    await agent.aiAssert('右键菜单中包含刷新选项');

    // 点击刷新
    await agent.aiTap('刷新');
    await agent.aiWaitFor('桌面刷新完成，桌面图标显示正常');

    // 断言文件管理器显示正常
    await agent.aiAssert('桌面目录正常显示，无异常');
    console.log('✅ 步骤2验证通过：桌面右键刷新功能正常');

  }, { timeout: 1200000, tags: ['1807719', 'level2', 'smoke', 'file_operations', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理特殊名称文件夹
    await system.exec('rm -rf ~/Documents/1807719');
    console.log('特殊名称文件夹已清理');

    // 关闭文件管理器
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    // 双重保险清理文件管理器环境
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
