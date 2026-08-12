/**
 * 用例 PMSID: 1806775
 * 用例标题:  日常操作-访问/sys/power目录_
 * 生成时间: 2025-12-17
 * 用例编写人: UT000054（叶飞）
 */

describe('1806775-日常操作-访问/sys/power目录_', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1806775-日常操作-访问/sys/power目录_', async ({ device, agent, uos, system }) => {

    console.log('访问系统目录');


    // 步骤1： 打开文管进入系统盘
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的计算机");
    await agent.aiWaitFor("文件管理器窗口右侧显示：磁盘列表信息,系统盘可见");
    await agent.aiDoubleClick("系统盘");
    await agent.aiWaitFor("sys文件夹可见");
    await agent.aiDoubleClick("sys");
    await agent.aiWaitFor("power文件夹可见");
    await agent.aiDoubleClick("power");
    await agent.aiWaitFor("窗口内容显示：disk 、suspend_stats等文件");
    await agent.aiAssert("disk、suspend_stats等文件存在");
 
  }, { timeout: 600000, tags: ["1806775", "level4", "permission", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec("killall dde-file-manager");
  });
});
