/**
 * 用例 PMSID: 1506405
 * 用例标题:【控制中心】【系统】【声音】【设备管理】测试有输入和输出设备，设备管理界面默认状态检查 
 * 生成时间: 2025-12-17 15:41:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1506405-【控制中心】【系统】【声音】【设备管理】测试有输入和输出设备，设备管理界面默认状态检查', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });
  
    beforeEach(async ({ device, agent }) => {
      console.log('2. beforeEach: 每个测试前的准备');
    });
  
    test('1506405-【控制中心】【系统】【声音】【设备管理】测试有输入和输出设备，设备管理界面默认状态检查', async ({ device, agent, uos }) => {
      // 步骤 1: 打开控制中心且最大化控制中心
      await uos.openApp("控制中心", 2000, 20000, true);

      // 步骤 2: 点击控制中心-系统-声音-设置区域中点击设备管理菜单项的任意位置
      await agent.aiTap("系统", { deepThink: true });
      await agent.aiTap("声音", { deepThink: true });
      await agent.aiTap("设备管理", { deepThink: true });
    
      //检查: 检查设备管理界面默认状态
      await agent.aiAssert("输出设备文案：选择是否启用设备，展示系统自带的音频输出设备，默认启用中为勾选状态；输入设备文案：选择是否启用设备展示系统自带的音频输入设备，默认启用中为勾选状态");

    }, { timeout: 1200000, tags: ["1506405", "level1", "smoke"] });
  
    afterEach(async ({ device }) => {
      console.log('3. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });