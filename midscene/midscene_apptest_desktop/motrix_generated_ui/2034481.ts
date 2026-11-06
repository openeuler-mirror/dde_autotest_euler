/**
 * 用例 PMSID: 2034481
 * 用例标题: 【V25】【deb】【Motrix-下载工具】添加任务功能
 * 生成时间: 2026-09-10 10:00:00
 * 用例编写人：UT003531(钱程)
 */

describe('2034481- 【V25】【deb】【Motrix-下载工具】添加任务功能', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 准备测试环境');
    await uos.showDesktop();
    // 关闭残留的 Motrix 进程，避免偏好设置窗口残留导致主界面判断失败
    await system.exec(`pkill -f '/opt/apps/app.motrix' || true`);
    // 确保应用已安装
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y app.motrix`;
    await system.exec(installCmd);
  });

  test('2034481- 【V25】【deb】【Motrix-下载工具】添加任务功能', async ({ device, agent, uos, system, env }) => {
    await uos.openLauncher();

    await uos.searchInLauncher('Motrix');

    await device.pressKey('Enter');
    await agent.aiWaitFor('Motrix主界面已显示', {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });
    await agent.aiAssert("界面存在'任务列表'");

    await agent.aiTap("'+'按钮");
    await agent.aiWaitFor("弹出对话框，包含'链接任务'字段", {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await device.pressKey('Escape');
    await agent.aiWaitFor('添加任务对话框已关闭，链接任务和种子任务选项卡已消失', {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['2034481', 'level3', 'smoke'] });

  afterEach(async ({ uos, agent, device }) => {
    console.log('4. afterEach: 清理环境');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y app.motrix`;
    await system.exec(uninstallCmd);
    await uos.showDesktop();
  });
});
