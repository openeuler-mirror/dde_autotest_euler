// @ts-nocheck

/**
 * 用例 PMSID: 1805667
 * 用例标题: [096]页面检查-回收站详细信息展示正确
 * 生成时间：2026-01-22 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1805667-[096]页面检查-回收站详细信息展示正确', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1805667-回收站详细信息展示正确', async ({ device, agent, uos, system}) => {
       // 前置条件：在回收站图标右键，若清空回收站可点击，请点击“清空回收站”，在清空回收站的弹框中点击“enter”
    try {
      await agent.aiRightClick("桌面回收站图标");
      
      // 检查右键菜单中是否有"清空回收站"选项
      const menuItems = await agent.aiQuery("右键菜单中的所有选项");
      
      if (menuItems && menuItems.toString().includes('清空回收站')) {
        console.log('检测到"清空回收站"选项可点击，执行清空操作');
        await agent.aiTap("清空回收站");
        
        // 等待确认弹框出现
        await agent.aiWaitFor("确认清空回收站");
        
        // 使用Enter快捷键确认
        await agent.aiTap("清空")
        
        // 直接执行用例内容
        console.log('回收站清空操作已触发，执行用例内容');
      } else {
        console.log('"清空回收站"选项不可点击或不存在，直接执行用例内容');
        await device.pressKey("Escape"); // 关闭右键菜单
      }
      
    } catch (error) {
      console.log('清空回收站操作失败或异常，直接执行用例内容');
      await device.pressKey("Escape"); // 关闭右键菜单
    }

    // 打开文件管理器并新建文件夹
    await system.exec('killall dde-file-manager', 500);
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.displaypreview.visible -v false");
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("侧边栏的文档目录"); 
    // 使用for循环创建两个文件夹
    for (let i = 0; i < 2; i++) {
        await device.pressKey("ctrl+shift+N")
    }

    await agent.aiTap("文档目录右下角空白处")
    await device.pressKey("Ctrl+A")
    await device.pressKey("Delete")

    // 切换到回收站目录
    await agent.aiTap("侧边栏的回收站目录");
    await agent.aiWaitFor("回收站已打开");

    // 优化1：点击视图选项，勾选显示预览
    await agent.aiTap("页面上方地址栏右侧的第四个按钮");
    // await agent.aiTap("页面右上角试图选项");
    await agent.aiWaitFor("视图选项弹框已加载完成")
    await agent.aiTap("显示预览前面的勾选框");
    // 鼠标点击回收站左下角空白处
    await agent.aiTap("回收站左下角空白处");
    // 断言回收站右侧有名称、类型、访问时间、修改时间关键字
    await agent.aiAssert("回收站右侧包含名称、类型、访问时间、修改时间关键字");

    // 新增步骤1：选中“新建文件夹”，断言回收站右侧有新建文件夹的名称、类型、访问时间、修改时间关键字信息
    await agent.aiTap("新建文件夹");
    await agent.aiWaitFor("新建文件夹已选中");
    await agent.aiAssert("回收站右侧包含新建文件夹的名称、类型、访问时间、修改时间、原始路径关键字信息");

    // 步骤2：选中“新建文件夹”，点击“Ctrl+a”，断言回收站右侧有新建文件夹的名称、类型、访问时间、修改时间关键字信息
    await device.pressKey("Ctrl+a");
    await agent.aiAssert("回收站右侧包含新建文件夹的名称、类型、访问时间、修改时间、原始路径关键字信息");
    // 清理数据操作
    await agent.aiTap("右上角清空按钮");
    await agent.aiWaitFor("清空弹框已加载完成");
    await agent.aiTap("在清空弹框中点击清空按钮");    

  }, { timeout: 600000, tags: ['1805667', 'level2', 'smoke', 'trash', 'DITT' , 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //恢复环境
  await system.exec('killall dde-file-manager', 500);
  await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.displaypreview.visible -v false");
  });
});