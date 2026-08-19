/**
 * 用例 PMSID: 1805533
 * 用例标题: 【搜索】【支持筛选搜索】文管单击"搜索"按钮后，筛选过滤条件，直接进行筛选
 * 生成时间: 2026-04-09 17:00:00
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1805533-【搜索】【支持筛选搜索】文管单击搜索按钮后筛选过滤条件直接进行筛选', () => {
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

  test('1805533-文管单击搜索按钮后筛选过滤条件直接进行筛选', async ({ device, agent, uos, system }) => {

    // 前置准备：在文档目录创建不同类型的测试文件
    console.log('===== 前置准备：创建不同类型的测试文件 =====');
    await agent.aiTap("侧边栏的文档目录");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 创建txt文件
    await system.exec(`echo "filter test content" > ~/Documents/filter_test_file.txt`);
    // 创建文件夹
    await system.exec(`mkdir -p ~/Documents/filter_test_folder`);
    // 创建图片文件
    await system.exec(`touch ~/Documents/filter_test_image.png`);

    await device.pressKey("F5");

    // 步骤1：打开文管，顶部工具栏，单击"搜索"按钮
    console.log('===== 步骤1: 单击搜索按钮，检查搜索输入框和筛选按钮 =====');
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiAssert("页面顶部已显示搜索输入框");
    await agent.aiAssert("搜索输入框旁显示筛选按钮");

    // 步骤2：单击"筛选"按钮，不输入关键字，选择筛选过滤条件
    console.log('===== 步骤2: 单击筛选按钮，不输入关键字，选择筛选过滤条件 =====');
    await agent.aiTap("搜索输入框旁的筛选按钮");
    await agent.aiWaitFor("筛选面板已展开", { deepThink: true });

    // 断言：筛选面板包含过滤条件选项
    await agent.aiAssert("筛选面板包含文件类型选项");
    await agent.aiAssert("筛选面板包含修改时间选项");
    await agent.aiAssert("筛选面板包含文件大小选项");

    // 选择文件类型筛选：选择"文本文档"类型
    console.log('===== 选择文件类型筛选条件：文本文档 =====');
    await agent.aiTap("文件类型筛选选项");
    await agent.aiWaitFor("文件类型下拉选项已展开", { deepThink: true });
    await agent.aiTap("文档选项");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 断言：当前目录文件根据筛选条件进行筛选，仅显示txt文件
    await agent.aiAssert("当前目录仅显示filter_test_file.txt文件，不显示文件夹和图片文件");

    // 重置筛选条件
    await agent.aiTap("重置按钮");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 断言：重置后所有文件恢复显示
    await agent.aiAssert("当前目录显示filter_test_file.txt文件、filter_test_folder文件夹等");

    // 选择文件类型筛选：选择"图片"类型
    console.log('===== 选择文件类型筛选条件：图片 =====');
    await agent.aiTap("文件类型筛选选项");
    await agent.aiWaitFor("文件类型下拉选项已展开", { deepThink: true });
    await agent.aiTap("图片选项");
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 断言：仅显示图片文件
    await agent.aiAssert("当前目录仅显示filter_test_image.png文件，不显示文件夹和txt文件");

    // 重置筛选条件
    await agent.aiTap("重置按钮");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 断言：重置后所有文件恢复显示
    await agent.aiAssert("当前目录显示filter_test_file.txt文件、filter_test_folder文件夹等");

    // 关闭筛选面板
    await agent.aiTap("搜索输入框旁的筛选按钮");
    await new Promise(resolve => setTimeout(resolve, 500));

  }, { timeout: 600000, tags: ['1805533', 'level3', 'smoke', 'search', 'filter', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    // 删除文档目录中可能残留的测试文件
    console.log('===== 删除测试文件 =====');
    try {
      await system.exec('rm -rf ~/Documents/filter_test_*');
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
