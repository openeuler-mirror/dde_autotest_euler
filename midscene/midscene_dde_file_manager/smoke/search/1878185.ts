/**
 * 用例 PMSID: 1878185
 * 用例标题: 【搜索专项优化-v1.0】完整镜像全文检索开关默认开启
 * 生成时间: 2025-12-23 9:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1878185-【搜索专项优化-v1.0】完整镜像全文检索开关默认开启', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');      
    });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("rm -rf ~/Desktop/*.txt");
    await system.exec(`kill -SIGTERM $(pidof dde-file-manager)`);
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });
  
  test('1878185-【搜索专项优化-v1.0】完整镜像全文检索开关默认开启', async ({ device, agent, uos, env, system }) => {
    await uos.showDesktop();
    await agent.aiWaitFor("桌面已显示");
    await agent.aiRightClick("桌面空白处")
    //创建search.txt
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText("search");
    await agent.aiTap("桌面空白处");
    await system.exec("echo '这个是搜索专项优化测试文档' >>~/Desktop/search.txt");

    //检查搜索中的全文搜索是否默认打开
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiTap("高级设置", { deepThink: true });
    await agent.aiAssert("全文搜索文字左侧有蓝色√");
    await agent.aiTap("全文搜索文字", { deepThink: true });
    await agent.aiTap("全文搜索文字", { deepThink: true });
    await agent.aiWaitFor("有立即更新索引文字",
      {
        timeoutMs: 800000,
        checkIntervalMs: 2000
      }
    );
    await device.pressKey("Alt+F4");
    await agent.aiTap("右上角有放大镜的输入框", { deepThink: true });
    await agent.aiInput("这个是搜索专项优化测试文档","右上角有放大镜的输入框");
    await device.pressKey("Enter");
    await agent.aiWaitFor("搜索结果有search.txt文件", { timeoutMs: 600000,checkIntervalMs: 2000 });
    //await agent.aiAssert("搜索结果有search.txt文件");
    await agent.aiTap("当前窗口右上角关闭按钮:x", { deepThink: true });    

  }, { timeout: 1300000, tags: ['1878185','level1','smoke','lanyanling'] });
  
  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');  
      await uos.showDesktop();
      // 删除测试文件
      await agent.aiRightClick("search.txt");
      await agent.aiTap("删除");
      await agent.aiAssert("search.txt文件不存在");    
    });
  });

