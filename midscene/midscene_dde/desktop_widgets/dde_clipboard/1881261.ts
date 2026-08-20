/**
 * 用例 PMSID: 1881261
 * 用例标题: 【桌面】【剪贴板】首次复制时，剪贴板顶部展示提示栏
 * 生成时间: 2026-04-21
 * 用例编写人：UT003165(吴磊)
 */

describe("1881261-【桌面】【剪贴板】首次复制时，剪贴板顶部展示提示栏", () => {
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

  test(
    "1881261-【桌面】【剪贴板】首次复制时，剪贴板顶部展示提示栏",
    async ({ device, agent, uos, system }) => {
      // ===== 步骤1：剪贴板为空时，展示剪贴板 =====
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`,
      );
      await agent.aiWaitFor("剪贴板界面已显示");

      // 断言1
      await agent.aiAssert("剪贴板界面展示为空图案，不展示顶部提示栏信息：双击内容区进行复制");

      // ===== 步骤2：首次复制后，展示剪贴板 =====
      system.exec(`touch /home/$USER/Desktop/1881261_file1.txt`);
      await agent.aiWaitFor("1881261_file1.txt在桌面显示");
      await agent.aiRightClick("点击1881261_file1.txt");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");

      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`,
      );
      await agent.aiWaitFor("剪贴板界面已显示");

      // 断言2
      await agent.aiAssert("剪贴板生成1条记录1881261_file1.txt");
      await agent.aiAssert("剪贴板标题下方展示提示栏，提示栏文案为：双击内容区进行复制");
      await agent.aiAssert("提示栏右侧有x关闭按钮");

      // ===== 步骤3：继续复制多个文件 =====
      for (const fileName of ["1881261_file2.txt", "1881261_file3.txt"]) {
        system.exec(`touch /home/$USER/Desktop/${fileName}`);
        await agent.aiWaitFor(`${fileName}在桌面显示`);
        await agent.aiRightClick(`点击${fileName}`);
        await agent.aiWaitFor("右键菜单显示");
        await agent.aiTap("点击复制");
      }

      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`,
      );
      await agent.aiWaitFor("剪贴板界面已显示");

      // 断言3
      await agent.aiAssert("剪贴板中有3条记录");
      await agent.aiAssert("剪贴板顶部提示栏保持展示，提示栏文案仍为：双击内容区进行复制");
    },
    { timeout: 600000, tags: ["1881261", "level2"] },
  );

  afterEach(async ({ device, agent, system }) => {
    console.log("4. afterEach: 每个测试后的清理");
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
    // 清理测试文件（用例编号命名的文件）
    system.exec(`rm -f /home/$USER/Desktop/1881261_file1.txt /home/$USER/Desktop/1881261_file2.txt /home/$USER/Desktop/1881261_file3.txt`);
  });
});
