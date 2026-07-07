// @ts-nocheck
/**
 * 用例 PMSID: 1593045
 * 用例标题: 设置【快捷键】
 * 生成时间：2025-12-16 12:00:00
 * 用例编写人：UT000686(李双双)
 */

describe('1593045-设置【快捷键】', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1593045-设置【快捷键】', async ({ device, agent, uos, system }) => {
    // 步骤1：启动器打开文本编辑器
    await system.exec("rm -rf ~/.config/deepin/deepin-editor/", 500);
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    console.log('执行步骤1：启动器打开文本编辑器');
    await uos.openApp('文本编辑器', 2000, 20000, true);
    
    // 步骤2：点击“F1”，断言帮助手册应用可正常打开
    console.log('执行步骤2：按F1打开帮助手册');
    await device.pressKey("F1");
    await agent.aiWaitFor("帮助手册应用打开");
    await agent.aiAssert("帮助手册应用已正常打开");
    
    // 步骤3：点击帮助手册应用的窗口的X，关闭帮助手册
    console.log('执行步骤3：关闭帮助手册');
    await agent.aiTap("帮助手册窗口右上角关闭按钮:X");
    // await agent.aiWaitFor("帮助手册应用关闭");
    
    // 步骤4：在文本编辑器页面，点击“Alt+shift+/”，断言文本编辑器页面显示快捷键预览
    console.log('执行步骤4：按Alt+Shift+/显示快捷键预览');
    await device.pressKey("Ctrl","shift","Slash"); 
    // 这个快捷键预览非常快，都是闪现，AI抓不到，优化断言为无报错
    await agent.aiAssert("文本编辑器页面新增一个快捷键窗口");
    
    console.log('测试用例执行完成');
  }, { timeout: 600000, tags: ['1593045', 'level3','smoke', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
        // 关闭文本编辑器
    // await agent.aiTap("文本编辑器窗口右上角关闭按钮:X");
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9", 500);
    await system.exec("rm -rf ~/.config/deepin/deepin-editor/", 500);
  });
});
