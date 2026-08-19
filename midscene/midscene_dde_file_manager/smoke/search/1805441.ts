/**
 * 用例 PMSID: 1805441
 * 用例标题: 【搜索】全文搜索-搜索隐藏 #2
 * 生成时间: 2026-04-09 18:00:00
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1805441-【搜索】全文搜索-搜索隐藏文件', () => {
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

    // 前置条件：确认文件管理器设置中已勾选全文搜索
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });

    // 确保全文搜索已开启
    await agent.aiTap("右上角有3条横线的菜单图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置");
    await agent.aiWaitFor("设置窗口已打开");
    await agent.aiTap("高级设置");
    const fullTextEnabled = await agent.aiBoolean("全文搜索选项已勾选（左侧有蓝色√）", { deepThink: true });
    if (!fullTextEnabled) {
      await agent.aiTap("全文搜索选项前的勾选框");
      await agent.aiAssert("全文搜索选项已勾选（左侧有蓝色√）");
    }
    
    // 切换到"新窗口"标签页，勾选"显示隐藏文件"
    await agent.aiTap("设置窗口中的新窗口标签页");
    await agent.aiWaitFor("新窗口设置页面已显示", { timeout: 5000 });
    const showHiddenEnabled = await agent.aiBoolean("显示隐藏文件选项已勾选（左侧有蓝色√）", { deepThink: true });
    if (!showHiddenEnabled) {
      await agent.aiTap("显示隐藏文件选项前的勾选框");
      await agent.aiAssert("显示隐藏文件选项已勾选（左侧有蓝色√）");
    }
    
    await agent.aiTap("设置窗口右上角关闭按钮");
    await agent.aiWaitFor("设置窗口已关闭");
  });

  test('1805441-全文搜索-搜索隐藏文件', async ({ device, agent, uos, system }) => {

    // 前置准备：创建隐藏文件（文件名以.开头），并写入特定内容
    console.log('===== 前置准备：创建隐藏测试文件 =====');
    const hiddenFileName = ".hidden_search_test.txt";
    const hiddenContent = "hidden_unique_content_9527";

    // 在文档目录创建隐藏文件并写入内容
    await system.exec(`echo "${hiddenContent}" > ~/Documents/${hiddenFileName}`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 进入文档目录
    await agent.aiTap("侧边栏的文档目录");
    await agent.aiWaitFor("文档目录已打开", { timeout: 10000 });
    await device.pressKey("F5");

    // 步骤1：输入隐藏文件的文件名进行搜索
    console.log('===== 步骤1: 输入隐藏文件名进行搜索 =====');
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput(".hidden_search_test.txt", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");

    // 断言：可匹配出隐藏文件
    console.log('===== 断言：搜索文件名可匹配出隐藏文件 =====');
    await agent.aiAssert("搜索结果中显示.hidden_search_test.txt隐藏文件");

    // 清空搜索框，准备步骤2
    await agent.aiTap("搜索输入框中的清除按钮");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤2：输入包含隐藏文件内容的关键字进行搜索
    console.log('===== 步骤2: 输入隐藏文件内容关键字进行搜索 =====');
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("hidden_unique_content_9527", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");

    // 断言：不可匹配出隐藏文件（全文搜索不索引隐藏文件内容）
    console.log('===== 断言：搜索内容不匹配隐藏文件 =====');
    await agent.aiAssert("搜索结果中不显示.hidden_search_test.txt隐藏文件");

    // 清空搜索框
    await agent.aiTap("搜索输入框中的清除按钮");

  }, { timeout: 600000, tags: ['1805441', 'level3', 'smoke', 'search', 'fulltext', 'hidden', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    // 删除测试创建的隐藏文件
    console.log('===== 删除隐藏测试文件 =====');
    try {
      await system.exec('rm -f ~/Documents/.hidden_search_test.txt');
    } catch (err) {
      console.warn('删除隐藏测试文件失败:', err.message);
    }

    // 恢复设置：取消勾选"显示隐藏文件"
    console.log('===== 恢复设置：取消勾选显示隐藏文件 =====');
    await agent.aiTap("右上角有3条横线的菜单图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置");
    await agent.aiWaitFor("设置窗口已打开");
    await agent.aiTap("设置窗口中的新窗口标签页");
    await agent.aiWaitFor("新窗口设置页面已显示", { timeout: 5000 });
    
    const showHiddenEnabled = await agent.aiBoolean("显示隐藏文件选项已勾选（左侧有蓝色√）", { deepThink: true });
    if (showHiddenEnabled) {
      await agent.aiTap("显示隐藏文件选项前的勾选框");
      await agent.aiWaitFor("显示隐藏文件选项已取消勾选", { timeout: 3000 });
      console.log('✅ 已取消勾选显示隐藏文件');
    } else {
      console.log('显示隐藏文件选项未勾选，无需操作');
    }
    
    await agent.aiTap("设置窗口右上角关闭按钮");
    await agent.aiWaitFor("设置窗口已关闭");

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
