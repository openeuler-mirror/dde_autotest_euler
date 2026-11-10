/**
 * 用例 PMSID: 1524959
 * 用例标题: 拼音-候选扩展，启用网址邮箱补全
 * 生成时间: 2026-05-13
 * 用例编写人： UT002899(胡诗敏)
 */

describe('1524959-拼音-候选扩展，启用网址邮箱补全', () => {
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

  test('1524959-拼音-候选扩展，启用网址邮箱补全', async ({ device, agent, uos }) => {
    // 步骤 1: 打开一个输入焦点
    console.log("步骤 1: 打开一个输入焦点")
    await uos.openApp("文本编辑器");
    await agent.aiTap("文本编辑器输入区域");

    // 步骤 2: 输入【www.】
    console.log("步骤 2: 输入【www.】")
    await device.pressKey("w");
    await device.pressKey("w");
    await device.pressKey("w");
    await agent.aiKeyboardPress("period");
    await agent.aiAssert("候选词存在多个网址候选词");
    await device.pressKey("space");
    await agent.aiTap("未命名文档1关闭按钮:X");
    await agent.aiTap("不保存");

    //步骤 3：打开一个输入焦点
    console.log("步骤 3：打开一个输入焦点")
    await uos.openApp("文本编辑器");
    await agent.aiTap("文本编辑器输入区域");

    // 步骤 4: 输入【test@】
    console.log("步骤 4: 输入【test@】")
    await device.pressKey("t");
    await device.pressKey("e");
    await device.pressKey("s");
    await device.pressKey("t");
    await device.pressKey('shift','2');
    await agent.aiAssert("候选词存在多个邮箱候选词");
    await device.pressKey("space");
    await agent.aiTap("未命名文档1关闭按钮:X");
    await agent.aiTap("不保存");

  }, { timeout: 300000, tags: ["1524959","smoke","hushimin","level3"] });

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