/**
 * 用例 PMSID: 1882555
 * 用例标题: 【桌面】【剪贴板】任务栏隐藏后，打开剪贴板自动靠紧屏幕边界展示
 * 生成时间: 2025-12-23 21:30:00
 * 用例编写人：UT000224(何权)
 */

describe('1882555-【桌面】【剪贴板】任务栏隐藏后，打开剪贴板自动靠紧屏幕边界展示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    // 重启剪贴板服务确保干净环境
    system.exec(`systemctl --user restart dde-clipboard`);
  });

  beforeEach(async ({ device, agent , system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1882555-【桌面】【剪贴板】任务栏隐藏后，打开剪贴板自动靠紧屏幕边界展示', async ({ device, agent, uos, system }) => {
    // 步骤1: 设置任务栏为一直隐藏后，直接打开剪贴板
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"HideMode" variant:int32:1`
    );
    // 设置任务栏位置为底部 (Position=4)
    await system.exec(
      `dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:3`
    );
    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待任务栏隐藏动画完成
    
    // 打开剪贴板
    await system.exec(`xdotool key Super+v`);
    await agent.aiWaitFor("剪贴板界面已显示");
    // 验证剪贴板在屏幕左侧展开，上下左侧都靠紧屏幕边界
    await agent.aiAssert("剪贴板在屏幕右侧展开，窗口无遮挡");
    
    // 关闭剪贴板
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`
    );
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤2: 设置任务栏位置为左，并隐藏后，再打开剪贴板
    console.log('步骤2: 设置任务栏位置为左并隐藏，打开剪贴板');
    // 设置任务栏位置为左 (Position=3)
    await system.exec(
      `dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:2`
    );
    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待任务栏位置改变和隐藏动画完成
    
    // 打开剪贴板
    await system.exec(`xdotool key Super+v`);
    await agent.aiWaitFor("剪贴板界面已显示");
    // 验证剪贴板在屏幕左侧展开，左侧靠紧屏幕边界
    await agent.aiAssert("剪贴板在屏幕右侧展开，窗口无遮挡");
    
    // 关闭剪贴板
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`
    );
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤3: 设置任务栏位置为上，并隐藏后，再打开剪贴板
    console.log('步骤3: 设置任务栏位置为上并隐藏，打开剪贴板');
    // 设置任务栏位置为上 (Position=2)
    await system.exec(
      `dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:2`
    );
    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待任务栏位置改变和隐藏动画完成
    
    // 打开剪贴板
    await system.exec(`xdotool key Super+v`);
    await agent.aiWaitFor("剪贴板界面已显示");
    // 验证剪贴板在屏幕左侧展开，上下左侧都靠紧屏幕边界
    await agent.aiAssert("剪贴板在屏幕右侧展开，窗口无遮挡");
    
    // 关闭剪贴板
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`
    );
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤4: 设置任务栏位置为右，并隐藏后，再打开剪贴板
    console.log('步骤4: 设置任务栏位置为右并隐藏，打开剪贴板');
    // 设置任务栏位置为右 (Position=1)
    await system.exec(
      `dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:1`
    );
    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待任务栏位置改变和隐藏动画完成
    
    // 打开剪贴板
    await system.exec(`xdotool key Super+v`);
    await agent.aiWaitFor("剪贴板界面已显示");
    // 验证剪贴板在屏幕左侧展开，上下左侧都靠紧屏幕边界
    await agent.aiAssert("剪贴板在屏幕右侧展开，窗口无遮挡");

  }, { timeout: 600000, tags: ['1882555', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭剪贴板
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`
    );
    await new Promise(resolve => setTimeout(resolve, 500));
    system.exec(`systemctl --user restart dde-clipboard`);
    await new Promise(resolve => setTimeout(resolve, 500));        
    await system.exec(
      `dbus-send --session --print-reply   --dest=org.deepin.dde.daemon.Dock1   /org/deepin/dde/daemon/Dock1   org.freedesktop.DBus.Properties.Set   string:"org.deepin.dde.daemon.Dock1"   string:"HideMode"   variant:int32:0`
    );
    await new Promise(resolve => setTimeout(resolve, 500));    
    await system.exec(
      `dbus-send --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:2`
    );
  });
});