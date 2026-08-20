/**
 * 用例 PMSID: 1695963
 * 用例标题:  【控制中心】【系统】【默认程序】入口和界面检查
 * 生成时间: 2025-12-17
 * 用例编写人:UT005571(王艺桥)
 */

describe('1695963-【系统】【默认程序】入口和界面检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1695963-【系统】【默认程序】入口和界面检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp("控制中心");
  
      // 步骤 2: 点击系统
      await agent.aiTap("系统");

      // 步骤 3: 点击默认程序
      await agent.aiTap("默认程序");

      // 检查: 默认程序页面UI显示
      await agent.aiAssert("顶部导航栏菜单：<系统/默认程序");
      await agent.aiAssert("依次排序的默认程序类型：网页、邮件、文本、音乐、视频、图片、终端");
  
    }, { timeout: 1200000,
         tags: ['1695963','level1','smoke'] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
  