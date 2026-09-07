/**
 * 用例 PMSID: 1804841
 * 用例标题: 菜单-新建窗口
 * 生成时间: 2025-12-23 15:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1804841-菜单-新建窗口', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });
  
  test('1804841-菜单-新建窗口', async ({ device, agent, uos, env }) => {
    
    await uos.openApp("文件管理器", 3000, 20000, true);
    //取消勾选“使用文件管理器的文件选择对话框”
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiAssert("下拉菜单有新建窗口、新建标签页、连接到服务器、设置共享密码、设置、主题、帮助、关于、退出文字");
    await agent.aiTap("屏幕中间空白处");
    await agent.aiAssert("当前窗口没有新建窗口、新建标签页、连接到服务器、设置共享密码、设置、主题、帮助、关于、退出文字");
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await device.pressKey('Esc');
    await agent.aiAssert("当前窗口没有新建窗口、新建标签页、连接到服务器、设置共享密码、设置、主题、帮助、关于、退出文字");
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的新建窗口", { deepThink: true });
    await agent.aiAssert("有两个打开的文件管理器窗口", { deepThink: true });
    await device.pressKey("Alt+F4");
    await device.pressKey("Alt+F4");
  }, { timeout: 1200000, tags: ['1804841','level3','menu','lanyanling'] });
  
  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');      
    });
  });

