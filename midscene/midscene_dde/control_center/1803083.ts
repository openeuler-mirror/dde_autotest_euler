/**
 * 用例 PMSID: 1803083
 * 用例标题: 【控制中心】【系统】【语言和区域】添加系统语言
 * 生成时间: 2025-12-23
 * 用例编写人:UT005571(王艺桥)（王艺桥）
 */

describe('1803083-【控制中心】【系统】【语言和区域】添加系统语言', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1803083-【控制中心】【系统】【语言和区域】添加系统语言', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp("控制中心");
  
      // 步骤 2: 点击语言和区域
      await agent.aiTap("语言和区域");

      // 步骤 3: 点击添加
      await agent.aiTap("其他语言后面的添加按钮");

      // 检查: 检查页面显示
      await agent.aiAssert("添加语言列表展示形式为：语言本身-当前系统语言翻译后（地区）");

      // 步骤4: 添加系统语言：例如美国英语
      await agent.aiTap("搜索框");
      await device.typeText('English');
      await agent.aiWaitFor("搜索框下方显示: American English-美国英语");
      await agent.aiTap("搜索框下方：American English-美国英语");
      await agent.aiTap("添加语言窗口右下角添加按钮");

      // 检查： 添加成功，英语已添加到系统语言列表上
      await agent.aiAssert("American English-美国英语 显示在语言列表中");
  
    }, { timeout: 300000,
         tags: ['1803083','level2','smoke'] });
  
    afterEach(async ({ agent,device }) => {
      console.log('4. afterEach: 每个测试后的清理');
      // 清除添加的英语语言
      await agent.aiTap("语言后面：编辑");
      await agent.aiTap("美国英语后面的‘-’红色按钮",{ deepThink: true });
      await device.pressKey("super", "Down");
      await device.pressKey("alt", "F4");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
    });
  });
  