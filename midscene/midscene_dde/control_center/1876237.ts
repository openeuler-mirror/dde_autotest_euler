/**
 * 用例 PMSID: 1876237
 * 用例标题: 【控制中心】【设备】【蓝牙】蓝牙开关为关闭状态时，检查蓝牙界面显示
 * 生成时间: 2026-05-07
 * 用例编写人:UT005571(王艺桥)
 */

describe('1876237-【控制中心】【设备】【蓝牙】蓝牙开关为关闭状态时，检查蓝牙界面显示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：确保蓝牙处于开启状态
    await system.exec(`bluetoothctl power on`);
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1876237-【控制中心】【设备】【蓝牙】蓝牙开关为关闭状态时，检查蓝牙界面显示', async ({ device, agent, uos, system }) => {
    // 步骤1：打开控制中心，进入蓝牙设置界面，关闭蓝牙开关
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("蓝牙");
    await agent.aiTap("蓝牙开关");
    await agent.aiAssert("蓝牙开关显示为关闭状态");

    // 步骤2：检查蓝牙界面内容展示
    await agent.aiAssert("蓝牙名称显示（与计算机名一致）");
    await agent.aiAssert("蓝牙名称下方显示提示文案：蓝牙已关闭，名称显示为“XXX”修改");
    await agent.aiAssert("蓝牙开关显示为关闭状态");
  }, { timeout: 600000, tags: ['1876237', 'level3','laptop'] });

  afterEach(async ({ device, system, uos,agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 后置清理：关闭控制中心窗口，恢复蓝牙开启状态
    await agent.aiTap("蓝牙开关");
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});