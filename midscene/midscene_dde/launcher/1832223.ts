
/**
 * 用例 PMSID: 1832223
 * 用例标题: 【启动器】【窗口模式】【快捷访问】点击左侧的电源图标，进入关机界面
 * 生成时间: 2025-12-19 15:34:40
 * 用例编写人: UT003072
 */

describe('1832223-【启动器】【窗口模式】【快捷访问】点击左侧的电源图标，进入关机界面', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1832223-【启动器】【窗口模式】【快捷访问】点击左侧的电源图标，进入关机界面', async ({ device, agent, uos }) => {
    //步骤1：打开启动器
    await uos.openLauncher();

    //步骤2：点击启动器左侧的关机图标
    await agent.aiTap("启动器左下角的关机图标", { deepThink: true });

    //检查：进入关机界面
    await agent.aiAssert("进入关机界面");
    await agent.aiAssert("关机界面显示：关机，重启，待机，休眠，锁屏，注销");
    await agent.aiAssert("关机界面默认选中锁屏");
  }, { timeout: 1200000, tags: ['1832223', 'level2', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("esc");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
