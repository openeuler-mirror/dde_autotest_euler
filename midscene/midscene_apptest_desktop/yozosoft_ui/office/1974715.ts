
/**
 * 用例 PMSID: 1974715
 * 用例标题: 【V25】【永中Office专业版】软件卸载
 * 生成时间: 2026-01-30 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('1974715-【V25】【永中Office专业版】软件卸载', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装永中Office软件
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.yozosoft.yozo-office.s1`;
    await system.exec(installCmd);
    await agent.aiWaitFor('桌面出现永中图标', {
      timeoutMs: 3000000, // 等待 3000 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    // 等待软件包完全安装完成 (dpkg状态为ii)
    for (let i = 0; i < 60; i++) {
      const pkgStatus = await agent.aiQuery('string[], the installation status of package com.yozosoft.yozo-office.s1');
      const isCompleted = await agent.aiBoolean(`check if the package "com.yozosoft.yozo-office.s1" is fully installed: ${pkgStatus}`);
      if (isCompleted) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  });

  test('1974715-【V25】【永中Office专业版】软件卸载', async ({ device, agent, uos }) => {
    await uos.openApp("应用商店");
    await agent.aiWaitFor("应用商店界面已显示应用管理", {
      timeoutMs: 300000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await agent.aiTap("应用管理");
    await agent.aiInput('永中Office','搜索框');
    await agent.aiTap("点击应用商店顶部搜索按钮")
    await agent.aiWaitFor("搜索结果出现永中Office应用", {
      timeoutMs: 3000000, // 等待 300 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await agent.aiTap("'永中Office'条目右侧第一个卸载按钮");
    await agent.aiWaitFor("'永中Office'条目右侧显示已卸载", {
      timeoutMs: 3000000, // 等待 3000 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
    await uos.closeCurrentWindow();
    await agent.aiAssert("桌面没有永中图标");
    await uos.openLauncher();
    await agent.aiInput('永中','搜索框');
    await agent.aiAssert("不存在永中应用图标");
  }, { timeout: 600000, tags: ['1974715', 'level1', 'smoke'] });
  
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system ,env }) => {
    console.log('5. afterAll: 清理测试套件');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.yozosoft.yozo-office.s1`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});
