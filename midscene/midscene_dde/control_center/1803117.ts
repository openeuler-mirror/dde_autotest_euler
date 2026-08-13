/**
 * 用例 PMSID: 1803117
 * 用例标题: 【控制中心】【系统】【语言和区域】语言列表显示检查
 * 生成时间: 2025-12-24
 * 用例编写人:UT005571(王艺桥)
 */

describe('1803117-【控制中心】【系统】【语言和区域】语言列表显示检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1803117-【控制中心】【系统】【语言和区域】语言列表显示检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心 
      await uos.openApp("控制中心");

      // 检查: 语言和区域文案
      await agent.aiAssert("语言和区域下方文案：系统语言、区域格式");
     
      // 步骤 2: 点击语言和区域
      await agent.aiTap("语言和区域");

      // 检查: 界面显示
      await agent.aiAssert("页面显示2部分：语言和区域");

      // 检查： 语言列表默认显示
      await agent.aiAssert("语言从上至下显示\
        标题：语言\
        简体中文 - 中文（中国）\
        其他语言 右侧显示添加按钮");
  
    }, { timeout: 1200000, tags: ["1803117","level1","smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
});