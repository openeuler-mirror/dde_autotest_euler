
/**
 * 用例 PMSID: 1805271
 * 用例标题: 【搜索】高级搜索-默认选项
 * 生成时间: 2026-01-13 11:06:34
 * 用例编写人: UT000193（郑豪）
 */

describe('1805271-【搜索】高级搜索-默认选项', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805271-【搜索】高级搜索-默认选项', async ({ device, agent, uos }) => {
    // 步骤1：进入高级搜索界面后，查看高级搜索默认选项
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理界面右上角的搜索框");
    await agent.aiTap("搜索框右侧筛选图标");
    await agent.aiWaitFor("文件管理器筛选界面已显示");

    // 断言1:高级搜索默认配置：搜索范围：所有子文件夹；文件类型：--（不限）；文件大小：--（不限）；修改时间：--（不限）；访问时间：--（不限）;创建时间：--（不限）
    await agent.aiAssert("文件管理器上方显示字段和默认选项：搜索范围：所有子文件夹；文件类型：--；文件大小：--；修改时间：--；访问时间：--;创建时间：--");

    // 步骤2：修改高级搜索选项后再次点击高级搜索入口
    await agent.aiTap("文件类型右侧的输入框");
    await agent.aiTap("文件类型下拉框选择'音频'");
    await agent.aiTap("搜索框右侧筛选图标");
    await agent.aiWaitFor("文件管理器筛选界面已隐藏");
    await agent.aiTap("搜索框右侧筛选图标");
    await agent.aiWaitFor("文件管理器筛选界面已显示");

    // 断言2：默认配置被修改
    await agent.aiAssert("文件管理器上方显示字段和默认选项：搜索范围：所有子文件夹；文件类型：--；文件大小：--；修改时间：--；访问时间：--;创建时间：--");
  }, { timeout: 600000, tags: ['1805271', 'level3', 'search', 'zhenghao'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
