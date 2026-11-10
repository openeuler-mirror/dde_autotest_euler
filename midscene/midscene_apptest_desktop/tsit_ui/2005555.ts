/**

 * 用例 PMSID: 2005555
 * 用例标题: 【V25】【泰山办公_玲珑】【PDF】打开注释菜单
 * 生成时间: 2026-05-27
 * 用例编写人：UT003531(钱程)
 */

describe('2005555-【V25】【泰山办公_玲珑】【PDF】打开注释菜单', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件'); 
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装泰山办公软件
    const installCmd = `echo '${env.testPassword}' | sudo -S ll-cli install cn.ts-it.suite`;
    await system.exec(installCmd);
  });

  test('2005555-【V25】【泰山办公_玲珑】【PDF】打开注释菜单', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('泰山办公');
    await agent.aiWaitFor("搜索结果出现'泰山办公'应用", {
      timeoutMs: 300000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await device.pressKey('Enter');
    try {
      await agent.aiWaitFor('出现"欢迎使用泰山办公"对话框', {
        timeoutMs: 120000, // 等待 120 秒
        checkIntervalMs: 5000, // 每 5 秒检查一次
      });
      await agent.aiTap('弹窗的关闭按钮');
      console.log('成功处理试用弹窗');
    } catch (e) {
      console.log('未检测到试用弹窗');
    }
    await agent.aiWaitFor('界面出现新建按钮');
    await agent.aiAssert("界面存在'泰山办公");
    await agent.aiTap('新建');
    await agent.aiWaitFor('打开新建界面，存在"文字、表格、放映"');
    await agent.aiTap('PDF', { deepThink:true });
    await agent.aiWaitFor('界面存在"新建空白PDF"');
    await agent.aiTap('新建空白PDF');
    await agent.aiWaitFor('新建空白PDF被打开');
    await agent.aiAssert('界面存在"注释"按钮');
    await agent.aiTap('注释');
    await agent.aiAssert('注释菜单被打开，界面存在"高亮、下划线"');
    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['2005555', 'level2', 'smoke'] });

  afterEach(async ({ uos, agent, device, system ,env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall cn.ts-it.suite`;
    await system.exec(uninstallCmd);
  });
});
