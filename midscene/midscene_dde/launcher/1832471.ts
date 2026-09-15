/**
 * 用例 PMSID: 1832471
 * 用例标题: 【启动器】【窗口模式】【搜索框】支持英文名称的简写搜索
 * 生成时间: 2026-02-06
 * 用例编写人: UT005044(王亮)
 */

describe('1832471-【启动器】【窗口模式】【搜索框】支持英文名称的简写搜索', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

    beforeEach(async ({ device, agent}) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('1832471-【启动器】【窗口模式】【搜索框】支持英文名称的简写搜索', async ({ device, agent, uos }) => {
      // 步骤 1: 打开启动器
      await uos.openLauncher();

      // 步骤 2: 鼠标没有点击搜索框时敲键盘任意键
      await agent.aiTap("启动器底部中央的搜索字符，左侧有放大镜图标");
      await device.typeText('as');
      await agent.aiWaitFor("底部中央的搜索输入框，呈矩形，内有放大镜图标和字符：as");

      // 检查 1：实时响应搜索并显示结果
      await agent.aiAssert("启动器所有应用菜单下方的界面显示应用：应用商店、远程协助、回收站")

      // 步骤 3：清除搜索框关键字后继续搜索
      await agent.aiTap('点击搜索框中右侧的x', { deepThink : true } )
      await agent.aiAssert("启动器的搜索框中为空");
      await device.typeText('wb');
      await agent.aiWaitFor("底部中央的搜索输入框，呈矩形，内有放大镜图标和字符:wb");

       // 检查 2：实时响应搜索并显示结果
      await agent.aiAssert("启动器所有应用菜单下方的界面显示应用：文本编辑器、浏览器");

    }, { timeout: 400000, tags: ["1832471", "level3"] });

    afterEach(async ({agent, device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent}) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });