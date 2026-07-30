/**
 * 用例 PMSID: 1504359
 * 用例标题: 【控制中心】【系统】【辅助信息】"关于本机"计算机名称显示正常
 * 生成时间: 2026-1-26 16:13:01
 * 用例编写人:UT000511(肖海燕)
 */

describe('1504359-【控制中心】【系统】【辅助信息】"关于本机"计算机名称显示正常', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1504359-【控制中心】【系统】【辅助信息】"关于本机"计算机名称显示正常', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      // 步骤 2: 点击系统-关于本机
      await agent.aiTap("系统");
      await agent.aiTap("关于本机");

      // 检查: 计算机名称显示正常
      await agent.aiAssert("计算机名称显示正常");

      // 步骤 3: 鼠标移动到计算机名称上
      await agent.aiHover("鼠标移动到计算机名后面的修改按钮签名的用户名上");

      // 检查：tips展示全名
      await agent.aiAssert("显示计算机名称成功");
      
    }, { timeout: 600000, tags: ["1504359","level3"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
  