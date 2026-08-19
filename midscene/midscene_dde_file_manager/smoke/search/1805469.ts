/**
 * 用例 PMSID: 1805469
 * 用例标题: 【搜索】搜索-单个词搜索
 * 生成时间: 2025-12-11 20:24:26
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1805469-【搜索】搜索-单个词搜索', () => {
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
  
  test('1805469-【搜索】搜索-单个词搜索', async ({ device, agent, uos, env }) => {
    await agent.aiWaitFor("桌面已显示");
    await agent.aiRightClick("桌面 右上角空白处")
    await agent.aiTap("新建文档")
    await agent.aiTap("文本文档")
    await device.typeText("blue-test")
    await agent.aiTap("桌面空白处")
    await agent.aiAssert("桌面存在文件名字为：blue-test.txt")
      
    await uos.openApp("文件管理器", 3000, 20000, true);
  
    await agent.aiTap("右上角有放大镜的输入框", { deepThink: true });
    await agent.aiInput('blue-test.txt',"右上角有放大镜的输入框");
    await device.pressKey("Enter")
    //await agent.aiKeyboardPress("右上角输入框", { keyName: "Enter" });
    await agent.aiAssert("搜索结果有blue-test.txt文件");
  }, { timeout: 1200000, tags: ['1805469','level2','smoke','lanyanling'] });
  
  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //数据清理：删除桌面文件和文件夹
    await agent.aiTap("窗口右上角关闭按钮:X");
    //await uos.showDesktop();
    await agent.aiRightClick("blue-test.txt")
    await agent.aiTap("删除按钮")
    await agent.aiAssert("桌面不存在blue-test.txt")
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      //await agent.aiTap("窗口右上角关闭按钮:X");
    });
  });
