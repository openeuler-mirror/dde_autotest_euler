/**
 * 用例 PMSID: 1978833
 * 用例标题: 【V25】【奇安信可信浏览器】开发工具页面
 * 用例编写人:UT000181（刘亚菲）
 * 生成时间: 2026-02-14 16:38:03
 */

describe('1978833-【V25】【奇安信可信浏览器】开发工具页面', () => {
  const devToolElements = [
    "元素",
    "控制台", 
    "网络",
    "源代码",
    "性能",
    "内存",
];
  beforeAll(async ({ device, uos, agent ,system,env}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.minimizeWindow();
    const installCmd = `echo '${env.testPassword}' | sudo -S apt install com.qianxin.browser-stable`;
    await system.exec(installCmd);
    await agent.aiWaitFor('桌面出现奇安信可信浏览器图标', {
      timeoutMs: 3000000, // 等待 3000 秒
      checkIntervalMs: 5000, // 每 5 秒检查一次
    });
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1978833-【V25】【奇安信可信浏览器】开发工具页面', async ({ device, agent, uos }) => {
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('启动器中搜索框', { deepThink: true });
    await device.typeText('奇安信可信浏览器',true);
    await agent.aiWaitFor("奇安信可信浏览器界面已显示");
    await agent.aiAssert("奇安信可信浏览器已打开");
    await uos.maximizeWindow();

    try{
      await agent.aiWaitFor("已显示用户确认窗口",{timeoutMs:30000});
      await agent.aiTap('确定', { deepThink: true });
    }catch(e){
      console.log("未检测到确认弹窗")
    }
    await agent.aiTap("浏览器右侧图标三", { deepThink: true });
    await agent.aiWaitFor("更多工具菜单");
    await agent.aiTap("更多工具")
    await agent.aiWaitFor("开发者工具菜单")
    await agent.aiTap("开发者工具")
   // 使用 await for...of 循环批量验证开发工具页面元素
    for await (const element of devToolElements) {
      await agent.aiAssert(`开发工具中存在${element}选项卡`, {
        timeoutMs: 5000,
        checkIntervalMs: 500
    });
    console.log(`验证通过: ${element}`);
  }
  console.log("所有开发工具页面元素验证通过");
  await agent.aiTap("浏览器右侧图标三下面的X按钮")
  await agent.aiWaitFor("PRO")

  }, { timeout: 1000000, tags: ['1978833', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 还原测试套件');
    await uos.closeCurrentWindow();
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.qianxin.browser-stable`;
    await system.exec(uninstallCmd);
  });
});
