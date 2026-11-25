
/**
 * 用例 PMSID: 1806451
 * 用例标题: 文管选择窗-复制名称-手动修改后缀后点击其他文件
 * 生成时间: 2026-07-24 10:00:00
 * 用例编写人：UT002411（胡戬）
 */
// @ts-nocheck
require("dotenv/config");

describe('1806451-文管选择窗-复制名称-手动修改后缀后点击其他文件', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await uos.showDesktop();
    // 前置条件：桌面创建两个测试文件test.txt、test1.mp4
    await system.exec(`touch ~/Desktop/test.txt ~/Desktop/test1.mp4`, 500);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806451-文管选择窗-复制名称-手动修改后缀后点击其他文件', async ({ device, agent, uos, system }) => {
    // 步骤1：右键计算机图标，点击发送到，再点击创建链接
    console.log('步骤1：右键计算机图标，点击发送到，再点击创建链接');
    await agent.aiRightClick('计算机');
    await agent.aiTap('发送到');
    await agent.aiTap('创建链接');
    // 断言1：打开文件选择窗口
    await agent.aiAssert("文件保存窗口已打开");
    console.log('断言1：文件保存窗口已打开');

    // 步骤2：键盘输入方向键right键，然后输入".txt"
    console.log('步骤2：键盘输入方向键right键，然后输入".txt"');
    await agent.aiTap("文件选择窗口下方文件名输入框");
    await device.pressKey('Right');
    await device.typeText('.txt');

    // 步骤3：在文件选择窗口侧边栏点击桌面，切换到桌面目录
    console.log('步骤3：在文件选择窗口侧边栏点击桌面，切换到桌面目录');
    await agent.aiTap("文件选择窗口左侧边栏的桌面");
    await agent.aiWaitFor("文件选择窗口显示桌面文件内容");

    // 步骤4：点击文件选择窗口中的test1.mp4
    console.log('步骤4：点击文件选择窗口中的test1.mp4');
    await agent.aiTap("文件选择窗口中的test1.mp4文件");
    // 断言2：文件选择窗口下方文件名显示为test1.txt
    await agent.aiAssert("文件选择窗口下方文件名显示为test1.txt");
    console.log('断言2：文件选择窗口下方文件名显示为test1.txt');

    // 步骤5：点击文件名栏目中test1.txt的右方空白处，输入".mp3"
    console.log('步骤5：点击文件名栏目中test1.txt的右方空白处，输入".mp3"');
    await agent.aiTap("文件选择窗口下方文件名输入框中test1.txt文字右侧的空白处");
    await device.typeText('.mp3');

    // 步骤6：点击文件选择窗口中的test.txt
    console.log('步骤6：点击文件选择窗口中的test.txt');
    await agent.aiTap("文件选择窗口中的test.txt文件");
    // 断言3：文件选择窗口下方文件名显示为test.mp3
    await agent.aiAssert("文件选择窗口下方文件名显示为test.mp3");
    console.log('断言3：文件选择窗口下方文件名显示为test.mp3');

    // 步骤7：点击文件名右侧的方框，ctrl+a全选，然后delete删除
    console.log('步骤7：点击文件名输入框，ctrl+a全选，然后delete删除');
    await agent.aiTap("文件选择窗口下方文件名输入框");
    await device.pressKey('Ctrl', 'a');
    await device.pressKey('Delete');

    // 步骤8：点击文件选择窗口中的test1.mp4
    console.log('步骤8：点击文件选择窗口中的test1.mp4');
    await agent.aiTap("文件选择窗口中的test1.mp4文件");
    // 断言4：文件选择窗口下方文件名显示为test1
    await agent.aiAssert("文件选择窗口下方文件名显示为test1");
    console.log('断言4：文件选择窗口下方文件名显示为test1');

  }, { timeout: 600000, tags: ['1806451', 'level4', 'file_selection_dialog', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 后置步骤：删除创建的测试文件
    await system.exec(`rm -f ~/Desktop/test.txt ~/Desktop/test1.mp4`, 500);
    // 关闭所有文管窗口
    await uos.closeCurrentWindow();
    await device.pressKey('Esc');
    await system.exec('killall dde-file-manager & killall dde-file-dialog', 500);
  });
});
