/**
 * 用例 PMSID: 1816679
 * 用例标题: 搜索框-快捷键激活并搜索
 * 生成时间: 2025-12-23 9:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1816679-搜索框-快捷键激活并搜索', () => {
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
  
  test('1816679-搜索框-快捷键激活并搜索', async ({ device, agent, uos, env }) => {
    await agent.aiWaitFor("桌面已显示");
    await agent.aiRightClick("桌面 右上角空白处")
    //创建search-1.txt
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText("search-1");
    await agent.aiTap("桌面空白处");
    await agent.aiDoubleClick("search-1.txt");
    await device.typeText("这个是搜索专项优化测试文档");
    await device.pressKey("Ctrl+S");
    await agent.aiTap("桌面右侧关闭按钮:x", { deepThink: true });
    await uos.openApp("文件管理器", 3000, 20000, true);
    await device.pressKey("Ctrl+F");
    await agent.aiInput("search-1.txt","右上角有放大镜的输入框");
    await device.pressKey("Enter");
    await agent.aiAssert("搜索结果有search-1.txt文件");
    await agent.aiTap("当前窗口中间空白处");
    await agent.aiAssert("当前窗口看到search-1.txt文件");
    await agent.aiTap("右上角漏斗左侧的x按钮");
    await agent.aiAssert("当前窗口看不到search-1.txt文件");
    await agent.aiTap("当前窗口右上角关闭按钮:x", { deepThink: true });
  }, { timeout: 1800000, tags: ['1816679','level2','smoke','lanyanling'] });
  
  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.showDesktop();
    // 删除测试文件
    await agent.aiRightClick("search-1.txt");
    await agent.aiTap("删除");
    await agent.aiAssert("search-1.txt文件不存在");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');      
    });
  });

