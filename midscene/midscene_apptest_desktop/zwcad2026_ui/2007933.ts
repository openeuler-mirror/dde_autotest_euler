/**
 * 用例 PMSID: 2007933
 * 用例标题: 【V25】【中望CAD 2026】打开注释菜单
 * 生成时间: 2026-06-01 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('2007933-【V25】【中望CAD 2026】打开注释菜单', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装中望CAD 2026软件
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.zwsoft.zwcad2026`;
    await system.exec(installCmd);
    try {
      await agent.aiWaitFor('出现"安装成功"网页', {
        timeoutMs: 600000, // 等待 600 秒
        checkIntervalMs: 5000, // 每 5 秒检查一次
      });
      await device.pressKey("alt","F4");
      console.log('成功处理安装网页');
    } catch (e) {
      console.log('未检测到安装网页');
    }
    await agent.aiWaitFor('桌面出现中望CAD2026图标', {
      timeoutMs: 180000,
      checkIntervalMs: 3000,
    });
  });

  test('2007933-【V25】【中望CAD 2026】打开注释菜单', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('中望CAD');
    await device.pressKey('Enter');
    try {
      await agent.aiWaitFor('出现"用户授权协议"对话框', {
        timeoutMs: 60000, // 等待 60 秒
        checkIntervalMs: 5000, // 每 5 秒检查一次
      });
      await agent.aiTap('已阅读并同意前的方框');
      await agent.aiTap('对话框的确定按钮')
      console.log('成功处理许可弹窗');
    } catch (e) {
      console.log('未检测到许可弹窗');
    }
    try {
      await agent.aiWaitFor('出现"免费试用"对话框', {
        timeoutMs: 60000, // 等待 60 秒
        checkIntervalMs: 5000, // 每 5 秒检查一次
      });
      await agent.aiTap('对话框的试用按钮')
      console.log('成功处理试用弹窗');
    } catch (e) {
      console.log('未检测到试用弹窗');
    }
    await agent.aiWaitFor('界面出现常用菜单');
    await agent.aiAssert("界面存在'中望CAD2026'");
    await agent.aiTap('注释菜单');
    await agent.aiAssert("界面存在'标注、线性'选项");
    await uos.closeCurrentWindow();
    await device.pressKey("alt","F4");
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['2007933', 'level2'] });

  afterEach(async ({ uos, agent, device, system, env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.zwsoft.zwcad2026`;
    await system.exec(uninstallCmd);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
