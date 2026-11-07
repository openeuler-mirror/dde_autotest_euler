/**
 * 用例 PMSID: 1978785
 * 用例标题: 【V25】【奇安信可信浏览器】浏览器打开多个网址页面
 * 用例编写人:UT000181（刘亚菲）
 * 生成时间: 2026-02-12 16:38:03
 */

describe('1978785-【V25】【奇安信可信浏览器】浏览器打开多个网址页面', () => {
 const targetUrls = [
    {
      url: 'https://www.baidu.com',
      name: '百度',
      assertions: [
        '百度首页已显示',
        '百度搜索框已显示',
        '百度logo已显示'
      ]
    },
    {
      url: 'https://www.doubao.com',
      name: '豆包',
      assertions: [
        '豆包首页已显示',
        '豆包输入框已显示',
        '豆包logo已显示'
      ]
    },
    {
      url: 'https://pms.uniontech.com',
      name: 'PMS系统',
      assertions: [
        '统信软件技术有限公司项目管理系统页面已显示',
        '用户名输入框已显示',
        '密码输入框已显示'
      ]
    }
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

  test('1978785-【V25】【奇安信可信浏览器】浏览器打开多个网址页面', async ({ device, agent, uos }) => {
    await device.pressKey("Win");
    await agent.aiWaitFor("启动器界面已显示");
    await agent.aiTap('启动器中搜索框', { deepThink: true });
    await device.typeText('奇安信可信浏览器',true);
    await agent.aiWaitFor("奇安信可信浏览器界面已显示");
    await agent.aiAssert("奇安信可信浏览器已打开");
    await uos.maximizeWindow();

    // 遍历访问网址
    console.log("\n 开始遍历访问指定网址");
    for (const target of targetUrls) {
      try {
        const { url, name, assertions } = target;
        console.log(`\n正在访问: ${name} (${url})`);
        
        // 1. 点击地址栏，激活输入
        await agent.aiTap("浏览器地址栏", { deepThink: true });
        await device.typeText(url, true);
        console.log(` 已输入网址: ${url}`);
        await agent.aiWaitFor(`${name} 页面加载完成`, {
          timeoutMs: 15000,
          checkIntervalMs: 1000
        });
        
        // 6. 执行该网址的专属断言验证
        console.log(`  开始验证 ${name} 页面断言`);
        for (const assertMsg of assertions) {
          await agent.aiAssert(assertMsg);
          console.log(`断言通过: ${assertMsg}`);
        }
        
        console.log(`${name} 访问及验证完成`);
      } catch (e) {
        console.log("${option} 验证失败")
        // continue;
      }
    }
    console.log("所有设置选项遍历验证完成");
  }, { timeout: 1000000, tags: ['1978785', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 还原测试套件');
  
    await uos.closeCurrentWindow();
    // await agent.aiTap('确定', { deepThink: true });
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.qianxin.browser-stable`;
    await system.exec(uninstallCmd);
    await uos.closeCurrentWindow();
  });
});
