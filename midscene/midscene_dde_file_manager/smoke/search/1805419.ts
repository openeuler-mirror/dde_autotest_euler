/**
 * 用例 PMSID: 1805419
 * 用例标题: 【搜索】搜索-关键词搜索（文件名和内容均包含关键词）
 * 生成时间: 2026-04-09 18:30:00
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1805419-【搜索】搜索-关键词搜索（文件名和内容均包含关键词）', () => {
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

    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });

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

  test('1805419-搜索关键词与文件名和内容均包含关键词', async ({ device, agent, uos, system }) => {
    console.log('===== 前置准备：创建文件名和内容均包含关键词的测试文件 =====');
    await system.exec(`echo "this file contains keyword9527 in content" > ~/Documents/keyword9527_test.txt`);
    await system.exec(`echo "this file also has keyword9527 content only" > ~/Documents/content_only_test.txt`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    await agent.aiTap("侧边栏的文档目录");
    await agent.aiWaitFor("文档目录已打开", { timeout: 10000 });
    await device.pressKey("F5");

    console.log('===== 步骤1: 搜索与文件名和内容均不匹配的关键字 =====');
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("nomatch_xyz_99999", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索结果中不显示keyword9527_test.txt文件和content_only_test.txt文件");
    await agent.aiTap("搜索输入框中的清除按钮");
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('===== 步骤2: 搜索与文件名和内容均匹配的关键字 =====');
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("keyword9527_test.txt", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索结果中显示keyword9527_test.txt文件");
    await agent.aiTap("搜索输入框中的清除按钮");
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('===== 步骤3: 搜索与文件名匹配的关键字 =====');
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("keyword9527", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索结果中显示keyword9527_test.txt文件");
    await agent.aiTap("搜索输入框中的清除按钮");
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('===== 步骤4: 搜索与文件内容匹配但文件名不匹配的关键字 =====');
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("content_only", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索结果中显示content_only_test.txt文件");
    await agent.aiTap("搜索输入框中的清除按钮");

  }, { timeout: 600000, tags: ['1805419', 'level3', 'smoke', 'search', 'keyword', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    try {
      await system.exec('rm -f ~/Documents/keyword9527_test.txt ~/Documents/content_only_test.txt');
    } catch (err) {
      console.warn('删除测试文件失败:', err.message);
    }

    console.log('===== 恢复设置：勾选全文搜索 =====');
    await agent.aiTap("右上角有3条横线的菜单图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置");
    await agent.aiWaitFor("设置窗口已打开");
    await agent.aiTap("高级设置");

    const fullTextEnabled = await agent.aiBoolean("全文搜索选项已勾选（左侧有蓝色√）", { deepThink: true });
    if (!fullTextEnabled) {
      await agent.aiTap("全文搜索选项前的勾选框");
      await agent.aiAssert("全文搜索选项已勾选（左侧有蓝色√）");
      console.log('✅ 已勾选全文搜索');
    } else {
      console.log('全文搜索已勾选，无需操作');
    }

    await agent.aiTap("设置窗口右上角关闭按钮");
    await agent.aiWaitFor("设置窗口已关闭");
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 清理测试套件');
    await common.closeFileManager(system);
    await common.clearEnvironment(system);
    await uos.showDesktop();
  });
});