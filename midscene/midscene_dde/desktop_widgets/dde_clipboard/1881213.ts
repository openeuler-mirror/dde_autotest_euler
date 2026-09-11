/**
 * 用例 PMSID: 1881213
 * 用例标题: 【桌面】【剪贴板】拖动不同路径但同名的文件记录到桌面，需要手动操作跳过/替换/共存
 * 生成时间: 2026-04-24
 * 用例编写人：UT003165(吴磊)
 */

describe("1881213-【桌面】【剪贴板】拖动不同路径但同名的文件记录到桌面，需要手动操作跳过/替换/共存", () => {
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
    console.log("[Step] 确保桌面干净，清理旧测试文件");
    // 确保桌面干净
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    // 清理可能存在的旧测试文件
    system.exec(`rm -f /home/$USER/Desktop/1881213*`);
    system.exec(`rm -f /home/$USER/Desktop/*1881213*`);
    system.exec(`rm -f /home/$USER/1881213*`);
    console.log("[Done] beforeAll 完成");
  });

  // 测试数据构造：创建测试文件并复制到剪贴板
  beforeEach(async ({ device, uos, agent, system }) => {
    console.log("========== beforeEach: 测试数据准备 ==========");
    console.log("[Step] 通过UI清空剪贴板，确保干净状态");
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

    // 创建测试文件：主目录（非桌面）创建文件
    console.log("[Step] 在主目录创建测试文件1881213_test.txt");
    system.exec(`touch /home/$USER/1881213_test.txt`);
    system.exec(`echo "Original content" > /home/$USER/1881213_test.txt`);

    // 复制到桌面（桌面也存在同名文件）
    console.log("[Step] 复制到桌面，创建桌面同名文件");
    system.exec(`cp /home/$USER/1881213_test.txt /home/$USER/Desktop/1881213_test.txt`);

    // 等待桌面文件显示
    await agent.aiWaitFor("1881213_test.txt在桌面显示");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 打开文件管理器到主目录，复制非桌面文件到剪贴板
    console.log("[Step] 打开文件管理器，复制非桌面文件到剪贴板");
    system.exec(`killall dde-file-manager`);
    await new Promise(resolve => setTimeout(resolve, 300));
    system.exec(`dde-file-manager /home/$USER`);
    await agent.aiWaitFor("文件管理器界面已显示");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 复制文件到剪贴板
    await agent.aiRightClick("点击1881213_test.txt");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("点击复制");
    await new Promise(resolve => setTimeout(resolve, 200));

    // 关闭文件管理器
    system.exec(`killall dde-file-manager`);
    await new Promise(resolve => setTimeout(resolve, 300));

    console.log("[OK] beforeEach 完成");
  });

  test(
    "1881213-拖动不同路径但同名的文件记录到桌面，需要手动操作跳过/替换/共存",
    async ({ device, agent, uos, system }) => {
      console.log("========== Test: 拖拽同名文件记录到桌面 ==========");

      // 打开剪贴板
      console.log("[Step 1] 打开剪贴板界面");
      system.exec(`xdotool mousemove 100 100 click 1`);
      await new Promise(resolve => setTimeout(resolve, 300));
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      console.log("[OK] 剪贴板界面已显示");

      // ===== 步骤1：拖动桌面文件的复制记录到桌面 =====
      console.log("[Step 2-1] 拖动桌面文件的复制记录到桌面");
      await agent.aiDrag("剪贴板中的1881213_test.txt文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 断言1：弹出提示框，显示跳过、替换、共存按钮
      console.log("[Assert] 验证弹出提示框：目录文件夹已存在，显示跳过、替换、共存按钮");
      await agent.aiAssert("弹出提示框显示跳过、替换、共存按钮");
      console.log("[OK] 提示框验证通过");

      // ===== 步骤2：点击"跳过" =====
      console.log("[Step 2-2] 点击跳过按钮");
      await agent.aiTap("点击跳过");
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("[OK] 已点击跳过，提示框关闭");

      // ===== 步骤3：再次拖动，点击"替换" =====
      console.log("[Step 2-3] 再次打开剪贴板，拖动文件到桌面");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiDrag("剪贴板中的1881213_test.txt文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证弹出提示框");
      await agent.aiAssert("弹出提示框显示跳过、替换、共存按钮");
      console.log("[Step 2-3] 点击替换按钮");
      await agent.aiTap("点击替换");
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("[OK] 已点击替换，文件被替换");

      // ===== 步骤4：再次拖动，点击"共存" =====
      console.log("[Step 2-4] 再次打开剪贴板，拖动文件到桌面");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiDrag("剪贴板中的1881213_test.txt文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证弹出提示框");
      await agent.aiAssert("弹出提示框显示跳过、替换、共存按钮");
      console.log("[Step 2-4] 点击共存按钮");
      await agent.aiTap("点击共存");
      await new Promise(resolve => setTimeout(resolve, 500));
      // 断言4：桌面生成"1881213_test(副本).txt"
      console.log("[Assert] 验证桌面生成1881213_test(副本).txt");
      await agent.aiAssert("桌面生成一个1881213_test(副本).txt文件");
      console.log("[OK] 共存验证通过");

      // ===== 步骤5：再次拖动同一文件，点击"共存" =====
      console.log("[Step 2-5] 再次打开剪贴板，拖动同一文件到桌面");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiDrag("剪贴板中的1881213_test.txt文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证弹出提示框");
      await agent.aiAssert("弹出提示框显示跳过、替换、共存按钮");
      console.log("[Step 2-5] 点击共存按钮");
      await agent.aiTap("点击共存");
      await new Promise(resolve => setTimeout(resolve, 500));
      // 断言5：桌面生成"1881213_test(副本1).txt"（第二次共存，编号从1开始）
      console.log("[Assert] 验证桌面生成1881213_test(副本1).txt");
      await agent.aiAssert("桌面生成一个1881213_test(副本1).txt文件");
      console.log("[OK] 多次共存验证通过");

      console.log("========== Test 完成 ==========");
    },
    { timeout: 600000, tags: ["1881213", "level2"] },
  );

  // 数据清理
  afterEach(async ({ device, agent, system }) => {
    console.log("========== afterEach: 清理测试数据 ==========");
    console.log("[Step] 清理测试文件并通过UI清空剪贴板");
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
    system.exec(`rm -f /home/$USER/Desktop/1881213*`);
    system.exec(`rm -f /home/$USER/Desktop/*1881213*`);
    system.exec(`rm -f /home/$USER/1881213*`);
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
