/**
 * 用例 PMSID: 1506435
 * 用例标题: 【控制中心】【UOS ID】正常进入UOS ID界面 
 * 生成时间: 2025-12-12 20:13:01
 * 用例编写人:UT000511(肖海燕)
 */

describe('1506435-【控制中心】【UOS ID】正常进入UOS ID界面', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1506435-【控制中心】【UOS ID】正常进入UOS ID界面', async ({ device, agent, uos }) => {
    // 步骤 1: 打开控制中心
    await uos.openApp('控制中心', { maximizeWindow: true });
    // 步骤 2: 点击UOS ID
    await agent.aiTap("UOS ID");
    await agent.aiWaitFor("UOS ID界面已显示");

    // 检查: 显示UOS ID界面
    await agent.aiAssert("界面存在按钮：登录UOS ID");

  }, { timeout: 1200000, tags: ["1506435","level1","smoke"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
  }); 
});
