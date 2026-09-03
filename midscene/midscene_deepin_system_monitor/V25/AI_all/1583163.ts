// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1583163
 * 用例标题:CPU详细信息页默认展示总体利用率
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：UT004526(赵培蕾)
 */

describe('1583163-CPU详细情页切换个体利用率', () => {
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
  
    test('1583163-CPU详细情页切换个体利用率', async ({ device, agent, uos}) => {
      //步骤  1：点击“详细信息”切换到详细信息页
      await agent.aiTap("详细信息");
      //验证：展示CPU总体利用率图表
      await agent.aiAssert("窗口右侧默认展示CPU总体利用率,上方为总体利用率的图表");
      //步骤  2：点击图表右上方的转换按钮
      await agent.aiTap("隐藏详情左边的切换按钮")
      //验证：默认展示CPU总体利用率，上方为总体利用率的图表，下方为CPU总体的性能参数
      await agent.aiAssert("窗口右侧展示CPU详情页展示个体CPU图表,下方显示总体的性能参数");
    }, { timeout: 600000, tags: ['1583163','level2','smoke'] });  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
