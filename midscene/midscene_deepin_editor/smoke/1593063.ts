// @ts-nocheck
/**
 * 用例 PMSID: 1593063
 * 用例标题: 显示行号
 * 生成时间：2025-12-17 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1593063-显示行号', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1593063-显示行号', async ({ device, agent, uos, system }) => {
    
    // 步骤1：启动器打开文本编辑器，断言文本编辑器页面左侧默认显示行号
    await system.exec("rm -rf ~/.config/deepin/deepin-editor/", 500);
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    console.log('执行步骤1：启动器打开文本编辑器');
    await uos.openApp('文本编辑器', 2000, 2000, true);
    await agent.aiWaitFor("文本编辑器应用打开");
    await agent.aiAssert("文本编辑器页面左侧默认显示行号");
    
    // 步骤2：在文本编辑器右上角的设置页面，点击“设置”，断言“显示行号”默认是选中的状态
    console.log('执行步骤2：点击右上角主菜单按钮打开设置页面');
    await agent.aiTap("文本编辑器右上角主菜单按钮");
    await agent.aiWaitFor("主菜单页面打开");
    await agent.aiTap("点击‘设置’选项");
    await agent.aiAssert("设置页面中'显示行号'选项默认处于选中状态");
    
    // 步骤3：在设置页面，取消“显示行号”的选择状态，断言文本编辑器页面左侧不显示行号
    console.log('执行步骤3：取消显示行号选项');
    await agent.aiTap("'显示行号'选项");
    await agent.aiAssert("文本编辑器页面左侧不显示行号");
    
    // 步骤4：在设置页面，勾选“显示行号”，关闭设置页面
    console.log('执行步骤4：勾选显示行号选项并关闭设置页面');
    await agent.aiTap("'显示行号'选项");
    await agent.aiTap("设置页面关闭按钮");

    console.log('测试用例执行完成');
  }, { timeout: 600000, tags: ['1593063', 'level3','smoke', 'lishuangshuang'] });

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