/**
 * 用例 PMSID: 1805397
 * 用例标题: 【搜索】搜索-全文搜索默认勾选 
 * 生成时间: 2025-12-23 9:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1805397-【搜索】搜索-全文搜索默认勾选 ', () => {
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
  
  test('1805397-【搜索】搜索-全文搜索默认勾选 ', async ({ device, agent, uos, env }) => {
    await agent.aiWaitFor("桌面已显示");
    //检查搜索中的全文搜索是否默认打开
    await uos.openApp("文件管理器", { waitAfterOpen: 60000, maximizeWindow: true });
    //await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiTap("高级设置", { deepThink: true });
    await agent.aiAssert("全文搜索文字左侧有蓝色√");
    await agent.aiTap("当前窗口关闭按钮:x", { deepThink: true });
    await agent.aiTap("当前窗口右上角关闭按钮:x", { deepThink: true });    

  }, { timeout: 1200000, tags: ['1805397','level2','smoke','lanyanling'] });
  
  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');      
    });
  });

