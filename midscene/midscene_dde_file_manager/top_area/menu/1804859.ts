/**
 * 用例 PMSID: 1804859
 * 用例标题: 设置-菜单栏目
 * 生成时间: 2025-12-23 13:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1804859-设置-菜单栏目', () => {
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
  
  test('1804859-设置-菜单栏目', async ({ device, agent, uos, env }) => {   
    await uos.openApp("文件管理器", 3000, 20000, true);
    //取消勾选“使用文件管理器的文件选择对话框”
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    await agent.aiAssert("当前窗口有打开行为、新窗口、新标签、文件和目录文字");
    await agent.aiScroll('基础设置', { direction: 'down', distance: 5 });
    await agent.aiAssert("当前窗口有侧边栏显示项目、视图、缩略图预览、计算机显示项目、搜索、挂载、外部存储设备、对话框、文件投送、文件粉碎文字");
    await agent.aiTap("当前窗口关闭按钮:x", { deepThink: true });
    await agent.aiTap("文件管理器右上角的关闭按钮:x", { deepThink: true });
  }, { timeout: 1200000, tags: ['1804859','level3','menu','lanyanling'] });
  
  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');      
    });
  });

