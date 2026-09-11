/**
 * 用例 PMSID: 1804915
 * 用例标题: 不勾选【显示隐藏文件】-在文件选择对话框内以“.”开头新建/重命名文件-弹窗提示-点击【隐藏】
 * 生成时间: 2026-03-10 13:10:00
 * 用例编写人: UT001774(李炎)
 */

describe('1804915- 不勾选【显示隐藏文件】-在文件选择对话框内以“.”开头新建/重命名文件-弹窗提示-点击【隐藏】', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    // 关闭所有文件管理器窗口
    await system.exec('kill -SIGTERM $(pidof dde-file-manager)', 500);
    // 关闭所有文本编辑器窗口
    await system.exec('kill -SIGTERM $(pidof deepin-editor)', 500);
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清理可能存在的测试文件
    await system.exec('rm -rf ~/Videos/.1804*', 500);
    await system.exec('rm -rf ~/Desktop/.1804*', 500);
    await system.exec('rm -rf ~/Desktop/1804915*', 500);
  });

  test('1804915- 不勾选【显示隐藏文件】-在文件选择对话框内以“.”开头新建/重命名文件-弹窗提示-点击【隐藏】', async ({ device, agent, uos, env, system }) => {
    console.log('=== 开始测试：1804915- 不勾选【显示隐藏文件】-在文件选择对话框内以“.”开头新建/重命名文件-弹窗提示-点击【隐藏】 ===');

    //前置条件：创建测试文件和文件夹
    await system.exec('mkdir -p ~/Desktop/1804915', 500);
    await system.exec('touch ~/Desktop/1804915.txt', 500);

    //步骤1：在文件选择对话框内以“.”开头新建文件，弹窗后点击【隐藏】
    await uos.openApp('文本编辑器', { maximizeWindow: true });
    console.log('文本编辑器已启动');
    await agent.aiTap('文本编辑器右上角的菜单按钮');
    await agent.aiWaitFor('打开文件选项');
    await agent.aiTap('打开文件');
    await agent.aiTap('文件管理器左侧的视频');
    await agent.aiRightClick("文件管理器窗口的空白区域");
    await agent.aiHover("新建文档");
    await agent.aiTap("文本文档");
    await device.typeText('.1804n');
    await device.pressKey("Enter");
    //预期: 新建文件成功，文件被隐藏，勾选【显示隐藏文件】或ctrl+h后文件可见
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("隐藏");
    await agent.aiAssert("主区域中不显示.1804n.txt文件");

    //步骤2：在文件选择对话框内以“.”开头新建文件夹，弹窗后点击【隐藏】
    await agent.aiRightClick("文件管理器窗口的空白区域");
    await agent.aiTap("新建文件夹");
    await device.typeText('.1804915');
    await device.pressKey("Enter");
    //预期: 新建文件夹成功，文件夹被隐藏，勾选【显示隐藏文件】或ctrl+h后文件可见
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("隐藏");
    await agent.aiAssert("主区域中不显示.1804915文件夹");

    //步骤3：在文件选择对话框内以“.”开头重命名文件，弹窗后点击【隐藏】
    await agent.aiTap('文件管理器左侧的桌面');
    await agent.aiRightClick("1804915.txt上方的文件图标");
    await agent.aiTap("重命名");
    await device.typeText('.1804m');
    await device.pressKey("Enter");
    //预期: 重命名文件成功，文件被隐藏，勾选【显示隐藏文件】或ctrl+h后文件可见
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("隐藏");
    await agent.aiAssert("主区域中不显示.1804m.txt文件");

    //步骤4：在文件选择对话框内以“.”开头重命名文件夹，弹窗后点击【隐藏】
    await agent.aiRightClick("1810265上方的文件夹图标");
    await agent.aiTap("重命名");
    await device.typeText('.1804m');
    await device.pressKey("Enter");
    //预期: 重命名文件夹成功，文件夹被隐藏，勾选【显示隐藏文件】或ctrl+h后文件可见
    await agent.aiAssert("弹框:文件名以“.”开始将会隐藏此文件，请确认是否继续？");
    await agent.aiTap("隐藏");
    await agent.aiAssert("主区域中不显示.1804m文件夹");

    console.log('✅ 1804915用例测试完成');

  }, { timeout: 600000, tags: ["1804915", "level3", "menu", "liyan"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理创建的测试文件夹
    await system.exec('rm -rf ~/Videos/.1804*', 500);
    await system.exec('rm -rf ~/Desktop/.1804*', 500);
    await system.exec('rm -rf ~/Desktop/1804915*', 500);
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







