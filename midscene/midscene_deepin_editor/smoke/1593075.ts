// @ts-nocheck
/**
 * 用例 PMSID: 1593075
 * 用例标题: 字号大小设置
 * 生成时间：2025-12-17 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1593075-字号大小设置', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1593075-字号大小设置', async ({ device, agent, uos, system }) => {
    
    // 步骤1：启动器打开文本编辑器,输入“test-editor”
    await system.exec(" rm -rf ~/.config/deepin/deepin-editor/", 500);
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    console.log('执行步骤1：启动器打开文本编辑器');
    await uos.openApp('文本编辑器', 2000, 20000, true);
    await agent.aiWaitFor("文本编辑器应用打开");

    //  // 点击顶栏的“+”号新建一个标签
    // console.log('执行步骤2：点击顶栏+号按钮新建标签');
    // await agent.aiTap("顶部+号按钮");
    // await agent.aiWaitFor("新标签页创建完成");
    
    // 在文本编辑器中输入“test-editor”
    console.log('在文本编辑器中输入"test-editor-1593075"');
    await device.typeText("test-editor-1593075", true);
    
    // 步骤2：在文本编辑器的右上角的主菜单页面，点击“设置”，断言字号默认是12
    console.log('执行步骤2：点击右上角主菜单按钮打开设置页面');
    await agent.aiTap("文本编辑器右上角主菜单按钮");
    await agent.aiWaitFor("主菜单页面打开");
    await agent.aiTap("点击‘设置’选项");
    
    // 断言字号默认是12
    await agent.aiAssert("设置页面中字号默认值为12");
    
    // 步骤3：在字号设置框中输入8，断言内容可正常显示
    console.log('执行步骤3：在字号设置框中输入8');
    await agent.aiDoubleClick("字号设置输入框");
    await device.typeText("8", true);
    // 断言内容可正常显示，变大变小AI无法识别
    await agent.aiAssert("test-editor-1593075字号显示正常");
    
    // 步骤4：在字号设置框中输入50，断言内容可正常显示
    console.log('执行步骤4：在字号设置框中输入50');
    await agent.aiDoubleClick("字号设置输入框");
    await device.typeText("50", true);
    // 断言内容可正常显示，，变大变小AI无法识别
    await agent.aiAssert("test-editor-1593075字号显示正常");
    await device.pressKey('Alt+F4');
    console.log('测试用例执行完成');
  }, { timeout: 600000, tags: ['1593075', 'level3','smoke', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭文本编辑器
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    await system.exec(" rm -rf ~/.config/deepin/deepin-editor/", 500);
  });
});