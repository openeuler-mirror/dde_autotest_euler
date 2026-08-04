
/**
 * 用例 PMSID: 1801345
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】系统快捷键和应用快捷键冲突时，取消修改
 * 生成时间: 2026-04-21 09:17:17
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801345-【控制中心】【设备】【键盘】【快捷键】系统快捷键和应用快捷键冲突时，取消修改', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  test('1801345-【控制中心】【设备】【键盘】【快捷键】系统快捷键和应用快捷键冲突时，取消修改', async ({ device, agent, uos, system }) => {
    // 步骤1：打开控制中心，修改显示工作区快捷键为Super+E
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧:蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiTap("显示工作区右侧:Super S");
    await device.pressKey("super", "E");
    
    // 检查：验证冲突弹窗
    await agent.aiAssert("快捷键冲突弹窗文案为'此快捷键与[文件管理器]冲突，点击取消或替换'");

    // 步骤2：点击取消按钮
    await agent.aiTap("快捷键冲突提示中的取消按钮");
    
    // 检查：取消修改
    await agent.aiAssert("显示工作区快捷键显示为Super S");

    // 检查：验证文件管理器快捷键
    await agent.aiScroll('设备/键盘/快捷键下方区域',{direction:'down',distance:5});
    await agent.aiAssert("文件管理器快捷键显示为Super E");
    
    // 检查：显示工作区快捷键
    await agent.aiScroll('设备/键盘/快捷键下方区域',{direction:'up',distance:5});
    await agent.aiAssert("显示工作区快捷键显示为Super S");
    
    // 步骤5：使用快捷键Super E
    await device.pressKey("Super", "E");
    await new Promise(resolve => setTimeout(resolve,1000));

    // 检查：显示工作区快捷键
    await agent.aiAssert("文件管理器应用界面已显示");

    await uos.closeCurrentWindow();

    // 步骤5：使用快捷键Super S
    await device.pressKey("Super", "S");
    await new Promise(resolve => setTimeout(resolve,1000));
    await agent.aiAssert("桌面右上角有：+");
    await agent.aiTap("桌面上方左边的窗口");
  }, { timeout: 600000, tags: ['1801345', 'level3'] });

  afterEach(async ({ device, system ,uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
