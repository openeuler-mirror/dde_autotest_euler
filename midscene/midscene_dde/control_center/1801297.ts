
/**
 * 用例 PMSID: 1801297
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】修改全局搜索快捷键为非默认值
 * 生成时间: 2026-04-22 16:07:19
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801297-【控制中心】【设备】【键盘】【快捷键】修改全局搜索快捷键为非默认值', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  test('1801297-【控制中心】【设备】【键盘】【快捷键】修改全局搜索快捷键为非默认值', async ({ device, agent, uos, system }) => {
    // 步骤1：点击控制中心-设备-键盘-快捷键，修改全局搜索快捷键为不符合快捷键规则的快捷键，例如：alt+super
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiTap("全局搜索右侧Shift Space");
    await device.pressKey("Alt", "Super");
    await agent.aiAssert("输入无法保存,全局搜索右侧显示Shift Space");
    
    // 步骤2：快捷键界面，点击全局搜索快捷键，快捷键输入框中按下delete删除，检查操作结果
    await agent.aiTap("全局搜索右侧Shift Space");
    await device.pressKey("Delete");
    await agent.aiAssert("全局搜索右侧显示无");
    
    // 步骤3：快捷键界面，点击全局搜索快捷键，快捷键输入框中按下backspace删除，检查操作结果
    await agent.aiTap("全局搜索右侧:无");
    await device.pressKey("Backspace");
    await agent.aiAssert("全局搜索右侧显示无");
    
    // 步骤4：快捷键界面，点击全局搜索快捷键，快捷键输入框中按下Super+H，检查操作结果
    await agent.aiTap("全局搜索右侧:无");
    await device.pressKey("Super", "H");
    await agent.aiAssert("全局搜索右侧显示Super H");
    
    // 步骤5：使用快捷键Super+H
    await device.pressKey("Super", "H");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("全局搜索搜索框置于当前桌面最上层");
    
    // 步骤6：快捷键界面，点击底部的恢复默认按钮
    await agent.aiTap("恢复默认按钮");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("全局搜索右侧显示Shift Space");
    
  }, { timeout: 600000, tags: ['1801297', 'level3'] });

  afterEach(async ({ device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
