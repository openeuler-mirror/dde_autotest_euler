/**
 * 用例 PMSID: 1525003
 * 用例标题: 拼音-输入习惯设置为双拼，启用拼音纠错
 * 生成时间: 2026-05-13 10:59:10
 * 用例编写人： UT002899(胡诗敏)
 */

describe('1525003-拼音-输入习惯设置为双拼，启用拼音纠错', () => {
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

  test('1525003-拼音-输入习惯设置为双拼，启用拼音纠错', async ({ device, agent, uos }) => {
    // 步骤 1: 打开属性设置菜单，进入拼音
    console.log("步骤 1: 打开属性设置菜单，进入拼音")
    await agent.aiTap("输入法状态栏第8个图标");
    await agent.aiWaitFor("属性设置窗口已显示");
    await agent.aiTap("拼音");
    await agent.aiAssert("打开拼音设置界面");

    // 步骤 2: 启用双拼，勾选【拼音纠错】
    console.log("步骤 2: 启用双拼，勾选【拼音纠错")
    await agent.aiTap("双拼单选框");
    await agent.aiWaitFor("双拼显示已勾选");
    await agent.aiTap("关闭");
    await agent.aiAssert("属性窗口不显示");

    // 步骤 3: 打开输入焦点，拼音输入模式，输入liou
    console.log("步骤 3: 打开输入焦点，拼音输入模式，输入liou")
    await uos.openApp("文本编辑器");
    await agent.aiTap("文本编辑器输入区域");
    await device.pressKey("l");
    await device.pressKey("i");
    await device.pressKey("o");
    await device.pressKey("u");
    await agent.aiAssert("第一个候选词为【留】");

  }, { timeout: 600000, tags: ["1525003","smoke","hushimin","level3"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //恢复环境：切换至默认输入法
    await agent.aiTap("输入法状态栏第8个图标");
    await agent.aiWaitFor("属性设置窗口已显示");
    await agent.aiTap("拼音");
    await agent.aiTap("全拼单选框");
    await agent.aiAssert("全拼显示已勾选");
    await agent.aiTap("关闭")
    await agent.aiAssert("属性窗口关闭");
    await device.pressKey('ctrl','space')
    //数据清理：关闭文本编辑器
    await system.exec("ps aux | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -15");
    await agent.aiWaitFor('文本编辑器窗口已关闭');
  });
});