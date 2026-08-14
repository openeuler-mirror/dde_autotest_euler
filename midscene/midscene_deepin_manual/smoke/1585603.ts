/**
 
 * 用例 PMSID:1585603
 * 用例标题: 最小化后再次打开帮助手册，dock栏和界面均显示正常
 * 生成时间: 2026-06-08
 * 用例编写人: UT000211(陈依)
 */

describe('1585603-最小化后再次打开帮助手册，dock栏和界面均显示正常', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：关闭帮助手册、计算器和控制中心
    await uos.showDesktop();
    await system.exec('ll-cli kill org.deepin.manual');
    await system.exec('pkill -f deepin-calculator || true');
    await system.exec('pkill -f dde-control-center || true');
    await new Promise(resolve => setTimeout(resolve, 1000));
  })

  beforeEach(async ({ device, agent,system ,uos }) => {
    await uos.openApp("控制中心");
    await agent.aiWaitFor("系统设置界面已显示");
    await agent.aiTap("个性化");
    await agent.aiTap("点击自定义上方的图片");
    await agent.aiAssert("自定义上方的主题被选中");
    await system.exec('pkill -f dde-control-center || true');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1585603-最小化后再次打开帮助手册，dock栏和界面均显示正常', async ({ device, agent, uos }) => {
    // 步骤 1: 启动器打开帮助手册，点击右上角最小化
    // 预期: 应用最小化，dock栏图标显示正确
    await uos.openApp("帮助手册");
    await agent.aiWaitFor("帮助手册界面已显示");
    await agent.aiTap("帮助手册窗口右上角最小化按钮");
    await agent.aiAssert("桌面不存在帮助手册窗口");
    await agent.aiAssert("dock栏存在中间为心形的图标");

    // 步骤 2: 打开控制中心，快捷键F1，打开帮助手册，展示控制中心的帮助文案
    // 预期: dock栏图标显示正确
    await uos.openApp("控制中心");
    await agent.aiWaitFor("系统设置界面已显示");
    await device.pressKey('F1');
    await agent.aiWaitFor("帮助手册界面已显示");
    await agent.aiAssert("帮助手册展示控制中心的帮助文案");
    await agent.aiAssert("dock栏存在中间为心形的图标");

    // 步骤 3: 点击帮助手册右上角最小化
    // 预期: 帮助手册最小化
    await agent.aiTap("帮助手册窗口右上角最小化按钮");
    await agent.aiWaitFor("桌面不存在帮助手册窗口");
    await agent.aiAssert("桌面不存在帮助手册窗口");

    // 步骤 4: 打开计算器，点击右上角的三条横线，点击帮助，展示计算器的帮助文案
    // 预期: dock栏图标显示正确
    await uos.openApp("计算器");
    await agent.aiWaitFor("计算器界面已显示");
    await agent.aiTap("计算器窗口右上角菜单按钮:三条横线");
    await agent.aiWaitFor("菜单已显示");
    await agent.aiTap("帮助菜单项");
    await agent.aiWaitFor("帮助手册界面已显示");
    await agent.aiAssert("帮助手册展示计算器的帮助文案");
    await agent.aiAssert("dock栏存在中间为心形的图标");

  }, { timeout: 1200000, tags: ['1585603', 'level1', 'smoke','DITT','chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 点击帮助手册和计算器和控制中心右上角×，帮助手册和计算器控制中心都关闭
    await agent.aiTap("帮助手册窗口右上角关闭按钮:X");
    await agent.aiWaitFor("帮助手册窗口已关闭");
    await agent.aiTap("计算器窗口右上角关闭按钮:X");
    await agent.aiWaitFor("计算器窗口已关闭");
    await agent.aiTap("控制中心窗口右上角关闭按钮:X");
    await agent.aiWaitFor("控制中心窗口已关闭");
  });

});
