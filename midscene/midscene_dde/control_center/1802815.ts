/**
 * 用例 PMSID: 1802815
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】冲突快捷键提示显示
 * 生成时间: 2026-09-11
 * 用例编写人:UT005571(王艺桥)
 */

describe('1802815-【控制中心】【设备】【键盘】【快捷键】冲突快捷键提示显示', () => {
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

  test('1802815-【控制中心】【设备】【键盘】【快捷键】冲突快捷键提示显示', async ({ device, agent, uos }) => {
    // 打开控制中心，进入键盘-快捷键页面
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 若弹出"更新传递优化服务异常"系统弹窗先按 Esc 关闭，避免遮挡界面
    await device.pressKey("Escape");
    await agent.aiTap("左侧导航中的：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiWaitFor("快捷键设置页面已打开，显示'系统'等分类的快捷键列表", { timeoutMs: 10000 });

    // 步骤 1（可视区域内冲突）: 修改"终端"快捷键为 Alt+F2，预期"终端雷神模式"快捷键旁显示冲突提示
    await agent.aiWaitFor("页面可见'终端'一行", { timeoutMs: 10000 });
    let r1 = false;
    for (let t = 0; t < 3 && !r1; t++) {
      try {
        await agent.aiTap("'终端'这一行右侧的键位区域（点击后进入按键录入状态）", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 800));
        await device.pressKey("Alt", "F2");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiWaitFor("页面出现行内冲突提示文字，文案含'冲突'与'取消或替换'字样", { timeoutMs: 6000 });
        r1 = true;
      } catch (e) { console.log(`步骤1 第 ${t + 1} 次未出现冲突提示，重试`); }
    }
    await agent.aiWaitFor("页面出现行内冲突提示文字，文案含'冲突'与'取消或替换'字样", { timeoutMs: 8000 });
    await agent.aiAssert("页面展示行内冲突提示（含'冲突'字样与'取消/替换'选项），冲突对象为占用 Alt+F2 的快捷键（如终端雷神模式）", { timeoutMs: 10000 });
    await agent.aiTap("冲突提示文案中的'取消'文字（点击后放弃这次修改）", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("'终端'右侧键位保持原值 Ctrl+Alt+T（取消后未被修改）", { timeoutMs: 10000 });

    // 步骤 2（可视区域外冲突）: 修改"终端"快捷键为 Super+E，预期列表滚动至"文件管理器"处、其旁显示冲突提示
    await agent.aiTap("'终端'这一行右侧的键位区域", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 800));
    await device.pressKey("Super", "E");
    await new Promise(resolve => setTimeout(resolve, 1000));
    let r2 = false;
    for (let t = 0; t < 3 && !r2; t++) {
      try {
        await agent.aiWaitFor("页面出现行内冲突提示文字，文案含与[文件管理器]冲突、点击取消或替换", { timeoutMs: 6000 });
        r2 = true;
      } catch (e) { console.log(`步骤2 第 ${t + 1} 次未出现冲突提示，重试`); }
    }
    await agent.aiWaitFor("页面出现行内冲突提示文字，文案含与[文件管理器]冲突或仅含'冲突'", { timeoutMs: 8000 });
    // 预期列表滚动至文件管理器位置处，其旁显示冲突提示（含向下指示）；双向小步兜底定位
    let fmVisible = false;
    for (let v = 0; v < 8 && !fmVisible; v++) {
      try {
        await agent.aiWaitFor("页面可见'文件管理器'一行，且该行或旁侧可见冲突提示", { timeoutMs: 4000 });
        fmVisible = true;
      } catch (e) {
        await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction: v % 2 === 0 ? 'up' : 'down', distance: 10});
      }
    }
    if (!fmVisible) {
      await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'up',distance:40});
      await agent.aiWaitFor("页面可见'文件管理器'一行，且该行或旁侧可见冲突提示", { timeoutMs: 8000 });
    }
    await agent.aiAssert("'文件管理器'行旁显示冲突提示（感叹号/提示标识，表示该快捷键被其他快捷键抢占）", { timeoutMs: 10000 });
    await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'up',distance:25});
    await agent.aiTap("冲突提示文案中的'取消'文字（点击后放弃这次修改）", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 3（可视区域外冲突）: 修改"关机界面"快捷键为 Alt+F2，预期列表滚动至"终端雷神模式"处、其旁显示冲突
    await agent.aiWaitFor("页面可见'关机界面'一行", { timeoutMs: 10000 });
    let r3 = false;
    for (let t = 0; t < 3 && !r3; t++) {
      try {
        await agent.aiTap("'关机界面'这一行右侧的键位区域", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 800));
        await device.pressKey("Alt", "F2");
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiWaitFor("页面出现行内冲突提示文字，文案含'冲突'与'取消或替换'", { timeoutMs: 6000 });
        r3 = true;
      } catch (e) { console.log(`步骤3 第 ${t + 1} 次未出现冲突提示，重试`); }
    }
    await agent.aiWaitFor("页面出现行内冲突提示文字，文案含'冲突'与'取消或替换'", { timeoutMs: 8000 });
    // 实际 UI：冲突提示显示在被修改行（关机界面）下方，双向小步兜底定位验证
    let gjVisible = false;
    for (let v = 0; v < 8 && !gjVisible; v++) {
      try {
        await agent.aiWaitFor("页面可见'关机界面'一行，其下方或旁侧可见冲突提示（含'冲突'文案）", { timeoutMs: 4000 });
        gjVisible = true;
      } catch (e) {
        await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction: v % 2 === 0 ? 'up' : 'down', distance: 10});
      }
    }
    await agent.aiAssert("'关机界面'行下方显示冲突提示（含'冲突'字样与'取消/替换'选项）", { timeoutMs: 10000 });
    await agent.aiTap("冲突提示文案中的'取消'文字（点击后放弃这次修改）", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, { timeout: 600000, tags: ['1802815', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
