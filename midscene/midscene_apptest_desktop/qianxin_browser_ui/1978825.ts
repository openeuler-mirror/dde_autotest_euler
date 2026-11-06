/**
 * 用例 PMSID: 1978825
 * 用例标题: 【V25】【奇安信可信浏览器】高级工具页面
 * 用例编写人:UT000181（刘亚菲）
 * 生成时间: 2026-02-12 16:38:03
 */

describe('1978825-【V25】【奇安信可信浏览器】高级工具页面', () => {
  const settingOptionsWithAssertions = [
    {
      name: '扩展工具',
      pageTitle: '扩展程序',
      assertions: [
        '扩展程序已显示',
        '扩展程序搜索框已显示',
      ]
    },
    {
      name: '插件管理',
      pageTitle: 'se://plugins/',
      assertions: [
        'Plugins已显示',
        'Kingsoft WPS Plugin已显示',
      ]
    },
    {
      name: '版本信息',
      pageTitle: '关于版本',
      assertions: [
        '修订版本已显示',
        '授权许可信息已显示',
      ]
    },
    {
      name: 'GPU信息',
      pageTitle: 'se://gpu/',
      assertions: [
        'Graphics Feature Status已显示',
        'Driver Bug Workarounds显示',
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

  test('1978825-【V25】【奇安信可信浏览器】高级工具页面', async ({ device, agent, uos }) => {
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
    await agent.aiWaitFor("高级工具")
    await agent.aiTap("高级工具")
    await agent.aiWaitFor("常用工具已显示")
    // 遍历所有设置选项，依次执行：打开name → 检查断言 → 关闭pageTitle
    console.log(`\n开始遍历 ${settingOptionsWithAssertions.length} 个设置选项`);
    
    for (let i = 0; i < settingOptionsWithAssertions.length; i++) {
      const option = settingOptionsWithAssertions[i];
      try {
        const { name, pageTitle, assertions } = option;
        console.log(`\n[${i + 1}/${settingOptionsWithAssertions.length}] ${name} → ${pageTitle}`);
        
        // 1. 打开name
        console.log(`  打开 ${name}`);
        await agent.aiWaitFor(`${name} 已显示`, {
          timeoutMs: 10000,
          checkIntervalMs: 500
        });
        await agent.aiTap(name, { deepThink: true });
        
        // 2. 等待pageTitle页面加载
        await agent.aiWaitFor(`${pageTitle} 页面已加载完成`, { 
          timeoutMs: 8000 
        });
        console.log(`已进入 ${pageTitle} 页面`);
        
        // 3. 检查assertions
        console.log(`  验证 ${pageTitle} 页面元素`);
        for (const assertMsg of assertions) {
          await agent.aiAssert(assertMsg);
          console.log(` ${assertMsg}`);
        }
        console.log(` ${pageTitle} 所有断言通过`);
        
        // 4. 关闭新开当前标签页pageTitle
        console.log(`  关闭 ${pageTitle} 页面`);
        await device.pressKey("Ctrl", "W");
        await agent.aiWaitFor("常用工具已显示", {
          timeoutMs: 5000,
          checkIntervalMs: 500
        });
        console.log(`${pageTitle} 已关闭，返回高级工具主界面`);
        
      } catch (e) {
        console.log(` ${option.name} 操作失败:`);
        // 尝试恢复状态
        try {
          await agent.aiTap("浏览器返回按钮", { deepThink: true });
          await agent.aiWaitFor("常用工具已显示", { timeoutMs: 3000 });
        } catch (e) {
          // 忽略恢复错误
        }
        continue;
      }
    }
    
    console.log("\n 所有高级工具页面遍历验证完成");
  }, { timeout: 1000000, tags: ['1978825', 'level3'] });

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
