/**
 * 用例 PMSID: 1810267
 * 用例标题:  勾选【显示隐藏文件】-在文件保存对话框内以“.”开头新建/重命名文件-不弹窗提示
 * 生成时间: 2026-02-27 13:10:00
 * 用例编写人: UT001774(李炎)
 */

describe('1810267-勾选【显示隐藏文件】-在文件保存对话框内以“.”开头新建/重命名文件-不弹窗提示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    // 关闭所有文本编辑器窗口
    await system.exec('killall deepin-editor', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件
    await system.exec('rm -rf ~/Desktop/.181* ~/Desktop/1810267*', 500);
    await system.exec('rm -rf ~/Videos/.181* ~/Videos/新建*', 500);
  });

  test('1810267-勾选【显示隐藏文件】-在文件保存对话框内以“.”开头新建/重命名文件-不弹窗提示', async ({ device, agent, uos, env, system }) => {
    console.log('=== 开始测试：1810267-勾选【显示隐藏文件】-在文件保存对话框内以“.”开头新建/重命名文件-不弹窗提示 ===');

    //前置条件：创建测试文件和文件夹
    await system.exec('touch ~/Desktop/1810267.txt', 500);
    // 显示隐藏文件
    await device.pressKey('Ctrl+H');

    //步骤1: 在文件保存对话框内以“.”开头保存文件,弹窗提示,点击【取消】
    await agent.aiDoubleClick("1810267.txt");
    await agent.aiTap('文本编辑器右上角的菜单按钮');
    await agent.aiWaitFor('另存为选项');
    await agent.aiTap("另存为");
    await device.typeText('.1810267');
    await agent.aiTap("保存");
    //有隐藏弹窗提示，文件未保存，并且选中文件名
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("弹框右下角取消");
    await agent.aiAssert("主区域中显示1810267.txt文件");

    //步骤2: 在文件保存对话框内以“.”开头保存文件,弹窗提示,点击【隐藏】
    await device.pressKey("Ctrl+A");
    //await agent.aiDoubleClick("1810267.txt");
    await device.typeText('.181n.txt');
    await agent.aiTap("保存");
    //有隐藏弹窗提示，保存文件成功
    await agent.aiWaitFor('弹框出现');
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("隐藏");
    await agent.aiTap("右上角【X】");
    await agent.aiAssert("主区域中存在.181n.txt文件");

    //步骤3: 在文件保存对话框内以“.”开头新建文件夹
    await agent.aiDoubleClick("1810267.txt");
    await agent.aiTap('文本编辑器右上角的菜单按钮');
    await agent.aiWaitFor('另存为选项');
    await agent.aiTap("另存为");
    await agent.aiTap('文件管理器左侧的视频');
    await agent.aiRightClick("主区域空白处");
    await agent.aiTap("新建文件夹");
    await device.typeText('.181m');
    await device.pressKey("Enter");
    //无弹窗提示，新建文件夹成功
    await agent.aiAssert("主区域中显示.181m文件夹");

    //步骤4: 在文件保存对话框内以“.”开头重命名文件夹
    await agent.aiRightClick(".181m");
    await agent.aiTap("重命名");
    await device.typeText('.181n');
    await device.pressKey("Enter");
    // 无弹窗提示，重命名文件夹成功
    await agent.aiAssert("主区域中显示.181n文件夹");


    await device.pressKey('Ctrl+H');; // 取消勾选显示隐藏文件,还原环境
    console.log('✅ 1810267用例测试完成');

  }, { timeout: 600000, tags: ["1810267", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理创建的测试文件夹
    await system.exec('rm -rf ~/Desktop/.181* ~/Desktop/1810267*', 500);
    await system.exec('rm -rf ~/Videos/.181* ~/Videos/新建*', 500);
    await system.cleanupFileManager();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    // 关闭所有文本编辑器窗口
    await system.exec('killall deepin-editor', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});







