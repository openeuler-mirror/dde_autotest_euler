/**
 * 用例 PMSID: 1524963
 * 用例标题: 拼音-候选扩展，启用英文补全
 * 生成时间: 2026-05-13 10:58:44
 * 用例编写人： UT002899(胡诗敏)
 */

describe('1524963-拼音-候选扩展，启用英文补全', () => {
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

    //构造测试场景：拼音设置中的【英文补全】未勾选
    await agent.aiTap("输入法状态栏第8个图标");
    await agent.aiWaitFor("属性设置窗口已显示");
    await agent.aiTap("拼音");
    await agent.aiScroll("拼音属性设置区域",{direction:'down',distance: 10});
    await agent.aiTap("英文补全复选框");
    await agent.aiWaitFor("英文补全复选框显示未勾选")
    await agent.aiTap("关闭")
    await agent.aiAssert("属性窗口关闭");
  });

  test('1524963-拼音-候选扩展，启用英文补全', async ({ device, agent, uos }) => {
    // 步骤 1: 打开属性设置菜单，进入拼音
    console.log("步骤 1: 打开属性设置菜单，进入拼音")
    await agent.aiTap("输入法状态栏第8个图标");
    await agent.aiWaitFor("属性设置窗口已显示");
    await agent.aiTap("拼音");
    await agent.aiAssert("显示拼音属性设置界面");

    // 步骤 2: 候选扩展中，勾选【英文补全】
    await agent.aiScroll("拼音属性设置区域",{direction:'down',distance: 10});
    await agent.aiTap("英文补全复选框");
    await agent.aiWaitFor("英文补全复选框显示已勾选")
    await agent.aiTap("关闭")
    await agent.aiAssert("属性窗口关闭");

    // 步骤 3: 打开输入焦点，拼音输入模式，输入【hellow】
    await uos.openApp("文本编辑器");
    await agent.aiTap("文本编辑器输入区域");
    await device.pressKey("h");
    await device.pressKey("e");
    await device.pressKey("l");
    await device.pressKey("l");
    await device.pressKey("o");
    await device.pressKey("w");
    await agent.aiAssert("第一个候选词为Helloween");

  }, { timeout: 1200000, tags: ["1524963","smoke","hushimin","level3"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //恢复环境：切换至默认输入法
    await device.pressKey('ctrl','space')
    //数据清理，关闭文本编辑器
    await system.exec("ps aux | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('文本编辑器窗口已关闭');
  });
});