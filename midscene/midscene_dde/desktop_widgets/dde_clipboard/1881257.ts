/**
 * 用例 PMSID: 1881257
 * 用例标题: 【桌面】【剪贴板】同一个文件连续多次复制/剪切，只生成一条剪贴板记录
 * 生成时间: 2026-04-22
 * 用例编写人：UT003165(吴磊)
 */

describe("1881257-【桌面】【剪贴板】同一个文件连续多次复制/剪切，只生成一条剪贴板记录", () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    // 确保剪贴板服务正常运行（挂掉时先清理僵尸进程再拉起）
    const status = await system.exec(`systemctl --user is-active dde-clipboard 2>/dev/null`);
    if (!status.stdout.includes('active')) {
      system.exec(`killall dde-clipboard dde-clipboard-daemon 2>/dev/null`);
      await new Promise(resolve => setTimeout(resolve, 500));
      system.exec(`systemctl --user start dde-clipboard`);
    }
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log("2. beforeEach: 每个测试前的准备");
    // 通过UI清空剪贴板（若无记录则跳过）
    await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`);
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiWaitFor("剪贴板界面已显示");
    try {
      await agent.aiTap("全部清除");
      // 验证清空已生效
      await agent.aiAssert("剪贴板中没有任何记录");
    } catch {
      // 剪贴板为空时没有全部清除按钮，跳过
    }
    await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`);
    await new Promise(resolve => setTimeout(resolve, 500));
    // 创建测试文件
    system.exec(`touch /home/$USER/Desktop/1881257_fileA.txt`);
    system.exec(`touch /home/$USER/Desktop/1881257_fileB.txt`);
    system.exec(`touch /home/$USER/Desktop/1881257_fileC.txt`);
    await agent.aiWaitFor("1881257_fileA.txt在桌面显示");
    await agent.aiWaitFor("1881257_fileB.txt在桌面显示");
    await agent.aiWaitFor("1881257_fileC.txt在桌面显示");
  });

  test(
    "1881257-【桌面】【剪贴板】同一个文件连续多次复制/剪切，只生成一条剪贴板记录",
    async ({ device, agent, uos, system }) => {
      // ===== 步骤1：对文件A连续多次点击复制 =====
      for (let i = 0; i < 3; i++) {
        await agent.aiRightClick("点击1881257_fileA.txt");
        await agent.aiWaitFor("右键菜单显示");
        await agent.aiTap("点击复制");
      }

      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`,
      );
      await agent.aiWaitFor("剪贴板界面已显示");

      // 断言1：重复文件A只有第一次会生成剪贴板记录
      await agent.aiAssert("剪贴板中有1条记录1881257_fileA.txt");

      // ===== 步骤2：对文件B连续多次点击复制 =====
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
      );

      for (let i = 0; i < 3; i++) {
        await agent.aiRightClick("点击1881257_fileB.txt");
        await agent.aiWaitFor("右键菜单显示");
        await agent.aiTap("点击复制");
      }

      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`,
      );
      await agent.aiWaitFor("剪贴板界面已显示");

      // 断言2：重复内容B只有第一次会生成剪贴板记录
      await agent.aiAssert("剪贴板中有2条记录，包含1881257_fileA.txt和1881257_fileB.txt");

      // ===== 步骤3：对文件C连续多次点击复制 =====
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
      );

      for (let i = 0; i < 3; i++) {
        await agent.aiRightClick("点击1881257_fileC.txt");
        await agent.aiWaitFor("右键菜单显示");
        await agent.aiTap("点击复制");
      }

      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`,
      );
      await agent.aiWaitFor("剪贴板界面已显示");

      // 断言3：重复内容C只有第一次会生成剪贴板记录
      await agent.aiAssert("剪贴板中有3条记录，包含1881257_fileA.txt、1881257_fileB.txt和1881257_fileC.txt");
    },
    { timeout: 600000, tags: ["1881257", "level2"] },
  );

  afterEach(async ({ device, agent, system }) => {
    console.log("4. afterEach: 每个测试后的清理");
    // 清理测试文件
    system.exec(`rm -f /home/$USER/Desktop/1881257_fileA.txt /home/$USER/Desktop/1881257_fileB.txt /home/$USER/Desktop/1881257_fileC.txt`);
    // 通过UI清空剪贴板
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
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
    // 通过UI清空剪贴板
    await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`);
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiWaitFor("剪贴板界面已显示");
    try { await agent.aiTap("全部清除"); } catch { /* 剪贴板为空则跳过 */ }
    await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`);
    await new Promise(resolve => setTimeout(resolve, 500));
  });
});
