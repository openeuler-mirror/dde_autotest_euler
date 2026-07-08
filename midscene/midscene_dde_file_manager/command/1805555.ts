/**
 * 用例 PMSID: 1805555
 * 用例标题: 使用命令打开 root 模式文件管理器
 * 生成时间: 2026-01-22 15:00:00
 * 用例编写人: UT000159（游伟）
 */


describe('1805555-使用命令打开 root 模式文件管理器', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805555-使用命令打开 root 模式文件管理器_dde-file-manager -r', async ({ device, agent, env, uos, system }) => {
    let cmd = "dde-file-manager -r";
    // 步骤 1: 在终端执行：dde-file-manager -r
    console.log(`步骤 1: ${cmd}`);
    await system.exec(cmd);

    // 预期 1: 弹出管理员认证对话框
    console.log(`预期 1: 弹出管理员认证对话框`);
    await agent.aiWaitFor('弹出以管理员身份打开需要认证对话框');

    // 步骤 2: 在对话框中输入密码, 并点击确定
    console.log(`步骤 2: 在对话框中输入密码`);
    // await agent.aiAssert('请输入密码框被选中');
    // await agent.aiTap('请输入密码');
    // await agent.aiWaitFor('请输入密码框被选中');
    let result = await system.exec("ps aux | grep -v grep | grep polkit-agent-helper | awk '{print $2}'");
    if (result.success) {
      await device.typeText(env.testPassword);
      // await agent.aiInput('密码输入框', env.TEST_PASSWORD);
      await agent.aiWaitFor('确定按钮可以使用')
      await agent.aiTap('确定');
    }

    // 预期 2: root 模式文件管理器窗口出现
    console.log(`预期 2: root 模式文件管理器窗口出现`);
    await agent.aiWaitFor('文件管理器窗口出现');

    // 预期 3: 有文件管理器进程
    console.log(`预期 3: 有文件管理器进程`);
    result = await system.exec("ps -ef | grep -v grep | grep -v daemon | grep dde-file-manager");
    // await agent.aiAssert(`${result.success}等于true, 表示有文件管理器进程`);
    assertTrue(result.success, `${cmd}执行失败, 没有文件管理器进程`); // ${cmd}执行成功

  }, { timeout: 600000, tags: ['1805555', 'level3', 'command', 'DITT', 'youwei', 'root mode', 'file manager', 'dde-file-manager -r'] });

  test('1805555-使用命令打开 root 模式文件管理器_dde-file-manager --root', async ({ device, agent, env, uos, system }) => {
    let cmd = "dde-file-manager --root";
    // 步骤 1: 在终端执行：dde-file-manager --root
    console.log(`步骤 1: 终端执行: ${cmd}`);
    await system.exec(cmd);

    // 预期 1: 弹出管理员认证对话框
    console.log(`预期 1: 弹出管理员认证对话框`);
    await agent.aiWaitFor('弹出以管理员身份打开需要认证对话框');

    // 步骤 2: 在对话框中输入密码, 并点击确定
    console.log(`步骤 2: 如果有管理密码对话框, 在对话框中输入密码`);
    // await agent.aiAssert('请输入密码框被选中');
    // await agent.aiTap('请输入密码');
    // await agent.aiWaitFor('请输入密码框被选中');
    let result = await system.exec("ps aux | grep -v grep | grep polkit-agent-helper | awk '{print $2}'");
    if (result.success) {
      await device.typeText(env.testPassword);
      // await agent.aiInput('密码输入框', env.TEST_PASSWORD);
      await agent.aiWaitFor('确定按钮可以使用')
      await agent.aiTap('确定');
    }
    

    // 预期 2: root 模式文件管理器窗口出现
    console.log(`预期 2: root 模式文件管理器窗口出现`);
    await agent.aiWaitFor('文件管理器窗口出现');

    // 预期 3: 有文件管理器进程
    console.log(`预期 3: 有文件管理器进程`);
    result = await system.exec("ps -ef | grep -v grep | grep -v daemon | grep dde-file-manager");
    // await agent.aiAssert(`${result.success}等于true`);
    assertTrue(result.success, `${cmd}执行失败, 没有文件管理器进程`); // ${cmd}执行成功

  }, { timeout: 600000, tags: ['1805555', 'level3', 'command', 'DITT', 'youwei', 'root mode', 'file manager', 'dde-file-manager --root'] });

  afterEach(async ({ device, agent, env, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭可能的管理密码对话框
    let result = await system.exec("ps aux | grep -v grep | grep polkit-agent-helper | awk '{print $2}'");
    if (!result.success) {
      console.log('关闭管理密码对话框');
      await agent.aiTap('管理密码对话框的取消按钮');
      await agent.aiWaitFor('管理密码对话框已关闭');
    } else {
      console.log('管理密码对话框已关闭');
    }

    // 关闭文件管理器文件夹属性窗口
    result = await system.exec(`echo ${env.testPassword} | sudo -S killall -15 dde-file-manager`);
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
