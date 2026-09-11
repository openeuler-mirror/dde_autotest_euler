/**
 * 用例 PMSID: 1881197
 * 用例标题: 【桌面】【剪贴板】显示"源文件已被删除"的文件类记录无法拖动到桌面
 * 生成时间: 2026-04-28
 * 用例编写人：UT003165(吴磊)
 */

describe("1881197-【桌面】【剪贴板】显示源文件已被删除的文件类记录无法拖动到桌面", () => {
  // 场景构造：清理可能存在的旧测试文件
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log("========== beforeAll: 初始化测试套件 ==========");
    console.log("[Step] 确保桌面干净，清理旧测试文件");
    // 确保桌面干净
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    // 清理可能存在的旧测试文件
    system.exec(`rm -f /home/$USER/Desktop/1881197*`);
    system.exec(`rm -rf /home/$USER/Desktop/1881197_dir`);
    // 重启剪贴板服务确保干净状态
    console.log("[Step] 重启剪贴板服务");
    system.exec(`systemctl --user restart dde-clipboard`);
    console.log("[Done] beforeAll 完成");
  });

  // 测试数据构造：轻量级清理
  beforeEach(async ({ device, uos, agent, system }) => {
    console.log("========== beforeEach: 清理测试数据 ==========");
    // 清理桌面测试文件
    system.exec(`rm -f /home/$USER/Desktop/1881197*`);
    system.exec(`rm -rf /home/$USER/Desktop/1881197_dir`);
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log("[OK] beforeEach 完成");
  });

  // ===== Test1: 环境准备 - 创建文件并复制到剪贴板 =====
  test(
    "1881197-环境准备",
    async ({ device, agent, uos, system }) => {
      console.log("========== Test1: 环境准备 ==========");

      // 重启剪贴板服务
      console.log("[Step 1-1] 重启剪贴板服务，确保干净状态");
      system.exec(`systemctl --user restart dde-clipboard`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // 创建5种类型的测试文件
      console.log("[Step 1-2] 创建测试文件");
      system.exec(`touch /home/$USER/Desktop/1881197_test.txt`);
      system.exec(`mkdir -p /home/$USER/Desktop/1881197_dir`);
      system.exec(`cp /usr/share/backgrounds/default_background.jpg /home/$USER/Desktop/1881197_image.jpg`);
      system.exec(`cp /usr/share/dde-introduction/uos/1-DDE.mp4 /home/$USER/Desktop/1881197_video.mp4`);
      system.exec(`cp /usr/share/applications/deepin-app-store.desktop /home/$USER/Desktop/1881197_app.desktop`);

      // 等待文件显示
      await agent.aiWaitFor("1881197_test.txt在桌面显示");
      await new Promise(resolve => setTimeout(resolve, 500));

      // 倒序复制文件到剪贴板
      console.log("[Step 1-3] 倒序复制文件到剪贴板");

      console.log("[Step] 复制应用程序文件到剪贴板");
      await agent.aiRightClick("点击应用商店");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");
      await new Promise(resolve => setTimeout(resolve, 200));

      console.log("[Step] 复制视频文件到剪贴板");
      await agent.aiRightClick("点击1881197_video.mp4");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");
      await new Promise(resolve => setTimeout(resolve, 200));

      console.log("[Step] 复制图片文件到剪贴板");
      await agent.aiRightClick("点击1881197_image.jpg");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");
      await new Promise(resolve => setTimeout(resolve, 200));

      console.log("[Step] 复制目录文件到剪贴板");
      await agent.aiRightClick("点击1881197_dir文件夹");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");
      await new Promise(resolve => setTimeout(resolve, 200));

      console.log("[Step] 复制文本文件到剪贴板");
      await agent.aiRightClick("点击1881197_test.txt");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");
      await new Promise(resolve => setTimeout(resolve, 200));

      // 删除所有源文件
      console.log("[Step 1-4] 删除所有源文件，模拟源文件已删除");
      system.exec(`rm -f /home/$USER/Desktop/1881197_test.txt`);
      system.exec(`rm -rf /home/$USER/Desktop/1881197_dir`);
      system.exec(`rm -f /home/$USER/Desktop/1881197_image.jpg`);
      system.exec(`rm -f /home/$USER/Desktop/1881197_video.mp4`);
      system.exec(`rm -f /home/$USER/Desktop/1881197_app.desktop`);
      console.log("[OK] 源文件已删除");

      console.log("========== Test1 完成 ==========");
    },
    { timeout: 600000, tags: ["1881197", "level2"] },
  );

  // ===== Test2: 实际测试 - 拖拽源文件已删除的记录 =====
  test(
    "1881197-源文件已删除的文件记录无法拖动到桌面",
    async ({ device, agent, uos, system }) => {
      console.log("========== Test2: 拖拽源文件已删除的记录 ==========");

      // 打开剪贴板
      console.log("[Step 2-1] 打开剪贴板界面");
      system.exec(`xdotool mousemove 100 100 click 1`);
      await new Promise(resolve => setTimeout(resolve, 300));
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      console.log("[OK] 剪贴板界面已显示");

      // ===== 步骤1：拖拽文本文件记录 =====
      console.log("[Step 2-2] 拖拽文本文件记录1881197_test.txt");
      await agent.aiDrag("剪贴板中第一个文本文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证弹框提示源文件不存在");
      await agent.aiAssert("弹框提示源文件不存在");
      console.log("[Step] 关闭弹框");
      await agent.aiTap("点击跳过");
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log("[Step] 重新打开剪贴板，删除已测试的文本文件记录");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiTap("点击第一个记录右上角的删除按钮");
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log("[OK] 文本文件步骤完成");

      // ===== 步骤2：拖拽目录文件记录 =====
      console.log("[Step 2-3] 拖拽目录文件记录");
      await agent.aiDrag("剪贴板中第一个目录文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证弹框提示源文件不存在");
      await agent.aiAssert("弹框提示源文件不存在");
      console.log("[Step] 关闭弹框");
      await agent.aiTap("点击跳过");
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log("[Step] 重新打开剪贴板，删除已测试的目录文件记录");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiTap("点击第一个记录右上角的删除按钮");
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log("[OK] 目录文件步骤完成");

      // ===== 步骤3：拖拽图片文件记录 =====
      console.log("[Step 2-4] 拖拽图片文件记录");
      await agent.aiDrag("剪贴板中第一个图片文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证弹框提示源文件不存在");
      await agent.aiAssert("弹框提示源文件不存在");
      console.log("[Step] 关闭弹框");
      await agent.aiTap("点击跳过");
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log("[Step] 重新打开剪贴板，删除已测试的图片文件记录");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiTap("点击第一个记录右上角的删除按钮");
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log("[OK] 图片文件步骤完成");

      // ===== 步骤4：拖拽视频文件记录 =====
      console.log("[Step 2-5] 拖拽视频文件记录");
      await agent.aiDrag("剪贴板中第一个视频文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证弹框提示源文件不存在");
      await agent.aiAssert("弹框提示源文件不存在");
      console.log("[Step] 关闭弹框");
      await agent.aiTap("点击跳过");
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log("[Step] 重新打开剪贴板，删除已测试的视频文件记录");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiTap("点击第一个记录右上角的删除按钮");
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log("[OK] 视频文件步骤完成");

      // ===== 步骤5：拖拽应用程序文件记录 =====
      console.log("[Step 2-6] 拖拽应用程序文件记录");
      await agent.aiDrag("剪贴板中第一个应用程序文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证弹框提示源文件不存在");
      await agent.aiAssert("弹框提示源文件不存在");
      console.log("[Step] 关闭弹框");
      await agent.aiTap("点击跳过");
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log("[OK] 应用程序文件步骤完成");

      console.log("========== Test2 完成 ==========");
    },
    { timeout: 600000, tags: ["1881197", "level2"] },
  );

  // 环境恢复
  afterAll(async ({ uos, agent, device, system }) => {
    console.log("========== afterAll: 环境恢复 ==========");
    console.log("[Step] 重启剪贴板服务，关闭文件管理器");
    system.exec(`systemctl --user restart dde-clipboard`);
    system.exec(`killall dde-file-manager`);
    console.log("[OK] afterAll 完成");
  });
});
