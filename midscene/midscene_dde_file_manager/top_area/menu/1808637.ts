/**
 * 用例 PMSID: 1808637
 * 用例标题: 【工作区视图插件显示隐藏】文管设置，高级设置-搜索-全文搜索
 * 生成时间: 2026-05-08
 * 用例编写人: UT000649（黄甜）
 */

describe('1808637-【工作区视图插件显示隐藏】文管设置，高级设置-搜索-全文搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808637-【工作区视图插件显示隐藏】文管设置，高级设置-搜索-全文搜索', async ({ device, agent, uos, system }) => {
    console.log('=== 开始测试：1808637-全文搜索设置 ===');

    console.log('步骤1: 打开文件管理器');
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');

    console.log('步骤2: 打开设置窗口，进入高级设置-搜索');
    await agent.aiTap('窗口主菜单');
    await agent.aiTap('设置');
    await agent.aiTap('设置菜单窗口里的搜索');

    console.log('步骤3: 检查默认值');
    await agent.aiAssert("全文搜索左侧复选框有蓝色√");
    console.log('✅ 默认值已勾选');

    console.log('步骤4: 取消勾选全文搜索');
    await agent.aiTap("全文搜索左侧方框");
    await agent.aiAssert("全文搜索左侧复选框没有蓝色√");
    await agent.aiTap('设置窗口关闭按钮');

    console.log('步骤5: 验证无法通过内容搜索');
    await system.exec(" echo test-content > ~/Documents/1808637.txt");
    await agent.aiTap('搜索框');
    await device.typeText('test-content');
    await device.pressKey('Enter');
    await agent.aiAssert("搜索结果不包含内容匹配的文件");
    console.log('✅ 不可以通过文件内容搜索文件');

    console.log('步骤6: 勾选全文搜索');
    await agent.aiTap('窗口主菜单');
    await agent.aiTap('设置');
    await agent.aiTap('搜索');
    await agent.aiTap("全文搜索左侧方框");
    await agent.aiAssert("全文搜索左侧复选框显示蓝色√");
    await agent.aiTap('设置窗口关闭按钮');

    console.log('步骤7: 测试全文搜索功能');
    await agent.aiTap('侧边栏的计算机');
    await agent.aiTap('搜索框');
    await device.typeText('test-content');
    await agent.aiWaitFor('搜索结果已显示');
    await agent.aiAssert("搜索结果包含内容匹配的文件");
    console.log('✅ 可以通过文件内容搜索文件');

    console.log('✅ 1808637用例测试完成');
  }, { timeout: 600000, tags: ["1808637", "level3", "menu", "DITT", "huangtian"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("rm -rf ~/Documents/1808637.txt");
    await agent.aiTap("文件管理器窗口右上角关闭按钮:X");
  });
});