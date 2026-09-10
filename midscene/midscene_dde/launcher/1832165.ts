
/**
 * 用例 PMSID: 1832165
 * 用例标题: 【启动器】【全屏模式】【搜索框】鼠标左键点击搜索框，激活搜索框
 * 生成时间: 2025-12-22 10:45:02
 * 用例编写人: UT003072（陈佳梅）
 */

describe('1832165-【启动器】【全屏模式】【搜索框】鼠标左键点击搜索框，激活搜索框', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1832165-【启动器】【全屏模式】【搜索框】鼠标左键点击搜索框，激活搜索框', async ({ device, agent, uos }) => {
    //步骤1：打开启动器
    await uos.openLauncher();
    //步骤2：切换为全屏模式
    await agent.aiTap("启动器的全屏切换按钮");
    await agent.aiAssert("启动器处于全屏模式，其中任务栏未被全屏启动器覆盖");
    await agent.aiWaitFor("搜索框元素已出现");
    //步骤3：点击搜索框
    await agent.aiTap("鼠标左键点击搜索框");
    //检查：搜索框被激活
    await agent.aiAssert("搜索字样不可见,放大镜图标显示在输入框最左边");
  }, { timeout: 1200000, tags: ['1832165', 'level2', 'smoke'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap({
      prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
      images: [
        {
          name: '窗口模式小图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
        },
      ],
      deepThink: true,
    });
    await device.pressKey("esc");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
