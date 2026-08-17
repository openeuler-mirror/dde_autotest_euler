/**
 * 用例 PMSID: 1805289
 * 用例标题: 【搜索】搜索结果空白处右键菜单
 * 生成时间: 2026-04-10 11:00:00
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1805289-【搜索】搜索结果空白处右键菜单', () => {
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

    // 打开文件管理器并最大化
    await uos.openApp('文件管理器', 2000, 20000, true);
    await uos.maximizeWindow();
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });
  });

  test('1805289-搜索结果空白处右键菜单', async ({ device, agent, uos, system }) => {
    console.log('===== 前置准备：创建测试文件并执行搜索 =====');
    
    // 创建多个测试文件
    await agent.aiTap("侧边栏的文档目录");
    await agent.aiWaitFor("文档目录已打开", { timeout: 10000 });
    
    await system.exec('touch ~/Documents/search_menu_test1.txt');
    await system.exec('touch ~/Documents/search_menu_test2.txt');
    await system.exec('touch ~/Documents/search_menu_test3.txt');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("F5");

    // 执行搜索
    await agent.aiTap("右上角有放大镜的搜索输入框");
    await agent.aiInput("search_menu_test", "右上角有放大镜的搜索输入框");
    await device.pressKey("Enter");
    await agent.aiWaitFor("显示文件名包含search_menu_test的文件", { timeout: 30000, deepThink: true });

    // 步骤1：在空白处右键查看菜单
    console.log('===== 步骤1: 在搜索结果空白处右键查看菜单 =====');
    await agent.aiRightClick("搜索结果页面空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });

    // 断言：菜单包含显示方式、排列方式、全选
    await agent.aiAssert("右键菜单包含显示方式选项");
    await agent.aiAssert("右键菜单包含排序方式选项");
    await agent.aiAssert("右键菜单包含全选选项");

    // 点击空白处关闭菜单
    await agent.aiTap("搜索结果页面空白处");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤2：显示方式 - 图标方式
    console.log('===== 步骤2: 显示方式-切换到图标方式 =====');
    await agent.aiRightClick("搜索结果页面空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    
    await agent.aiTap("右键菜单中的显示方式");
    await agent.aiWaitFor("显示方式子菜单已展开", { timeout: 3000 });
    
    await agent.aiTap("显示方式子菜单中的图标");
    await agent.aiWaitFor("已切换到图标视图", { timeout: 5000, deepThink: true });
    //await agent.aiAssert("搜索结果以图标方式显示");

    // 点击空白处关闭菜单
    await agent.aiTap("搜索结果页面空白处");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤2：显示方式 - 列表视图
    console.log('===== 步骤2: 显示方式-切换到列表视图 =====');
    await agent.aiRightClick("搜索结果页面空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    
    await agent.aiTap("右键菜单中的显示方式");
    await agent.aiWaitFor("显示方式子菜单已展开", { timeout: 3000 });
    
    await agent.aiTap("显示方式子菜单中的列表");
    await agent.aiWaitFor("已切换到列表视图", { timeout: 5000, deepThink: true });
    //await agent.aiAssert("搜索结果以列表方式显示");

    // 点击空白处关闭菜单
    await agent.aiTap("搜索结果页面空白处");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤3：排序方式 - 修改时间
    console.log('===== 步骤3: 排列方式-按修改时间排序 =====');
    await agent.aiRightClick("搜索结果页面空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    
    await agent.aiTap("右键菜单中的排序方式");
    await agent.aiWaitFor("排列方式子菜单已展开", { timeout: 3000 });
    
    await agent.aiTap("排列方式子菜单中的修改时间");
    await agent.aiWaitFor("已按修改时间排序", { timeout: 5000, deepThink: true });
    //await agent.aiAssert("搜索结果已按修改时间排序");

    // 点击空白处关闭菜单
    await agent.aiTap("搜索结果页面空白处");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤3：排序方式 - 名称
    console.log('===== 步骤3: 排列方式-按名称排序 =====');
    await agent.aiRightClick("搜索结果页面空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    
    await agent.aiTap("右键菜单中的排序方式");
    await agent.aiWaitFor("排列方式子菜单已展开", { timeout: 3000 });
    
    await agent.aiTap("排列方式子菜单中的名称");
    await agent.aiWaitFor("已按名称排序", { timeout: 5000, deepThink: true });
    await agent.aiAssert("搜索结果已按名称排序");

    // 点击空白处关闭菜单
    await agent.aiTap("搜索结果页面空白处");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤4：全选功能
    console.log('===== 步骤4: 全选功能 =====');
    await agent.aiRightClick("搜索结果页面空白处");
    await agent.aiWaitFor("弹出右键菜单", { timeout: 5000, deepThink: true });
    
    await agent.aiTap("右键菜单中的全选");
    await agent.aiWaitFor("所有文件已被选中", { timeout: 5000, deepThink: true });
    
    // 断言：所有文件被选中
    const allSelected = await agent.aiBoolean("搜索结果中所有文件都处于选中状态（高亮显示）", { deepThink: true });
    if (!allSelected) {
      throw new Error('全选功能失败：并非所有文件都被选中');
    }
    console.log('✅ 全选功能验证通过');

    // 点击空白处取消选中
    await agent.aiTap("搜索结果页面空白处");

  }, { timeout: 600000, tags: ['1805289', 'level3', 'smoke', 'search', 'context-menu', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('3. afterEach: 每个测试后的清理');

    // 删除测试文件
    try {
      await system.exec('rm -f ~/Documents/search_menu_test*.txt');
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
