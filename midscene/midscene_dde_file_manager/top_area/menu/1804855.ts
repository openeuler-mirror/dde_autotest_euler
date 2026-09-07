/**
 * 用例 PMSID: 1804855
 * 用例标题: 菜单-关于
 * 生成时间: 2025-12-23 15:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1804855-菜单-关于', () => {
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
  
  test('1804855-菜单-关于', async ({ device, agent, uos, env }) => {
    
    await uos.openApp("文件管理器", 3000, 20000, true);
    //取消勾选“使用文件管理器的文件选择对话框”
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的关于", { deepThink: true });
    await agent.aiAssert("当前窗口有版本、主页、www.chinauos.com、描述、文件管理器、致谢、致谢所使用的开源软件文字");
    await agent.aiAssert("当前窗口有文件管理器是一款功能强大的文件管理工具，它包括搜索、复制、回收站、压缩/解压缩，文件属性等管理功能。文字");
    await agent.aiTap("当前窗口关闭按钮:x", { deepThink: true });
    await agent.aiTap("文件管理器右上角的关闭按钮:x", { deepThink: true });
    await uos.openApp("文件管理器", 3000, 20000, true);
    //取消勾选“使用文件管理器的文件选择对话框”
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的关于", { deepThink: true });
    await device.pressKey("Alt+F4");
    await agent.aiAssert("当前窗口没有致谢所使用的开源软件文字");

  }, { timeout: 1200000, tags: ['1804855','level3','menu','lanyanling'] });
  
  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');      
    });
  });

