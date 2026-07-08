/**
 * 用例 PMSID: 1805549
 * 用例标题: 在命令行查看文件管理器版本
 * 生成时间: 2026-01-22 15:00:00
 * 用例编写人: UT000159（游伟）
 */


describe('1805549-在命令行查看文件管理器版本_', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805549-在命令行查看文件管理器版本_dde-file-manager -v', async ({ device, agent, uos, system }) => {
    let cmd = "dde-file-manager -v";
    // 步骤 1: 在终端执行：dde-file-manager -v
    console.log(`步骤 1: 终端执行: ${cmd}`);
    let result = await system.exec(cmd);

    // 预期 1: dde-file-manager -v 执行成功
    console.log(`预期 1: ${cmd} 执行成功`);
    // await agent.aiAssert(`${result.success}等于true, 表示${cmd}执行成功`);
    assertTrue(result.success, `${cmd}执行失败`); // ${cmd}执行成功

    // 预期 2: dde-file-manager -v 执行结果中包含版本号
    console.log(`预期 2: ${cmd} 执行结果中包含版本号`);
    await agent.aiAssert(`${result.stdout.trim()}中包含X.Y.Z格式的版本号`);

  }, { timeout: 600000, tags: ['1805549', 'level3', 'command', 'DITT', 'youwei', 'version', 'file manager', 'dde-file-manager -v'] });

  test('1805549-命令行新建文件管理器窗口_dde-file-manager --version', async ({ device, agent, env, uos, system }) => {
    let cmd = "dde-file-manager --version";
    // 步骤 1: 在终端执行：dde-file-manager --version
    console.log(`步骤 1: 终端执行: ${cmd}`);
    let result =await system.exec(cmd);

    // 预期 1: dde-file-manager --version 执行成功
    console.log(`预期 1: ${cmd} 执行成功`);
    // await agent.aiAssert(`${result.success}等于true, 表示${cmd}执行成功`);
    assertTrue(result.success, `${cmd}执行失败`); // ${cmd}执行成功

    // 预期 2: dde-file-manager --version 执行结果中包含版本号
    console.log(`预期 2: ${cmd} 执行结果中包含版本号`);
    await agent.aiAssert(`${result.stdout.trim()}中包含X.Y.Z格式的版本号`);

  }, { timeout: 600000, tags: ['1805549', 'level3', 'command', 'DITT', 'youwei', 'version', 'file manager', 'dde-file-manager --version'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
