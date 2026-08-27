/**
 * 用例 PMSID: 1699249
 * 用例标题: 【控制中心】【个性化】【字体和字号】字体和字号三级界面展示
 * 生成时间: 2025-12-23
 * 用例编写人:UT005571(王艺桥)
 */

describe('1699249-【控制中心】【个性化】【字体和字号】字体和字号三级界面展示', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1699249-【控制中心】【个性化】【字体和字号】字体和字号三级界面展示', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp("控制中心",{maximizeWindow: true});
  
      // 步骤 2: 点击个性化
      await agent.aiTap("个性化");

      // 步骤 3: 点击字体和字号
      await agent.aiTap("字体和字号");

      // 检查: 检查页面显示
      await agent.aiAssert("上方显示：<个性化/字体和字号");
      await agent.aiAssert("设置项1：标题：字号，左对齐。下方展示刻度调节区，从左到右字号刻度值分别为11，12，13，14，15，16，18，20。默认值为14");
      await agent.aiAssert("设置项2：下拉选项类，标题：标准字体，左对齐，最右侧展示默认字体：思源黑体 V箭头");
      await agent.aiAssert("设置项3：下拉选项类，标题：等宽字体，左对齐，最右侧展示默认字体：Noto Mono V箭头");

      // 检查： 标准字体和等宽字体下拉菜单显示
      await agent.aiTap("思源黑体后面V箭头",{ deepThink: true });
      await agent.aiAssert("出现弹窗");
      await agent.aiTap("弹窗外空白区域");
      await agent.aiTap("Noto Mono后面V箭头",{ deepThink: true });
      await agent.aiAssert("出现弹窗");
      await agent.aiTap("弹窗外空白区域");
  
    }, { timeout: 300000,
         tags: ['1699249','level2','smoke'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
      await device.pressKey("super", "Down");
      await device.pressKey("alt", "F4");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
  