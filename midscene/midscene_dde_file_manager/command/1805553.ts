/**
 * 用例 PMSID: 1805553
 * 用例标题: dde-file-manager -d 无窗口显示
 * 生成时间: 2026-01-22 15:00:00
 * 用例编写人: UT000159（游伟）
 */


describe('1805553-dde-file-manager -d 无窗口显示', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805553-dde-file-manager -d 无窗口显示', async ({ device, agent, uos, system }) => {
    let cmd = "dde-file-manager -d";
    // 步骤 1: 在终端执行：dde-file-manager -d
    console.log(`步骤 1: ${cmd}`);
    await system.exec(cmd);

    // 预期 1: 有文件管理器进程
    console.log(`预期 1: 有文件管理器进程`);
    let result = await system.exec("ps -ef | grep -v grep | grep -v daemon | grep dde-file-manager");
    // if (!result.success) {
    //   throw new Error('没有文件管理器进程');
    // } else {
    //   console.log('有文件管理器进程');
    // }
    // await agent.aiAssert(`${result.success}等于true, 表示有文件管理器进程`);
    assertTrue(result.success, `${cmd}执行失败, 没有文件管理器进程`); // ${cmd}执行成功

  }, { timeout: 600000, tags: ['1805553', 'level3', 'command', 'DITT', 'youwei', 'no-window', 'file manager', 'dde-file-manager -d'] });

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
