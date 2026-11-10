
/**
 * 用例 PMSID: 1974727
 * 用例标题: 【V25】【永中Office版式阅读】软件打开、关闭
 * 生成时间: 2026-01-30 14:28:54
 * 用例编写人：UT003531(钱程)
 */

describe('1974727-【V25】【永中Office版式阅读】软件打开、关闭', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, uos, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
    // 初始化安装永中Office软件
    const installCmd = `echo '${env.testPassword}' | sudo -S apt update && echo '${env.testPassword}' | sudo -S apt install -y com.yozosoft.yozo-office.s1`;
    await system.exec(installCmd);
    // 等待软件包完全安装完成 (dpkg状态为ii)
    for (let i = 0; i < 60; i++) {
      const pkgStatus = await agent.aiQuery('string[], the installation status of package com.yozosoft.yozo-office.s1');
      const isCompleted = await agent.aiBoolean(`check if the package "com.yozosoft.yozo-office.s1" is fully installed: ${pkgStatus}`);
      if (isCompleted) {
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    await agent.aiWaitFor('桌面出现永中图标', {
      timeoutMs: 180000, // 等待 180 秒
      checkIntervalMs: 3000, // 每 3 秒检查一次
    });
  });

  test('1974727-【V25】【永中Office版式阅读】软件打开、关闭', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await uos.searchInLauncher('永中Office版式阅读');
    await device.pressKey('Enter');
    await agent.aiWaitFor('界面出现打开按钮');
    await agent.aiAssert("界面存在'版式阅读器'");
    await uos.closeCurrentWindow();
    await agent.aiAssert("界面存在'计算机'");
  }, { timeout: 1200000, tags: ['1974727', 'level2', 'smoke'] });

  afterEach(async ({ uos, agent, device, system ,env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.yozosoft.yozo-office.s1`;
    await system.exec(uninstallCmd);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
