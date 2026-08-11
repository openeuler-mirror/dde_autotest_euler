/**
 * 用例 PMSID: 1506417
 * 用例标题: 【控制中心】【电源管理】【使用电源】【笔记本】使用电源界面显示检查
 * 生成时间: 2025-12-16
 * 用例编写人:UT005571(王艺桥)
 */

describe('1506417-【控制中心】【电源管理】【使用电源】【笔记本】使用电源界面显示检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506417-【控制中心】【电源管理】【使用电源】【笔记本】使用电源界面显示检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp("控制中心",{maximizeWindow: true});
  
      // 步骤 2: 点击电源管理
      await agent.aiTap("电源管理");

      // 步骤 3: 点击使用电源
      await agent.aiTap("使用电源");

      // 检查: 使用电源页面显示
      await agent.aiAssert("标题：屏幕和待机");
      await agent.aiAssert("关闭显示器：时间刻度依次显示：1m、5m、10m、15m、30m、1h、从不，默认初始值为15分钟");
      await agent.aiAssert("自动锁屏：时间刻度依次显示：1m、5m、10m、15m、30m、1h、从不，默认初始值为15分钟");
      await agent.aiAssert("进入待机：时间刻度依次显示：10m、15m、30m、1h、2h、3h、从不，默认初始值为30分钟");
      await agent.aiAssert("笔记本合盖时：默认值为待机");
      await agent.aiAssert("按电源按钮时：默认值为进入关机界面");
  
    }, { timeout: 300000,
         tags: ['1506417','level1','smoke','laptop'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
      await device.pressKey("super", "Down");
      await device.pressKey("alt", "F4");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
  