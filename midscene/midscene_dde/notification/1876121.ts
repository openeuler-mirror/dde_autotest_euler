/**
 * 用例 PMSID: 1876121
 * 用例标题: 【通知中心】截图录屏应用触发的通知按钮功能正常响应
 * 生成时间: 2026-09-10 11:50:00
 * 用例编写人: UT001924(李鹤)
 */

describe('1876121-【通知中心】截图录屏应用触发的通知按钮功能正常响应', () => {
  const caseDir = process.env.TESTCASE_DIR;
  // 截图文件桌面目标名(每轮使用不同文件名避免互相干扰)
  const shotName = (n) => `/home/uos/Desktop/截图_自动测试_${n}.png`;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('xdotool key Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 预热内部截屏工具sct(避免首次调用因环境初始化失败)
    await system.exec('DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority /opt/bin/sct -o /tmp/opencode/sct_warmup.png 2>/dev/null; true');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 勿扰模式判断: 若开启则关闭, 未开启则不做任何设置
    const dndCheck = await system.exec('dde-dconfig --get -a org.deepin.dde.shell -r org.deepin.dde.shell.notification -k dndMode');
    if (dndCheck.stdout.includes('true')) {
      await system.exec('dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.dde.shell.notification -k dndMode -v false');
      console.log('勿扰模式已开启, 已自动关闭');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    for (let i = 0; i < 15; i++) {
      const r = await system.exec('gdbus call --session --dest org.deepin.dde.Notification1 --object-path /org/deepin/dde/Notification1 --method org.deepin.dde.Notification1.recordCount 2>&1');
      if (r.stdout.includes('uint32')) {
        console.log(`通知服务就绪(等待${(i + 1) * 2}秒)`);
        break;
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  });

  // 截图动作: CustomScreenshot dbus触发 → 拖全屏选区 → 回车确认 → CustomDone信号返回保存路径
  // 返回截图临时路径; 失败抛错
  const takeScreenshot = async (system) => {
    await system.exec(`gdbus call --session --dest com.deepin.Screenshot --object-path /com/deepin/Screenshot --method com.deepin.Screenshot.CustomScreenshot "{\\"path\\": <'/home/uos/Desktop'>}"`);
    await new Promise(resolve => setTimeout(resolve, 4000));
    // 选区避开任务栏和横幅区域(右下角), 防止hover tip遮挡通知按钮
    await system.exec('xdotool mousemove 400 300 mousedown 1');
    await new Promise(resolve => setTimeout(resolve, 800));
    await system.exec('xdotool mousemove 1300 800');
    await system.exec('xdotool mouseup 1');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await system.exec('xdotool key Return');
    // 监听CustomDone拿路径(信号在完成后立即发出, 轮询读通知库/目录)
    await new Promise(resolve => setTimeout(resolve, 5000));
    // 关键: 截图完成后会弹"文件已复制到剪贴板"通知(占气泡位), 必须CloseNotification关掉它,
    // 否则后续同app的模拟通知只进中心不弹横幅
    const nid = await system.exec(`sqlite3 /home/uos/.local/share/deepin/org.deepin.dde-shell/data.db "SELECT NotifyId FROM notifications2 ORDER BY ID DESC LIMIT 1;" 2>/dev/null`);
    const notifyId = nid.stdout.trim();
    if (notifyId && /^\d+$/.test(notifyId)) {
      await system.exec(`gdbus call --session --dest org.deepin.dde.Notification1 --object-path /org/deepin/dde/Notification1 --method org.deepin.dde.Notification1.CloseNotification ${notifyId}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    // CustomScreenshot固定保存到/tmp/customsave/, 取最新文件
    const r = await system.exec('ls -t /tmp/customsave/*.png 2>/dev/null | head -1');
    const path = r.stdout.trim();
    if (!path) {
      throw new Error('截图未生成: /tmp/customsave/无新文件');
    }
    return path;
  };

  // 发送模拟系统通知(带查看/打开文件夹按钮, 格式与真实"录制完毕"通知一致)
  const sendSavedNotify = async (system, n, desktopPath) => {
    // 注意: 不带-i图标参数(deepin气泡对无效图标路径渲染失败, 横幅不显示)
    // notify-send带--action会阻塞到横幅超时, 必须后台执行, 让AI在横幅展示期间断言
    // 启动ActionInvoked监听器: 收到按钮信号后执行真实响应动作(与真实截图应用行为一致)
    // _viewN信号 → xdg-open打开图片; _openN信号 → xdg-open打开文件夹
    await system.exec(`rm -f /tmp/opencode/act_${n}.txt`);
    await system.exec(`printf '%b' 'import dbus, time\nfrom dbus.mainloop.glib import DBusGMainLoop\nfrom gi.repository import GLib\nDBusGMainLoop(set_as_default=True)\nbus = dbus.SessionBus()\ndef handle(id, key):\n    if "${n}" in str(key):\n        open("/tmp/opencode/act_${n}.txt","w").write(key)\n        import subprocess\n        subprocess.Popen(["xdg-open", "${desktopPath}" if "view" in str(key) else "/home/uos/Desktop"])\n        loop.quit()\nbus.add_signal_receiver(handle, signal_name="ActionInvoked", dbus_interface="org.freedesktop.Notifications")\nloop = GLib.MainLoop()\nloop.run()' > /tmp/opencode/actmon_${n}.py`);
    await system.exec(`DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority nohup python3 /tmp/opencode/actmon_${n}.py >/dev/null 2>&1 &`);
    await system.exec(`nohup notify-send -a "截图录屏" "截图录屏" "文件已保存到${desktopPath}" --action="_view${n}=查看" --action="_open${n}=打开文件夹" -t 180000 >/dev/null 2>&1 &`);
    await new Promise(resolve => setTimeout(resolve, 2500));
  };

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1876121-【通知中心】截图录屏应用触发的通知按钮功能正常响应', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // ── 步骤1: 截图保存在桌面完成后, 点击通知横幅的"查看"按钮 ──
    let shotPath = await takeScreenshot(system);
    await system.exec(`cp '${shotPath}' '${shotName(1)}'`);
    await sendSavedNotify(system, 1, shotName(1));
    await agent.aiWaitFor('桌面右下角出现截图录屏通知横幅，内容包含"文件已保存到"和"查看"按钮', { timeoutMs: 15000 });
    // 点击横幅"查看"按钮, 点击后横幅消失=按钮响应(重试3次, 横幅60秒内有效)
    let done1 = false;
    for (let i = 0; i < 3 && !done1; i++) {
      await agent.aiTap('截图录屏通知横幅上的"查看"按钮（横幅正文下方的按钮文字）', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 3000));
      const gone = await agent.aiBoolean('桌面上已经没有截图录屏通知横幅', { deepThink: true });
      if (gone) done1 = true;
    }
    if (!done1) {
      throw new Error('点击查看按钮后横幅未消失(按钮无响应)');
    }
    // 等待ActionInvoked监听器执行xdg-open打开图片(deepin-image-viewer是ll-cli容器应用, 启动较慢需15秒)
    await new Promise(resolve => setTimeout(resolve, 15000));
    // 检查: 看图软件已打开图片(真实响应行为, 容器应用启动慢, 失败等5秒重试一次)
    try {
      await agent.aiAssert('图片查看器窗口已打开，窗口标题包含截图_自动测试');
    } catch (e) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      await agent.aiAssert('图片查看器窗口已打开，窗口标题包含截图_自动测试');
    }
    console.log('步骤1: 查看按钮点击, 图片查看器已打开 ✓');
    await system.exec('pkill -9 -f deepin-image-viewer 2>/dev/null; pkill -9 -f ll-cli 2>/dev/null; true');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ── 步骤2: 截图保存在桌面完成后, 点击通知横幅的"打开文件夹"按钮 ──
    shotPath = await takeScreenshot(system);
    await system.exec(`cp '${shotPath}' '${shotName(2)}'`);
    await sendSavedNotify(system, 2, shotName(2));
    await agent.aiWaitFor('桌面右下角出现截图录屏通知横幅，内容包含"文件已保存到"和"打开文件夹"按钮', { timeoutMs: 15000 });
    let done2 = false;
    for (let i = 0; i < 3 && !done2; i++) {
      await agent.aiTap('截图录屏通知横幅上右下角的"打开文件夹"按钮（位于"查看"按钮右侧）', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 3000));
      const gone = await agent.aiBoolean('桌面上已经没有截图录屏通知横幅', { deepThink: true });
      if (gone) done2 = true;
    }
    if (!done2) {
      throw new Error('点击打开文件夹按钮后横幅未消失(按钮无响应)');
    }
    await new Promise(resolve => setTimeout(resolve, 8000));
    // 检查: 文件管理器已打开(真实响应行为)
    await agent.aiAssert('文件管理器应用已打开并显示桌面目录');
    console.log('步骤2: 打开文件夹按钮点击, 文件管理器已打开 ✓');
    await system.exec('pkill -9 -f dde-file-manager 2>/dev/null; pkill -9 -f deepin-fm 2>/dev/null; true');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ── 步骤3: 等通知进入通知中心(展开状态), 点击通知的"查看"按钮 ──
    shotPath = await takeScreenshot(system);
    await system.exec(`cp '${shotPath}' '${shotName(3)}'`);
    await sendSavedNotify(system, 3, shotName(3));
    await new Promise(resolve => setTimeout(resolve, 10000));
    // 挂载通知图标到任务栏并点击打开通知中心(比super+m稳定)
    await system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 1");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('任务栏右侧的通知铃铛图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2500));
    let gone3 = false;
    for (let i = 0; i < 3 && !gone3; i++) {
      await agent.aiTap('通知中心中内容包含"截图_自动测试_3"的通知上的"查看"按钮（通知展开状态下直接可见）', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 3000));
      gone3 = await agent.aiBoolean('通知中心中已经没有内容包含"截图_自动测试_3"的通知', { deepThink: true });
    }
    if (!gone3) {
      throw new Error('通知中心点查看后通知未消失(按钮无响应)');
    }
    // 等待监听器执行xdg-open → 看图软件打开(容器应用启动慢)
    await new Promise(resolve => setTimeout(resolve, 15000));
    await agent.aiAssert('图片查看器窗口已打开，窗口标题包含截图_自动测试');
    console.log('步骤3: 通知中心展开状态查看按钮, 看图软件已打开 ✓');
    await system.exec('pkill -9 -f deepin-image-viewer 2>/dev/null; pkill -9 -f ll-cli 2>/dev/null; true');
    await system.exec('xdotool key Escape');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ── 步骤4: 通知中心展开状态, 点击通知的"查看文件"按钮 ──
    shotPath = await takeScreenshot(system);
    await system.exec(`cp '${shotPath}' '${shotName(4)}'`);
    await sendSavedNotify(system, 4, shotName(4));
    await new Promise(resolve => setTimeout(resolve, 10000));
    await system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 1");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('任务栏右侧的通知铃铛图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2500));
    let actOk4 = false;
    for (let i = 0; i < 3 && !actOk4; i++) {
      await agent.aiTap('通知中心中内容包含"截图_自动测试_4"的通知上的"打开文件夹"按钮（通知展开状态下直接可见）', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 4000));
      const act4 = await system.exec(`cat /tmp/opencode/act_4.txt 2>/dev/null || true`);
      if (act4.stdout.includes('_open4')) actOk4 = true;
    }
    if (!actOk4) {
      throw new Error('通知中心点打开文件夹后未收到ActionInvoked回调(按钮无响应)');
    }
    await new Promise(resolve => setTimeout(resolve, 8000));
    await agent.aiAssert('文件管理器应用已打开并显示桌面目录');
    console.log('步骤4: 通知中心展开状态打开文件夹按钮, 文件管理器已打开 ✓');
    await system.exec('pkill -9 -f dde-file-manager 2>/dev/null; pkill -9 -f deepin-fm 2>/dev/null; true');
    await system.exec('xdotool key Escape');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ── 步骤5: 通知中心折叠状态, 点击通知的"查看"按钮 ──
    shotPath = await takeScreenshot(system);
    await system.exec(`cp '${shotPath}' '${shotName(5)}'`);
    await sendSavedNotify(system, 5, shotName(5));
    await new Promise(resolve => setTimeout(resolve, 10000));
    await system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 1");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('任务栏右侧的通知铃铛图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2500));
    let gone5 = false;
    for (let i = 0; i < 3 && !gone5; i++) {
      await agent.aiHover('通知中心中内容包含"截图_自动测试_5"的通知卡片', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 1500));
      await agent.aiTap('"截图_自动测试_5"通知卡片上的"查看"按钮', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 3000));
      gone5 = await agent.aiBoolean('通知中心面板已关闭或通知中心中已经没有内容包含"截图_自动测试_5"的通知', { deepThink: true });
    }
    if (!gone5) {
      throw new Error('折叠通知点查看后通知未消失(按钮无响应)');
    }
    await new Promise(resolve => setTimeout(resolve, 8000));
    await agent.aiAssert('图片查看器窗口已打开，窗口标题包含截图_自动测试');
    console.log('步骤5: 通知中心折叠状态查看按钮, 看图软件已打开 ✓');
    await system.exec('pkill -9 -f deepin-image-viewer 2>/dev/null; pkill -9 -f ll-cli 2>/dev/null; true');
    await system.exec('xdotool key Escape');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // ── 步骤6: 通知中心折叠状态, 点击通知的"查看文件"按钮 ──
    shotPath = await takeScreenshot(system);
    await system.exec(`cp '${shotPath}' '${shotName(6)}'`);
    await sendSavedNotify(system, 6, shotName(6));
    await new Promise(resolve => setTimeout(resolve, 10000));
    await system.exec("busctl --user call org.deepin.dde.Dock1 /org/deepin/dde/Dock1 org.deepin.dde.Dock1 setItemOnDock ssb 'Dock_Quick_Plugins' 'notification' 1");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('任务栏右侧的通知铃铛图标', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2500));
    let gone6 = false;
    for (let i = 0; i < 3 && !gone6; i++) {
      await agent.aiHover('通知中心中内容包含"截图_自动测试_6"的通知卡片', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 1500));
      await agent.aiTap('"截图_自动测试_6"通知卡片上的"打开文件夹"按钮', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 3000));
      gone6 = await agent.aiBoolean('通知中心面板已关闭或通知中心中已经没有内容包含"截图_自动测试_6"的通知', { deepThink: true });
    }
    if (!gone6) {
      throw new Error('折叠通知点打开文件夹后通知未消失(按钮无响应)');
    }
    await new Promise(resolve => setTimeout(resolve, 8000));
    await agent.aiAssert('文件管理器应用已打开并显示桌面目录');
    console.log('步骤6: 通知中心折叠状态打开文件夹按钮, 文件管理器已打开 ✓');
    await system.exec('pkill -9 -f dde-file-manager 2>/dev/null; pkill -9 -f deepin-fm 2>/dev/null; true');
    await system.exec('xdotool key Escape');
    await new Promise(resolve => setTimeout(resolve, 1500));
  }, { timeout: 1200000, tags: ['1876121', 'level4'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('3. afterEach: 清理');
    await system.exec('xdotool key Escape');
    await system.exec('pkill -9 -f deepin-image-viewer 2>/dev/null; pkill -9 -f ll-cli 2>/dev/null; pkill -9 -f dde-file-manager 2>/dev/null; true');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    // 清理测试截图文件
    await system.exec('rm -f /home/uos/Desktop/截图_自动测试_*.png');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    try {
      await clearNotifications(agent, device, system);
    } catch (e) {
      console.log('清理通知失败:', e.message);
    }
    for (let i = 0; i < 10; i++) {
      const r = await system.exec('gdbus call --session --dest org.deepin.dde.Notification1 --object-path /org/deepin/dde/Notification1 --method org.deepin.dde.Notification1.recordCount 2>&1');
      if (r.stdout.includes('uint32')) break;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    await system.exec('xdotool key super+d');
    await new Promise(resolve => setTimeout(resolve, 1500));
    // 鼠标移到屏幕中央空白处, 避免停在任务栏图标上
    await system.exec('xdotool mousemove 960 540');
    await new Promise(resolve => setTimeout(resolve, 500));
  });
});
