/**
 * 用例 PMSID: 1506399
 * 用例标题:【控制中心】【系统】【声音】声音界面，输入设置项检查 
 * 生成时间: 2025-12-17 15:54:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1506399-【控制中心】【系统】【声音】声音界面，输入设置项检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506399-【控制中心】【系统】【声音】声音界面，输入设置项检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心且最大化控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击控制中心-系统-声音
      await agent.aiTap("系统", { deepThink: true });
      await agent.aiTap("声音", { deepThink: true });
    
      //检查: 检查输入设置项
      await agent.aiAssert("输入设置项从上到下依次显示:输入音量(默认显示50%)、反馈音量、噪音抑制(默认关闭)、输入设备");

    }, { timeout: 1200000, tags: ["1506399", "level1", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });