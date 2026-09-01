/**
 * 用例 PMSID: 2004523
 * 用例标题:【任务栏】【固定区域】【UOS AI】UOS AI插件图标展示位置
 * 生成时间: 2026-05-29 11:00:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('2004523-【任务栏】【固定区域】【UOS AI】UOS AI插件图标展示位置', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });

    test('2004523-【任务栏】【固定区域】【UOS AI】UOS AI插件图标展示位置', async ({ device, agent, uos }) => {
      // 步骤 1: 检查任务栏上UOS AI插件图标展示位置
      await agent.aiAssert("任务栏上UOS AI插件图标位于任务栏最右侧的固定区域，时间插件图标的右侧，显示正常");

    }, { timeout: 1200000, tags: ["2004523", "level3"] });

    afterEach(async ({ device, agent, system }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
