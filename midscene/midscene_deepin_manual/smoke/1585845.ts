/**
 
 * 用例 PMSID:1585845
 * 用例标题: 终端
 * 生成时间: 2026-06-08
 * 用例编写人: UT000211(陈依)
 */

describe('1585845-终端', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 环境清理：关闭帮助手册、终端
    await uos.showDesktop();
    await system.stopApp("帮助手册");
    await system.stopApp("终端");
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1585845-终端', async ({ device, agent, uos }) => {
    // 步骤 1: 打开终端，使用快捷键F1，系统会直接打开帮助手册，并直接进入到终端项目
    await uos.openApp("终端");
    await agent.aiWaitFor("终端界面已显示");
    await device.pressKey('F1');
    await agent.aiWaitFor("帮助手册已启动");
    await agent.aiAssert("帮助手册位于屏幕中央");
    await agent.aiAssert("帮助手册直接进入到终端项目");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 2: 点击帮助手册右上角×，预期帮助手册关闭
    await agent.aiTap("帮助手册窗口右上角关闭按钮:X");
    await agent.aiWaitFor("帮助手册窗口已关闭");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 3: 点击终端右上角三条横线，点击帮助，预期系统会直接打开帮助手册，并直接进入到终端项目
    await agent.aiTap("终端窗口右上角三条横线菜单按钮");
    await agent.aiWaitFor("终端菜单已展开");
    await agent.aiTap("帮助菜单项");
    await agent.aiWaitFor("帮助手册已启动");
    await agent.aiAssert("帮助手册位于屏幕中央");
    await agent.aiAssert("帮助手册直接进入到终端项目");

  }, { timeout: 600000, tags: ['1585845', 'level1','smoke','DITT','chenyi'] });

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
