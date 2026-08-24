/**
 
 * 用例 PMSID:1585899
 * 用例标题: 主题自动切换
 * 生成时间: 2026-06-08
 * 用例编写人: UT000211(陈依)
 */

describe('1585899-主题自动切换', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：关闭帮助手册和控制中心
    await uos.showDesktop();
    await system.exec('ll-cli kill org.deepin.manual');
    await system.exec('pkill -f dde-control-center || true');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1585899-主题自动切换', async ({ device, agent, uos }) => {
    // 步骤 1: 打开帮助手册，执行快捷键Super+Left,点击右上角三条横线，点击主题，预期默认选择跟随系统，跟随系统前方有√
    await uos.openApp("帮助手册");
    await agent.aiWaitFor("展示快速入门，系统，应用模块");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Super+Left');
    await agent.aiAssert("帮助手册窗口显示在屏幕左侧");
    await agent.aiTap("帮助手册右上角三条横线菜单按钮");
    await agent.aiWaitFor("菜单已展开");
    await agent.aiTap("主题菜单项");
    await agent.aiWaitFor("主题子菜单已显示");
    await agent.aiAssert("主题菜单中默认选择跟随系统，跟随系统前方有√");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 2: 打开控制中心，执行快捷键Super+Right，预期控制中心打开，并显示在右侧
    await uos.openApp("控制中心");
    await agent.aiWaitFor("系统设置界面已显示");
    await device.pressKey('Super+Right');
    await agent.aiAssert("系统设置窗口显示在屏幕右侧");

    // 步骤 3: 点击控制中心个性化，预期进入系统设置页面
    await agent.aiTap("控制中心中的个性化选项");
    await agent.aiWaitFor("控制中心个性化页面已显示");

    // 步骤 4: 点击后方自动后面的倒三角，展示下拉框，点击深色，帮助手册背景深色展示
    await agent.aiTap("外观栏右侧下拉选择框");
    await agent.aiWaitFor("模式选择框已展示");
    await agent.aiTap("模式选择框中的深色选项");
    await agent.aiAssert("帮助手册背景深色展示");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 5: 点击后方自动后面的倒三角，展示下拉框，点击浅色，帮助手册背景浅色展示
    await agent.aiTap("外观栏右侧下拉选择框");
    await agent.aiWaitFor("模式选择框已展示");
    await agent.aiTap("模式选择框的浅色选项");
    await agent.aiAssert("帮助手册背景浅色展示");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 6: 点击后方自动后面的倒三角，展示下拉框，点击自动，帮助手册跟随系统展示
    await agent.aiTap("外观栏右侧下拉选择框");
    await agent.aiWaitFor("模式选择框已展示");
    await agent.aiTap("模式选择框中的自动选项");
    await agent.aiAssert("帮助手册跟随系统展示");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 7: 点击帮助手册右上角三条横线，点击主题，点击深色，帮助手册背景深色展示
    await agent.aiTap("帮助手册右上角三条横线菜单按钮");
    await agent.aiWaitFor("菜单已展开");
    await agent.aiTap("主题菜单项");
    await agent.aiWaitFor("主题子菜单已显示");
    await agent.aiTap("主题子菜单中的深色选项");
    await agent.aiAssert("帮助手册背景深色展示");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 8: 点击帮助手册右上角三条横线，点击主题，点击浅色，帮助手册背景浅色展示
    await agent.aiTap("帮助手册右上角三条横线菜单按钮");
    await agent.aiWaitFor("菜单已展开");
    await agent.aiTap("主题菜单项");
    await agent.aiWaitFor("主题子菜单已显示");
    await agent.aiTap("主题子菜单中的浅色选项");
    await agent.aiAssert("帮助手册背景浅色展示");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 9: 点击帮助手册右上角三条横线，点击主题，点击跟随系统，帮助手册跟随系统展示
    await agent.aiTap("帮助手册右上角三条横线菜单按钮");
    await agent.aiWaitFor("菜单已展开");
    await agent.aiTap("主题菜单项");
    await agent.aiWaitFor("主题子菜单已显示");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap("主题子菜单中的跟随系统选项");
    await agent.aiAssert("帮助手册跟随系统展示");
    await new Promise(resolve => setTimeout(resolve, 1000));

  }, { timeout: 1000000, tags: ['1585899', 'level1', 'smoke','DITT','chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
  await system.exec('ll-cli kill org.deepin.manual');
  await agent.aiWaitFor("帮助手册窗口已关闭");
  await system.exec('pkill -f dde-control-center || true');
  await agent.aiWaitFor("控制中心窗口已关闭");
    console.log('5. afterAll: 清理测试套件');
  });

});
