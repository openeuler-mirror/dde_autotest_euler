/**
 
 * 用例 PMSID:1585817
 * 用例标题: 搜索跳转
 * 生成时间: 2026-06-08
 * 用例编写人: UT000211(陈依)
 */

describe('1585817-搜索跳转', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：关闭帮助手册
    await uos.showDesktop();
    await system.stopApp("帮助手册");
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1585817-搜索跳转', async ({ device, agent, uos }) => {
    // 步骤 1: 打开帮助手册，执行Ctrl+F,搜索框光标闪烁，在搜索框输入商店，点击出现的下拉框中的应用商店，预期软件会自动跳转到商店项目
    await uos.openApp("帮助手册");
    await agent.aiWaitFor("帮助手册界面已显示");
    await device.pressKey('Ctrl+F');
    await agent.aiWaitFor("搜索框已显示");
    await agent.aiAssert("搜索框光标闪烁");
    await device.typeText("商店");
    await agent.aiWaitFor("搜索下拉框已显示");1

    await agent.aiTap("下拉框中的应用商店选项");
    await agent.aiAssert("软件自动跳转到应用商店的帮助手册");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 2: 点击输入框后方的关闭，输入框中的商店字样被删除
    await agent.aiTap("搜索输入框后方的关闭按钮");
    await agent.aiAssert("输入框显示占位符搜索");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 3: 在搜索出来的项目中点击应用商店，软件会自动跳转到商店项目中
    await device.typeText("应用");
    await agent.aiWaitFor("搜索下拉框已显示");
    await agent.aiAssert("软件会自动显示所有包含应用的项目");
    await agent.aiTap("搜索出来的项目中的应用商店");
    await agent.aiAssert("软件自动跳转到应用商店的帮助手册");

  }, { timeout: 600000, tags: ['1585817', 'level1','smoke','DITT','chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 点击帮助手册右上角×，帮助手册关闭
    await agent.aiTap("帮助手册窗口右上角关闭按钮:X");
    await agent.aiWaitFor("帮助手册窗口已关闭");
  });

});
