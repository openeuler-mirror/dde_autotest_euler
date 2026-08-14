/**
 
 * 用例 PMSID:1585805
 * 用例标题: 搜索结果显示
 * 生成时间: 2026-06-08
 * 用例编写人: UT000211(陈依)
 */

describe('1585805-搜索结果显示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：关闭帮助手册和终端
    await uos.showDesktop();
    await system.process.kill('dman');
    await system.process.kill('deepin-terminal');
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1585805-搜索结果显示', async ({ device, agent, uos }) => {
    // 步骤 1: 打开帮助手册，执行Ctrl+F,搜索框光标闪烁，在搜索框输入应用，快捷键Enter
    // 预期: 软件会自动搜索关键字：应用，并在搜索结果中显示，会显示项目标题和正文详细内容显示
    await uos.openApp("帮助手册");
    await agent.aiWaitFor("帮助手册界面已显示");
    await device.pressKey('Ctrl+F');
    await agent.aiWaitFor("搜索框已显示，光标在搜索框中闪烁");
    await device.typeText('应用');
    await device.pressKey('Enter');
    await agent.aiWaitFor("搜索结果页面已显示");
    await agent.aiAssert("会显示项目标题和正文详细内容显示");

    // 步骤 2: 在搜索结果中，点击项目标题
    // 预期: 软件会自动跳转到该项目的帮助文档
    await agent.aiTap("搜索结果中的项目标题");
    await agent.aiWaitFor("帮助文档内容页面已显示");
    await agent.aiAssert("已跳转到对应项目的帮助文档页面");

    // 步骤 3: 点击左上角返回按钮
    // 预期: 返回到上一页
    await agent.aiTap("左上角返回按钮");
    await agent.aiAssert("页面已返回到搜索结果页面");

    // 步骤 4: 在搜索结果中，点击正文内容
    // 预期: 软件会自动跳转到该项目中，并内容显示在关键字的地方，滚动条显示正常，不会出现在正文中
    await agent.aiTap("搜索结果中的输入法正文内容");
    await agent.aiWaitFor("帮助文档内容页面已显示");
    await agent.aiAssert("已跳转到对应项目的帮助文档页面");
    await agent.aiAssert("页面内容显示输入法的相关内容");
    await agent.aiScroll('当前页面', { direction: 'down', distance: 15 });
    await agent.aiAssert("帮助手册界面显示正常");

  }, { timeout: 600000, tags: ['1585805', 'level1','smoke','DITT','chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 点击帮助手册和终端右上角×，帮助手册和终端都关闭
    await agent.aiTap("帮助手册窗口右上角关闭按钮:X");
    await agent.aiWaitFor("帮助手册窗口已关闭");
  });

});
