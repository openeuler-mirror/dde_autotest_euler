// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1583275
 * 用例标题:等保-主菜单-新增设置
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：ut004526
 */

describe('1583275-等保-主菜单-新增设置', () => {
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
  
    test('1583275-等保-主菜单-新增设置', async ({ device, agent, uos}) => {
      // 步骤 1: 点击右上方主菜单按钮，检查主菜单选项
      await agent.aiTap("窗口标题栏的三条横线图标");
      // 验证：主菜单新增“设置选项”
      await agent.aiAssert("主菜单存在'设置'选项");
    }, { timeout: 600000, tags: ['1583275','level1','smoke'] });  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await device.pressKey("ESC")
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
