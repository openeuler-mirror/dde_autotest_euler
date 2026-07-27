/**
 * 用例 PMSID: 1805993
 * 用例标题: [039]系统盘-空白处右键在终端中打开
 * 生成时间: 2025-12-25 16:34:20
 * 用例编写人: UT000244（李庆玲）
 */

describe('1805993-[039]系统盘-空白处右键在终端中打开', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');

    //恢复文件管理器设置
    await system.cleanupFileManager();
  });

  test('1805993-[039]系统盘-空白处右键在终端中打开', async ({ device, agent, uos, system }) => {
    // 步骤一：打开文件管理器
    await uos.openApp('文件管理器');

    // 步骤二：进入系统盘目录，在终端中打开
    await agent.aiDoubleClick('系统盘');
    await agent.aiRightClick('文件列表空白区域');
    await agent.aiTap('在终端中打开');

    // 步骤三：断言终端中显示/路径
    await agent.aiAssert('终端窗口已打开');
    await device.typeText('pwd');
    await device.pressKey("Enter");
    await agent.aiAssert('终端中显示/');

  }, { timeout: 1800000, tags: ["1805993", "level3", "computer", "liqingling"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    
    // 关闭所有文管窗口
    await system.exec('killall dde-file-manager');

    // 关闭所有终端窗口
    await system.exec('killall deepin-terminal');
    //恢复文件管理器设置
    await system.cleanupFileManager(); 
  });
});
