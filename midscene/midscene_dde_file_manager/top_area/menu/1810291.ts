/**
 * 用例 PMSID: 1810291
 * 用例标题:  不勾选【显示隐藏文件】-文件保存对话框/文件选择对话框
 * 生成时间: 2026-02-03 14:10:00
 * 用例编写人: UT001774(李炎)
 */

describe('1810291-不勾选【显示隐藏文件】-文件保存对话框/文件选择对话框', () => {
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
    // 清理创建的测试文件夹
    await system.exec('rm -rf ~/Videos/.1810*', 500);
    await system.exec('rm -rf ~/Desktop/.1810*', 500);
    await system.exec('rm -rf ~/Desktop/1810291*', 500);
  });

  test('1810291-不勾选【显示隐藏文件】-文件保存对话框/文件选择对话框', async ({ device, agent, uos, env, system }) => {
    console.log('=== 开始测试：1810291-不勾选【显示隐藏文件】-文件保存对话框/文件选择对话框 ===');

    //前置条件：创建测试文件和文件夹
    await system.exec('mkdir ~/Desktop/1810291', 500);

    //步骤1: 在文件保存对话框/文件选择对话框内以“.”开头新建文件夹，弹窗后点击【隐藏】
    await uos.openApp('文本编辑器', { maximizeWindow: true });
    console.log('文本编辑器已启动');
    await agent.aiTap('文本编辑器右上角的菜单按钮');
    await agent.aiWaitFor('打开文件选项');
    await agent.aiTap('打开文件');
    await agent.aiTap('文件管理器左侧的视频');
    await agent.aiRightClick("文件管理器窗口的空白区域");
    await agent.aiTap("新建文件夹");
    await device.typeText('.1810n');
    await device.pressKey("Enter");
    //预期: 新建文件夹成功，文件夹被隐藏，勾选【显示隐藏文件】或ctrl+h后文件可见
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("隐藏");
    await agent.aiAssert("主区域中不显示.1810n文件夹");

    //步骤2:在文件保存对话框/文件选择对话框内以“.”开头重命名文件夹，弹窗后点击【隐藏】
    await agent.aiTap('文件管理器左侧的桌面');
    await agent.aiRightClick("1810291上方的文件夹图标");
    await agent.aiTap("重命名");
    await device.typeText('.1810m');
    await device.pressKey("Enter");
    //预期: 重命名文件夹成功，文件夹被隐藏，勾选【显示隐藏文件】或ctrl+h后文件可见
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("隐藏");
    await agent.aiAssert("主区域中不显示.1810m文件夹");
    // 使用快捷键Ctrl+H验证文件夹可见
    console.log('使用快捷键Ctrl+H验证文件夹可见');
    await device.pressKey('Ctrl+H');; // 显示隐藏文件
    await agent.aiAssert("主区域中显示.1810m文件夹");

    console.log('✅ 1810291用例测试完成');

  }, { timeout: 600000, tags: ["1810291", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理创建的测试文件夹
    await system.exec('rm -rf ~/Videos/.1810*', 500);
    await system.exec('rm -rf ~/Desktop/.1810*', 500);
    await system.exec('rm -rf ~/Desktop/1810291*', 500);
    await system.cleanupFileManager();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    // 关闭所有文件管理器窗口
    await system.exec('killall dde-file-manager', 500);
    // 关闭所有文本编辑器窗口
    await system.exec('killall deepin-editor', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});







