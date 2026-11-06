/**
 * 用例 PMSID: 2008051
 * 用例标题: 【V25】【浩辰CAD 2027】打开网格菜单
 * 生成时间: 2026-06-01 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('2008051-【V25】【浩辰CAD 2027】打开网格菜单', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装浩辰CAD 2027软件
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.gstarsoft.gstarcad2027`;
    await system.exec(installCmd);
  });

  test('2008051-【V25】【浩辰CAD 2027】打开网格菜单', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('浩辰CAD');
    await agent.aiWaitFor('出现"浩辰CAD 2027"图标', {
      timeoutMs: 180000, // 等待 180 秒
      checkIntervalMs: 3000, // 每 3 秒检查一次
    });
    await agent.aiTap('"浩辰CAD 2027"图标');
    try {
      await agent.aiWaitFor('出现"感谢您选择浩辰CAD"对话框', {
        timeoutMs: 120000, // 等待 120 秒
        checkIntervalMs: 5000, // 每 5 秒检查一次
      });
      await agent.aiTap('弹窗的同意按钮');
      console.log('成功处理试用弹窗');
    } catch (e) {
      console.log('未检测到试用弹窗');
    }
    await agent.aiWaitFor('界面出现常用图标');
    await agent.aiAssert("界面存在'浩辰CAD2027'");
    await agent.aiTap('网格菜单');
    await agent.aiAssert("界面存在'截面平面'选项");
    await uos.closeCurrentWindow();
    await device.pressKey("alt","F4");
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['2008051', 'level2'] });

  afterEach(async ({ device, system, env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt","F4");
  });

  afterAll(async ({ device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.gstarsoft.gstarcad2027`;
    await system.exec(uninstallCmd);
  });
});
