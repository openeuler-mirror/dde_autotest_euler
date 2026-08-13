
/**
 * 用例 PMSID: 1803113
 * 用例标题: 【控制中心】【系统】【语言和区域】切换地区
 * 生成时间: 2026-04-21 20:10:00
 * 用例编写人:UT001707(陈慧)
 */

describe('1803113-【控制中心】【系统】【语言和区域】切换地区', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1803113-【控制中心】【系统】【语言和区域】切换地区', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp("控制中心");
      
      // 步骤 2: 点击系统选项
      await agent.aiTap("系统");
      
      // 步骤 3: 点击语言和区域选项
      await agent.aiTap("语言和区域");
      
      // 步骤 4: 点击地区下拉框
      await agent.aiTap("地区下拉框");
      
      // 检查: 地区列表弹窗显示
      await agent.aiAssert("地区列表弹窗已显示");
      await agent.aiAssert("地区选择列表顶部显示搜索框");
      await agent.aiAssert("地区选择列表下方显示所支持的地区有：中国台湾、丹麦、乌克兰、乌干达、也门");
      
      // 步骤 5: 选择一个地区:丹麦
      await agent.aiTap("丹麦");
      
      // 检查: 地区切换成功
      await agent.aiAssert("地区显示为丹麦");
    }, { timeout: 600000, tags: ["1803113", "level2", "smoke"] });
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
      //地区切回中国
      await agent.aiTap("丹麦")
      await agent.aiTap("搜索框");
      await device.typeText("中国")
      await agent.aiTap("中国");
    // 关闭控制中心窗口
    });
    

    afterAll(async ({ uos }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
});
