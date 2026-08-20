/**
 * 用例 PMSID: 1506781
 * 用例标题: 【控制中心】【系统信息】控制中心-系统信息，关于本机页面版权年限根据实际年份展示 
 * 生成时间: 2025-12-11 20:13:01
 * 用例编写人:UT000511(肖海燕)
 */

describe('1506781-【控制中心】【系统信息】控制中心-系统信息，关于本机页面版权年限根据实际年份展示', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506781-【控制中心】【系统信息】控制中心-系统信息，关于本机页面版权年限根据实际年份展示', async ({ device, agent, uos, system }) => {
      // 步骤 1: 打开控制中心并最大化
      await uos.openApp("控制中心", {maximizeWindow: true});
      
      // 步骤 2: 点击系统-关于本机
      await agent.aiTap("系统");
      await agent.aiTap("关于本机");
      
      // 检查： 获取当前年份信息且检查界面信息显示正常
      const date_out= await system.exec('date');
      const year_value= date_out.stdout.match(/\d{4}/)[0];
      console.log('获取到的年份为：',year_value);
      await agent.aiAssert(`检查界面显示Copyright © 2019-${year_value}统信软件技术有限公司`); 
      
    }, { timeout: 600000, tags: ["1506781","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
  