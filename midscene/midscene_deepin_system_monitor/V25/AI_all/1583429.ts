// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1583429
 * 用例标题: 首次打开系统监视器-视图展示
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：ut004526
 */

describe('1583429-首次打开系统监视器-视图展示', () => {
    beforeAll(async ({ device, uos, agent ,system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      await system.exec('killall deepin-system-monitor')
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent ,uos}) => {
      console.log('2. beforeEach: 每个测试前的准备'); 
      // 前置步骤 1: 打开系统监视器
      await uos.openApp("系统监视器", 2000, 40000,false);
      console.log('beforeEach done')
    });
  
    test('1583429-首次打开系统监视器-视图展示', async ({ device, agent, uos}) => {
      // 步骤 1: 查看默认打开时，视图展示
      // 验证：默认展示应用程序视图
      await agent.aiAssert("标题栏左上角'程序进程'高亮");
    }, { timeout: 600000, tags: ['1583429','level1','smoke'] });  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
