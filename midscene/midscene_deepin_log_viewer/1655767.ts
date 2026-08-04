/**
 * 用例 PMSID: 1655767
 * 用例标题: 窗口可以最小化至dock栏
 * 生成时间: 2026-05-17
 * 用例编写人: UT006165（李日华）
 */

describe('1655767-窗口可以最小化至dock栏', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1655767-窗口可以最小化至dock栏', async ({ device, agent, uos, system }) => {
    // 步骤 1: 启动器打开日志收集工具
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具窗口打开");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 点击窗口右上角的"-"图标
    await agent.aiTap("最小化按钮");

    // 步骤 3: 日志收集工具界面被最小化，界面被隐藏
    await agent.aiWaitFor("窗口已最小化");
    await agent.aiAssert("日志收集工具窗口已最小化");

    // 步骤 4: 点击dock上的日志收集工具图标
    await agent.aiTap("Dock上的紫蓝色图标右下角有一个圆形小闹钟的日志收集工具图标");

    // 步骤 5: 日志收集工具界面被还原，界面重新展开
    await agent.aiWaitFor("窗口已还原");
    await agent.aiAssert("日志收集工具界面已还原");
    await agent.aiAssert("日志收集工具窗口重新展开");

  }, { timeout: 600000, tags: ['1655767', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
