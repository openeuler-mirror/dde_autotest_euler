// @ts-nocheck
/**
 * 用例 PMSID: 1919203
 * 用例标题: 查找替换-点击替换按钮切换至替换弹窗（未选中文本）
 * 生成时间：2025-12-17 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1919203-查找替换-点击替换按钮切换至替换弹窗（未选中文本）', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1919203-查找替换-点击替换按钮切换至替换弹窗（未选中文本）', async ({ device, agent, uos, system }) => {
    
    // 步骤1：启动器打开文本编辑器，断言文本编辑器可正常打开
    await system.exec("rm -rf ~/.config/deepin/deepin-editor/", 500);
    await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    console.log('执行步骤1：启动器打开文本编辑器');
    await uos.openApp('文本编辑器', 2000, 2000, true);
    await agent.aiWaitFor("文本编辑器应用打开");
    await agent.aiAssert("文本编辑器可正常打开");
    await device.typeText('test-editor1919203', false);
    // await device.pressKey("Ctrl","S"); 
    
    // 步骤2：输入快捷键“Ctrl+F”，断言页面有“查找”和“替换”的文案
    console.log('执行步骤2：按Ctrl+F打开查找弹窗');
    await device.pressKey("Ctrl","F"); 
    
    // 断言页面有“查找”和“替换”的文案
    await agent.aiAssert("页面显示'查找'、'替换'文案");

    // 步骤3：点击“替换”，断言页面“替换”、“跳过”、“剩余替换”、“全部替换”的文案
    console.log('执行步骤3：点击替换按钮切换至替换弹窗');
    await agent.aiTap("替换按钮");
    
    // 断言替换弹窗中的文案
    await agent.aiAssert("页面显示'替换'、'跳过'、'剩余替换'、'全部替换'的文案");
    console.log('测试用例执行完成');
  }, { timeout: 600000, tags: ['1919203', 'level1','smoke', 'lishuangshuang'] });

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