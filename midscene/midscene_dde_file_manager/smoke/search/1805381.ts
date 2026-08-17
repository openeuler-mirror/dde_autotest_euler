/**
 * 用例 PMSID: 1805381
 * 用例标题: 【搜索】全文搜索-中文、繁体、英文、数字单独/混合进行搜索
 * 生成时间: 2026-04-10 10:00:00
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1805381-【搜索】全文搜索-中文繁体英文数字搜索', () => {
  let common;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    common = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await common.clearEnvironment(system);
    await common.closeFileManager(system);
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await common.closeFileManager(system);

    // 前置条件：开启全文搜索
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });

    await agent.aiTap("右上角有3条横线的菜单图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置");
    await agent.aiWaitFor("设置窗口已打开");
    await agent.aiTap("高级设置");
    
    const fullTextEnabled = await agent.aiBoolean("全文搜索选项已勾选（左侧有蓝色√）", { deepThink: true });
    if (!fullTextEnabled) {
      await agent.aiTap("全文搜索选项前的勾选框");
      await agent.aiAssert("全文搜索选项已勾选（左侧有蓝色√）");
    }
    
    await agent.aiTap("设置窗口右上角关闭按钮");
    await agent.aiWaitFor("设置窗口已关闭");
  });

  test('1805381-全文搜索-中文繁体英文数字单独混合搜索', async ({ device, agent, uos, system }) => {
    console.log('===== 前置准备：创建包含混合内容的测试文件 =====');
    const testFileName = "fulltext_mixed_search_test.txt";
    const testContent = "天ss123空s44下雨lllll 呼龍4s呼 mm22你好 a,b 123.456";
    
    // 创建测试文件并写入内容
    await system.exec(`echo "${testContent}" > ~/Documents/${testFileName}`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 进入文档目录
    await agent.aiTap("侧边栏的文档目录");
    await agent.aiWaitFor("文档目录已打开", { timeout: 10000 });
    await device.pressKey("F5");

    // 步骤1：输入"天"进行搜索
    console.log('===== 步骤1: 搜索中文"天" =====');
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("天", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索结果中显示fulltext_mixed_search_test.txt文件");
    await agent.aiTap("搜索输入框中的清除按钮");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤2：输入"ss"进行搜索
    console.log('===== 步骤2: 搜索英文"ss" =====');
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("ss", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索结果中显示fulltext_mixed_search_test.txt文件");
    await agent.aiTap("搜索输入框中的清除按钮");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤3：输入"44"进行搜索
    console.log('===== 步骤3: 搜索数字"44" =====');
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("44", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索结果中显示fulltext_mixed_search_test.txt文件");
    await agent.aiTap("搜索输入框中的清除按钮");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤4：输入"ss123"进行搜索
    console.log('===== 步骤4: 搜索英文数字混合"ss123" =====');
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("ss123", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索结果中显示fulltext_mixed_search_test.txt文件");
    await agent.aiTap("搜索输入框中的清除按钮");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤5：输入"呼龍4"进行搜索
    console.log('===== 步骤5: 搜索繁体数字混合"呼龍4" =====');
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("呼龍4", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索结果中显示fulltext_mixed_search_test.txt文件");
    await agent.aiTap("搜索输入框中的清除按钮");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤6：输入"s呼"进行搜索
    console.log('===== 步骤6: 搜索英文繁体混合"s呼" =====');
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("s呼", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索结果中显示fulltext_mixed_search_test.txt文件");
    await agent.aiTap("搜索输入框中的清除按钮");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤7：输入长混合字符串进行搜索
    console.log('===== 步骤7: 搜索长混合字符串"天ss123空s44下雨lllll 呼龍4s呼 mm22" =====');
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("天ss123空s44下雨lllll 呼龍4s呼 mm22", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索结果中显示fulltext_mixed_search_test.txt文件");
    await agent.aiTap("搜索输入框中的清除按钮");

  }, { timeout: 600000, tags: ['1805381', 'level3', 'smoke', 'search', 'fulltext', 'mixed', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    // 删除测试文件
    try {
      await system.exec('rm -f ~/Documents/fulltext_mixed_search_test.txt');
    } catch (err) {
      console.warn('删除测试文件失败:', err.message);
    }

    // 关闭文件管理器窗口
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await common.closeFileManager(system);
    await common.clearEnvironment(system);
    await uos.showDesktop();
  });
});
