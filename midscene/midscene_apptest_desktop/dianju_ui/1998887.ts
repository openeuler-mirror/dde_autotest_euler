
/**
 * 用例 PMSID: 1998887
 * 用例标题: 【V25】【点聚OFD版式软件_deb】工具菜单
 * 生成时间: 2026-04-29 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('1998887-【V25】【点聚OFD版式软件_deb】工具菜单', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件'); 
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装点聚OFD软件
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y cn.dianju.ofdreader`;
    await system.exec(installCmd);
  });

  test('1998887-【V25】【点聚OFD版式软件_deb】工具菜单', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('点聚');
    await device.pressKey('Enter');
    try {
      await agent.aiWaitFor('出现"欢迎使用点聚OFD"对话框', {
        timeoutMs: 60000, // 等待 60 秒
        checkIntervalMs: 3000, // 每 3 秒检查一次
      });
      await agent.aiTap('弹窗的关闭按钮');
      console.log('成功处理试用弹窗');
    } catch (e) {
      console.log('未检测到试用弹窗');
    }
    await agent.aiWaitFor('界面出现编辑按钮');
    await agent.aiAssert("界面存在'点聚OFD版式软件");
    await agent.aiTap('工具菜单');
    await agent.aiWaitFor('界面出现下拉菜单');
    await agent.aiAssert("界面存在'水印工具'选项");
    await agent.aiTap('屏幕中间空白处');
    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['1998887', 'level2'] });

  afterEach(async ({ uos, agent, device, system ,env }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y cn.dianju.ofdreader`;
    await system.exec(uninstallCmd);
  });
});
