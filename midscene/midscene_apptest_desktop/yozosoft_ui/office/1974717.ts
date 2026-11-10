
/**
 * 用例 PMSID: 1974717
 * 用例标题: 【V25】【永中Office专业版】软件安装
 * 生成时间: 2026-01-30 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('1974717-【V25】【永中Office专业版】软件安装', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化卸载永中Office软件
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.yozosoft.yozo-office.s1`;
    await system.exec(uninstallCmd);
  });

  test('1974717-【V25】【永中Office专业版】软件安装', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示", {
      timeoutMs: 3000000, // 等待 3000 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await agent.aiInput('永中Office专业版','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮")
    await agent.aiWaitFor("搜索结果包含永中Office应用", {
      timeoutMs: 180000, // 等待 180 秒
      checkIntervalMs: 3000, // 每 3 秒检查一次
    });
    await agent.aiTap("永中Office专业版条目右侧第一个安装按钮");
    await agent.aiWaitFor('永中Office条目右侧，应用内付费上的的打开按钮已显示', {
      timeoutMs: 1800000, // 等待 1800 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    await agent.aiAssert("桌面出现永中图标");
  }, { timeout: 1000000, tags: ['1974717', 'level1', 'smoke'] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env }) => {
    console.log('5. afterAll: 清理测试套件');  
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.yozosoft.yozo-office.s1`;
    await system.exec(uninstallCmd);
  });
});
