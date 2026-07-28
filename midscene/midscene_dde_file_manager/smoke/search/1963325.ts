/**
 * 用例 PMSID: 1963325
 * 用例标题:【搜索】主目录中搜索
 * 生成时间: 2025-12-11 20:24:26
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1963325-【搜索】主目录中搜索', () => {
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
  
  test('1963325-【搜索】主目录中搜索', async ({ device, agent, uos, env, system  }) => {
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("文件管理器左侧栏的数据盘");
    await agent.aiWaitFor("数据盘页面已打开");
    await agent.aiDoubleClick("主目录");
    await agent.aiWaitFor("主目录页面已打开");
    await system.exec(`echo "this is a test file" >~/test-1.txt`);
    await new Promise(resolve => setTimeout(resolve, 2000));
/*
    await agent.aiRightClick("主目录页面空白处");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap("新建文档");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap("文本文档");
    await agent.aiRightClick("新建文本.txt");  
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    await agent.aiTap("重命名");
    await device.typeText("test-1");
    await agent.aiTap("主目录页面空白处");
    await agent.aiAssert("主目录页面存在文件名字为：test-1.txt");         
*/  
    await agent.aiTap("右上角有放大镜的输入框", { deepThink: true });
    await agent.aiInput('test-1.txt',"右上角有放大镜的输入框");
    await device.pressKey("Enter");
    //await agent.aiKeyboardPress("右上角输入框", { keyName: "Enter" });
    await agent.aiAssert("搜索结果有test-1.txt文件");
  }, { timeout: 1200000, tags: ['1963325','level2','smoke','lanyanling'] });
  
  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //数据清理：删除桌面文件和文件夹
    await agent.aiTap("右上角有放大镜的输入框中的按钮:X");
    //await uos.showDesktop();
    await agent.aiRightClick("test-1.txt");
    await agent.aiTap("删除按钮");
    await agent.aiAssert("主目录页面不存在test-1.txt");
    await agent.aiTap("窗口右上角关闭按钮:X");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');      
    });
  });

