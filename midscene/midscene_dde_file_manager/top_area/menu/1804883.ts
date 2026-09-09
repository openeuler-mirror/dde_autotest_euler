/**
 * 用例 PMSID: 1804883
 * 用例标题: 快捷访问调整顺序勾选
 * 生成时间: 2025-12-23 9:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1804883-快捷访问调整顺序勾选', () => {
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
  
  test('1804883-快捷访问调整顺序勾选', async ({ device, agent, uos, env }) => { 
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    // 向下滚动
    await agent.aiTap("侧边栏显示项目", { deepThink: true });
    await agent.aiTap("侧边栏显示项目右侧最近使用文字左侧的蓝色√", { deepThink: true });
    await agent.aiAssert("左上角屏幕没有最近使用文字");
    await agent.aiTap("侧边栏显示项目右侧最近使用文字左侧方框的中心", { deepThink: true });
    await agent.aiAssert("左上角屏幕有最近使用文字");
    await agent.aiTap("当前窗口关闭按钮:x");
    await agent.aiTap("左侧栏的最近使用");
    await agent.aiDrag("左侧栏的最近使用", "左侧主目录和桌面之间空白处");
    await agent.aiAssert("最近使用在主目录下方");
    await agent.aiTap("左侧栏的最近使用");
    await agent.aiDrag("左侧栏的最近使用", "快捷访问下方");
    try {
      await agent.aiAssert("最近使用在主目录上方");
    } catch (error) {
      // 如果断言失败，重新执行拖拽操作
      await agent.aiDrag("左侧栏的最近使用", "快捷访问下方");
      await agent.aiAssert("最近使用在主目录上方");
    }
    await agent.aiTap("屏幕中间的空白处");
    await agent.aiTap("当前窗口右上角的关闭钮:x", { deepThink: true });

  }, { timeout: 1200000, tags: ['1804883','level3','menu','lanyanling'] });
  
  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');      
    });
  });

