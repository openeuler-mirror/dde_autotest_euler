/**
 * 用例 PMSID: 1936703
 * 用例标题: 【控制中心】【设备】键盘菜单项概述文案显示
 * 生成时间: 2026-09-11
 * 用例编写人:UT005571(王艺桥)
 */

describe('1936703-【控制中心】【设备】键盘菜单项概述文案显示', () => {
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

  test('1936703-【控制中心】【设备】键盘菜单项概述文案显示', async ({ device, agent, uos }) => {
    // 打开控制中心，进入键盘页面
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 若弹出"更新传递优化服务异常"系统弹窗先按 Esc 关闭，避免遮挡界面
    await device.pressKey("Escape");
    await agent.aiTap("左侧导航中的：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiWaitFor("键盘设置页面已打开，页面可见'通用'、'输入法'、'快捷键'三个菜单项", { timeoutMs: 10000 });

    // 检查：键盘概述文案
    await agent.aiAssert("页面顶部路径显示'蓝牙和其他设备 / 键盘'；右侧设置区上方可见'通用'（含重复延迟、重复速度等设置项），下方菜单项为：输入法、快捷键", { timeoutMs: 10000 });
  }, { timeout: 600000, tags: ['1936703', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
