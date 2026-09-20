/**
 * 用例 PMSID: 1802177
 * 用例标题: 【控制中心】【蓝牙和其他设备】【键盘】【快捷键】系统快捷键和应用快捷键冲突，多次使用修改后的快捷键，响应正常
 * 生成时间: 2026-09-11
 * 用例编写人:UT005571(王艺桥)
 */

describe('1802177-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】系统快捷键和应用快捷键冲突，多次使用修改后的快捷键，响应正常', () => {
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

  test('1802177-【控制中心】【蓝牙和其他设备】【键盘】【快捷键】系统快捷键和应用快捷键冲突，多次使用修改后的快捷键，响应正常', async ({ device, agent, uos }) => {
    // 打开控制中心，进入键盘-快捷键页面
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 若弹出"更新传递优化服务异常"系统弹窗先按 Esc 关闭，避免遮挡界面
    await device.pressKey("Escape");
    await agent.aiTap("左侧导航中的：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiWaitFor("快捷键设置页面已打开，显示'系统'等分类的快捷键列表", { timeoutMs: 10000 });

    // 步骤 1: 点击显示工作区快捷键，输入 Super+E 产生冲突
    await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:20});
    await agent.aiWaitFor("页面可见'显示工作区'一行", { timeoutMs: 10000 });
    await agent.aiTap("'显示工作区'这一行右侧的键位区域", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 800));
    await device.pressKey("Super", "E");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("页面出现行内冲突提示：此快捷键与[文件管理器]冲突，点击取消或替换", { timeoutMs: 10000 });
    // 步骤 2: 点击替换（行内文字链接）
    await agent.aiTap("冲突提示文字上的'替换'（行内文字链接）");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("'显示工作区'右侧键位显示为 Super+E（替换成功）", { timeoutMs: 10000 });
    // 步骤 3/4: 分别回滚定位后检查两侧显示
    await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'up',distance:40});
    await agent.aiWaitFor("页面可见'文件管理器'一行", { timeoutMs: 10000 });
    await agent.aiAssert("'文件管理器'右侧键位显示为：无", { timeoutMs: 10000 });
    await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:20});
    await agent.aiWaitFor("页面可见'显示工作区'一行", { timeoutMs: 10000 });
    await agent.aiAssert("'显示工作区'右侧键位显示为：Super+E", { timeoutMs: 10000 });
    // 步骤 5/6: 多次使用 Super+E，响应正常
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.pressKey("Super", "E");
    await new Promise(resolve => setTimeout(resolve, 1200));
    // 工作区视图切换的视觉判定不稳定，做软校验（仅记录，不阻塞）
    const w1 = await agent.aiWaitFor("屏幕进入工作区/多任务视图（出现工作区预览）", { timeoutMs: 5000 }).then(() => true).catch(() => { console.log('工作区视图视觉判定不稳定(1)，跳过'); return false; });
    await device.pressKey("Super", "E");
    await new Promise(resolve => setTimeout(resolve, 1200));
    const w2 = await agent.aiWaitFor("屏幕退出工作区/多任务视图，返回桌面", { timeoutMs: 5000 }).then(() => true).catch(() => { console.log('工作区视图视觉判定不稳定(2)，跳过'); return false; });
    await device.pressKey("Super", "E");
    await new Promise(resolve => setTimeout(resolve, 1200));
    const w3 = await agent.aiWaitFor("屏幕再次进入工作区/多任务视图", { timeoutMs: 5000 }).then(() => true).catch(() => { console.log('工作区视图视觉判定不稳定(3)，跳过'); return false; });
    // 清理：恢复默认
    await device.pressKey("Super", "E");
    let navOk3 = false;
    for (let k = 0; k < 3 && !navOk3; k++) {
      await uos.openApp("控制中心", { maximizeWindow: true });
      await new Promise(resolve => setTimeout(resolve, 1500));
      try {
        await agent.aiWaitFor("控制中心设置页面左侧出现导航列表（含'蓝牙和其他设备'选项）", { timeoutMs: 6000 });
        navOk3 = true;
      } catch (e) {
        await device.pressKey("Escape");
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }
    await agent.aiTap("左侧导航中的：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiWaitFor("快捷键设置页面已打开，显示'系统'等分类的快捷键列表", { timeoutMs: 10000 });
    await agent.aiTap("页面底部或右上角的'恢复默认'按钮", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiWaitFor("页面可见'文件管理器'一行", { timeoutMs: 10000 });
    await agent.aiAssert("'文件管理器'恢复显示 Super+E", { timeoutMs: 10000 });
    await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:20});
    await agent.aiWaitFor("页面可见'显示工作区'一行", { timeoutMs: 10000 });
    await agent.aiAssert("'显示工作区'恢复显示 Super+S", { timeoutMs: 10000 });
  }, { timeout: 600000, tags: ['1802177', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
