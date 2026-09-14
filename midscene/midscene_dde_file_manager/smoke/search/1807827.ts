/**
 * 用例 PMSID: 1807827
 * 用例标题: 计算机页面，检查搜索结果后的右键菜单功能
 * 生成时间: 2026-04-09 16:00:00
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1807827-计算机页面，检查搜索结果后的右键菜单功能', () => {
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

    // 打开文管并最大化
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });
  });

  test('1807827-计算机页面，检查搜索结果后的右键菜单功能', async ({ device, agent, uos, system }) => {

    // 前置准备：在文档目录创建测试文件
    console.log('===== 前置准备：创建测试文件 =====');
    const testFile = "1807827_search_test.txt";
    const testFolder = "1807827_search_folder";

    // 进入文档目录创建测试文件
    await agent.aiTap("侧边栏的文档目录");
    await new Promise(resolve => setTimeout(resolve, 1000));

    await system.exec(`touch ~/Documents/${testFile}`);
    await system.exec(`mkdir -p ~/Documents/${testFolder}`);

    await device.pressKey("F5");

    // 步骤1：进入计算机页面并执行搜索
    console.log('===== 步骤1: 进入计算机页面并执行搜索 =====');
    await agent.aiTap("侧边栏的计算机目录");
    await agent.aiWaitFor("计算机页面已打开", { timeout: 10000 });

    // 点击搜索框并输入关键字
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("1807827_search", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");

    // 断言：搜索结果显示匹配的文件
    console.log('===== 断言：搜索结果正确 =====');
    const searchResult = await agent.aiBoolean("搜索结果页面已显示1807827_search_test.txt文件和1807827_search_folder文件夹", { deepThink: true });
    if (!searchResult) {
      await agent.aiAssert("搜索结果页面显示无搜索结果或无匹配项提示");
    }

    // 步骤2：选中搜索结果文件，检查右键菜单
    console.log('===== 步骤2: 选中搜索结果文件，检查右键菜单 =====');
    await agent.aiTap("1807827_search_test.txt文件");
    await agent.aiRightClick("1807827_search_test.txt文件");
    await agent.aiWaitFor("弹出右键菜单", { deepThink: true });

    // 断言：右键菜单选项显示正确
    await agent.aiAssert("右键菜单包含打开选项");
    await agent.aiAssert("右键菜单包含打开文件所在位置选项");
    await agent.aiAssert("右键菜单包含复制选项");
    await agent.aiAssert("右键菜单包含剪切选项");
    await agent.aiAssert("右键菜单包含删除选项");
    await agent.aiAssert("右键菜单包含重命名选项");
    await agent.aiAssert("右键菜单包含属性选项");

    // 步骤3：检查右键菜单功能
    console.log('===== 步骤3: 检查右键菜单功能 =====');

    // 验证"打开文件所在位置"功能
    await agent.aiTap("打开文件所在位置");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("文件管理器已跳转到文档目录且高亮显示1807827_search_test.txt文件");
    await agent.aiTap("当前打开窗口右上角X按钮");

    // 返回计算机页面重新搜索
    await agent.aiTap("侧边栏的计算机目录");
    await agent.aiWaitFor("计算机页面已打开", { timeout: 10000 });
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("1807827_search", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");

    // 验证选中文件夹右键菜单
    await agent.aiTap("1807827_search_folder文件夹");
    await agent.aiRightClick("1807827_search_folder文件夹");
    await agent.aiWaitFor("弹出右键菜单", { deepThink: true });

    await agent.aiAssert("右键菜单包含打开选项");
    await agent.aiAssert("右键菜单包含打开文件所在位置选项");
    await agent.aiAssert("右键菜单包含复制选项");
    await agent.aiAssert("右键菜单包含剪切选项");
    await agent.aiAssert("右键菜单包含删除选项");
    await agent.aiAssert("右键菜单包含重命名选项");
    await agent.aiAssert("右键菜单包含属性选项");

    // 验证"打开文件所在位置"功能（文件夹）
    await agent.aiTap("打开文件所在位置");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("文件管理器已跳转到文档目录且高亮显示1807827_search_folder文件夹");
    await agent.aiTap("当前打开窗口右上角X按钮");

  }, { timeout: 600000, tags: ['1807827', 'level3', 'smoke', 'search', 'computer', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    // 删除文档目录中可能残留的测试文件
    console.log('===== 删除测试文件 =====');
    try {
      await system.exec('rm -rf ~/Documents/1807827_search_*');
    } catch (err) {
      console.warn('删除文档目录测试文件失败:', err.message);
    }

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
