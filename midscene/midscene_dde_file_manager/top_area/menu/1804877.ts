/**
 * 用例 PMSID: 1804877
 * 用例标题: 设置--“对话框 - 使用文件管理器的文件选择对话框”
 * 生成时间: 2025-12-23 13:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1804877-设置--“对话框 - 使用文件管理器的文件选择对话框”', () => {
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
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });
  
  test('1804877-设置--“对话框 - 使用文件管理器的文件选择对话框”', async ({ device, agent, uos, env }) => {
    
    await uos.openApp("文件管理器", 3000, 20000, true);
    //取消勾选“使用文件管理器的文件选择对话框”
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiScroll('基础设置', { direction: 'down', distance: 5 });
    await agent.aiTap("对话框", { deepThink: true });
    await agent.aiTap("对话框右侧的使用文件管理器的文件选择对话框文字左侧的蓝色√", { deepThink: true });
    await agent.aiAssert("对话框右侧的使用文件管理器的文件选择对话框文字左侧没有蓝色√");
    await agent.aiTap("当前窗口关闭按钮:x");
    await agent.aiTap("文件管理器右上角的关闭按钮:x", { deepThink: true });
    //桌面上创建文本文档并创建链接
    await uos.showDesktop();
    await agent.aiRightClick("桌面 右上角空白处")
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText("creat-link");
    await agent.aiTap("桌面空白处");
    await agent.aiRightClick("creat-link.txt");
    await agent.aiTap("发送到");
    await agent.aiTap("创建链接");
    await agent.aiWaitFor(`弹出文件选择窗口`, { timeout: 3000 } );
    await agent.aiAssert("当前窗口没有音乐、图片中文文字");
    await agent.aiTap("取消按钮");

  }, { timeout: 1800000, tags: ['1804877','level3','menu','lanyanling'] });
  
  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //await uos.openApp("文件管理器", 3000, 20000, true);
    await uos.openApp('文件管理器', { waitAfterOpen: 3000, maximizeWindow: true });
    //恢复勾选“使用文件管理器的文件选择对话框”
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiScroll('基础设置', { direction: 'down', distance: 5 });
    await agent.aiTap("对话框", { deepThink: true });
    await agent.aiTap("对话框右侧的使用文件管理器的文件选择对话框文字左侧方框的中心", { deepThink: true });
    await agent.aiAssert("对话框右侧的使用文件管理器的文件选择对话框文字左侧有蓝色√");
    await agent.aiTap("当前窗口关闭按钮:x", { deepThink: true });
    await agent.aiTap("文件管理器右上角的关闭按钮:x", { deepThink: true });
    //await agent.aiRightClick("creat-link.txt");
    //await agent.aiTap("删除");
    await agent.aiTap("creat-link.txt文件");
    await device.pressKey("Delete");
    await agent.aiAssert("creat-link.txt文件不存在");
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');      
    });
  });

