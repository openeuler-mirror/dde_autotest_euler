
/**
 * 用例 PMSID: 1832853
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】系统快捷键和应用快捷键冲突，多次使用修改后的快捷键，响应正常
 * 生成时间: 2026-02-04 20:51:24
 * 用例编写人:UT005571(王艺桥)
 */

describe('1832853-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】系统快捷键和应用快捷键冲突，多次使用修改后的快捷键，响应正常', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent,uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 检查锁屏的快捷键为：Super+L
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:5});
    await agent.aiAssert("锁屏界面右侧显示：Super L");
  });

  test('1832853-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】系统快捷键和应用快捷键冲突，多次使用修改后的快捷键，响应正常', async ({ device, agent, uos }) => {
    // 步骤 1: 修改显示工作区的快捷键为Super+L,点击替换
    await agent.aiTap("显示工作区右侧：Super S",{ deepThink: true });
    await device.pressKey("Super", "L");
    await agent.aiWaitFor("此快捷键与[锁屏界面]快捷键冲突，点击取消或替换")
    await agent.aiTap("替换",{ deepThink: true });
    await new Promise(resolve => setTimeout(resolve,1000));

    // 检查 : 显示工作区设置为Super +L
    await agent.aiAssert("显示工作区右侧显示：Super L");

    // 步骤 2: 检查锁屏界面快捷键显示，显示无
    await agent.aiAssert("锁屏界面右侧显示：无");

    // 步骤 3: 使用快捷键Super+L
    await device.pressKey("Super", "L");
    await new Promise(resolve => setTimeout(resolve,1000));

    // 检查 : 显示工作区
    await agent.aiAssert("桌面右上角存在：+；桌面上方存在小窗口");

    // 步骤 4: 再次使用快捷键Super+L
    await device.pressKey("Super", "L");

    // 检查 : 退出显示工作区
    await agent.aiAssert("右上角不存在：+");

  }, { timeout: 600000, tags: ['1832853', 'level3'] });

  afterEach(async ({ device,agent,uos,system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭控制中心
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
