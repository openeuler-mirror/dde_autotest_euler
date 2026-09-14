
/**
 * 用例 PMSID: 1805285
 * 用例标题: 【搜索】高级搜索-重置搜索
 * 生成时间: 2026-02-09 17:51:26
 * 用例编写人: UT000193（郑豪）
 */

describe('1805285-【搜索】高级搜索-重置搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // await system.exec(`killall -15 dde-file-manager`);
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805285-【搜索】高级搜索-重置搜索', async ({ device, agent, uos }) => {
    // 前置1：已使用多个高级搜索条件进行搜索
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理界面右上角的搜索框");
    await agent.aiTap("搜索框右侧筛选图标");
    await agent.aiWaitFor("文件管理器筛选界面已显示");
    
    // 设置多个高级搜索条件
    await agent.aiTap("文件类型右侧的输入框");
    await agent.aiTap("文件类型下拉框选择'音频'");
    await agent.aiTap("文件大小右侧的输入框");
    await agent.aiTap("文件大小下拉框选择'0-100KB'");
    await agent.aiTap("修改时间右侧的输入框");
    await agent.aiTap("修改时间下拉框选择'今天'");
    await agent.aiTap("创建时间右侧的输入框");
    await agent.aiTap("创建时间下拉框选择'今天'");
    await agent.aiTap("访问时间右侧的输入框");
    await agent.aiTap("访问时间下拉框选择'今天'");

    // 步骤1：在高级界面，点击右上角的重置按钮，查看软件显示
    await agent.aiTap("高级搜索界面右上角的重置按钮");
    await agent.aiWaitFor("文件管理器筛选界面已重置");

    // 断言1：界面所有的设置项恢复到默认状态
    await agent.aiAssert("文件管理器上方显示字段和默认选项：搜索范围：所有子文件夹；文件类型：--；文件大小：--；修改时间：--；访问时间：--;创建时间：--");

  }, { timeout: 600000, tags: ['1805285', 'level3', 'search', 'zhenghao'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
