/**
 * 用例 PMSID: 1881203
 * 用例标题: 【桌面】【剪贴板】多次拖拽文本文件记录拖拽到同一用户级路径下，都可多次自动复制和重命名
 * 生成时间: 2026-04-24
 * 用例编写人：UT003165(吴磊)
 */

describe("1881203-【桌面】【剪贴板】多次拖拽文件夹记录拖拽到同一用户级路径下，都可多次自动复制和重命名", () => {
  // 场景构造：清理可能存在的旧测试文件
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log("========== beforeAll: 初始化测试套件 ==========");
    // 确保剪贴板服务正常运行（挂掉时先清理僵尸进程再拉起）
    const status = await system.exec(`systemctl --user is-active dde-clipboard 2>/dev/null`);
    if (!status.stdout.includes('active')) {
      system.exec(`killall dde-clipboard dde-clipboard-daemon 2>/dev/null`);
      await new Promise(resolve => setTimeout(resolve, 500));
      system.exec(`systemctl --user start dde-clipboard`);
    }
    console.log("[Step] 确保桌面干净，清理旧测试文件夹");
    // 确保桌面干净
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    // 通过UI清空剪贴板确保干净状态
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
    console.log("[Done] beforeAll 完成");
  });

  // 测试数据构造：在桌面创建测试文件夹并复制到剪贴板
  beforeEach(async ({ device, uos, agent, system }) => {
    console.log("========== beforeEach: 测试数据准备 ==========");
    // 每次测试前清理桌面测试文件夹（含所有副本变体）
    system.exec(`find /home/$USER/Desktop -maxdepth 1 -name '1881203_testdir*' -exec rm -rf {} + 2>/dev/null`);
    await new Promise(resolve => setTimeout(resolve, 200));

    // 在桌面创建测试文件夹
    console.log("[Step] 在桌面创建测试文件夹1881203_testdir");
    system.exec(`mkdir -p /home/$USER/Desktop/1881203_testdir`);

    // 等待桌面文件夹显示
    await agent.aiWaitFor("1881203_testdir文件夹在桌面显示");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 右键复制桌面文件夹到剪贴板
    console.log("[Step] 复制1881203_testdir文件夹到剪贴板");
    await agent.aiRightClick("点击1881203_testdir文件夹");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("点击复制");
    await new Promise(resolve => setTimeout(resolve, 200));

    console.log("[OK] beforeEach 完成");
  });

  test(
    "1881203-多次拖拽文件夹记录拖拽到同一用户级路径下，都可多次自动复制和重命名",
    async ({ device, agent, uos, system }) => {
      console.log("========== Test: 多次拖拽文件夹记录 ==========");

      // 打开剪贴板
      console.log("[Step 1] 打开剪贴板界面");
      await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`);
      await agent.aiWaitFor("剪贴板界面已显示");
      console.log("[OK] 剪贴板界面已显示");

      // ===== 第1次拖拽 =====
      console.log("[Step 2-1] 第1次拖拽文件夹记录到桌面");
      await agent.aiDrag("剪贴板中的1881203_testdir文件夹记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证桌面生成1881203_testdir（副本）文件夹");
      const ls1 = await system.exec(`ls -la "/home/$USER/Desktop/" | grep 1881203`);
      console.log("桌面文件诊断:", ls1.stdout);
      const check1 = await system.exec(`test -d "/home/$USER/Desktop/1881203_testdir（副本）" && echo 'exists'`);
      assert.assertTrue(check1.stdout.includes('exists'), `应生成（副本）文件夹，实际: ${ls1.stdout}`);
      console.log("[OK] 第1次拖拽成功");

      // ===== 第2次拖拽 =====
      console.log("[Step 2-2] 第2次拖拽文件夹记录到桌面");
      await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`);
      await new Promise(resolve => setTimeout(resolve, 300));
      await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`);
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiDrag("剪贴板中的1881203_testdir文件夹记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证桌面生成1881203_testdir（副本 1）文件夹");
      const ls2 = await system.exec(`ls -la "/home/$USER/Desktop/" | grep 1881203`);
      console.log("桌面文件诊断:", ls2.stdout);
      const check2 = await system.exec(`test -d "/home/$USER/Desktop/1881203_testdir（副本 1）" && echo 'exists'`);
      assert.assertTrue(check2.stdout.includes('exists'), `应生成（副本 1）文件夹，实际: ${ls2.stdout}`);
      console.log("[OK] 第2次拖拽成功");

      // ===== 第3次拖拽 =====
      console.log("[Step 2-3] 第3次拖拽文件夹记录到桌面");
      await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`);
      await new Promise(resolve => setTimeout(resolve, 300));
      await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`);
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiDrag("剪贴板中的1881203_testdir文件夹记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证桌面生成1881203_testdir（副本 2）文件夹");
      const ls3 = await system.exec(`ls -la "/home/$USER/Desktop/" | grep 1881203`);
      console.log("桌面文件诊断:", ls3.stdout);
      const check3 = await system.exec(`test -d "/home/$USER/Desktop/1881203_testdir（副本 2）" && echo 'exists'`);
      assert.assertTrue(check3.stdout.includes('exists'), `应生成（副本 2）文件夹，实际: ${ls3.stdout}`);
      console.log("[OK] 第3次拖拽成功");

      // ===== 第4次拖拽 =====
      console.log("[Step 2-4] 第4次拖拽文件夹记录到桌面");
      await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`);
      await new Promise(resolve => setTimeout(resolve, 300));
      await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`);
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiDrag("剪贴板中的1881203_testdir文件夹记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证桌面生成1881203_testdir（副本 3）文件夹");
      const ls4 = await system.exec(`ls -la "/home/$USER/Desktop/" | grep 1881203`);
      console.log("桌面文件诊断:", ls4.stdout);
      const check4 = await system.exec(`test -d "/home/$USER/Desktop/1881203_testdir（副本 3）" && echo 'exists'`);
      assert.assertTrue(check4.stdout.includes('exists'), `应生成（副本 3）文件夹，实际: ${ls4.stdout}`);
      console.log("[OK] 第4次拖拽成功");

      console.log("========== Test 完成 ==========");
    },
    { timeout: 600000, tags: ["1881203", "level2"] },
  );

  // 数据清理
  afterEach(async ({ device, system }) => {
    console.log("========== afterEach: 清理测试数据 ==========");
    console.log("[Step] 清理测试文件夹及所有副本");
    // 显式清理，避免通配符风险
    system.exec(`find /home/$USER/Desktop -maxdepth 1 -name '1881203_testdir*' -exec rm -rf {} + 2>/dev/null`);
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
    system.exec(`killall dde-file-manager`);
    console.log("[OK] afterAll 完成");
  });
});
