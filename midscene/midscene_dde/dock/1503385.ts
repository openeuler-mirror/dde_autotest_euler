/**
 * 用例 PMSID: 1503385
 * 用例标题: 【任务栏】【显示桌面区域】显示桌面区域入口检查
 * 生成时间: 2026-02-11 15:30:00
 * 用例编写人：UT000224(何权)
 */

describe('1503385-【任务栏】【显示桌面区域】显示桌面区域入口检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1503385-【任务栏】【显示桌面区域】显示桌面区域入口检查', async ({ device, agent, uos, system }) => {
    // 获取屏幕尺寸
    const screenSizeResult = await system.exec(`xdpyinfo | awk '/dimensions:/ {print $2; exit}' | tr 'x' ' '`);
    const screenSize = typeof screenSizeResult === 'string' ? screenSizeResult : screenSizeResult.stdout || screenSizeResult.output || '';
    const [screenWidth, screenHeight] = screenSize.trim().split(' ').map(Number);
    console.log(`屏幕尺寸: ${screenWidth}x${screenHeight}`);
    
    await uos.openApp("文件管理器");
    
    console.log('测试1: 任务栏在屏幕上方时，显示桌面区域入口检查');
    await system.exec(`dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:0`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 屏幕右上角
    await system.exec(`xdotool mousemove ${screenWidth - 10} 10`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("hover提示'显示桌面'");
    await system.exec(`xdotool click 1`);
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiAssert("桌面无文件管理器窗口");

    console.log('测试2: 任务栏在屏幕右方时，显示桌面区域入口检查');
    await system.exec(`dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:1`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 屏幕右侧底部
    await system.exec(`xdotool mousemove ${screenWidth - 10} ${screenHeight - 10}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("hover提示'显示桌面'");
    await system.exec(`xdotool click 1`);
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiAssert("桌面存在文件管理器窗口");

    console.log('测试3: 任务栏在屏幕左方时，显示桌面区域入口检查');
    await system.exec(`dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:3`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 屏幕左侧底部
    await system.exec(`xdotool mousemove 10 ${screenHeight - 10}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("hover提示'显示桌面'");
    await system.exec(`xdotool click 1`);
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiAssert("桌面无文件管理器窗口");

    console.log('测试4: 任务栏在屏幕下方时，显示桌面区域入口检查');
    await system.exec(`dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:2`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 屏幕底部右侧
    await system.exec(`xdotool mousemove ${screenWidth - 10} ${screenHeight - 10}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("hover提示'显示桌面'");
    await system.exec(`xdotool click 1`);
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiAssert("桌面存在文件管理器窗口");

  }, { timeout: 1200000, tags: ['1503385', 'level1', 'smoke'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await new Promise(resolve => setTimeout(resolve, 500)); //系统存在概率性设置失败，添加等待时间
    await system.exec(`dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:2`);
    await new Promise(resolve => setTimeout(resolve, 500));
    await system.exec(`killall dde-file-manager`)
  });
});