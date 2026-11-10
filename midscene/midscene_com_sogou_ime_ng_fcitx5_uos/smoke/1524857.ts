/**
 * 用例 PMSID: 1524857
 * 用例标题: 快捷键切换英文输入
 * 生成时间: 2026-05-13 10:55:12
 * 用例编写人： UT002899(胡诗敏)
 */

describe('1524857-快捷键切换英文输入', () => {
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
    await agent.aiTap("搜狗输入法工具栏第5个图标");
    await agent.aiTap("中文拼音(全键盘v3)");
  });

  test('1524857-快捷键切换英文输入', async ({ device, agent, uos }) => {
    // 步骤 1: 点击输入窗口，按快捷键shift
    console.log("步骤 1: 点击输入窗口，按快捷键shift")
    await uos.openApp("文本编辑器");
    await agent.aiTap("文本编辑器输入区域");
    await device.pressKey("Shift");
    await agent.aiAssert("切换到英文输入，状态栏第一个图标显示英");

    // 步骤 2: 输入ceshi
    console.log("步骤 2: 输入ceshi")
    await device.pressKey("c");
    await device.pressKey("e");
    await device.pressKey("s");
    await device.pressKey("h");
    await device.pressKey("i");
    await agent.aiAssert("成功上屏ceshi，无候选词框");
    await agent.aiTap("未命名文档1关闭按钮:X");
    await agent.aiTap("不保存");

  }, { timeout: 300000, tags: ["1524857","smoke","hushimin","level1"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //恢复环境：切换至默认输入法
    await device.pressKey("Shift");
    await agent.aiAssert("切换到中文输入，状态栏第一个图标显示中");
    await device.pressKey('ctrl','space')
    //数据清理：关闭文本编辑器
    await system.exec("ps aux | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('文本编辑器窗口已关闭');
  });
});