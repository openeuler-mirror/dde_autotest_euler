/**
 * 用例 PMSID: 1506547
 * 用例标题:  【控制中心】【通用】【域管理】域管理三级菜单界面展示检查
 * 生成时间: 2026-02-05
 * 用例编写人:UT000224(何权)
 */

describe('1506547-【控制中心】【通用】【域管理】域管理三级菜单界面展示检查', () => {
    beforeAll(async ({ device, uos, agent, sy }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await system.exec(`killall dde-control-center`)
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506547-【控制中心】【通用】【域管理】域管理三级菜单界面展示检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心，点击系统，域管理，进入三级菜单界面
      await uos.openApp("控制中心");
      await agent.aiTap("系统");
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiTap("系统");
      await device.pressKey('super', 'up');
      await agent.aiTap("域管理");
  
      // 步骤 2: 域管理展示检查，开关，默认关闭
      await agent.aiAssert("域管理开关默认关闭");
  
      // 步骤 3: 说明文案展示检查，按钮下方展示说明文案
      await agent.aiAssert("按钮下方展示说明文案：启用域管理功能后，您可按照引导将本机加入到域中统一管理。");
  
      // 步骤 4: 点击开关，弹出弹窗，提示连接域服务器配置信息
      await agent.aiTap("域管理开关");
      await agent.aiAssert("弹出弹窗，提示连接域服务器配置信息");
  
    }, { timeout: 1200000,
         tags: ['1506547','level2','smoke'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("控制中心窗口右上角关闭按钮:X");
      await agent.aiTap("域管理配置窗口右上角关闭按钮:X");
      await uos.openApp("控制中心");
      await device.pressKey('super', 'down');
      await system.exec(`killall dde-control-center`)
    });
  });