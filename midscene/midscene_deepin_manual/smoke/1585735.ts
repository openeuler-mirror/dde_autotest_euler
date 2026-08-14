/**
 
 * 用例 PMSID:1585735
 * 用例标题: 正文导航栏交互优化
 * 生成时间: 2026-06-08
 * 用例编写人: UT000211(陈依)
 */

describe('1585735-正文导航栏交互优化', () => {
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

  test('1585735-正文导航栏交互优化', async ({ device, agent, uos }) => {
    // 步骤 1: 打开帮助手册，点击了解基本操作
    // 预期: 进入帮助手册内
    await uos.openApp("帮助手册");
    await agent.aiWaitFor("帮助手册界面已显示");
    await agent.aiTap("了解基本操作");
    await agent.aiWaitFor("帮助手册内容页面已显示");
    await agent.aiAssert("已进入帮助手册内容页面");

    // 步骤 2: 鼠标放置在左侧导航栏上
    // 预期: 左侧导航栏鼠标移上去有hover效果
    await agent.aiHover("左侧导航栏");
    await agent.aiAssert("左侧导航栏显示hover效果");

  }, { timeout: 1200000, tags: ['1585735', 'level1','smoke','DITT','chenyi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 点击帮助手册和终端右上角×，帮助手册和终端都关闭
    await agent.aiTap("帮助手册窗口右上角关闭按钮:X");
    await agent.aiWaitFor("帮助手册窗口已关闭");
    await agent.aiTap("终端窗口右上角关闭按钮:X");
    await agent.aiWaitFor("终端窗口已关闭");
  });

});
