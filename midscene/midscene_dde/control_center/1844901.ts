/**
 * 用例 PMSID: 1844901
 * 用例标题:【控制中心】【账户】【账户头像】账户头像界面展示
 * 生成时间: 2026-06-01
 * 用例编写人:UT005044(王亮)
 */

describe('1844901-【控制中心】【账户】【账户头像】账户头像界面展示', () => {
    beforeAll(async ({ device, uos, agent, system, env }) => {
        console.log('1. beforeAll: 初始化测试套件');
        //await uos.showDesktop();
        await system.exec('/usr/lib/deepin-daemon/desktop-toggle');
    });
  
    beforeEach(async ({ device, agent }) => {
        console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1844901-【控制中心】【账户】【账户头像】账户头像界面展示', async ({ device, agent, uos, env }) => {
        // 步骤 1: 打开控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 打开账户
      await agent.aiTap("左侧区域的菜单项：账户", { deepThink: true });
      await agent.aiAssert("导航栏显示：账户，右侧区域的左上角存在用户的头像，圆形");

      // 步骤 3: 点击用户头像
      await agent.aiTap(`右侧区域的用户头像圆形区域`, { deepThink: true });
      await agent.aiWaitFor('头像设置框界面已显示', { timeoutMs: 6000 });

      //检查1：头像展示检查
      await agent.aiAssert("界面中央位置打开弹框，左侧区域有6个菜单项，依次为：人物、动物、静物、创意插图、表情符号和自定义图片,默认焦点菜单为：人物，对应右侧展示头像标题：Q版风格，默认可见展示了5行，每行固定5列，底部存在按钮：取消 和 保存");

    }, { timeout: 600000, tags: ["1844901", "level2", "smoke"] });
  
    afterEach(async ({ device, agent, uos }) => {
      console.log('4. afterEach: 每个测试后的清理');
      // 清理环境1，关闭修改密码弹框，并删除新建的账户
      await agent.aiTap("弹框中的按钮：取消", { deepThink: true });

      // 清理环境2，关闭控制中心
      await device.pressKey("Super", "Down");
      await uos.closeCurrentWindow();
    });
  
    afterAll(async ({ device, uos }) => {
      console.log('5. afterAll: 清理测试套件');
      await device.pressKey("Alt", "F4");
    });
  });
  