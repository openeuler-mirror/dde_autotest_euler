// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1583161
 * 用例标题: CPU总体、个体利用率转换按钮
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：UT004526(赵培蕾)
 */

describe('1583161- CPU总体、个体利用率转换按钮', () => {
    beforeAll(async ({ device, uos, agent ,system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      await system.exec('killall deepin-system-monitor')
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent ,uos}) => {
      console.log('2. beforeEach: 每个测试前的准备'); 
      // 前置步骤 1: 打开系统监视器
      await uos.openApp("系统监视器", 2000, 40000,false);
      // 前置步骤 2：点击“详细信息”切换到详细信息页
      await agent.aiTap("详细信息");
      console.log('beforeEach done')
    });
  
    test('1583161- CPU总体、个体利用率转换按钮', async ({ device, agent, uos}) => {
      //步骤  2：鼠标悬停到图表右上方的转换按钮
      await agent.aiHover("隐藏详情左边的切换按钮")
      //验证：展示文字释义“个体利用率”
      await agent.aiAssert("展示文字释义’个体利用率‘");
      //步骤  2：鼠标点击图表右上方的转换按钮
      await agent.aiTap("隐藏详情左边的切换按钮");
      await agent.aiHover("隐藏详情")
      await agent.aiHover("隐藏详情左边的切换按钮")
      //验证：展示文字释义“总体利用率”
      await agent.aiAssert("展示文字释义‘总体利用率‘");

    }, { timeout: 600000, tags: ['1583161','level2','smoke'] });  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
