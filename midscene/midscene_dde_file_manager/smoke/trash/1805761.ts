// @ts-nocheck
/**
 * 用例 PMSID: 1805761
 * 用例标题: 回收站，空白处右键清空回收站
 * 生成时间: 2026-04-23
 * 用例编写人: UT000686(李双双)
 */

describe('1805761-回收站，空白处右键清空回收站', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
     // 前置条件：清空回收站确保环境干净
    await system.exec('rm -rf ~/.local/share/Trash/files/*');
    await system.exec('rm -rf ~/.local/share/Trash/info/*');
    await system.exec('killall dde-file-manager');
    await uos.showDesktop();
    await system.exec(`touch  ~/Desktop/1805761`);
    console.log('1805761文件已创建到桌面');
    await agent.aiRightClick('1805761的图标');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('删除');
    // 打开文件管理器并最大化
    await device.pressKey('Super+E');
    await system.exec('sleep 3');
    await uos.maximizeWindow();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：在桌面创建一个1805761文件
  });

  test('1805761-回收站，空白处右键清空回收站', async ({ device, agent, uos, system }) => {

    // 步骤1：打开文件管理器-回收站，空白处点击右键
    console.log('步骤1: 打开文件管理器-回收站，空白处点击右键');
    await agent.aiTap('文件管理器左侧栏的回收站');
    await agent.aiWaitFor('回收站目录已加载');
    await agent.aiAssert('回收站中存在1805761文件');

    // 空白处点击右键
    await agent.aiRightClick('回收站右侧内容区域空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiAssert('右键菜单中包含清空回收站选项');
    console.log('✅ 步骤1验证通过：空白处右键菜单显示正常');

    // 步骤2：点击"清空回收站"，在清空回收站弹框中点击"清空"，文件清空成功
    console.log('步骤2: 点击"清空回收站"，在弹框中点击"清空"，文件清空成功');
    await agent.aiTap('清空回收站');
    await agent.aiWaitFor('清空回收站弹框已显示');

    // 点击清空按钮
    await agent.aiTap('清空');
    await agent.aiWaitFor('回收站已清空', { timeoutMs: 10000 });

    // 断言：文件清空成功
    await agent.aiAssert('回收站已清空，不存在1805761文件');
    console.log('✅ 步骤2验证通过：清空回收站成功');

  }, { timeout: 1200000, tags: ['1805761', 'level2', 'smoke', 'trash', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 命令行清理回收站残留
    await system.exec('rm -rf ~/.local/share/Trash/files/*');
    await system.exec('rm -rf ~/.local/share/Trash/info/*');
    console.log('回收站已清理');

    // 关闭文件管理器
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    // 双重保险清理文件管理器环境
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
