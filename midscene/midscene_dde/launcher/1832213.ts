
/**
 * 用例 PMSID: 1832213
 * 用例标题: 【启动器】【窗口模式】【快捷访问】点击左侧的计算机图标，进入计算机目录
 * 生成时间: 2025-12-19 16:28:50
 * 用例编写人: UT003072
 */

describe('1832213-【启动器】【窗口模式】【快捷访问】点击左侧的计算机图标，进入计算机目录', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1832213-【启动器】【窗口模式】【快捷访问】点击左侧的计算机图标，进入计算机目录', async ({ device, agent, uos }) => {
    //步骤1：打开启动器
    await uos.openLauncher();
    //步骤2：打开计算机图标
    await agent.aiTap("开启菜单中的显示器图标",{ deepThink: true });
    //检查：计算机目录被打开
    await agent.aiWaitFor("计算机目录已显示");
    await agent.aiAssert("计算机目录已打开");
  }, { timeout: 1200000, tags: ['1832213', 'level2', 'smoke'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
