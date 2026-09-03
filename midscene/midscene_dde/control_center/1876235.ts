
/**
 * 用例 PMSID: 1876235
 * 用例标题: 【控制中心】【蓝牙和其他设备】【蓝牙】蓝牙开关默认状态检查
 * 生成时间: 2025-12-18 09:26:23
 * 用例编写人: UT001924(李鹤)
 */

describe('1876235-【控制中心】【蓝牙和其他设备】【蓝牙】蓝牙开关默认状态检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1876235-【控制中心】【蓝牙和其他设备】【蓝牙】蓝牙开关默认状态检查', async ({ device, agent, uos }) => {
    // 打开控制中心并进入蓝牙和其他设备页面
    await uos.openApp("控制中心");
    await agent.aiWaitFor("'蓝牙和其他设备'文字可见");
    await agent.aiTap("蓝牙和其他设备", { deepThink: true });
    await agent.aiWaitFor("'蓝牙'文字可见");
    await agent.aiAssert("蓝牙模块概述'蓝牙设置、设备管理'");
    // 点击蓝牙菜单进入蓝牙页面
    await agent.aiTap("蓝牙", { deepThink: true });
    await agent.aiWaitFor("'蓝牙已打开'文字可见");
    // 检查蓝牙开关状态
    await agent.aiAssert("蓝牙开关为开启状态");
  }, { timeout: 1200000, tags: ['1876235', 'level1', 'smoke', 'laptop'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
