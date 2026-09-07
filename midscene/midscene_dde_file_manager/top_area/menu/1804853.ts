/**
 * 用例 PMSID: 1804853
 * 用例标题: 多文件管理窗口打开一个帮助
 * 生成时间: 2025-12-23 15:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1804853-多文件管理窗口打开一个帮助', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("rm -rf ~/Desktop/*.txt");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });
  
  test('1804853-多文件管理窗口打开一个帮助', async ({ device, agent, uos, env }) => {    
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("菜单中的帮助", { deepThink: true });
    await agent.aiWaitFor("屏幕上有返回主页文字",
      { 
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("我的目录");
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("菜单中的帮助", { deepThink: true });
    await agent.aiWaitFor("屏幕上有返回主页文字",
      { 
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    await device.pressKey("Alt+F4");
    await device.pressKey("Alt+F4");
    await device.pressKey("Alt+F4");
  }, { timeout: 1200000, tags: ['1804853','level3','menu','lanyanling'] });
  
  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
  });
