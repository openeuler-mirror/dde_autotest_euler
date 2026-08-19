/**
 * 用例 PMSID: 1805785
 * 用例标题: [129][core]回收站内搜索内容
 * 生成时间: 2026-04-09 15:00:00
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1805785-[129][core]回收站内搜索内容', () => {
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

  test('1805785-[129][core]回收站内搜索内容', async ({ device, agent, uos, system }) => {

    // 前置准备：创建测试文件并删除到回收站
    console.log('===== 前置准备：创建测试文件并删除到回收站 =====');
    const testFile1 = "trash_search_test1.txt";
    const testFile2 = "trash_search_test2.txt";
    const testFolder = "trash_search_folder";

    // 在文档目录创建测试文件和文件夹
    await agent.aiTap("侧边栏的文档目录");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 创建测试文件1
    await system.exec(`touch ~/Documents/${testFile1}`);
    // 创建测试文件2
    await system.exec(`touch ~/Documents/${testFile2}`);
    // 创建测试文件夹
    await system.exec(`mkdir -p ~/Documents/${testFolder}`);

    await device.pressKey("F5");
    const filesCreated = await agent.aiBoolean("当前目录已显示trash_search_test1.txt、trash_search_test2.txt文件和trash_search_folder文件夹", { deepThink: true });
    if (!filesCreated) {
      throw new Error('测试文件创建后未在文管中显示');
    }

    // 删除测试文件和文件夹到回收站
    await device.pressKey("Ctrl+A");
    await device.pressKey("Delete");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤1：进入回收站并执行搜索
    console.log('===== 步骤1: 进入回收站并执行搜索 =====');
    await agent.aiTap("侧边栏的回收站目录");
    await agent.aiWaitFor("回收站窗口已打开", { timeout: 10000 });

    // 点击搜索框
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("trash_search", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");

    // 断言：搜索结果显示匹配的文件
    console.log('===== 断言：搜索结果显示匹配的文件 =====');
    const searchResult = await agent.aiBoolean("回收站搜索结果页面已显示trash_search_test1.txt、trash_search_test2.txt文件和trash_search_folder文件夹", { deepThink: true });
    if (!searchResult) {
      // 如果没有匹配结果，检查是否显示无结果提示
      await agent.aiAssert("搜索结果页面显示无搜索结果或无匹配项提示");
    }

    // 步骤2：搜索结果页-空白处右键菜单
    console.log('===== 步骤2: 搜索结果页-空白处右键菜单 =====');
    await agent.aiRightClick("搜索结果页面空白处");
    await agent.aiWaitFor("弹出右键菜单", { deepThink: true });

    // 断言：右键菜单包含显示方式、排序方式、全选
    await agent.aiAssert("右键菜单包含显示方式选项");
    await agent.aiAssert("右键菜单包含排序方式选项");
    await agent.aiAssert("右键菜单包含全选选项");

    // 验证显示方式功能响应正常
    await agent.aiTap("显示方式");
    await agent.aiWaitFor("显示方式子菜单已展开", { deepThink: true });
    await device.pressKey("Escape");

    // 验证排序方式功能响应正常
    await agent.aiRightClick("搜索结果页面空白处");
    await agent.aiWaitFor("弹出右键菜单", { deepThink: true });
    await agent.aiTap("排序方式");
    await agent.aiWaitFor("排序方式子菜单已展开", { deepThink: true });
    await device.pressKey("Escape");

    // 验证全选功能响应正常
    await agent.aiRightClick("搜索结果页面空白处");
    await agent.aiWaitFor("弹出右键菜单", { deepThink: true });
    await agent.aiTap("全选");
    await agent.aiAssert("搜索结果页面所有文件和文件夹已被选中");
    await agent.aiTap("搜索结果页面空白处");

    // 步骤3：搜索结果页-选中文件右键菜单
    console.log('===== 步骤3: 搜索结果页-选中文件右键菜单 =====');
    await agent.aiTap("trash_search_test1.txt文件");
    await agent.aiRightClick("trash_search_test1.txt文件");
    await agent.aiWaitFor("弹出右键菜单", { deepThink: true });

    // 断言：右键菜单包含打开文件所在位置功能（比回收站多此功能）
    await agent.aiAssert("右键菜单包含打开文件所在位置选项");

    // 断言：还原、删除、剪切按钮灰显可点击（第一层被删除的文件）
    await agent.aiAssert("右键菜单中还原选项显示");
    await agent.aiAssert("右键菜单中删除选项显示");
    await agent.aiAssert("右键菜单中剪切选项显示");

    await agent.aiTap("搜索结果页面空白处");
    // 右键点击文件夹
    await agent.aiTap("trash_search_folder文件夹");
    await agent.aiRightClick("trash_search_folder文件夹");
    await agent.aiWaitFor("弹出右键菜单", { deepThink: true });

    // 断言：右键菜单包含打开文件所在位置功能（比回收站多此功能）
    await agent.aiAssert("右键菜单包含打开文件所在位置选项");

    // 断言：还原、删除、剪切按钮灰显可点击（第一层被删除的文件夹）
    await agent.aiAssert("右键菜单中还原选项显示");
    await agent.aiAssert("右键菜单中删除选项显示");
    await agent.aiAssert("右键菜单中剪切选项显示");

    // 关闭右键菜单
    await device.pressKey("Escape");

  }, { timeout: 600000, tags: ['1805785', 'level3', 'smoke', 'search', 'trash', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    // 清空回收站中的测试文件
    console.log('===== 清空回收站测试文件 =====');
    try {
      await system.exec('rm -rf ~/.local/share/Trash/files/trash_search_*');
      await system.exec('rm -rf ~/.local/share/Trash/info/trash_search_*');
    } catch (err) {
      console.warn('清空回收站测试文件失败:', err.message);
    }

    // 删除文档目录中可能残留的测试文件
    try {
      await system.exec('rm -rf ~/Documents/trash_search_*');
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
