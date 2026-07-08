/**
 * 用例 PMSID: 1805545
 * 用例标题: 在命令行查看文件管理器版本
 * 生成时间: 2026-01-22 15:00:00
 * 用例编写人: UT000159（游伟）
 */


describe('1805545-[078]命令行启动', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805545-[078]命令行启动', async ({ device, agent, uos, system }) => {
    let cmd = "dde-file-manager";
    // 步骤 1: 在终端执行：dde-file-manager
    console.log(`步骤 1: 终端执行: ${cmd}`);
    await system.exec(cmd);

    // 预期 1-1: 文件管理器窗口出现
    console.log(`预期 1-1: 文件管理器窗口出现`);
    await agent.aiWaitFor('文件管理器窗口出现');

    // 预期 1-2: 有文件管理器进程
    console.log(`预期 1-2: 有文件管理器进程`);
    let result = await system.exec("ps -ef | grep -v grep | grep -v daemon | grep dde-file-manager");
    // await agent.aiAssert(`${result.success}等于true, 表示有文件管理器进程`);
    assertTrue(result.success, `${cmd}执行失败`); // ${cmd}执行成功

    // 步骤 2: 关闭文件管理器
    console.log(`步骤 2: 关闭文件管理器`);
    await agent.aiTap('文件管理器窗口右上角的关闭按钮X');
    await agent.aiWaitFor('文件管理器窗口消失');

    // 预期 2: 仍有文件管理器进程
    console.log(`预期 2: 仍有文件管理器进程`);
    result = await system.exec('ps -ef | grep -v grep | grep -v daemon | grep "dde-file-manager -d"');
    // await agent.aiAssert(`${result.success}等于true, 表示有dde-file-manager -d进程`);
    assertTrue(result.success, `${cmd}执行失败, 没有dde-file-manager -d进程`); // ${cmd}执行成功

  }, { timeout: 600000, tags: ['1805545', 'level3', 'command', 'DITT', 'youwei', 'open', 'file manager', 'dde-file-manager'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭文件管理器文件夹属性窗口
    await system.exec('killall -15 dde-file-manager');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
