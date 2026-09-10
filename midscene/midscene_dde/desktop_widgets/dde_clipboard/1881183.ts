/**
 * 用例 PMSID: 1881183
 * 用例标题: 【桌面】【剪贴板】每次打开剪贴板，保持初始界面位置
 * 生成时间: 2026-05-08
 * 用例编写人：UT003165(吴磊)
 */

describe("1881183-【桌面】【剪贴板】每次打开剪贴板，保持初始界面位置", () => {
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
    system.exec(`killall deepin-editor 2>/dev/null`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("[Done] beforeAll 完成");
  });

  // 测试数据构造：在剪贴板中准备7条文本记录
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

    // 打开文本编辑器
    console.log("[Step] 打开文本编辑器");
    system.exec('/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor -w %F');
    await agent.aiWaitFor("文本编辑器窗口已打开");

    // 生成7条长文本记录，自动折行占多行空间，减少循环次数避免超时
    const textContents = [
      "1881183_1 测试文本内容 测试文本内容 测试文本内容 测试文本内容 测试文本内容 测试文本内容",
      "1881183_2 测试文本内容 测试文本内容 测试文本内容 测试文本内容 测试文本内容 测试文本内容",
      "1881183_3 测试文本内容 测试文本内容 测试文本内容 测试文本内容 测试文本内容 测试文本内容",
      "1881183_4 测试文本内容 测试文本内容 测试文本内容 测试文本内容 测试文本内容 测试文本内容",
      "1881183_5 测试文本内容 测试文本内容 测试文本内容 测试文本内容 测试文本内容 测试文本内容",
      "1881183_6 测试文本内容 测试文本内容 测试文本内容 测试文本内容 测试文本内容 测试文本内容",
      "1881183_7 测试文本内容 测试文本内容 测试文本内容 测试文本内容 测试文本内容 测试文本内容",
    ];

    for (let i = 0; i < textContents.length; i++) {
      // 全选并删除旧内容
      console.log(`[Step] 复制第${i + 1}条文本: ${textContents[i]}`);
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 200));
      await device.pressKey("Delete");
      await new Promise(resolve => setTimeout(resolve, 200));

      // 输入新文本
      await device.typeText(textContents[i]);
      await new Promise(resolve => setTimeout(resolve, 300));

      // 全选并复制
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 200));
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 300));

      console.log(`[OK] 已复制第${i + 1}条`);
    }

    // 关闭文本编辑器
    console.log("[Step] 关闭文本编辑器");
    system.exec("killall deepin-editor");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 验证剪贴板中存在7条记录
    console.log("[Step] 验证剪贴板中存在7条文本记录");
    system.exec(`xdotool key Super+v`);
    await agent.aiWaitFor("剪贴板界面已显示");
    await agent.aiAssert("剪贴板顶部显示最新记录1881183_7，右侧存在滚动条");

    console.log("[OK] beforeEach 完成");
  });

  test(
    "1881183-每次打开剪贴板保持初始界面位置",
    async ({ device, agent, uos, system }) => {
      console.log("========== Test: 每次打开剪贴板保持初始界面位置 ==========");

      // ===== 步骤1: 使用快捷键打开剪贴板 =====
      console.log("[Step 1] 首次唤出剪贴板");
      // 剪贴板已在 beforeEach 中打开，直接验证初始界面位置
      await agent.aiWaitFor("剪贴板界面已显示");
      // 断言：默认显示从最新记录开始（最新复制的在顶部）
      console.log("[Assert] 验证剪贴板顶部显示最新记录1881183_7");
      await agent.aiAssert("剪贴板顶部显示最新记录1881183_7，界面显示正常");
      console.log("[OK] 步骤1完成");

      // ===== 步骤2: 滚动剪贴板到底部 =====
      console.log("[Step 2] 滚动剪贴板到底部");
      await agent.aiScroll('剪贴板列表', { direction: 'down', distance: 2000 });
      await new Promise(resolve => setTimeout(resolve, 500));
      // 断言：离开初始位置，第一条可见记录不再是1881183_7
      console.log("[Assert] 验证剪贴板已向下滚动离开初始位置");
      await agent.aiAssert("剪贴板第一条可见的记录内容不是1881183_7");
      console.log("[OK] 步骤2完成");

      // ===== 步骤3: 再次使用快捷键打开剪贴板 =====
      console.log("[Step 3] 再次使用快捷键打开剪贴板");
      // 点击桌面空白处关闭剪贴板，避免连续Super+v toggle不可靠
      system.exec(`xdotool mousemove 100 100 click 1`);
      await new Promise(resolve => setTimeout(resolve, 500));
      // 使用快捷键重新打开剪贴板
      system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");
      // 断言：再次打开后回到初始位置，顶部显示最新记录
      console.log("[Assert] 验证剪贴板再次从最新记录开始显示");
      await agent.aiAssert("剪贴板顶部显示最新记录1881183_7，恢复初始位置");
      console.log("[OK] 步骤3完成");

      // ===== 步骤4: 滚动剪贴板到中间位置 =====
      console.log("[Step 4] 滚动剪贴板到中间位置");
      await agent.aiScroll('剪贴板列表', { direction: 'down', distance: 1200 });
      await new Promise(resolve => setTimeout(resolve, 500));
      // 断言：离开初始位置，第一条可见记录不再是1881183_7
      console.log("[Assert] 验证剪贴板滚动到中间位置");
      await agent.aiAssert("剪贴板第一条可见的记录内容不是1881183_7");
      console.log("[OK] 步骤4完成");

      // ===== 步骤5: 再次使用快捷键打开剪贴板 =====
      console.log("[Step 5] 再次使用快捷键打开剪贴板");
      // 点击桌面空白处关闭剪贴板，避免连续Super+v toggle不可靠
      system.exec(`xdotool mousemove 100 100 click 1`);
      await new Promise(resolve => setTimeout(resolve, 500));
      // 使用快捷键重新打开剪贴板
      system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");
      // 断言：再次打开后回到初始位置，顶部显示最新记录
      console.log("[Assert] 验证剪贴板再次从最新记录开始显示");
      await agent.aiAssert("剪贴板顶部显示最新记录1881183_7，恢复初始位置");
      console.log("[OK] 步骤5完成");

      console.log("========== Test 完成 ==========");
    },
    { timeout: 600000, tags: ["1881183", "level2"] },
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
    // 关闭可能残留的应用窗口
    console.log("[Step] 关闭残留应用窗口");
    system.exec(`killall deepin-editor 2>/dev/null`);
    console.log("[OK] afterAll 完成");
  });
});
