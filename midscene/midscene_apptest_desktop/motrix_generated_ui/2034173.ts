/**
 * 用例 PMSID: 2034173
 * 用例标题: 【V25】【deb】【Motrix-下载工具】软件下载安装
 * 生成时间: 2026-09-10 10:00:00
 * 用例编写人：UT003531(钱程)
 */

describe('2034173- 【V25】【deb】【Motrix-下载工具】软件下载安装', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent }) => {
    console.log('2. beforeEach: 准备测试环境');
    await uos.showDesktop();
  });

  test('2034173- 【V25】【deb】【Motrix-下载工具】软件下载安装', async ({ device, agent, uos, system, env }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示", {
      timeoutMs: 300000,
      checkIntervalMs: 5000,
    });

    await agent.aiInput('Motrix-下载工具','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮");
    await agent.aiWaitFor("搜索结果已显示", {
      timeoutMs: 60000,
      checkIntervalMs: 3000,
    });

    await agent.aiTap("Motrix-下载工具条目右侧第一个安装按钮");
    await agent.aiWaitFor("Motrix-下载工具条目右侧的打开按钮已显示", {
      timeoutMs: 600000,
      checkIntervalMs: 5000,
    });
  }, { timeout: 1200000, tags: ['2034173', 'level3', 'smoke'] });

  afterEach(async ({ uos, agent, device }) => {
    console.log('4. afterEach: 清理环境');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
