/**
 * 用例 PMSID: 1805551
 * 用例标题: 命令行新建文件管理器窗口
 * 生成时间: 2026-01-22 15:00:00
 * 用例编写人: UT000159（游伟）
 */


describe('1805551-命令行新建文件管理器窗口', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805551-命令行新建文件管理器窗口_dde-file-manager -n', async ({ device, agent, uos, system }) => {
    let cmd = "dde-file-manager -n";
    // 步骤 1: 在终端执行：dde-file-manager -n
    console.log(`步骤 1: ${cmd}`);
    await system.exec(cmd);

    // 预期 1: 文件管理器窗口出现
    console.log(`预期 1: 文件管理器窗口出现`);
    await agent.aiWaitFor('文件管理器窗口出现',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 预期 2: 有文件管理器进程
    console.log(`预期 2: 有文件管理器进程`);
    let result = await system.exec("ps -ef | grep -v grep | grep -v daemon | grep dde-file-manager");
    // await agent.aiAssert(`${result.success}等于true, 表示有文件管理器进程`);
    assertTrue(result.success, `${cmd}执行失败`); // ${cmd}执行成功

  }, { timeout: 600000, tags: ['1805551', 'level3', 'command', 'DITT', 'youwei', 'new window', 'file manager', 'dde-file-manager -n'] });

  test('1805551-命令行新建文件管理器窗口_dde-file-manager --new-window', async ({ device, agent, env, uos, system }) => {
    let cmd = "dde-file-manager --new-window";
    // 步骤 1: 在终端执行：dde-file-manager --new-window
    console.log(`步骤 1: 终端执行: ${cmd}`);
    await system.exec(cmd);

    // 预期 1: 文件管理器窗口出现
    console.log(`预期 1: 文件管理器窗口出现`);
    await agent.aiWaitFor('文件管理器窗口出现',
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

    // 预期 2: 有文件管理器进程
    console.log(`预期 2: 有文件管理器进程`);
    let result = await system.exec("ps -ef | grep -v grep | grep -v daemon | grep dde-file-manager");
    // await agent.aiAssert(`${result.success}等于true, 表示有文件管理器进程`);
    assertTrue(result.success, `${cmd}执行失败, 没有文件管理器进程`); // ${cmd}执行成功

  }, { timeout: 600000, tags: ['1805551', 'level3', 'command', 'DITT', 'youwei', 'new window', 'file manager', 'dde-file-manager --new-window'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭文件管理器文件夹属性窗口
    let result = await system.exec('killall -15 dde-file-manager');
    if (!result.success) {
      console.log('命令行关闭文件管理器文件夹属性窗口失败');
      console.log('使用热键关闭文件管理器文件夹属性窗口');
      await device.pressKey('LeftAlt', 'F4');
    }
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
