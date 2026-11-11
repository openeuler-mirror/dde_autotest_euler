/**
 * 用例 PMSID: 1525321
 * 用例标题: 五笔-特殊习惯启用智能造词
 * 生成时间: 2026-05-13 11:03:55
 * 用例编写人： UT002899(胡诗敏)
 */

describe('1525321-五笔-特殊习惯启用智能造词', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 初始化测试环境
    await system.exec('killall deepin-editor');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //前置条件：切换输入法为搜狗输入法
    await device.pressKey('ctrl','shift')
    await agent.aiWaitFor("桌面显示搜狗输入法工具栏")
    await agent.aiTap("搜狗输入法工具栏第5个图标");
    await agent.aiTap("五笔(v3)");

    //构造测试场景：取消勾选智能造词
    await agent.aiTap("输入法状态栏第8个图标");
    await agent.aiWaitFor("属性设置窗口已显示");
    await agent.aiTap("五笔");
    await agent.aiAssert("打开五笔设置界面");
    await agent.aiTap("特殊习惯区域，智能造词复选框");
    await agent.aiAssert("智能造词未勾选");
    await agent.aiTap("关闭");
    await agent.aiAssert("属性窗口关闭");
  });

  test('1525321-五笔-特殊习惯启用智能造词', async ({ device, agent, uos }) => {
    // 步骤 1: 打开属性设置菜单，进入五笔
    console.log("步骤 1: 打开属性设置菜单，进入五笔")
    await agent.aiTap("输入法状态栏第8个图标");
    await agent.aiWaitFor("属性设置窗口已显示");
    await agent.aiTap("五笔");
    await agent.aiAssert("打开五笔设置界面");

    // 步骤 2: 特殊习惯中，勾选【智能造词】
    console.log("步骤 2: 特殊习惯中，勾选【智能造词】")
    await agent.aiTap("特殊习惯区域，智能造词复选框");
    await agent.aiAssert("智能造词已勾选");
    await agent.aiTap("关闭");
    await agent.aiAssert("属性窗口关闭");

    // 步骤 3: 打开输入焦点，五笔输入模式，输入fdmj
    console.log("步骤 3: 打开输入焦点，五笔输入模式，输入fdmj")
    await uos.openApp("文本编辑器");
    await agent.aiTap("文本编辑器输入区域");
    await device.pressKey("f");
    await device.pressKey("d");
    await device.pressKey("m");
    await device.pressKey("j");
    await agent.aiAssert("上屏：需");
    await agent.aiKeyboardPress("Backspace");

    // 步骤 4: 再输入ti，上屏：秒，最后输入fdti
    console.log("步骤 4: 再输入ti，上屏：秒，最后输入fdti")
    await device.pressKey("t");
    await device.pressKey("i");
    await device.pressKey("Space");
    await agent.aiAssert("上屏：秒");
    await agent.aiKeyboardPress("Backspace");
    await device.pressKey("f");
    await device.pressKey("d");
    await device.pressKey("t");
    await device.pressKey("i");
    await agent.aiAssert("显示需秒");
    await agent.aiTap("未命名文档1关闭按钮:X");
    await agent.aiTap("不保存");

  }, { timeout: 600000, tags: ["smoke","1525321","hushimin","level3"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //恢复环境：切换至默认输入法
    await device.pressKey("ctrl", "Shift", "w");
    await agent.aiAssert("切换到中文输入法，状态栏第5个图标显示拼");
    await device.pressKey('ctrl','space')

  });
});