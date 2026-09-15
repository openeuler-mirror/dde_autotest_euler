
/**
 * 用例 PMSID: 1832217
 * 用例标题: 【启动器】【窗口模式】【快捷访问】点击左侧的文档图标，进入文档目录
 * 生成时间: 2025-12-23 09:11:34
 * 用例编写人: UT003072
 */

describe('1832217-【启动器】【窗口模式】【快捷访问】点击左侧的文档图标，进入文档目录', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1832217-【启动器】【窗口模式】【快捷访问】点击左侧的文档图标，进入文档目录', async ({ device, agent, uos }) => {
    //步骤1：打开启动器
    await uos.openLauncher();
    //步骤2：点击文档图标
    await agent.aiTap("开启菜单中的显示器图标下的文档图标(带右上角折角的简化纸张样式)",{ deepThink: true });
    //检查：文档目录被打开
    await agent.aiWaitFor("文档目录已显示");
    await agent.aiAssert("文档目录已打开");
  }, { timeout: 1200000, tags: ['1832217', 'level2', 'smoke'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
