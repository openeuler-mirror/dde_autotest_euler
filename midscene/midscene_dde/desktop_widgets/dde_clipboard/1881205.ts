/**
 * 用例 PMSID: 1881205
 * 用例标题: 【桌面】【剪贴板】多次拖拽文本文件记录拖拽到同一用户级路径下，都可多次自动复制和重命名
 * 生成时间: 2026-04-24
 * 用例编写人：UT003165(吴磊)
 */

describe("1881205-【桌面】【剪贴板】多次拖拽文本文件记录拖拽到同一用户级路径下，都可多次自动复制和重命名", () => {
  // 场景构造：清理可能存在的旧测试文件
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log("========== beforeAll: 初始化测试套件 ==========");
    console.log("[Step] 确保桌面干净，清理旧测试文件");
    // 确保桌面干净
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    // 清理可能存在的旧测试文件
    system.exec(`rm -f /home/$USER/Desktop/1881205*`);
    // 重启剪贴板服务确保干净状态
    console.log("[Step] 重启剪贴板服务");
    system.exec(`systemctl --user restart dde-clipboard`);
    console.log("[Done] beforeAll 完成");
  });

  // 测试数据构造：在桌面创建测试文件并复制到剪贴板
  beforeEach(async ({ device, uos, agent, system }) => {
    console.log("========== beforeEach: 测试数据准备 ==========");
    // 每次测试前清理桌面测试文件
    system.exec(`rm -f /home/$USER/Desktop/1881205*`);
    await new Promise(resolve => setTimeout(resolve, 200));

    // 在桌面创建测试文件
    console.log("[Step] 在桌面创建测试文件1881205_test.txt");
    system.exec(`touch /home/$USER/Desktop/1881205_test.txt`);
    system.exec(`echo "Original content" > /home/$USER/Desktop/1881205_test.txt`);

    // 等待桌面文件显示
    await agent.aiWaitFor("1881205_test.txt在桌面显示");
    await new Promise(resolve => setTimeout(resolve, 500));

    // 右键复制桌面文件到剪贴板
    console.log("[Step] 复制1881205_test.txt到剪贴板");
    await agent.aiRightClick("点击1881205_test.txt");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("点击复制");
    await new Promise(resolve => setTimeout(resolve, 200));

    console.log("[OK] beforeEach 完成");
  });

  test(
    "1881205-多次拖拽文本文件记录拖拽到同一用户级路径下，都可多次自动复制和重命名",
    async ({ device, agent, uos, system }) => {
      console.log("========== Test: 多次拖拽文本文件记录 ==========");

      // 打开剪贴板
      console.log("[Step 1] 打开剪贴板界面");
      system.exec(`xdotool mousemove 100 100 click 1`);
      await new Promise(resolve => setTimeout(resolve, 300));
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      console.log("[OK] 剪贴板界面已显示");

      // ===== 第1次拖拽 =====
      console.log("[Step 2-1] 第1次拖拽文本文件记录到桌面");
      await agent.aiDrag("剪贴板中的1881205_test.txt文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证桌面生成1881205_test.txt(副本)");
      await agent.aiAssert("桌面生成一个1881205_test.txt(副本)文件");
      console.log("[OK] 第1次拖拽成功");

      // ===== 第2次拖拽 =====
      console.log("[Step 2-2] 第2次拖拽文本文件记录到桌面");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiDrag("剪贴板中的1881205_test.txt文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证桌面生成1881205_test.txt(副本1)");
      await agent.aiAssert("桌面生成一个1881205_test.txt(副本1)文件");
      console.log("[OK] 第2次拖拽成功");

      // ===== 第3次拖拽 =====
      console.log("[Step 2-3] 第3次拖拽文本文件记录到桌面");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiDrag("剪贴板中的1881205_test.txt文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证桌面生成1881205_test.txt(副本2)");
      await agent.aiAssert("桌面生成一个1881205_test.txt(副本2)文件");
      console.log("[OK] 第3次拖拽成功");

      // ===== 第4次拖拽 =====
      console.log("[Step 2-4] 第4次拖拽文本文件记录到桌面");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiDrag("剪贴板中的1881205_test.txt文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证桌面生成1881205_test.txt(副本3)");
      await agent.aiAssert("桌面生成一个1881205_test.txt(副本3)文件");
      console.log("[OK] 第4次拖拽成功");

      // ===== 第5次拖拽 =====
      console.log("[Step 2-5] 第5次拖拽文本文件记录到桌面");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiDrag("剪贴板中的1881205_test.txt文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证桌面生成1881205_test.txt(副本4)");
      await agent.aiAssert("桌面生成一个1881205_test.txt(副本4)文件");
      console.log("[OK] 第5次拖拽成功");

      console.log("========== Test 完成 ==========");
    },
    { timeout: 600000, tags: ["1881205", "level2"] },
  );

  // 数据清理
  afterEach(async ({ device, system }) => {
    console.log("========== afterEach: 清理测试数据 ==========");
    console.log("[Step] 清理测试文件");
    system.exec(`rm -f /home/$USER/Desktop/1881205*`);
    console.log("[OK] afterEach 完成");
  });

  // 环境恢复
  afterAll(async ({ uos, agent, device, system }) => {
    console.log("========== afterAll: 环境恢复 ==========");
    console.log("[Step] 重启剪贴板服务，关闭文件管理器");
    system.exec(`systemctl --user restart dde-clipboard`);
    system.exec(`killall dde-file-manager`);
    console.log("[OK] afterAll 完成");
  });
});
