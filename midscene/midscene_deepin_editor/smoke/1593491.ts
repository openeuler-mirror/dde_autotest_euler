// @ts-nocheck
/**
 * 用例 PMSID: 1593491
 * 用例标题: 字数展示_UI
 * 生成时间：2025-12-17 12:00:00
  * 用例编写人：UT000686(李双双)
 */

describe('1593491-字数展示_UI', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1593491-字数展示_UI', async ({ device, agent, uos, system }) => {
    
    // 步骤1：启动器打开文本编辑器
    await system.exec("rm -rf ~/.config/deepin/deepin-editor/", 500);
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    console.log('执行步骤1：启动器打开文本编辑器');
    await uos.openApp('文本编辑器', 2000, 20000, true);
    await agent.aiWaitFor("文本编辑器应用打开");
    
    // 步骤2：点击顶栏的“+”号新建一个标签
    console.log('执行步骤2：点击顶栏+号按钮新建标签');
    await agent.aiTap("顶部+号按钮");
    await agent.aiWaitFor("新标签页创建完成");
    
    // 步骤3：断言文本编辑器页面底栏上有“字数0”的文案
    console.log('执行步骤3：断言文本编辑器页面底栏显示字数0');
    await agent.aiAssert("文本编辑器页面底栏显示'字数0'的文案");
    // 步骤4：在文本编辑器页面，输入test123哈哈
    console.log('执行步骤4：在文本编辑器中输入test123哈哈');
    await device.typeText("test123哈哈");
    
    // 步骤5：断言文本编辑器页面底栏上有“字数9”的文案
    console.log('执行步骤5：断言文本编辑器页面底栏显示字数9');
    await agent.aiAssert("文本编辑器页面底栏显示'字数9'的文案");

    // await agent.aiRightClick("顶部高亮的标签")
    // await agent.aiTap("关闭标签页")
    // await agent.aiWaitFor("保存的弹框")
    // await agent.aiTap("不保存")

    console.log('测试用例执行完成');
  }, { timeout: 600000, tags: ['1593491', 'level1','smoke', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭文本编辑器
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    await system.exec("rm -rf ~/.config/deepin/deepin-editor/", 500);
  });
});