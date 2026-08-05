/**
 * 用例 PMSID: 1809919
 * 用例标题: 桌面空白处，右键菜单点击【显示设置】
 * 生成时间: 2026-2-3 16:15:32
 * 用例编写人：UT002161(陈俞)
 */

describe('1809919-桌面空白处，右键菜单点击【显示设置】', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent, uos, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      
      // 检查并结束控制中心进程
      await system.exec('killall dde-control-center', 500);

    });
  
    test('1809919-桌面空白处，右键菜单点击【显示设置】 ', async ({ device, agent, uos, system, env }) => {  

        // 开启整理桌面功能
        await agent.aiRightClick('桌面右侧无内容区');
        await agent.aiWaitFor('右键菜单');
        await agent.aiTap('显示设置', 1000);
        await agent.aiAssert('系统/显示');

    }, { timeout: 1200000, tags: ["1809919", "level3", "rightclickd_menu", "chenyu"] });
  
    afterEach(async ({ device, agent, env, system}) => {
      console.log('4. afterEach: 每个测试后的清理');

      // 检查并结束控制中心进程
      await system.exec('killall dde-control-center', 500);
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
