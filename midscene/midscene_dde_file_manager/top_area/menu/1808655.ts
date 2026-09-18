/**
 * 用例 PMSID: 1808655
 * 用例标题: 【新建标签页】文管"快捷访问"页面，菜单-新建标签页
 * 生成时间: 2025-1-5 19:00:00
 * 用例编写人: UT001774(李炎)
 */

describe('1808655-【新建标签页】文管"快捷访问"页面，菜单-新建标签页', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    //处理可能存在的弹框和右键菜单
    await device.pressKey('Esc');
    //关闭所有文管窗口
    await system.exec('killall dde-file-manager', 500);
    //显示桌面
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1808655-【新建标签页】文管"快捷访问"页面，菜单-新建标签页', async ({ device, agent, uos, env }) => {

    // 步骤1: 打开文件管理器, 确保当前处于快捷访问页面
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("侧边栏中的快捷访问区域", { deepThink: true });
    await agent.aiAssert("页面左上角显示快捷访问");
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    // 验证菜单中包含新建标签页选项
    await agent.aiAssert("下拉菜单有新建窗口、新建标签页、连接到服务器、设置共享密码、设置、主题、帮助、关于、退出文字");

    // 步骤2: 点击顶部工具栏菜单按钮下的选项：新建标签页
    await agent.aiTap("下拉菜单中的新建标签页", { deepThink: true });
    // 新建当前页面的标签页
    await agent.aiAssert("文件管理器窗口顶部显示两个标签页");

    console.log('✅ 1808655用例测试完成');

  }, { timeout: 600000, tags: ["1808655", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.cleanupFileManager();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});

