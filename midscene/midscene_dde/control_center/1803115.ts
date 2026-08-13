
/**
 * 用例 PMSID: 1803115
 * 用例标题: 【控制中心】【系统】【语言和区域】区域格式切换
 * 生成时间: 2026-04-21 20:15:00
 * 用例编写人:UT001707(陈慧)
 */


describe('1803115-【控制中心】【系统】【语言和区域】区域格式切换', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1803115-【控制中心】【系统】【语言和区域】区域格式切换', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp("控制中心");
      
      // 步骤 2: 点击系统选项
      await agent.aiTap("系统");
      
      // 步骤 3: 点击语言和区域选项
      await agent.aiTap("语言和区域");
      
      // 步骤 4: 点击区域格式下拉框
      await agent.aiTap("区域格式下拉框");
      
      // 检查: 区域格式弹窗显示
      await agent.aiAssert("区域格式弹窗已显示");
      
      // 步骤 5: 选择一个区域格式
      await agent.aiTap("信德语(印度)");
      
      // 步骤 6: 点击保存按钮
      await agent.aiTap("保存");
     //切换中等待5秒钟
      await new Promise(resolve => setTimeout(resolve,5000));      
      // 检查: 区域格式切换成功
      await agent.aiAssert("区域格式显示为信德语(印度)");
      await agent.aiAssert('当前区域格式下，日期、时间、货币符号都显示印度相关的信德语格式，货币符号为印度卢比');
    }, { timeout: 600000, tags: ["1803115", "level2", "smoke"] });
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
      //区域格式切回中国
      await agent.aiTap("信德语(印度)");
      await agent.aiTap("搜索框");
      await device.typeText("中国")
      await agent.aiTap("中文(中国)");
      await agent.aiTap("保存");
      await new Promise(resolve => setTimeout(resolve,5000))

    });
  
    afterAll(async ({ uos }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
});

