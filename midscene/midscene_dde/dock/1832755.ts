
/**
 * 用例 PMSID: 1832755
 * 用例标题: 【任务栏】【右键菜单】任务栏右键菜单界面展示
 * 生成时间: 2025-12-22 10:38:44
 * 用例编写人: UT003072
 */

describe('1832755-【任务栏】【右键菜单】任务栏右键菜单界面展示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1832755-【任务栏】【右键菜单】任务栏右键菜单界面展示', async ({ device, agent, uos }) => {
    await agent.aiRightClick("任务栏空白区域");
    await agent.aiWaitFor("右键菜单已显示");
    await agent.aiAssert("右键菜单存在菜单项：模式");
    await agent.aiHover('模式');
    await agent.aiAssert("右键菜单存在菜单项：模式二级菜单项包含经典模式、居中模式");
    await agent.aiAssert("右键菜单存在菜单项：位置");
    await agent.aiHover('位置');
    await agent.aiAssert("右键菜单存在菜单项：位置二级菜单项包含上、下、左、右");
    await agent.aiAssert("状态");
    await agent.aiHover('状态');
    await agent.aiAssert("右键菜单存在菜单项：状态二级菜单项包含一直显示、一直隐藏、智能隐藏");
    await agent.aiAssert("右键菜单存在菜单项：禁用自由调节");
    await agent.aiAssert("右键菜单存在菜单项：任务栏设置");
  }, { timeout: 1200000, tags: ['1832755', 'level2', 'smoke'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("任务栏空白区域");

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
