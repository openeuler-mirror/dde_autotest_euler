// import "dotenv/config";
// import { describe, test } from "midscene-uos";

/**
 * 用例 PMSID: 1583177
 * 用例标题:磁盘单位统一
 * 生成时间: 2025-11-19 09:50:26
 * 用例编写人：UT004526(赵培蕾)
 */

describe('1583177-磁盘单位统一', () => {
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
  
    test('1583177-磁盘单位统一', async ({ device, agent, uos}) => {
      // 步骤 1: 检查系统监视器程序列表应用进程中磁盘读取、磁盘写入的单位
      await agent.aiTap("窗口右上方应用程序视图图标");
      // 验证：单位统一格式，均为KB、MB、GB、TB、B
      await agent.aiAssert("进程列表中磁盘读取、磁盘写入的单位格式,为KB/s或MB/s或GB/s或TB/s或B/s");
      // 步骤 2: 检查程序列表我的进程中磁盘读取、磁盘写入的单位
      await agent.aiTap("窗口右上方我的进程视图图标");
      // 验证：单位统一格式，均为KB、MB、GB、TB、B
      await agent.aiAssert("进程列表中磁盘读取、磁盘写入的单位格式,为KB/s或MB/s或GB/s或TB/s或B/s");
      // 步骤 3: 检查程序列表所有进程中上传、下载的单位
      await agent.aiTap("窗口右上方所有进程视图图标");
      // 验证：单位统一格式，均为KB、MB、GB、TB、B
      await agent.aiAssert("进程列表中磁盘读取、磁盘写入的单位格式,为KB/s或MB/s或GB/s或TB/s或B/s");
      // 步骤 4: 检查程序进程左侧磁盘读取、磁盘写入单位，单位统一格式，均为KB、MB、GB、TB、B
      await agent.aiAssert("窗口左侧磁盘读取、磁盘写入的单位格式,为KB/s或MB/s或GB/s或TB/s或B/s");
      // 步骤 5: 检查网络详情信页中的单位，单位统一格式，均为KB、MB、GB、TB、B
      await agent.aiTap("窗口左侧'磁盘读取'");
      await agent.aiAssert("窗口右侧磁盘详情信页表格上方读取和写入的单位格式,为KB/s或MB/s或GB/s或TB/s或B/s");
      await agent.aiTap("隐藏详情");
    }, { timeout: 600000, tags: ['1583177','level3','smoke'] });  
  
    afterEach(async ({ device,agent }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await agent.aiTap("窗口标题栏下面一行从右往左第三个图标");
      await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
