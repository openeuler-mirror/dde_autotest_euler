/**
 * 用例 PMSID: 2004527
 * 用例标题:【任务栏】【固定区域】【UOS AI】UOS AI插件图标hover展示效果
 * 生成时间: 2026-05-29 11:00:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('2004527-【任务栏】【固定区域】【UOS AI】UOS AI插件图标hover展示效果', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('2004527-【任务栏】【固定区域】【UOS AI】UOS AI插件图标hover展示效果', async ({ device, agent, uos }) => {
      // 步骤 1: 鼠标hover任务栏上UOS AI插件图标
      await agent.aiHover("任务栏上最右侧的UOS AI插件图标", { deepThink: true });

      //检查: 图标正上方展示TIPS：小U同学
      await agent.aiAssert("UOS AI插件图标正上方展示TIPS文字：小U同学");

      // 步骤 2: 鼠标移出插件图标
      await agent.aiHover("桌面空白区域");

      //检查: 相应TIPS即时消失
      await agent.aiAssert("UOS AI插件图标上方的TIPS已消失");

    }, { timeout: 1200000, tags: ["2004527", "level3"] });

    afterEach(async ({ device, agent, system }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
