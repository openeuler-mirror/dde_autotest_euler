// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1582861
 * 用例标题:   [004]主题
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：ut004526
 */
describe('1582861-[004]主题', () => {
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
  
    test('1582861-[004]主题', async ({ device, agent, uos}) => {
      // 步骤 1：	在设置下拉列表中勾选主题按钮，查看软件显示
      await agent.aiTap("窗口标题栏的三条横线图标");
      await agent.aiTap("主题");
      await agent.aiAssert("默认勾选跟随系统")
      //步骤 2 ：切换成浅色主题，查看软件显示
      await agent.aiTap("浅色");
      //验证：软件界面切换成白色
      await agent.aiAssert("窗口标题栏白色")
      // 步骤 2：切换成深色主题，查看软件显示
      await agent.aiTap("窗口标题栏的三条横线图标");
      await agent.aiTap("主题");
      await agent.aiTap("深色");
      //验证：软件界面切换成黑色
      await agent.aiAssert("窗口标题栏黑色")
    }, { timeout: 600000, tags: ['1582861','level1','smoke'] });  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口标题栏的三条横线图标");
      await agent.aiTap("主题");
      await agent.aiTap("跟随系统");
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
