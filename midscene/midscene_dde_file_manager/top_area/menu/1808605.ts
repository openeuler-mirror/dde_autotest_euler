/**
 * 用例 PMSID: 1808605
 * 用例标题: 侧边栏显示项目设置取消勾选分区分组下所有设置项目
 * 生成时间: 2025-12-22 19:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1808605- 侧边栏显示项目设置取消勾选分区分组下所有设置项目', () => {
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
  
  test('1808605- 侧边栏显示项目设置取消勾选分区分组下所有设置项目', async ({ device, agent, uos, env }) => {
 
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("右上角有3条横线的图标", { deepThink: true });
    await agent.aiTap("下拉菜单中的设置", { deepThink: true });
    // 向下滚动
    await agent.aiTap("侧边栏显示项目");
    await agent.aiTap("分区");
    await agent.aiScroll('分区', { direction: 'down', distance: 3 });
    //await agent.aiTap("自定义目录", { deepThink: true });
    //await agent.aiScroll("自定义目录", { direction: 'down', distance: 11 });
    await agent.aiAssert("侧边栏显示项目右侧计算机文字左侧有蓝色√", { deepThink: true });
    await agent.aiTap("侧边栏显示项目右侧计算机文字左侧的蓝色√", { deepThink: true });
    await agent.aiAssert("文件管理器左边栏中没有计算机文字");
    await agent.aiTap("侧边栏显示项目右侧计算机文字", { deepThink: true });
    await agent.aiAssert("文件管理器左边栏中有计算机文字");
    await agent.aiTap("当前窗口关闭按钮:X");
    await agent.aiTap("文件管理器右上角的关闭按钮:X");

  }, { timeout: 1200000, tags: ['1808605','level3','menu','lanyanling'] });
  
  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");      
    });
  });

