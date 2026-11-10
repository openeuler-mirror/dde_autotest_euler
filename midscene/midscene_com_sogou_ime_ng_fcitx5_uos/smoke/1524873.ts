/**
 * 用例 PMSID: 1524873
 * 用例标题: 状态栏打开属性窗口
 * 生成时间: 2026-05-13
 * 用例编写人： UT002899(胡诗敏)
 */

describe('1524873-状态栏打开属性窗口', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    //前置条件：切换输入法为搜狗输入法
    await device.pressKey('ctrl','shift')
    await agent.aiWaitFor("桌面显示搜狗输入法工具栏")
  });

  test('1524873-状态栏打开属性窗口', async ({ device, agent, uos }) => {
    // 步骤 1: 点击输入法状态栏属性图标
    console.log("步骤 1: 点击输入法状态栏属性图标")
    await agent.aiTap("输入法状态栏第8个图标");
    await agent.aiAssert("显示属性窗口");
    await agent.aiTap("关闭");

  }, { timeout: 300000, tags: ["1524873","smoke","hushimin","level1"] });

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