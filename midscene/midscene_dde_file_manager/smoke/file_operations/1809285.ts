/**
 * 用例 PMSID: 1809285
 * 用例标题: 排序 - 按修改时间排序 - 由近到远排序（修改时间由大到小）
 * 生成时间: 2025-12-16 16:47:30
 * 用例编写人: UT002411
 */

describe('1809285-排序 - 按修改时间排序 - 由近到远排序（修改时间由大到小）', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux | grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1809285-排序 - 按修改时间排序 - 由近到远排序（修改时间由大到小）', async ({ device, agent, uos, KeyCode }) => {
    // 步骤 1: 打开文件管理器 // 通过系统快捷方式或启动器打开文件管理器
    // await uos.openFileManager();
    await uos.openApp('文件管理器');
    await agent.aiWaitFor("文件管理器界面已显示");
    // 步骤 2: 进入tmp目录，并切换列表视图
    await agent.aiTap("左侧边栏的系统盘");
    await agent.aiDoubleClick('tmp文件夹');
    await agent.aiTap("搜索框左侧插件的左数第二个图标", { deepThink: true });
    // await device.pressKey('Ctrl', '2')
    await agent.aiWaitFor("文件列表显示修改时间");
    // 步骤 3: 点击修改时间，文件按照修改时间排序
    await agent.aiTap("修改时间");
    await agent.aiAssert("文件按修改时间顺序由远到近排列（时间远在上，时间近在下）");
    // 步骤 4: 恢复环境
    await agent.aiTap("名称");
    await agent.aiTap("搜索框左侧插件的左数第一个图标", { deepThink: true });

  }, { timeout: 600000,
       tags: ['1809285', 'level2', 'smoke', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});
