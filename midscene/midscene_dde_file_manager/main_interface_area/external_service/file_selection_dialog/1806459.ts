
/**
 * 用例 PMSID: 1806459
 * 用例标题: 文件选择对话框，搜索输入框进行搜索
 * 生成时间: 2026-07-24 10:00:00
 * 用例编写人：UT002411（胡戬）
 */
// @ts-nocheck
require("dotenv/config");

describe('1806459-文件选择对话框，搜索输入框进行搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 前置条件：桌面创建两个测试文件abc.txt、abc123.txt
    await system.exec(`touch ~/Desktop/abc.txt ~/Desktop/abc123.txt`, 500);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806459-文件选择对话框，搜索输入框进行搜索', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文本编辑器，按ctrl+o
    console.log('步骤1：打开文本编辑器，按ctrl+o打开文件选择窗口');
    await uos.openApp("文本编辑器");
    await device.pressKey('Ctrl+o');
    // 断言1：打开文件选择窗口
    await agent.aiAssert("文件选择窗口已打开");
    console.log('断言1：文件选择窗口已打开');

    // 步骤2：在文件选择窗口的地址栏输入abc，进行搜索
    console.log('步骤2：在文件选择窗口的地址栏输入abc，进行搜索');
    await agent.aiTap("文件选择窗口左侧边栏的桌面");
    await agent.aiWaitFor("文件选择窗口显示桌面文件内容");
    await agent.aiTap("文件选择窗口的右上角的搜索图标");
    await device.typeText('abc');
    await device.pressKey('Enter');
    await agent.aiWaitFor("文件选择窗口显示搜索结果");
    // 断言2：搜索成功，结果中包含abc.txt和abc123.txt
    await agent.aiAssert("文件选择窗口的搜索结果中包含abc.txt和abc123.txt");
    console.log('断言2：搜索成功，结果中包含abc.txt和abc123.txt');

    // 步骤3：搜索框中继续输入123，搜索abc123
    console.log('步骤3：搜索框中继续输入123，搜索abc123');
    await agent.aiTap("文件选择窗口的地址栏搜索输入框");
    await device.pressKey('Right');
    await device.typeText('123');
    await device.pressKey('Enter');
    await agent.aiWaitFor("文件选择窗口显示更新后的搜索结果");
    // 断言3：搜索成功，结果中仅包含abc123.txt
    await agent.aiAssert("文件选择窗口的搜索结果中仅包含abc123.txt，不包含abc.txt");
    console.log('断言3：搜索成功，结果中仅包含abc123.txt');

  }, { timeout: 600000, tags: ['1806459', 'level3', 'file_selection_dialog', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 后置步骤：删除创建的测试文件
    await system.exec(`rm -f ~/Desktop/abc.txt ~/Desktop/abc123.txt`, 500);
    // 关闭所有文管窗口和文本编辑器
    await uos.closeCurrentWindow();
    await device.pressKey('Esc');
    await system.exec('killall deepin-editor & killall dde-file-dialog', 500);
  });
});
