
/**
 * 用例 PMSID: 1832219
 * 用例标题: 【启动器】【窗口模式】【快捷访问】点击左侧的桌面图标，进入桌面目录
 * 生成时间: 2025-12-18 15:57:15
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1832219-【启动器】【窗口模式】【快捷访问】点击左侧的桌面图标，进入桌面目录', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1832219-【启动器】【窗口模式】【快捷访问】点击左侧的桌面图标，进入桌面目录', async ({ device, agent, uos }) => {
    //步骤1：打开启动器
    await uos.openLauncher();
    //步骤2：打开桌面文件夹
    await agent.aiTap("开启菜单左侧面板中，文档图标下方的桌面图标",{ deepThink: true });
    //检查：桌面文件夹被打开
    await agent.aiAssert("显示桌面文件夹窗口：桌面被选中")
    await agent.aiAssert("桌面文件夹窗口导航栏：桌面/")
    
  }, { timeout: 1200000, tags: ['1832219', 'level2', 'smoke'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
