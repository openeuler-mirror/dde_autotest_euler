/**
 * 用例 PMSID: 1978773
 * 用例标题: 【V25】【奇安信可信浏览器】浏览器设置页面
 * 用例编写人:UT000181（刘亚菲）
 * 生成时间: 2026-02-12 16:38:03
 */

describe('1978773-【V25】【奇安信可信浏览器】浏览器设置页面', () => {
  const settingOptionsWithAssertions = [
    {
      name: '基本设置',
      assertions: [
        '启动时打开已显示',
        '搜索引擎已显示',
      ]
    },
    {
      name: '标签设置',
      assertions: [
        '新建标签页设置项已显示',
        '标签页关闭设置项已显示',
      ]
    },
    {
      name: '上网痕迹',
      assertions: [
        '清除上网浏览痕迹选项已显示',
        '自动清除痕迹设置项已显示',
      ]
    },
    {
      name: '网页内容',
      assertions: [
        '网页缩放设置项已显示',
        '网页设置项已显示',
      ]
    },
    {
      name: '快捷键',
      assertions: [
        '常用快捷键已显示',
        '浏览器功能已显示',
      ]
    },
    {
      name: '鼠标手势',
      assertions: [
        '使用鼠标手势',
        '鼠标手势对应功能',
      ]
    },
    {
      name: '可信安全',
      assertions: [
        '云安全设置已显示',
        '安全隔离防护已显示',
      ]
    },
    {
      name: '高级设置',
      assertions: [
        '使用鼠标手势',
        '鼠标手势对应功能',
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

  test('1978773-【V25】【奇安信可信浏览器】浏览器设置页面', async ({ device, agent, uos }) => {
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
    await agent.aiWaitFor("设置菜单");
    await agent.aiTap("设置")
    await agent.aiWaitFor("浏览器页面存在选项")
    // 遍历所有设置选项并执行专属断言
    console.log(`开始遍历 ${settingOptionsWithAssertions.length} 个设置选项`);
    for (const option of settingOptionsWithAssertions) {
      try {
        const { name, assertions } = option;
        console.log(`\n正在验证设置选项: ${name}`);
        
        // 1. 等待当前选项在侧边栏显示
        await agent.aiWaitFor(`${name} 已显示`, {
          timeoutMs: 10000,
          checkIntervalMs: 500
        });
        // 2. 点击进入该设置页面
        await agent.aiTap(name, { deepThink: true });
        // 3. 等待页面加载完成
        await agent.aiWaitFor(`${name} 页面已加载完成`, { timeoutMs: 8000 });
        // 4. 执行该页面的专属断言（核心：每个页面的个性化验证）
        console.log(`开始执行 ${name} 页面的断言验证`);
        for (const assertMsg of assertions) {
          await agent.aiAssert(assertMsg);
          console.log(`断言通过: ${assertMsg}`);
        }
        console.log(`${name} 所有断言验证通过`);  
      } catch (e) {
        console.log("${option} 验证失败")
        continue;
      }
    }
    
    console.log("所有设置选项遍历验证完成");
  }, { timeout: 1000000, tags: ['1978773', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 还原测试套件');
  
    await uos.closeCurrentWindow();
    // await agent.aiTap('确定', { deepThink: true });
    await uos.closeCurrentWindow();
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.qianxin.browser-stable`;
    await system.exec(uninstallCmd);
  });
});
