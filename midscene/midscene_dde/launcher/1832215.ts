
/**
 * 用例 PMSID: 1832215
 * 用例标题: 【启动器】【窗口模式】【快捷访问】点击左侧的图片图标，进入图片目录
 * 生成时间: 2025-12-19 16:27:58
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1832215-【启动器】【窗口模式】【快捷访问】点击左侧的图片图标，进入图片目录', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1832215-【启动器】【窗口模式】【快捷访问】点击左侧的图片图标，进入图片目录', async ({ device, agent, uos }) => {
    //步骤1：打开启动器
    await uos.openLauncher();
    //步骤2：点击图片图标
    await agent.aiTap("开启菜单左侧面板中，显示器图标下方的图片图标",{ deepThink: true });
    //检查：图片目录被打开
    await agent.aiAssert("图片目录已打开");
  }, { timeout: 1200000, tags: ['1832215', 'level2', 'smoke'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
