// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1583273
 * 用例标题:等保-检查设置界面
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：UT004526(赵培蕾)
 */

describe('1583273-等保-检查设置界面', () => {
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
  
    test('1583273-等保-检查设置界面', async ({ device, agent, uos}) => {
      // 步骤 1: 点击主菜单“设置选项”
      await agent.aiTap("窗口标题栏的三条横线图标");
      await agent.aiTap("设置");
      // 验证：设置页面左侧导航栏展示：一级标题为设置，下方二级标题为系统防护和消息通知；右侧展示自动报警开关按钮，CPU、内存阈值和预警间隔设置项,输入范围的文字提示，以及消息通知设置按钮
      await agent.aiAssert("设置窗口左侧导航栏展示：一级标题为设置，下方二级标题为系统防护和消息通知");
      await agent.aiAssert("设置窗口右侧展示自动报警开关按钮,CPU、内存阈值和预警间隔设置项,输入范围的文字提示，以及消息通知设置按钮");
    }, { timeout: 600000, tags: ['1583273','level2','smoke'] });  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await device.pressKey("ESC")
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
