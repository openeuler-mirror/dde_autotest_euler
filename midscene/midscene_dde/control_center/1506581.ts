/**
 * 用例 PMSID: 1506581
 * 用例标题:  【控制中心】【电源管理】【通用】唤醒设置默认值检查
 * 生成时间: 2025-12-17
 * 用例编写人:UT005571(王艺桥)
 */

describe('1506581-【电源管理】【通用】唤醒设置默认值检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506581-【电源管理】【通用】唤醒设置默认值检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp("控制中心");
  
      // 步骤 2: 点击电源管理
      await agent.aiTap("电源管理");

      // 步骤 3: 点击通用
      await agent.aiTap("通用");

      // 步骤 4: 鼠标向下滚动
      await agent.aiScroll('电源管理/通用下方区域',{direction:'down',distance:20});

      // 检查: 唤醒设置默认值
      await agent.aiAssert("待机恢复时需要密码按钮默认开启");
      await agent.aiAssert("唤醒显示器时需要密码按钮默认开启");
  
    }, { timeout: 1200000,
         tags: ['1506581','level1','smoke'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  