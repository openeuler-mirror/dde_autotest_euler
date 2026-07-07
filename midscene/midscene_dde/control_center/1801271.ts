
/**
 * 用例 PMSID: 1801271
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】系统快捷键检查
 * 生成时间: 2026-04-23 09:04:31
 * 用例编写人: UT005571(王艺桥)
 */

describe('1801271-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】系统快捷键检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  test('1801271-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】系统快捷键检查', async ({ device, agent, uos, system }) => {
    // 步骤1：点击控制中心-蓝牙和其他设备-键盘-通用，点击菜单项中的快捷键-检查系统快捷键显示和顺序
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    
    // 检查终端快捷键
    await agent.aiAssert("终端快捷键为Ctrl+Alt+T");
    
    // 检查终端雷神模式快捷键
    await agent.aiAssert("终端雷神模式快捷键为Alt+F2");
    
    // 检查全局搜索快捷键
    await agent.aiAssert("全局搜索快捷键为Shift+Space");
    
    // 检查截图相关快捷键
    await agent.aiAssert("截图快捷键为Ctrl+Alt+A");
    await agent.aiAssert("延时截图快捷键为Ctrl+Print");
    await agent.aiAssert("全屏截图快捷键为Print");
    await agent.aiAssert("窗口截图快捷键为Alt+Print");
    await agent.aiAssert("滚动截图快捷键为Ctrl+Alt+I");
    
    // 检查图文识别快捷键
    await agent.aiAssert("图文识别快捷键为Ctrl+Alt+C");
    
    // 检查录屏快捷键
    await agent.aiAssert("录屏快捷键为Alt+Ctrl+R");
    
    // 检查窗口切换快捷键
    await agent.aiAssert("切换同类型窗口快捷键为Alt+`");
    await agent.aiAssert("反向切换同类型窗口快捷键为Alt+Shift+~");
    
    // 检查工作区快捷键
    await agent.aiAssert("显示工作区快捷键为Super+S");

    await agent.aiScroll('设备/键盘/快捷键下方区域',{direction:'down',distance:10});

    // 检查启动器快捷键
    await agent.aiAssert("启动器快捷键为Super");
    
    // 检查窗口管理快捷键
    await agent.aiAssert("切换窗口快捷键为Alt+Tab");
    await agent.aiAssert("反向切换窗口快捷键为Alt+Shift+Tab");
    await agent.aiAssert("显示桌面快捷键为Super+D");
    
    // 检查文件管理器快捷键
    await agent.aiAssert("文件管理器快捷键为Super+E");
    
    // 检查系统快捷键
    await agent.aiAssert("锁屏界面快捷键为Super+L");
    await agent.aiAssert("关机界面快捷键为Ctrl+Alt+Delete");
    
    // 检查其他快捷键
    await agent.aiAssert("切换窗口效果快捷键为Shift+Super+Tab");
    await agent.aiAssert("系统监视器快捷键为Ctrl+Alt+Escape");
    await agent.aiAssert("剪切板快捷键为Super+V");
    await agent.aiAssert("切换多屏模式快捷键为Super+P");
  }, { timeout: 600000, tags: ['1801271', 'level2'] });

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
