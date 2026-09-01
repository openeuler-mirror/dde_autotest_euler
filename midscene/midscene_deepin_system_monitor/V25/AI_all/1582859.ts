// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1582859
 * 用例标题:    [005]视图
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：ut004526
 */
describe('1582859-[005]视图', () => {
    beforeAll(async ({ device, uos, agent ,system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      await system.exec('killall deepin-system-monitor');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent ,uos}) => {
      console.log('2. beforeEach: 每个测试前的准备'); 
      // 前置步骤 1: 打开系统监视器
      await uos.openApp("系统监视器", 2000, 40000,false);
    });
  
    test('1582859-[005]视图', async ({ device, agent, uos}) => {
      // 步骤 1：	在设置下拉列表中点击视图按钮，查看软件显示
      await agent.aiTap("窗口标题栏的三条横线图标");
      await agent.aiTap("视图");
      //步骤 2 ：切换成舒展模式，查看软件显示
      await agent.aiTap("舒展");
      //验证：软件界面切换成舒展视图
      await agent.aiAssert("窗口左侧处理器上面有圆环");
      // 步骤 2：切换成紧凑模式，查看软件显示
      await agent.aiTap("窗口标题栏的三条横线图标");
      await agent.aiTap("视图");
      await agent.aiTap("紧凑");
      //验证：软件界面切换成紧凑视图
      await agent.aiAssert("窗口左侧处理器上面无圆环");
      //验证： 查看主菜单功能显示
      await agent.aiTap("窗口标题栏的三条横线图标");
      await agent.aiAssert("列表显示强制结束应用程序、视图、设置、主题、帮助、关于、退出");
      await device.pressKey("ESC");
    }, { timeout: 600000, tags: ['1582859','level1','smoke'] });  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口标题栏的三条横线图标");
      await agent.aiTap("视图");
      await agent.aiTap("紧凑");
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
