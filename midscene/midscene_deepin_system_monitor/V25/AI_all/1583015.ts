// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1583015
 * 用例标题:点击“详情信息”，切换到性能参数界面
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：ut004526
 */

describe('1583015-点击“详情信息”，切换到性能参数界面', () => {
    beforeAll(async ({ device, uos, agent ,system}) => {
      console.log('1. beforeAll: 初始化测试套件');
      await system.exec('killall deepin-system-monitor')
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent ,uos}) => {
      console.log('2. beforeEach: 每个测试前的准备'); 
    });
  
    test('1583015-点击“详情信息”，切换到性能参数界面', async ({ device, agent, uos}) => {
      // 步骤 1: 打开系统监视器
      await uos.openApp("系统监视器", 2000, 40000,false);
      // 步骤 1: 右侧显示进程列表时,左侧视图中显示“详情信息”，点击“详情信息”按钮
      await agent.aiTap("左侧视图中存在文本'详细信息'");
      await agent.aiAssert("右侧视图中存在'隐藏详情'文本");
      // 验证：左侧视图中不显示“详情信息”
      await agent.aiAssert("左侧视图中不存在'详细信息'文本");
    }, { timeout: 600000, tags:['1583015','level1','smoke']});  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
