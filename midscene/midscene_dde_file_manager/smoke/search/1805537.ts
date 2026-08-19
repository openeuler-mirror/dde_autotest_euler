/**
 * 用例 PMSID: 1805537
 * 用例标题: 文件重命名、新建后，进行搜索
 * 生成时间: 2025-12-23 9:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1805537-文件重命名、新建后，进行搜索', () => {
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
  
  test('1805537-文件重命名、新建后，进行搜索', async ({ device, agent, uos, env }) => {
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
    //重命名search-1.txt为search-1-new
    await agent.aiRightClick("search-1.txt文件");
    await agent.aiTap("重命名");
    await device.typeText("search-1-new");
    await agent.aiTap("桌面空白处");
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("右上角有放大镜的输入框", { deepThink: true });
    await agent.aiInput("search-1-new.txt","右上角有放大镜的输入框");
    await device.pressKey("Enter");
    //await agent.aiAssert("搜索结果有search-1-new.txt文件");
    await agent.aiWaitFor("搜索结果有search-1-new.txt文件",
      { 
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    await agent.aiTap("当前窗口右上角关闭按钮:x", { deepThink: true }); 
    await uos.showDesktop();
    await agent.aiRightClick("桌面空白处")
    //创建search-1.txt
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText("search-2");
    await agent.aiTap("桌面空白处");
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("右上角有放大镜的输入框", { deepThink: true });
    await agent.aiInput("search-2.txt","右上角有放大镜的输入框");
    await device.pressKey("Enter");
    //await agent.aiAssert("搜索结果有search-2.txt文件");
    await agent.aiWaitFor("搜索结果有search-2.txt文件",
      { 
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );
    await agent.aiTap("当前窗口右上角关闭按钮:x", { deepThink: true }); 
  }, { timeout: 1200000, tags: ['1805537','level2','smoke','lanyanling'] });
  
  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.showDesktop();
    // 删除测试文件
    /*
    await agent.aiRightClick("search-1-new.txt");
    await agent.aiTap("删除");
    await agent.aiAssert("search-1-new.txt文件不存在");
    await agent.aiRightClick("search-2.txt");
    await agent.aiTap("删除");
    await agent.aiAssert("search-2.txt文件不存在");
    */
    await system.exec("rm -rf ~/Desktop/*.txt");    
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
  });

