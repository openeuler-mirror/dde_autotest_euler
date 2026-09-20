/**
 * 用例 PMSID: 1801239
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】放大镜快捷键检查
 * 生成时间: 2026-09-11
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801239-【控制中心】【设备】【键盘】【快捷键】放大镜快捷键检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 保险：重置屏幕缩放（Super+0），防止上一个用例放大残留影响本用例定位
    await device.pressKey("Super", "0");
    await new Promise(resolve => setTimeout(resolve, 800));
    // 若弹出"更新传递优化服务异常"系统弹窗会遮挡界面，先按 Esc 关闭
    await device.pressKey("Escape");
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 按 UUID 清理全部自定义快捷键，避免残留干扰
    await system.exec(`export XDG_RUNTIME_DIR=/run/user/1000; dbus-send --session --print-reply --dest=org.deepin.dde.Keybinding1 /org/deepin/dde/Keybinding1 org.deepin.dde.Keybinding1.ListAllShortcuts | grep -oE 'org\.deepin\.dde\.keybinding\.shortcut\.custom\.[0-9a-f-]+' | sort -u | while read id; do dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"$id" >/dev/null 2>&1; done`);
    // 恢复系统快捷键默认（防止上一用例修改残留，如屏幕放大/文件管理器键位被改动）
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
    await new Promise(resolve => setTimeout(resolve, 800));
  });

  test('1801239-【控制中心】【设备】【键盘】【快捷键】放大镜快捷键检查', async ({ device, agent, uos }) => {
    // 打开控制中心，进入键盘-快捷键页面
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 若弹出"更新传递优化服务异常"系统弹窗先按 Esc 关闭，避免遮挡界面
    await device.pressKey("Escape");
    await agent.aiTap("左侧导航中的：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiWaitFor("快捷键设置页面已打开，显示'系统'等分类的快捷键列表", { timeoutMs: 10000 });

    // 快捷键列表较长，连续向下滚动至"屏幕放大/屏幕缩小/重置屏幕缩放"所在区域
    await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:25});
    await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:25});
    await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:25});
    await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:25});
    // 等待辅助功能相关行出现
    await agent.aiWaitFor("页面可见'屏幕放大'一行（辅助功能相关分类中）", { timeoutMs: 10000 });
    // 检查：放大镜（屏幕缩放）快捷键展示
    await agent.aiAssert("页面显示三行：屏幕放大右侧为 Super =（或 Super+=）、屏幕缩小右侧为 Super -、重置屏幕缩放右侧为 Super 0", { timeoutMs: 12000 });
  }, { timeout: 600000, tags: ['1801239', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
