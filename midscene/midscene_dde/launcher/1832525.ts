/**
 * 用例 PMSID: 1832525
 * 用例标题:【启动器】【全屏模式】【UI】界面布局和控件检查
 * 生成时间: 2025/12/23 11:00:00
 * 用例编写人: UT000327(秦家喜)
 */

describe('1832525-【启动器】【全屏模式】【UI】界面布局和控件检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
    });

    beforeEach(async ({ device, agent, system}) => {
      console.log('2. beforeEach: 每个测试前的准备');
      system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    });

    test('1832525-【启动器】【全屏模式】【UI】界面布局和控件检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开启动器
      await uos.openLauncher();

      // 步骤 2: 点击全屏模式
      await agent.aiTap("启动器右下角全屏模式图标");
      await agent.aiWaitFor("启动器页面已显示");

      // 检查: 检查全屏模式下的UI
      await agent.aiAssert("顶部：翻页圆点");
      await agent.aiAssert("右上菜单：存在全屏模式和窗口模式切换菜单(类似星状图标)");
      await agent.aiAssert("中间区域：应用区");
      await agent.aiAssert("下方：搜索框（放大镜图标+“搜索”文案）");

    }, { timeout: 1200000, tags: ["1832525", "level1", "smoke"] });

    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
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
      await agent.aiWaitFor("启动器页面已显示");
      await device.pressKey("esc");
    });
  });
