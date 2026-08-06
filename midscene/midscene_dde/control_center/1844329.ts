/**
 * 用例 PMSID: 1844329
 * 用例标题: 【控制中心】【系统】【辅助信息】关于本机菜单的概述中文描述与需求一致 
 * 生成时间: 2026-1-26 15:13:01
 * 用例编写人:UT000511(肖海燕)
 */

describe('1844329-【控制中心】【系统】【辅助信息】关于本机菜单的概述中文描述与需求一致', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1844329-【控制中心】【系统】【辅助信息】关于本机菜单的概述中文描述与需求一致', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心并最大化
      await uos.openApp('控制中心', { maximizeWindow: true });
      
      // 步骤 2: 点击系统
      await agent.aiTap("系统");
      
      // 检查： 界面显示
      await agent.aiAssert("辅助信息菜单下面显示：关于本机");
      await agent.aiAssert("关于本机下方显示：系统版本、设备信息");
      
    }, { timeout: 600000, tags: ["1844329","level4"] });
  
    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });
  