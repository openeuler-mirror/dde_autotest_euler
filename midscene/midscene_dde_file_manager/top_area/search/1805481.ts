
/**
 * 用例 PMSID: 1805481
 * 用例标题: 【搜索】搜索结果-打开文件所在位置，复制面包屑路径_
 * 生成时间: 2026-01-07 14:28:47
 * 用例编写人: UT000193（郑豪）
 */

describe('1805481-【搜索】搜索结果-打开文件所在位置，复制面包屑路径_', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('mkdir -p ~/breadcrumbs');
    await system.exec('touch ~/breadcrumbs/测试文件');
  });

  test('1805481-【搜索】搜索结果-打开文件所在位置，复制面包屑路径_', async ({ device, agent, uos }) => {
    // 步骤1：在文管搜索文件A，在搜索结果右键文件A，打开文件所在位置
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理界面右上角的搜索框");
    await device.typeText("测试文件");
    await agent.aiWaitFor("搜索结果出现'测试文件'");
    await agent.aiTap("文件列表中的'测试文件'文件");
    await agent.aiRightClick("文件列表中的'测试文件'文件");
    await agent.aiTap("打开文件所在位置");

    // 断言1：	新窗口打开文件A所在目录
    await agent.aiWaitFor("新的文件管理器窗口已打开");
    await agent.aiAssert("新窗口已定位到'测试文件'文件所在位置");

    // 步骤2：在新窗口顶部，右键最后一级目录复制路径
    await agent.aiRightClick("文件管理器上方地址栏'breadcrumbs'字符");
    await agent.aiTap("弹出右键菜单中的'复制路径'");
    await uos.closeCurrentWindow();
    await uos.closeCurrentWindow();
    await device.pressKey('Super+V');
    await agent.aiWaitFor("屏幕右侧剪贴板已显示");

    // 断言2：复制的路径正确（路径为1805481文件所在父目录路径）
    await agent.aiAssert(`屏幕右侧剪贴板第一个文本显示：/home/${process.env.TEST_USERNAME}/breadcrumbs`);

  }, { timeout: 600000, tags: ['1805481', 'level4', 'search', 'zhenghao'] });

  afterEach(async ({ device, system, uos, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('rm -rf ~/breadcrumbs');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
