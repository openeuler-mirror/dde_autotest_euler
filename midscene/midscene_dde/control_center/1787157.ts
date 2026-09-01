/**
 * 用例 PMSID: 1787157
 * 用例标题: 【控制中心】【系统】【时间和日期】时间和日期界面检查 
 * 生成时间: 2025-12-19 13：55：11
 * 用例编写人:UT000511(肖海燕)
 */

describe('1787157-【控制中心】【系统】【时间和日期】时间和日期界面检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1787157-【控制中心】【系统】【时间和日期】时间和日期界面检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      // 步骤 2: 点击系统
      await agent.aiTap("系统");

      //检查时间和日期文案显示
      await agent.aiAssert("显示时间和日期菜单，下方显示：时间日期、时区设置");

      // 步骤 3: 点击时间和日期
      await agent.aiTap("时间和日期");

      //检查从上到下依次显示：
      await agent.aiAssert("显示数字时间");
      await agent.aiAssert("显示年月日星期");
      await agent.aiAssert("自动同步配置开关默认开启");
      await agent.aiAssert("服务器后面默认值为ntp.aliyun.com)");
      await agent.aiAssert("系统时区当前显示的默认值是北京 (UTC+08:00)");
      await agent.aiAssert("时区列表后面显示添加按钮");
       
    }, { timeout: 1200000, tags: ["1787157","level1","smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  