
/**
 * 用例 PMSID: 1963251
 * 用例标题: 【Vim-文本编辑器】软件下载安装测试
 * 生成时间: 2025-12-18 13:33:48
 * 用例编写人：UT000181（刘亚菲）
 */

describe('1963251-【Vim-文本编辑器】软件下载安装测试', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 初始化卸载 Vim 文本编辑器（玲珑包），确保应用商店显示"安装"按钮
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall org.vim`;
    await system.exec(uninstallCmd);
  });

  test('1963251-【Vim-文本编辑器】软件下载安装测试', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示");
    await agent.aiAssert("应用商店已打开");
    await agent.aiInput('vim','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮")
    await agent.aiAssert("搜索结果包含Vim应用");
    await agent.aiTap("点击Vim-文本编辑器应用条目右侧的安装按钮");
    await agent.aiWaitFor('Vim-文本编辑器应用条目右侧的打开按钮已显示', {
      timeoutMs: 200000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
  }, { timeout: 600000, tags: ['1963251', 'level1'] });
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env}) => {
    console.log('5. afterAll: 清理测试套件');  
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S ll-cli uninstall org.vim`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});