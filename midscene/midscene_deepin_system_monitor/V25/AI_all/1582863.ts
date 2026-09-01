// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1582863
 * 用例标题:  [003]主菜单
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：ut004526
 */

describe('1582863-[003]主菜单', () => {
    beforeAll(async ({ device, uos, agent ,system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      await system.exec('killall deepin-system-monitor')
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent ,uos}) => {
      console.log('2. beforeEach: 每个测试前的准备'); 
      // 前置步骤 1: 打开系统监视器
      await uos.openApp("系统监视器", 2000, 40000,false);
    });
  
    test('1582863-[003]主菜单', async ({ device, agent, uos}) => {
      // 步骤 1：点击软件右上角的主菜单按钮，查看软件显示
      await agent.aiTap("窗口标题栏的三条横线图标");
      await agent.aiAssert("弹出主菜单列表")
      await agent.aiAssert("列表显示强制结束应用程序、视图、设置、主题、帮助、关于、退出")
      await device.pressKey('Esc');
    }, { timeout: 600000, tags: ['1582863','level1','smoke']});  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
