/**
 * 用例 PMSID: 1829903
 * 用例标题: 【控制中心】【个性化】【桌面和任务栏】控制中心设置任务栏模式为经典，生效正常
 * 生成时间: 2025-12-24
 * 用例编写人:UT005571(王艺桥)
 */

describe('1829903-【控制中心】【个性化】【桌面和任务栏】控制中心设置任务栏模式为经典，生效正常', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1829903-【控制中心】【个性化】【桌面和任务栏】控制中心设置任务栏模式为经典，生效正常', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp("控制中心");

      // 步骤 2: 点击个性化
      await agent.aiTap("个性化");

      // 步骤 3: 点击桌面和任务栏
      await agent.aiTap("桌面和任务栏");

      // 步骤 4: 点击居中模式
      await agent.aiTap("居中模式文本上方图片");

      // 检查: 任务栏生效效果
      await agent.aiAssert("任务栏下发图标分为左中右3部分，任务栏居中部分存在应用图标，状态正常，保持默认的或之前设置过的高度");

      // 步骤 5: 点击经典模式
      await agent.aiTap("经典模式上方图片");

      // 检查: 任务栏生效效果
      await agent.aiAssert("设置成功，选中焦点即时更新为“经典”模式项，边框效果显示正常");
      await agent.aiAssert("任务栏同步即时更新为经典模式，固定区和应用区图标整体居左显示，状态正常，保持默认或之前设置过的高度");

  
    }, { timeout: 1200000,
         tags: ['1829903','level2','smoke'] });
  
    afterEach(async ({ agent,device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    })
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  