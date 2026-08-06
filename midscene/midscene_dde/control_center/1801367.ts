
/**
 * 用例 PMSID: 1801367
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【通用】通用界面显示
 * 生成时间: 2025-12-17 17:08:36
 * 用例编写人: UT001924(李鹤)
 */

describe('1801367-【控制中心】【蓝牙和其他设备】【键盘】【通用】通用界面显示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801367-【控制中心】【蓝牙和其他设备】【键盘】【通用】通用界面显示', async ({ device, agent, uos }) => {
    // 打开控制中心并最大化
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 蓝牙和其他设备菜单出现后，点击菜单进入蓝牙和其他设备页面
    await agent.aiWaitFor("'蓝牙和其他设备'文字可见");
    await agent.aiTap("蓝牙和其他设备", { deepThink: true });
    // 确认已经进入蓝牙和其他设备页面，点击键盘进入键盘页面
    await agent.aiWaitFor("'键盘'文字可见");
    await agent.aiTap("键盘", { deepThink: true });
    // 确认已经进入键盘页面
    await agent.aiWaitFor("'通用'文字可见");
    // 检查键盘页面展示元素
    await agent.aiAssert("验证存在设置项重复延迟");
    await agent.aiAssert("验证存在设置项重复速度");
    await agent.aiAssert("测试区域显示'请在此输入测试'");
    await agent.aiAssert("启用数字键盘为开启状态");
    await agent.aiAssert("大写锁定提示为开启状态");
    await agent.aiAssert("存在菜单项输入法");
    await agent.aiAssert("输入法介绍文案为'输入法管理、输入法快捷键、高级设置'");
    await agent.aiAssert("存在菜单项快捷键");
    await agent.aiAssert("快捷键介绍文案为'系统快捷键、自定义快捷键'");
  }, { timeout: 1200000, tags: ['1801367', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 恢复窗口默认大小(控制中心)
    await device.pressKey("super", "Down");
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
