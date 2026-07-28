/**
 * 用例 PMSID: 1502433
 * 用例标题: 【控制中心】【电源管理】【通用】开启定时关机，修改重复次数设置值
 * 生成时间: 2026-2-2 14:32:10
 * 用例编写人:UT000511(肖海燕)
 */

describe('1502433-【控制中心】【电源管理】【通用】开启定时关机，修改重复次数设置值', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1502433-【控制中心】【电源管理】【通用】开启定时关机，修改重复次数设置值', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      // 步骤 2: 点击电源管理-通用
      await agent.aiTap("电源管理");
      await agent.aiTap("通用");

      // 步骤 3: 判断定时关机开关状态，为关闭时，打开。为开时，不操作
      const result = await agent.aiBoolean('定时关机开关是打开状态');
      if (result) {
      console.log('定时关机开关已经是打开状态');
      } else {
      console.log('定时关机开关不是打开状态');
      await agent.aiTap('定时关机的开关按钮');
      }

      //步骤 4: 下拉菜单选择每天，检查选择成功
      await agent.aiTap('重复菜单下拉箭头');
      await agent.aiWaitFor('下拉菜单显示正常');
      await agent.aiTap('每天');
      await agent.aiAssert('重复菜单后面显示每天');

      //步骤 5: 下拉菜单选择工作日，检查选择成功
      await agent.aiTap('重复菜单下拉箭头');
      await agent.aiWaitFor('下拉菜单显示正常');
      await agent.aiTap('工作日');
      await agent.aiAssert('重复菜单后面显示工作日');
      
    }, { timeout: 600000, tags: ["1502433","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap('重复菜单下拉箭头');
      await agent.aiTap('一次');
      await agent.aiAssert('重复菜单后面显示一次');
      await agent.aiTap('定时关机的开关按钮');
      await agent.aiAssert('定时关机的开关状态为关闭');
      await uos.closeCurrentWindow();
    });
  });
  
