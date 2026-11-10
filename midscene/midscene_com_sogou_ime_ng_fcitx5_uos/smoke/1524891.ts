/**
 * 用例 PMSID: 1524891
 * 用例标题: 状态栏切换繁体输入
 * 生成时间: 2026-05-13 10:57:56
 * 用例编写人： UT002899(胡诗敏)
 */

describe('1524891-1524891', () => {
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

  test('1524891-状态栏切换繁体输入', async ({ device, agent, uos }) => {
    // 步骤 1: 点击输入法状态栏第4个简繁切换图标
    console.log("步骤 1: 点击输入法状态栏第4个简繁切换图标")
    await agent.aiTap("输入法状态栏第4个图标");
    await agent.aiAssert("状态栏第4个图标显示为繁");

    // 步骤 2: 输入窗口输入fanti，按空格键上屏第一个候选词
    console.log("步骤 2: 输入窗口输入fanti，按空格键上屏第一个候选词")
    await uos.openApp("文本编辑器");
    await agent.aiTap("文本编辑器输入区域");
    await device.pressKey("f");
    await device.pressKey("a");
    await device.pressKey("n");
    await device.pressKey("t");
    await device.pressKey("i");
    await device.pressKey("Space");
    await agent.aiAssert("成功上屏繁體");
    await agent.aiTap("未命名文档1关闭按钮:X");
    await agent.aiTap("不保存");

  }, { timeout: 600000, tags: ["1524891","smoke","hushimin","level2"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //恢复环境：切换至默认输入法
    await agent.aiTap("输入法状态栏第4个图标");
    await agent.aiAssert("状态栏第4个图标显示简");
    await device.pressKey('ctrl','space')
    //数据清理：关闭文本编辑器
    await system.exec("ps aux | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('文本编辑器窗口已关闭');
  });
});