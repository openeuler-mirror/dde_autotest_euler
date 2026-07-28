// @ts-nocheck
/**
 * 用例 PMSID: 1919201
 * 用例标题: 查找替换-查找弹窗中替换按钮可见性验证（未选中文本）
 * 生成时间：2025-12-17 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1919201-查找替换-查找弹窗中替换按钮可见性验证（未选中文本）', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1919201-查找替换-查找弹窗中替换按钮可见性验证（未选中文本）', async ({ device, agent, uos, system }) => {
    
    // 步骤1：启动器打开文本编辑器，断言文本编辑器可正常打开
    await system.exec("rm -rf ~/.config/deepin/deepin-editor/", 500);
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    console.log('执行步骤1：启动器打开文本编辑器');
    await uos.openApp('文本编辑器', 2000, 20000, true);
    // await uos.maximizeWindow();
    await agent.aiWaitFor("文本编辑器应用打开");
    await agent.aiAssert("文本编辑器可正常打开");
    await device.typeText("test-editor-1919201", true);
    
    // 步骤2：输入快捷键“Ctrl+F”，断言页面有“查找”和“替换”的文案
    console.log('执行步骤2：按Ctrl+F打开查找弹窗');
    await device.pressKey("Ctrl","F"); 
    await agent.aiWaitFor("查找弹窗打开");
    
    // 断言页面有“查找”和“替换”的文案
    await agent.aiAssert("页面显示'查找'文案");
    await agent.aiAssert("页面显示'替换'文案");
    console.log('测试用例执行完成');
  }, { timeout: 600000, tags: ['1919201', 'level3','smoke', 'lishuangshuang'] });

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