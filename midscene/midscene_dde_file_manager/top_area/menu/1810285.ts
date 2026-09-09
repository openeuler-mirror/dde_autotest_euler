// @ts-nocheck

/**
 * 用例 PMSID: 1810285
 * 用例标题: 【菜单】不勾选【显示隐藏文件】-在桌面/普通目录以“.”开头新建/重命名文件-弹窗提示-点击【取消】
 * 生成时间：2026-01-23 15:33:00
 * 用例编写人：UT000686(李双双)
 */

describe('1810285-不勾选显示隐藏文件时以.开头新建文件点击取消', () => {
  beforeAll(async ({ device, uos }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async () => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1810285-不勾选显示隐藏文件时以.开头新建文件点击取消', async ({ device, agent, uos, system }) => {
    // 前置条件：确保不显示隐藏文件
    await system.exec('rm -rf ~/Desktop/.18102* ~/Desktop/新建*', 500);
    await system.exec('rm -rf ~/Documents/.181028* ~/Documents/新建*', 500);
    await system.exec('killall dde-file-manager', 500);
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);

    // 步骤1：桌面中间位置右键，鼠标悬停在新建文档，点击"文本文档"
    await agent.aiRightClick("桌面中间位置空白处");
    await agent.aiWaitFor("右键菜单已展开");
    await agent.aiHover("新建文档");
    await agent.aiWaitFor("右键菜单加载完成")
    await agent.aiTap("文本文档");
    
    // 重命名为“pic5651”
    await device.typeText(".1810285txt");
    await device.pressKey("Enter");
    await agent.aiWaitFor("隐藏文件确认弹框已显示");
    await agent.aiTap("取消");
    await agent.aiAssert("文件未被重命名为.1810285txt");
    await agent.aiTap("桌面右下角空白处")

    // 步骤3：利用快捷键"ctrl+shift+N"创建文件，重命名为".1810285file",在隐藏文件确认弹框中，点击"取消",断言文件重命名失败
    await device.pressKey("Ctrl+Shift+N");
    await agent.aiWaitFor("文件夹创建成功");
    await device.typeText(".1810285file");
    await device.pressKey("Enter");
    await agent.aiWaitFor("隐藏文件确认弹框已显示");
    await agent.aiTap("取消");
    await agent.aiAssert("文件未被重命名为.1810285file");

    // 步骤4：启动器-文件管理器，点击侧边栏的文档目录，重复步骤1~3
    await system.exec('killall dde-file-manager', 500);
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiTap("侧边栏的文档目录");
    await agent.aiWaitFor("文档目录已打开");

    // 在文档目录重复步骤1~3
    await agent.aiRightClick("文档中间位置空白处");
    await agent.aiWaitFor("右键菜单已展开");
    await agent.aiTap("新建文档");
    await agent.aiWaitFor("新建文档子菜单已展开");
    await agent.aiTap("文本文档");
   await device.typeText(".1810285file");
    await device.pressKey("Enter");
    await agent.aiWaitFor("隐藏文件确认弹框已显示");
    await agent.aiTap("取消");
    await agent.aiAssert("文件未被重命名为.1810285file");
    await agent.aiTap("桌面右下角空白处")

    await device.pressKey("Ctrl+Shift+N");
     await agent.aiWaitFor("文件夹创建成功");
    await device.typeText(".1810285file");
    await device.pressKey("Enter");
    await agent.aiWaitFor("隐藏文件确认弹框已显示");
    await agent.aiTap("取消");
    await agent.aiAssert("文档目录中文件未被重命名为.1810285file");

  }, { timeout: 600000, tags: ['1810285', 'level2', 'top_area', 'menu', 'DITT', 'lishuangshuang'] });

  afterEach(async () => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ system, device, uos, agent }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理桌面和文档目录中可能创建的文件
    await system.exec('rm -rf ~/Desktop/.18102* ~/Desktop/新建**', 500);
    await system.exec('rm -rf ~/Documents/.18102* ~/Documents/新建*', 500);
    await system.exec('killall dde-file-manager', 500);
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
  });
});