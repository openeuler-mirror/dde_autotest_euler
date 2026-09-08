/**
 * 用例 PMSID: 1829997
 * 用例标题: 【任务栏】【状态】任务栏一直隐藏状态展示
 * 生成时间: 2026-02-09 11:11:00
 * 用例编写人：UT000224(何权)
 */

describe('1829997-【任务栏】【状态】任务栏一直隐藏状态展示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 确保任务栏处于显示状态以及在底部状态，便于设置隐藏模式
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"HideMode" variant:int32:0`
    );
    await new Promise(resolve => setTimeout(resolve, 500));
    await system.exec(
      `dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:2`
    );  
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1829997-【任务栏】【状态】任务栏一直隐藏状态展示', async ({ device, agent, uos, system }) => {
    // 步骤1: 设置任务栏一直隐藏，查看桌面底部没有任务栏隐藏
    console.log('步骤1: 设置任务栏一直隐藏并验证');
    await agent.aiRightClick("底部任务栏空白处");
    await agent.aiTap("状态");
    await agent.aiTap("一直隐藏");
    
    // 验证桌面底部没有任务栏显示
    await agent.aiTap("桌面中间");
    await agent.aiAssert("屏幕底部没有任务栏窗口");
    
    // 步骤2: 桌面上或应用窗口内任意鼠标操作，任务栏一直隐藏，不会展示
    console.log('步骤2: 鼠标操作验证任务栏保持隐藏');
    
    // 打开应用窗口（以文本编辑器为例）
    await system.exec("/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 在应用窗口内点击
    await agent.aiTap("文本编辑器编辑区域");
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiAssert("任务栏保持隐藏状态，没有展示");
    
    // 关闭应用窗口
    await system.exec("killall deepin-editor");
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 步骤3: 拖动应用窗口与任务栏区域重叠，任务栏一直隐藏，不会展示
    console.log('步骤3: 拖动窗口到任务栏区域验证');
    
    // 再次打开应用窗口
    await system.exec("/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 拖动窗口到屏幕底部（任务栏区域）
    await agent.aiDrag("文本编辑器窗口标题栏", "屏幕底部区域", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 验证任务栏仍然保持隐藏
    await agent.aiAssert("存在应用窗口，无任务栏窗口");
    
    // 关闭应用窗口
    await system.exec("killall deepin-editor");

  }, { timeout: 600000, tags: ['1829997', 'level2'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复任务栏为正常显示模式
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"HideMode" variant:int32:0`
    );
    await new Promise(resolve => setTimeout(resolve, 500));
    // 确保所有应用窗口已关闭
    await system.exec("killall deepin-editor");
  });
});