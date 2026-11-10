/**
 * 用例 PMSID: 1524853
 * 用例标题: 候选词翻页
 * 生成时间: 2026-05-13 10:50:33
 * 用例编写人： UT002899(胡诗敏)
 */

describe('1524853-候选词翻页', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //前置条件：切换输入法为搜狗输入法
    await device.pressKey('ctrl','shift')
    await agent.aiWaitFor("桌面显示搜狗输入法工具栏")
    await agent.aiTap("搜狗输入法工具栏第5个图标");
    await agent.aiTap("中文拼音(全键盘v3)");
  });

  test('1524853-候选词翻页', async ({ device, agent, uos }) => {
    // 步骤 1: 打开文本编辑器，编辑区域输入ceshi
    console.log('打开文本编辑器，编辑区域输入ceshi')
    await uos.openApp("文本编辑器");
    await agent.aiTap("文本编辑器输入区域");
    await device.pressKey("c");
    await device.pressKey("e");
    await device.pressKey("s");
    await device.pressKey("h");
    await device.pressKey("i");
    await agent.aiAssert("第一个候选词为测试")

    // 步骤 2: 按Page DOWN
    console.log('步骤 2: PageDown')
    await agent.aiKeyboardPress("pagedown");
    await agent.aiAssert("候选词第一个选项不是测试");

    // 步骤 3: 按Page UP
    console.log('步骤 3: 按PageUP')
    await agent.aiKeyboardPress("pageup");
    await agent.aiAssert("候选词第一个选项是测试");
    await device.pressKey("space");
    await agent.aiTap("未命名文档1关闭按钮:X");
    await agent.aiTap("不保存");

  }, { timeout: 300000, tags: ["1524853","smoke","hushimin","level2"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
});

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //恢复环境：切换至默认输入法
    await device.pressKey('ctrl','space')
    //数据清理：关闭文本编辑器
    await system.exec("ps aux | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('文本编辑器窗口已关闭');
  });
});