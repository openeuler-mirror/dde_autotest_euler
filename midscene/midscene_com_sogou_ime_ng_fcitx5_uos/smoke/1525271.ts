/**
 * 用例 PMSID: 1525271
 * 用例标题: 高级-快捷键，中英文切换设置为shift，启用切换到英文时，上屏已输入字符
 * 生成时间: 2026-05-13 10:02:35
 * 用例编写人： UT002899(胡诗敏)
 */

describe('1525271-高级-快捷键，中英文切换设置为shift，启用切换到英文时，上屏已输入字符', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await system.exec('killall deepin-editor');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //前置条件：切换输入法为搜狗输入法
    await device.pressKey('ctrl','shift')
    await agent.aiWaitFor("桌面显示搜狗输入法工具栏")
    //前置条件构造：进入高级菜单，中英文切换选择Ctrl，取消勾选切换到英文时，上屏已输入字符复选框
    await agent.aiTap("输入法状态栏第8个图标");
    await agent.aiWaitFor("属性设置窗口已显示");
    await agent.aiTap("高级");
    await agent.aiAssert("显示高级设置界面");
    await agent.aiTap("中英文切换菜单右侧的ctrl");
    await agent.aiTap("切换到英文时，上屏已输入字符复选框", {deepThink:true});
    await agent.aiAssert("切换到英文时，上屏已输入字符复选框显示未勾选");
    await agent.aiTap("关闭");
    await agent.aiAssert("属性窗口关闭");
  });

  test('1525271-高级-快捷键，中英文切换设置为shift，启用切换到英文时，上屏已输入字符', async ({ device, agent, uos }) => {
    // 步骤 1: 打开属性设置菜单，进入高级
    console.log("步骤 1: 打开属性设置菜单，进入高级")
    await agent.aiTap("输入法状态栏第8个图标");
    await agent.aiWaitFor("属性设置窗口已显示");
    await agent.aiTap("高级");
    await agent.aiAssert("显示高级设置界面");

    // 步骤 2: 设置中英文切换为【shift】，并勾选【切换到英文时，上屏已输入字符】
    console.log("步骤 2: 设置中英文切换为【shift】，并勾选【切换到英文时，上屏已输入字符】")
    await agent.aiTap("中英文切换菜单右侧的shift");
    await agent.aiTap("切换到英文时，上屏已输入字符复选框", {deepThink:true});
    await agent.aiAssert("切换到英文时，上屏已输入字符复选框显示已勾选");
    await agent.aiTap("关闭");
    await agent.aiAssert("属性窗口关闭");

    // 步骤 3: 打开输入焦点，五笔输入模式，输入【ng】，按键盘shift
    console.log("步骤 3: 打开输入焦点，五笔输入模式，输入【ng】，按键盘shift")
    await uos.openApp("文本编辑器");
    await agent.aiTap("文本编辑器输入区域");
    await device.pressKey("ctrl", "Shift", "w");
    await device.pressKey("n");
    await device.pressKey("g");
    await device.pressKey("Shift");
    await agent.aiAssert("【ng】直接上屏，输入法状态栏切换到英文输入模式");
    await agent.aiTap("未命名文档1关闭按钮:X");
    await agent.aiTap("不保存");

    // 步骤 4: 打开输入焦点，拼音输入模式，输入【nihao】，按键盘shift
    console.log("步骤 4: 打开输入焦点，拼音输入模式，输入【nihao】，按键盘shift")
    await device.pressKey("Shift");
    await device.pressKey("ctrl", "Shift", "w");
    await uos.openApp("文本编辑器");
    await agent.aiTap("文本编辑器输入区域");
    await device.pressKey("n");
    await device.pressKey("i");
    await device.pressKey("h");
    await device.pressKey("a");
    await device.pressKey("o");
    await device.pressKey("Shift");
    await agent.aiAssert("【nihao】直接上屏，显示内容nihao，输入法状态栏切换到英文输入模式");
    await agent.aiTap("未命名文档1关闭按钮:X");
    await agent.aiTap("不保存");

  }, { timeout: 600000, tags: ["1525271","smoke","hushimin","level3"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //恢复环境：切换至默认输入法
    await device.pressKey("Shift");
    await agent.aiAssert("切换到中文输入法，状态栏第5个图标显示拼");
    await device.pressKey('ctrl','space')

  });
});