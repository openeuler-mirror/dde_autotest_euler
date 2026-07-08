/**
 * 用例 PMSID: 1805547
 * 用例标题: 在命令行查看文件管理器帮助信息
 * 生成时间: 2026-01-22 15:00:00
 * 用例编写人: UT000159（游伟）
 */


describe('1805547-在命令行查看文件管理器帮助信息_', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805547-在命令行查看文件管理器帮助信息_dde-file-manager -h', async ({ device, agent, uos, system }) => {
    let cmd = "dde-file-manager -h";
    // 步骤 1: 在终端执行：dde-file-manager -h
    console.log(`步骤 1: 终端执行: ${cmd}`);
    let result = await system.exec(cmd);

    // 预期 1: dde-file-manager -h 执行成功
    console.log(`预期 1: ${cmd} 执行成功`);
    // await agent.aiAssert(`${result.success}等于true, 表示${cmd}执行成功`);
    assertTrue(result.success, `${cmd}执行失败`); // ${cmd}执行成功

    // 预期 2: dde-file-manager -h 执行结果中包含帮助信息
    console.log(`预期 2: ${cmd} 执行结果中包含帮助信息`);
    // await agent.aiAssert(`${result.stdout.trim()}中包含多行"-x(,--xxx) 描述"格式的帮助信息`);
    await agent.aiWaitFor(`${result.stdout.trim()}中包含多行"-x(,--xxx) 描述"格式的帮助信息`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行aiWaitFor通过, 断言通过

  }, { timeout: 600000, tags: ['1805547', 'level3', 'command', 'DITT', 'youwei', 'help', 'file manager', 'dde-file-manager -h'] });

  test('1805547-在命令行查看文件管理器帮助信息__dde-file-manager --help', async ({ device, agent, env, uos, system }) => {
    let cmd = "dde-file-manager --help";
    // 步骤 1: 在终端执行：dde-file-manager --help
    console.log(`步骤 1: 终端执行: ${cmd}`);
    let result =await system.exec(cmd);

    // 预期 1: dde-file-manager --help 执行成功
    console.log(`预期 1: ${cmd} 执行成功`);
    // await agent.aiAssert(`${result.success}等于true, 表示${cmd}执行成功`);
    assertTrue(result.success, `${cmd}执行失败`); // ${cmd}执行成功

    // 预期 2: dde-file-manager --help 执行结果中包含帮助信息
    console.log(`预期 2: ${cmd} 执行结果中包含帮助信息`);
    await agent.aiAssert(`${result.stdout.trim()}中包含多行"-x(,--xxx) 描述"格式的帮助信息`);
    await agent.aiWaitFor(`${result.stdout.trim()}中包含多行"-x(,--xxx) 描述"格式的帮助信息`,
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    assertTrue(true); // 上一行aiWaitFor通过, 断言通过

  }, { timeout: 600000, tags: ['1805547', 'level3', 'command', 'DITT', 'youwei', 'help', 'file manager', 'dde-file-manager --help'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
