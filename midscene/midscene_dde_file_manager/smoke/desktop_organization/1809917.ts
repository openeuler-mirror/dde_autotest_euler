/**
 * 用例 PMSID: 1809917
 * 用例标题: 检查桌面右键菜单的刷新
 * 生成时间: 2026-1-22 13:22:54
 * 用例编写人: UT000649（黄甜）
 */

describe('1809917-检查桌面右键菜单的刷新', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1809917-检查桌面右键菜单的刷新', async ({ device, agent, uos , system}) => {
    // 步骤 1: 右键菜单刷新
    await agent.aiRightClick("桌面空白处");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("刷新");
    await agent.aiAssert("桌面刷新加载完成");

    // 步骤 2: F5刷新
    //await device.pressKey(`Fn`)
    await device.pressKey(`F5`)
    await agent.aiAssert("桌面刷新加载完成");
    //await device.pressKey(`Fn`)

  }, { timeout: 600000, tags: ['1809917', 'level2', 'smoke', 'DITT', 'huangtian'] ,});

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
  });
});