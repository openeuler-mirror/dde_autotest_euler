/**
 * 用例 PMSID: 1908461
 * 用例标题:【搜索】重命名后立即添加内容，再搜索
 * 生成时间: 2025-12-23 9:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

describe('1908461-【搜索】重命名后立即添加内容，再搜索', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');      
    });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec("rm -rf ~/.config/deepin/dde-file-manager");
    await system.exec("rm ~/.config/deepin/dde-file-manager.json");
    await system.exec("rm -rf ~/Desktop/*.txt");
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9");
    await system.exec("systemctl --user restart deepin-service-plugin@org.deepin.Filemanager.TextIndex.service");
    await system.exec("systemctl --user restart deepin-anything-daemon.service");
    await system.exec("systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service");
    await system.exec("systemctl --user restart dde-file-manager.service");
    await agent.aiWaitFor('所有文件管理器窗口已关闭');
  });
  
  test('1908461-【搜索】重命名后立即添加内容，再搜索', async ({ device, agent, uos, env, system }) => {
    await uos.showDesktop();
    await agent.aiWaitFor("桌面已显示");
    await agent.aiRightClick("桌面空白处")
    //创建a.txt
    await agent.aiTap("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText("a");
    await agent.aiTap("桌面空白处");
    await agent.aiRightClick("a.txt文件");
    await agent.aiTap("重命名");
    await device.typeText("a-new");
    await agent.aiTap("桌面空白处");
    await system.exec("echo '今天天气很好' >>~/Desktop/a-new.txt");

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
    await agent.aiInput("今天天气很好","右上角有放大镜的输入框");
    await device.pressKey("Enter");
    try {
      await agent.aiWaitFor("搜索结果有a-new.txt文件",
        {
          timeoutMs: 300000,
          checkIntervalMs: 2000
        }
      );
    } catch (error) {
      console.log('第一次搜索超时，未找到a-new.txt文件，重新执行搜索操作');
      await agent.aiTap("右上角有放大镜的输入框里的x按钮", { deepThink: true });
      await agent.aiTap("右上角有放大镜的输入框", { deepThink: true });
      await agent.aiInput("今天天气很好","右上角有放大镜的输入框");
      await device.pressKey("Enter");
      await agent.aiWaitFor("搜索结果有a-new.txt文件",
        {
          timeoutMs: 300000,
          checkIntervalMs: 2000
        }
      );
    }
    //await agent.aiAssert("搜索结果有a-new.txt文件");
    await agent.aiTap("当前窗口右上角关闭按钮:x", { deepThink: true });
  }, { timeout: 1800000, tags: ['1908461','level3','search','lanyanling'] });
  
  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      await system.exec("rm -rf ~/Desktop/*.txt");
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15"); 
    });
  });

