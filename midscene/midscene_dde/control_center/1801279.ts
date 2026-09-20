/**
 * 用例 PMSID: 1801279
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】重置修改后的系统快捷键
 * 生成时间: 2026-09-11
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801279-【控制中心】【设备】【键盘】【快捷键】重置修改后的系统快捷键', () => {
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

  test('1801279-【控制中心】【设备】【键盘】【快捷键】重置修改后的系统快捷键', async ({ device, agent, uos }) => {
    // 打开控制中心，进入键盘-快捷键页面
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 若弹出"更新传递优化服务异常"系统弹窗先按 Esc 关闭，避免遮挡界面
    await device.pressKey("Escape");
    await agent.aiTap("左侧导航中的：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiWaitFor("快捷键设置页面已打开，显示'系统'等分类的快捷键列表", { timeoutMs: 10000 });

    // 步骤 1: 修改终端快捷键 Ctrl+Alt+T → Super+L，点击冲突提示上的替换
    await agent.aiWaitFor("页面可见'终端'一行", { timeoutMs: 10000 });
    await agent.aiTap("'终端'这一行右侧的键位区域", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 600));
    await device.pressKey("Super", "L");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor("页面出现行内冲突提示：此快捷键与[锁屏界面]冲突，点击取消或替换", { timeoutMs: 10000 });
    await agent.aiTap("行内冲突提示末尾的'替换'文字（点击后接受冲突、应用新快捷键）", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1200));
    await agent.aiWaitFor("'终端'右侧键位显示为 Super+L 且该行冲突提示消失", { timeoutMs: 10000 });
    await agent.aiAssert("'终端'右侧键位显示为 Super+L（修改成功）", { timeoutMs: 10000 });
    // 步骤 2: 检查锁屏界面快捷键显示
    await agent.aiAssert("'锁屏界面'右侧键位显示为：无", { timeoutMs: 10000 });
    // 步骤 3: 修改关机界面快捷键 → Super+K
    // 双向兜底定位目标行
    await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:12});
    let rFound = false;
    for (let attempt = 0; attempt < 4 && !rFound; attempt++) {
      try {
        await agent.aiWaitFor("页面可见'关机界面'一行", { timeoutMs: 5000 });
        rFound = true;
      } catch (e) {
        if (attempt % 2 === 0) await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:10});
        else await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'up',distance:12});
      }
    }
    if (!rFound) {
      await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'up',distance:35});
      await agent.aiWaitFor("页面可见'关机界面'一行", { timeoutMs: 8000 });
    }
    // 修改关机界面为 Super+K（点击/录入偶发未生效，自动重试至生效）
    let st3 = false;
    for (let t = 0; t < 3 && !st3; t++) {
      try {
        await agent.aiTap("'关机界面'这一行右侧的键位区域", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 800));
        await device.pressKey("Super", "K");
        await new Promise(resolve => setTimeout(resolve, 1000));
        for (let v3 = 0; v3 < 6; v3++) {
          try { await agent.aiWaitFor("'关机界面'右侧键位显示为 Super+K", { timeoutMs: 4000 }); break; }
          catch (e) { await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction: v3 % 2 === 0 ? 'down' : 'up', distance: 12}); }
        }
        await agent.aiWaitFor("'关机界面'右侧键位显示为 Super+K", { timeoutMs: 4000 });
        st3 = true;
      } catch (e) { console.log(`步骤3 第 ${t + 1} 次未生效，重试`); }
    }
    await agent.aiAssert("'关机界面'右侧键位显示为 Super+K（修改成功）", { timeoutMs: 10000 });
    // 步骤 4: 修改关闭窗口快捷键为 Alt+F3（点击/录入偶发未生效，自动重试至生效）
    let st4 = false;
    for (let t = 0; t < 3 && !st4; t++) {
      try {
        await agent.aiTap("'关闭窗口'这一行右侧的键位区域", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 800));
        await device.pressKey("Alt", "F3");
        await new Promise(resolve => setTimeout(resolve, 1000));
        for (let v4 = 0; v4 < 6; v4++) {
          try { await agent.aiWaitFor("页面可见'关闭窗口'一行", { timeoutMs: 4000 }); break; }
          catch (e) { await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction: v4 % 2 === 0 ? 'down' : 'up', distance: 12}); }
        }
        await agent.aiWaitFor("'关闭窗口'右侧键位显示为 Alt+F3", { timeoutMs: 8000 });
        st4 = true;
      } catch (e) { console.log(`步骤4 第 ${t + 1} 次未生效，重试`); }
    }
    await agent.aiAssert("'关闭窗口'右侧键位显示为 Alt+F3（修改成功）", { timeoutMs: 10000 });
    // 步骤 5: 修改切换到左边工作区快捷键为 Super+X（双向定位+自动重试）
    let st5 = false;
    for (let t = 0; t < 3 && !st5; t++) {
      // 双向滚动定位目标行（该行位于列表下方窗口/工作区分类区域）
      await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:15});
      for (let v5 = 0; v5 < 6; v5++) {
        try { await agent.aiWaitFor("页面可见'切换到左边工作区'一行", { timeoutMs: 4000 }); break; }
        catch (e) { await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction: v5 % 2 === 0 ? 'down' : 'up', distance: 12}); }
      }
      try {
        await agent.aiTap("'切换到左边工作区'这一行右侧的键位区域", { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 800));
        await device.pressKey("Super", "X");
        await new Promise(resolve => setTimeout(resolve, 1000));
        for (let v6 = 0; v6 < 6; v6++) {
          try { await agent.aiWaitFor("'切换到左边工作区'右侧键位显示为 Super+X", { timeoutMs: 4000 }); break; }
          catch (e) { await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction: v6 % 2 === 0 ? 'down' : 'up', distance: 12}); }
        }
        await agent.aiWaitFor("'切换到左边工作区'右侧键位显示为 Super+X", { timeoutMs: 5000 });
        st5 = true;
      } catch (e) { console.log(`步骤5 第 ${t + 1} 次未生效，重试`); }
    }
    await agent.aiAssert("'切换到左边工作区'右侧键位显示为 Super+X（修改成功）", { timeoutMs: 10000 });
    // 步骤 6: 点击"恢复默认"按钮，全部恢复
    await agent.aiTap("页面底部或右上角的'恢复默认'按钮", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2500));
    // 恢复默认即刻生效；恢复默认按钮位于页面底部，点击后视口在列表下部，先回滚到列表顶部再逐项验证
    await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'up',distance:40});
    for (let rv = 0; rv < 4; rv++) {
      try { await agent.aiWaitFor("页面可见'终端'这一行", { timeoutMs: 5000 }); break; }
      catch (e) { await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:10}); }
    }
    await agent.aiAssert("'终端'右侧键位恢复显示 Ctrl+Alt+T", { timeoutMs: 10000 });
    for (let rv = 0; rv < 4; rv++) {
      try { await agent.aiWaitFor("页面可见'锁屏界面'这一行", { timeoutMs: 5000 }); break; }
      catch (e) { await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:10}); }
    }
    await agent.aiAssert("'锁屏界面'右侧键位恢复显示 Super+L", { timeoutMs: 10000 });
    for (let rv = 0; rv < 4; rv++) {
      try { await agent.aiWaitFor("页面可见'关机界面'这一行", { timeoutMs: 5000 }); break; }
      catch (e) { await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:10}); }
    }
    await agent.aiAssert("'关机界面'右侧键位恢复显示 Ctrl+Alt+Delete", { timeoutMs: 10000 });
    for (let rv = 0; rv < 4; rv++) {
      try { await agent.aiWaitFor("页面可见'关闭窗口'这一行", { timeoutMs: 5000 }); break; }
      catch (e) { await agent.aiScroll("快捷键设置页面右侧的快捷键列表区域",{direction:'down',distance:10}); }
    }
    await agent.aiAssert("'关闭窗口'右侧键位恢复显示 Alt+F4", { timeoutMs: 10000 });
  }, { timeout: 600000, tags: ['1801279', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
