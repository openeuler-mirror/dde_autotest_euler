/**
 * 用例 PMSID: 1805399
 * 用例标题: [t][core]全文搜索-勾选全文搜索配置项
 * 生成时间: 2026-04-09 19:00:00
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1805399-[t][core]全文搜索-勾选全文搜索配置项', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);

    // 前置条件：确认全文搜索配置项未勾选
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });

    // 检查全文搜索配置项，如已勾选则取消勾选
    await agent.aiTap("右上角有3条横线的菜单图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置");
    await agent.aiWaitFor("设置窗口已打开");
    await agent.aiTap("高级设置");
    const fullTextEnabled = await agent.aiBoolean("全文搜索选项已勾选（左侧有蓝色√）", { deepThink: true });
    if (fullTextEnabled) {
      await agent.aiTap("全文搜索选项前的勾选框");
      await agent.aiAssert("全文搜索选项未勾选");
    }
    await agent.aiTap("设置窗口右上角关闭按钮");
    await agent.aiWaitFor("设置窗口已关闭");
  });

  test('1805399-全文搜索-勾选全文搜索配置项', async ({ device, agent, uos, system }) => {

    // 步骤1：打开文件管理器，点击设置
    console.log('===== 步骤1: 打开设置菜单 =====');
    await agent.aiTap("右上角有3条横线的菜单图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置");
    await agent.aiWaitFor("设置窗口已打开");

    // 断言：设置菜单已呼出
    await agent.aiAssert("设置页面包含基本设置和高级设置选项");

    // 步骤2：点击勾选全文搜索配置项
    console.log('===== 步骤2: 勾选全文搜索配置项 =====');
    await agent.aiTap("高级设置");
    await agent.aiAssert("全文搜索选项显示且未勾选");

    // 点击勾选全文搜索选项
    await agent.aiTap("全文搜索选项前的勾选框");

    // 断言：全文搜索被勾选
    await agent.aiAssert("全文搜索选项已勾选（左侧有蓝色√）");

    // 步骤3：关闭设置页面再重新打开
    console.log('===== 步骤3: 关闭设置页面再重新打开 =====');
    await agent.aiTap("设置窗口右上角关闭按钮");
    await agent.aiWaitFor("设置窗口已关闭");

    // 重新打开设置页面
    await agent.aiTap("右上角有3条横线的菜单图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置");
    await agent.aiWaitFor("设置窗口已打开");
    await agent.aiTap("高级设置");

    // 断言：全文搜索仍然被勾选（配置项持久化）
    await agent.aiAssert("全文搜索选项仍然被勾选（左侧有蓝色√）");

    // 关闭设置窗口
    await agent.aiTap("设置窗口右上角关闭按钮");
    await agent.aiWaitFor("设置窗口已关闭");

  }, { timeout: 600000, tags: ['1805399', 'level3', 'smoke', 'search', 'fulltext', 'setting', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');
    console.log('[步骤] 关闭文件管理器窗口');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });
});
