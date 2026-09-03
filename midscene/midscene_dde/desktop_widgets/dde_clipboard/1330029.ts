
/**
 * 用例 PMSID: 1330029
 * 用例标题: 【桌面】【剪贴板】剪切板内容删除
 * 生成时间: 2025-12-19 17:21:23
 * 用例编写人：UT000224(何权)
 */

describe('1330029-【桌面】【剪贴板】剪切板内容删除', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    
    // 检查剪贴板是否有全部清除按钮，有则点击，没有不报错继续执行
    try {
      system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`,
      );
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiTap("全部清除");   
    } catch (error) {
      console.log('检查剪贴板清除按钮时出错，继续执行：', error.message);
    }
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1330029-【桌面】【剪贴板】剪切板内容删除', async ({ device, agent, uos, system }) => { 
    // 使用文本编辑器生成不同的剪贴板内容
    system.exec("/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor -w %F");
    await agent.aiWaitFor("文本编辑器界面已显示");

    // 生成第1条记录
    await device.typeText("这是一条剪贴板测试数据");
    await device.pressKey("Ctrl", "a");
    await device.pressKey("Ctrl", "c");
    
    // 生成第2条记录
    await device.pressKey("Ctrl", "a");
    await device.pressKey("Delete");
    await device.typeText("这是二条剪贴板测试数据");
    await device.pressKey("Ctrl", "a");
    await device.pressKey("Ctrl", "c");
    
    // 生成第3条记录
    await device.pressKey("Ctrl", "a");
    await device.pressKey("Delete");
    await device.typeText("这是三条剪贴板测试数据");
    await device.pressKey("Ctrl", "a");
    await device.pressKey("Ctrl", "c");
    
    // 打开剪贴板应用
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`,
      );

    // 验证有33条记录存在
    await agent.aiAssert("剪贴板中有3条记录");
    
    // 删除第一条记录
    await agent.aiTap("点击剪贴板中“这是三条剪贴板测试数据”文本记录");
    await agent.aiTap("点击剪贴板中第一个文本右上角的X按钮", { deepThink: true });
    
    // 验证删除效果
    await agent.aiAssert("还剩下两条剪贴板记录“这是二条剪贴板测试数据”和“这是一条剪贴板测试数据”");
    
    // 等待界面更新
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 删除第二条记录
    await agent.aiTap("点击剪贴板中第一个文本右上角的X按钮", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 验证第二条记录删除效果
    await agent.aiAssert("还剩下一条剪贴板记录“这是一条剪贴板测试数据”");
    
    // 全部清除
    await agent.aiTap("全部清除");
    await new Promise(resolve => setTimeout(resolve, 500));
    system.exec("killall deepin-editor")
    
    // 最终验证
    await agent.aiAssert("剪切板中无文本记录");
  }, { timeout: 1200000, tags: ['1330029', 'level2', 'smoke'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
    );    
  });
});
