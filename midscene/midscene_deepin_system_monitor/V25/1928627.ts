// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1928627
 * 用例标题:处理器详情页-“最大频率”和“频率”位置变更
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：ut004526
 */

describe('1928627-处理器详情页-“最大频率”和“频率”位置变更', () => {
    beforeAll(async ({ device, uos, agent ,system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      await system.exec('killall deepin-system-monitor')
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent ,uos}) => {
      console.log('2. beforeEach: 每个测试前的准备'); 
      // 前置步骤 1: 打开系统监视器
      await uos.openApp("系统监视器", 2000, 40000,false);
      // 前置步骤 2：点击“详情信息”按钮,进入详情界面
      await agent.aiTap("左侧视图中的文本'详细信息'");
      console.log('beforeEach done')
    });
  
    test('1928627-处理器详情页-“最大频率”和“频率”位置变更', async ({ device, agent, uos}) => {
      // 步骤 1: 查看处理器详情界面下方的各个参数
      // 验证：“频率”显示在第一行第二个、“最大频率”显示在第二行第一个
      await agent.aiAssert("右侧下方表格中'频率'显示在第一行第二个");
      await agent.aiAssert("右侧下方表格中'最大频率'显示在第二行第一个");
    }, { timeout: 600000, tags: ['1928627','level3','smoke'] });  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
