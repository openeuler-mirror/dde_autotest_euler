
/**
 * 用例 PMSID: 1832221
 * 用例标题: 【启动器】【窗口模式】【快捷访问】点击左侧的控制中心图标，进入控制中心目录
 * 生成时间: 2025-12-19 16:01:49
 * 用例编写人: UT003072
 */

describe('1832221-【启动器】【窗口模式】【快捷访问】点击左侧的控制中心图标，进入控制中心目录', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1832221-【启动器】【窗口模式】【快捷访问】点击左侧的控制中心图标，进入控制中心目录', async ({ device, agent, uos }) => {
    //步骤1：打开启动器
    await uos.openLauncher();
    //步骤2：打开控制中心图标
    await agent.aiTap({
      prompt: '识别指定图标坐标。在最左下侧关机图标列，齿轮图标',
      images: [
        {
          name: '桌面小图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832221.png',
        },
      ],
      deepThink: true,
    });
    
    //检查：控制中心被打开
    await agent.aiAssert("显示控制中心窗口：系统被选中")
  }, { timeout: 1200000, tags: ['1832221', 'level2', 'smoke'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
