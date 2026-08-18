/**
 * 用例 PMSID: 1506545
 * 用例标题:  【控制中心】【系统】【用户体验计划】用户体验计划三级菜单界面展示检查
 * 生成时间: 2025-12-17
 * 用例编写人:UT005571(王艺桥)
 */

describe('1506545-【控制中心】【系统】【用户体验计划】用户体验计划三级菜单界面展示检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506545-【控制中心】【系统】【用户体验计划】用户体验计划三级菜单界面展示检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp("控制中心");
  
      // 步骤 2: 点击系统
      await agent.aiTap("系统");

      // 步骤 3：鼠标向下滚动 
      await agent.aiScroll('常用设置下方区域',{direction:'down',distance:50});

      // 步骤 4: 点击用户体验计划
      await agent.aiTap("用户体验计划");

      // 检查: 加入用户体验计划按钮默认打开，下方文案显示正常
      await agent.aiAssert("加入用户体验计划按钮默认开启");
      await agent.aiAssert("按钮下方展示说明文案：开启用户体验计划视为您授权我们收集和使用您的设备\
        及系统信息，以及应用软件信息，您可以关闭用户体验计划以拒绝我们对前述信息的收集和使用。了解用户\
        体验计划，请访问：https://www.uniontech.com/agreement/experience-cn。（此链接带下划线，蓝色，可点击状态）");
  
    }, { timeout: 1200000,
         tags: ['1506545','level2','smoke'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  