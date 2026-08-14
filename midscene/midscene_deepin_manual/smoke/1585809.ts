/**
 
 * 用例 PMSID:1585809
 * 用例标题: 关键字高亮
 * 生成时间: 2026-06-08
 * 用例编写人: UT000211(陈依)
 */

describe('1585809-关键字高亮', () => {
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

  test('1585809-关键字高亮', async ({ device, agent, uos }) => {
    // 步骤 1: 打开帮助手册，执行Ctrl+F,搜索框光标闪烁，在搜索框输入应用商店，点击出现的下拉框中的第一行内容，展示应用商店的帮助手册，应用商店字样高亮显示，且从正文第一行开始展示
    await uos.openApp("帮助手册");
    await agent.aiWaitFor("帮助手册界面已显示");
    await device.pressKey('Ctrl+F');
    await agent.aiWaitFor("搜索框已显示");
    await agent.aiAssert("搜索框光标闪烁");
    await device.typeText("应用商店");
    await agent.aiWaitFor("搜索下拉框已显示");
    await agent.aiTap("下拉框中的第一行内容");
    await agent.aiAssert("展示应用商店的帮助手册");
    await agent.aiAssert("应用商店字样高亮显示");
    await agent.aiAssert("从正文第一行开始展示");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 2: 点击搜索输入框，光标在搜索输入框闪烁
    await agent.aiTap("搜索输入框");
    await agent.aiAssert("光标在搜索输入框闪烁");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 3: 快捷键Enter,预期跳转含有应用商店的正文，且应用商店字样高亮显示
    await device.pressKey('Enter');
    await agent.aiAssert("跳转含有应用商店的正文");
    await agent.aiAssert("应用商店字样高亮显示");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 4: 点击搜索结果出现的第一个应用商店，跳转到对应的项目
    await agent.aiTap("搜索结果出现的第一个应用商店");
    await agent.aiAssert("跳转到对应的项目");

  }, { timeout: 600000, tags: ['1585809', 'level1','smoke','DITT','chenyi'] });

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
