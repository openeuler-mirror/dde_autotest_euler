
/**
 * 用例 PMSID: 1801295
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】全局搜索快捷键冲突
 * 生成时间: 2026-04-22 16:08:28
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801295-【控制中心】【设备】【键盘】【快捷键】全局搜索快捷键冲突', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  test('1801295-【控制中心】【设备】【键盘】【快捷键】全局搜索快捷键冲突', async ({ device, agent, uos, system }) => {
    // 步骤1：点击控制中心-设备-键盘-快捷键，修改全局搜索快捷键为已经存在的快捷键，例如：显示工作区:super+s
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiTap("全局搜索右侧Shift Space");
    await device.pressKey("Super", "S");
    await agent.aiAssert("提示文案显示:此快捷键与[显示工作区]冲突，点击取消或替换");
    
    // 步骤2：快捷键冲突提示中，点击取消按钮
    await agent.aiTap("冲突提示中的取消按钮");
    await agent.aiAssert("全局搜索右侧显示:Shift Space");
    
    // 步骤3：快捷键冲突提示中，点击替换按钮
    await agent.aiTap("全局搜索右侧Shift Space");
    await device.pressKey("Super", "S");
    await agent.aiTap("冲突提示中的替换按钮");
    await agent.aiAssert("全局搜索右侧显示:Super S");
    
    // 步骤4：检查显示工作区快捷键显示
    await agent.aiAssert("显示工作区右侧显示为：无");
    
    // 步骤5：使用快捷键Super+S
    await device.pressKey("Super", "S");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("全局搜索搜索框置于当前桌面最上层");
    
    // 步骤6：快捷键界面，点击恢复默认按钮
    await agent.aiTap("恢复默认按钮");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("全局搜索右侧显示:Shift Space");
    await agent.aiAssert("显示工作区右侧显示为:Super S");
  }, { timeout: 600000, tags: ['1801295', 'level3'] });

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
