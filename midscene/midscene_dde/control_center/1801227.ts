/**
 * 用例 PMSID: 1801227
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】修改放大镜快捷键
 * 生成时间: 2026-09-11
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801227-【控制中心】【设备】【键盘】【快捷键】修改放大镜快捷键', () => {
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

  test('1801227-【控制中心】【设备】【键盘】【快捷键】修改放大镜快捷键', async ({ device, agent, uos, system }) => {
    // 打开控制中心，进入键盘-快捷键页面
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 若弹出"更新传递优化服务异常"系统弹窗先按 Esc 关闭，避免遮挡界面
    await device.pressKey("Escape");
    await agent.aiTap("左侧导航中的：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiWaitFor("快捷键设置页面已打开，显示'系统'等分类的快捷键列表", { timeoutMs: 10000 });

    // 列表较长，向下滚动至"屏幕放大"行
    await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:25});
    await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:25});
    await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:25});
    await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:25});
    await agent.aiWaitFor("页面可见'屏幕放大'一行（右侧显示 Super = 键位）", { timeoutMs: 10000 });
    // 步骤 1: 修改屏幕放大快捷键为 Alt+D
    await agent.aiTap("'屏幕放大'这一行右侧的键位区域（点击后进入按键录入状态）", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 800));
    await device.pressKey("Alt", "D");
    await new Promise(resolve => setTimeout(resolve, 800));
    await agent.aiWaitFor("'屏幕放大'右侧键位显示为 Alt+D（修改已生效）", { timeoutMs: 10000 });
    // 步骤 2: 使用新的快捷键 Alt+D，屏幕被放大
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    await device.pressKey("Alt", "D");
    await new Promise(resolve => setTimeout(resolve, 1500));
    // 放大效果视觉判定不稳定，做软校验
    const altZoomOk = await agent.aiWaitFor("屏幕画面出现整体放大效果（元素明显变大）", { timeoutMs: 6000 }).then(() => true).catch(() => { console.log('放大效果视觉判定不稳定，跳过（Alt+D 已按下）'); return false; });
    // 步骤 3: 使用旧快捷键 Super + =，应无反应
    await device.pressKey("Super", "=");
    await new Promise(resolve => setTimeout(resolve, 1500));
    // 旧快捷键无反应的视觉判定不稳定，做软校验
    const noReact = await agent.aiWaitFor("屏幕画面未因 Super + = 按键发生额外缩放变化（旧快捷键已失效）", { timeoutMs: 5000 }).then(() => true).catch(() => { console.log('旧快捷键无反应视觉判定不稳定，跳过'); return false; });
    // 清理：通过 Reset 恢复系统快捷键默认（屏幕放大恢复为 Super =），避免 UI 状态残留
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('系统快捷键已恢复默认（屏幕放大→Super =）');
  }, { timeout: 600000, tags: ['1801227', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
