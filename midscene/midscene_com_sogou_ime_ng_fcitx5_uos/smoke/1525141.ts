/**
 * 用例 PMSID: 1525141
 * 用例标题: 拼音输入在控制中心搜索输入框输入
 * 生成时间: 2026-05-13 10:02:02
 * 用例编写人： UT002899(胡诗敏)
 */

describe('1525141-拼音输入在控制中心搜索输入框输入', () => {
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

  test('1525141-拼音输入在控制中心搜索输入框输入', async ({ device, agent, uos }) => {
    // 步骤 1: 打开控制中心，点击搜索框
    console.log("步骤 1: 打开控制中心，点击搜索框")
    await uos.openApp("控制中心");
    await agent.aiTap("控制中心搜索框");

    // 步骤 2: 输入【sougou】
    console.log("步骤 2: 输入【sougou】")
    await device.pressKey("s");
    await device.pressKey("o");
    await device.pressKey("u");
    await device.pressKey("g");
    await device.pressKey("o");
    await device.pressKey("u");
    await agent.aiAssert("候选词条显示搜狗");

    // 步骤 3: 按键盘数字【1】
    console.log("步骤 3: 按键盘数字【1】")
    await agent.aiKeyboardPress("1");
    await agent.aiAssert("【搜狗】字符上屏");
    await agent.aiTap("窗口右上角关闭按钮:X");

  }, { timeout: 300000, tags: ["1525141","smoke","hushimin","level2"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //恢复环境：切换至默认输入法
    await device.pressKey('ctrl','space')
  });
});