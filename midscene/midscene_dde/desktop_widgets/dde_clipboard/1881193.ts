/**
 * 用例 PMSID: 1881193
 * 用例标题: 【桌面】【剪贴板】拖拽文本信息记录可到应用的文本编辑框中
 * 生成时间: 2026-05-07
 * 用例编写人：UT003165(吴磊)
 */

describe("1881193-【桌面】【剪贴板】拖拽文本信息记录可到应用的文本编辑框中", () => {
  // 场景构造：清理旧环境，重启剪贴板服务
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log("========== beforeAll: 初始化测试套件 ==========");
    // 确保剪贴板服务正常运行（挂掉时先清理僵尸进程再拉起）
    const status = await system.exec(`systemctl --user is-active dde-clipboard 2>/dev/null`);
    if (!status.stdout.includes('active')) {
      system.exec(`killall dde-clipboard dde-clipboard-daemon 2>/dev/null`);
      await new Promise(resolve => setTimeout(resolve, 500));
      system.exec(`systemctl --user start dde-clipboard`);
    }
    // 确保桌面干净
    console.log("[Step] 确保桌面干净");
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    // 清理可能残留的应用进程
    console.log("[Step] 清理残留进程");
    system.exec(`killall dde-control-center dde-file-manager deepin-editor 2>/dev/null`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 初始化文件管理器为非最大化状态，避免窗口记忆上次最大化导致动态调宽失效
    console.log("[Step] 初始化文件管理器窗口状态");
    system.exec(`dde-file-manager ~/Desktop`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    system.exec(`xdotool key Super+Down`);
    await new Promise(resolve => setTimeout(resolve, 500));
    system.exec(`killall dde-file-manager`);
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("[Done] beforeAll 完成");
  });

  // 测试数据构造：在剪贴板中准备文本记录"1881193"
  beforeEach(async ({ device, uos, agent, system }) => {
    console.log("========== beforeEach: 测试数据准备 ==========");
    // 通过UI清空剪贴板确保干净状态
    await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`);
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiWaitFor("剪贴板界面已显示");
    try {
      await agent.aiTap("全部清除");
    } catch {
      // 剪贴板为空时没有全部清除按钮，跳过
    }
    await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // 清理可能残留的编辑器进程
    console.log("[Step] 清理编辑器进程");
    system.exec(`killall deepin-editor 2>/dev/null`);
    await new Promise(resolve => setTimeout(resolve, 300));

    // 打开文本编辑器
    console.log("[Step] 打开文本编辑器");
    system.exec('/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor -w %F');
    await agent.aiWaitFor("文本编辑器窗口已打开");

    // 输入测试文本"1881193"
    console.log("[Step] 输入测试文本 1881193");
    await device.typeText("1881193");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 全选并复制文本到剪贴板
    console.log("[Step] 全选并复制文本到剪贴板");
    await device.pressKey("Ctrl", "a");
    await new Promise(resolve => setTimeout(resolve, 300));
    await device.pressKey("Ctrl", "c");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 关闭文本编辑器
    console.log("[Step] 关闭文本编辑器");
    system.exec("killall deepin-editor");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 验证剪贴板中存在文本记录
    console.log("[Step] 验证剪贴板中存在文本记录");
    system.exec(`xdotool key Super+v`);
    await agent.aiWaitFor("剪贴板界面已显示");
    await agent.aiAssert("剪贴板中存在包含1881193的文本记录");

    console.log("[OK] beforeEach 完成");
  });

  test(
    "1881193-拖拽文本信息记录可到控制中心、文管、浏览器的文本编辑框中",
    async ({ device, agent, uos, system }) => {
      console.log("========== Test: 拖拽文本信息记录到应用的文本编辑框中 ==========");

      // ===== 步骤1: 拖拽文本信息记录到控制中心的搜索框 =====
      console.log("[Step 1] 拖拽文本信息记录到控制中心的搜索框");

      // 打开控制中心并最大化
      console.log("[Step 1-1] 打开控制中心");
      await uos.openApp("控制中心");
      // AI 识别的窗口名为"系统设置"而非"控制中心"，用"设置搜索框"匹配
      await agent.aiWaitFor("设置搜索框可见", { timeoutMs: 30000 });

      // 打开剪贴板
      console.log("[Step 1-2] 打开剪贴板");
      system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");

      // 拖拽文本记录到设置搜索框
      console.log("[Step 1-3] 拖拽剪贴板中的1881193文本记录到设置搜索框");
      await agent.aiDrag("剪贴板中的1881193文本记录", "设置搜索框");

      // 断言：设置搜索框内容显示"1881193"
      console.log("[Assert] 验证设置搜索框内容显示1881193");
      await agent.aiAssert("设置搜索框内容显示1881193");
      console.log("[OK] 步骤1完成");

      // 关闭控制中心
      system.exec(`killall dde-control-center`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // ===== 步骤2: 拖拽文本信息记录到文管的搜索框 =====
      console.log("[Step 2] 拖拽文本信息记录到文管的搜索框");

      // 打开文件管理器，先调整窗口再验证搜索框
      console.log("[Step 2-1] 打开文件管理器");
      await uos.openApp("文件管理器");
      // 等窗口就绪后调整大小：awk 直接计算屏宽-400，留给剪贴板侧边栏
      await new Promise(resolve => setTimeout(resolve, 1000));
      system.exec(`W=$(xdotool getdisplaygeometry | awk '{print $1-400}') && xdotool getactivewindow windowmove 0 0 windowsize $W 800`);
      await agent.aiWaitFor("文件管理器搜索框可见", { timeoutMs: 30000 });

      // 打开剪贴板
      console.log("[Step 2-2] 打开剪贴板");
      system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");

      // 拖拽文本记录到文件管理器搜索框
      console.log("[Step 2-3] 拖拽剪贴板中的1881193文本记录到文件管理器搜索框");
      await agent.aiDrag("剪贴板中的1881193文本记录", "文件管理器搜索框");

      // 断言：文管搜索框内容显示"1881193"
      console.log("[Assert] 验证文件管理器搜索框内容显示1881193");
      await agent.aiAssert("文件管理器搜索框内容显示1881193");
      console.log("[OK] 步骤2完成");

      // 关闭文件管理器
      system.exec(`killall dde-file-manager`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // ===== 步骤3: 拖拽文本信息记录到浏览器的地址栏 =====
      console.log("[Step 3] 拖拽文本信息记录到浏览器的地址栏");

      // 打开浏览器并最大化
      console.log("[Step 3-1] 打开浏览器");
      await uos.openApp("浏览器");
      await agent.aiWaitFor("浏览器地址栏可见", { timeoutMs: 30000 });

      // 打开剪贴板
      console.log("[Step 3-2] 打开剪贴板");
      system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");

      // 拖拽文本记录到浏览器地址栏
      console.log("[Step 3-3] 拖拽剪贴板中的1881193文本记录到浏览器地址栏");
      await agent.aiDrag("剪贴板中的1881193文本记录", "浏览器地址栏");

      // 断言：浏览器地址栏显示"1881193"
      console.log("[Assert] 验证浏览器地址栏显示1881193");
      await agent.aiAssert("浏览器地址栏显示1881193");
      console.log("[OK] 步骤3完成");

      // 关闭浏览器
      system.exec(`killall chrome firefox chromium browser 2>/dev/null`);
      await new Promise(resolve => setTimeout(resolve, 500));

      console.log("========== Test 完成 ==========");
    },
    { timeout: 600000, tags: ["1881193", "level2"] },
  );

  // 数据清理
  afterEach(async ({ device, agent, system }) => {
    console.log("========== afterEach: 清理测试数据 ==========");
    // 通过UI清空剪贴板
    console.log("[Step] 通过UI清空剪贴板");
    await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`);
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiWaitFor("剪贴板界面已显示");
    try {
      await agent.aiTap("全部清除");
    } catch {
      // 剪贴板为空时没有全部清除按钮，跳过
    }
    await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`);
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log("[OK] afterEach 完成");
  });

  // 环境恢复
  afterAll(async ({ uos, agent, device, system }) => {
    console.log("========== afterAll: 环境恢复 ==========");
    // 通过UI清空剪贴板
    await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`);
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiWaitFor("剪贴板界面已显示");
    try { await agent.aiTap("全部清除"); } catch { /* 剪贴板为空则跳过 */ }
    await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // 先关闭所有测试中打开的应用
    console.log("[Step] 关闭残留应用窗口");
    system.exec(`killall dde-control-center dde-file-manager chrome firefox chromium browser 2>/dev/null`);
    // 还原所有被修改窗口大小的应用
    console.log("[Step] 还原控制中心窗口");
    await uos.openApp("控制中心");
    await new Promise(resolve => setTimeout(resolve, 1000));
    system.exec(`xdotool key Super+Down`);
    await new Promise(resolve => setTimeout(resolve, 500));
    system.exec(`killall dde-control-center`);
    // 还原文件管理器窗口
    console.log("[Step] 还原文件管理器窗口");
    await uos.openApp("文件管理器");
    await new Promise(resolve => setTimeout(resolve, 1000));
    system.exec(`xdotool key Super+Down`);
    await new Promise(resolve => setTimeout(resolve, 500));
    system.exec(`killall dde-file-manager`);
    console.log("[OK] afterAll 完成");
  });
});
