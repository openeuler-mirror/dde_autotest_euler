/**
 * 用例 PMSID: 1881215
 * 用例标题: 【桌面】【剪贴板】拖拽剪贴板中源文件已删除的文件记录到桌面
 * 生成时间: 2026-04-23
 * 用例编写人：UT003165(吴磊)
 */

describe("1881215-【桌面】【剪贴板】拖拽剪贴板中源文件已删除的文件记录到桌面", () => {
  // 场景构造：清理可能存在的旧测试文件
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log("========== beforeAll: 初始化测试套件 ==========");
    console.log("[Step] 确保桌面干净，清理旧测试文件");
    // 确保桌面干净
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    // 清理可能存在的旧测试文件
    system.exec(`rm -f /home/$USER/Desktop/1881215*`);
    system.exec(`rm -rf /home/$USER/Desktop/1881215_dir`);
    // 重启剪贴板服务确保干净状态
    console.log("[Step] 重启剪贴板服务");
    system.exec(`systemctl --user restart dde-clipboard`);
    console.log("[Done] beforeAll 完成");
  });

  // ===== 测试1：环境准备 - 创建文件并复制到剪贴板 =====
  test(
    "1881215-环境准备",
    async ({ device, agent, uos, system }) => {
      console.log("========== Test1: 环境准备 ==========");

      // 1. 重启剪贴板服务
      console.log("[Step 1-1] 重启剪贴板服务，确保干净状态");
      system.exec(`systemctl --user restart dde-clipboard`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // 2. 创建测试文件到桌面
      console.log("[Step 1-2] 创建5个测试文件到桌面");
      console.log("  - 创建文本文件: 1881215_text.txt");
      system.exec(`touch /home/$USER/Desktop/1881215_text.txt`);
      console.log("  - 创建目录文件: 1881215_dir");
      system.exec(`mkdir -p /home/$USER/Desktop/1881215_dir`);
      console.log("  - 创建图片文件: 1881215_image.jpg");
      system.exec(`cp /usr/share/backgrounds/default_background.jpg /home/$USER/Desktop/1881215_image.jpg`);
      console.log("  - 创建视频文件: 1881215_video.mp4");
      system.exec(`cp /usr/share/dde-introduction/uos/1-DDE.mp4 /home/$USER/Desktop/1881215_video.mp4`);
      console.log("  - 创建应用商店desktop文件: 1881215_app.desktop");
      system.exec(`cp /usr/share/applications/deepin-app-store.desktop /home/$USER/Desktop/1881215_app.desktop`);

      // 3. 等待文件显示
      console.log("[Step 1-3] 等待文件在桌面显示");
      await agent.aiWaitFor("1881215_text.txt在桌面显示");
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log("[OK] 文件已显示在桌面");

      // 4. 依次将文件复制到剪贴板（倒序复制，最后复制的在剪贴板最上面）
      console.log("[Step 1-4] 依次将5个文件复制到剪贴板");

      console.log("  [4-1] 复制应用商店desktop文件（桌面显示为应用商店）");
      await agent.aiRightClick("点击应用商店");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log("  [OK] 应用程序文件已复制到剪贴板");

      console.log("  [4-2] 复制视频文件 1881215_video.mp4");
      await agent.aiRightClick("点击1881215_video.mp4");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log("  [OK] 视频文件已复制到剪贴板");

      console.log("  [4-3] 复制图片文件 1881215_image.jpg");
      await agent.aiRightClick("点击1881215_image.jpg");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log("  [OK] 图片文件已复制到剪贴板");

      console.log("  [4-4] 复制目录文件 1881215_dir");
      await agent.aiRightClick("点击1881215_dir");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log("  [OK] 目录文件已复制到剪贴板");

      console.log("  [4-5] 复制文本文件 1881215_text.txt");
      await agent.aiRightClick("点击1881215_text.txt");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");
      await new Promise(resolve => setTimeout(resolve, 200));
      console.log("  [OK] 文本文件已复制到剪贴板");

      // 5. 删除所有源文件（模拟源文件已删除的场景）
      console.log("[Step 1-5] 删除所有源文件，模拟源文件已删除");
      system.exec(`rm -f /home/$USER/Desktop/1881215_text.txt`);
      system.exec(`rm -rf /home/$USER/Desktop/1881215_dir`);
      system.exec(`rm -f /home/$USER/Desktop/1881215_image.jpg`);
      system.exec(`rm -f /home/$USER/Desktop/1881215_video.mp4`);
      system.exec(`rm -f /home/$USER/Desktop/1881215_app.desktop`);
      console.log("[OK] 源文件已删除");

      // 6. 验证剪贴板中有记录（滚动条导致无法验证具体数量，跳过此验证）
      // 剪贴板中已有5条文件记录，等待Test2进行实际测试验证
      console.log("========== Test1 完成 ==========");
    },
    { timeout: 600000, tags: ["1881215", "level2"] },
  );

  // ===== 测试2：实际测试 - 拖拽源文件已删除的记录 =====
  test(
    "1881215-拖拽剪贴板中源文件已删除的文件记录到桌面",
    async ({ device, agent, uos, system }) => {
      console.log("========== Test2: 拖拽源文件已删除的记录 ==========");

      // 1. 先确保在桌面环境，然后打开剪贴板
      console.log("[Step 2-1] 打开剪贴板界面");
      // 先点击桌面确保焦点在桌面
      system.exec(`xdotool mousemove 100 100 click 1`);
      await new Promise(resolve => setTimeout(resolve, 300));
      // 打开剪贴板
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      console.log("[OK] 剪贴板界面已显示");

      // ===== 步骤1：拖拽源文件已删除的文本文件记录（文本在剪贴板第一个位置） =====
      console.log("[Step 2-3-1] 拖拽文本文件记录 1881215_text.txt");
      await agent.aiDrag("剪贴板中第一个文本文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证弹出提示框：源文件不存在，显示跳过和重试按钮");
      await agent.aiAssert("弹出提示框提示源文件不存在，显示跳过和重试按钮");
      await agent.aiTap("点击跳过");
      console.log("[OK] 文本文件步骤完成");

      // ===== 步骤2：拖拽源文件已删除的目录文件记录（目录现在是第一个位置） =====
      // 重新打开剪贴板，并删除上一条记录（文本文件）
      console.log("[Step 2-3-2] 重新打开剪贴板，删除上一条文本记录");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiTap("点击第一个记录右上角的删除按钮");
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log("[Step 2-3-2] 拖拽目录文件记录 1881215_dir");
      await agent.aiDrag("剪贴板中第一个目录文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证弹出提示框：源文件不存在，显示跳过和重试按钮");
      await agent.aiAssert("弹出提示框提示源文件不存在，显示跳过和重试按钮");
      await agent.aiTap("点击跳过");
      console.log("[OK] 目录文件步骤完成");

      // ===== 步骤3：拖拽源文件已删除的图片文件记录（图片现在是第一个位置） =====
      // 重新打开剪贴板，并删除上一条记录（目录文件）
      console.log("[Step 2-3-3] 重新打开剪贴板，删除上一条目录记录");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiTap("点击第一个记录右上角的删除按钮");
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log("[Step 2-3-3] 拖拽图片文件记录 1881215_image.jpg");
      await agent.aiDrag("剪贴板中第一个图片文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证弹出提示框：源文件不存在，显示跳过和重试按钮");
      await agent.aiAssert("弹出提示框提示源文件不存在，显示跳过和重试按钮");
      await agent.aiTap("点击跳过");
      console.log("[OK] 图片文件步骤完成");

      // ===== 步骤4：拖拽源文件已删除的视频文件记录（视频现在是第一个位置） =====
      // 重新打开剪贴板，并删除上一条记录（图片文件）
      console.log("[Step 2-3-4] 重新打开剪贴板，删除上一条图片记录");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiTap("点击第一个记录右上角的删除按钮");
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log("[Step 2-3-4] 拖拽视频文件记录 1881215_video.mp4");
      await agent.aiDrag("剪贴板中第一个视频文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证弹出提示框：源文件不存在，显示跳过和重试按钮");
      await agent.aiAssert("弹出提示框提示源文件不存在，显示跳过和重试按钮");
      await agent.aiTap("点击跳过");
      console.log("[OK] 视频文件步骤完成");

      // ===== 步骤5：拖拽源文件已删除的应用程序文件记录（应用现在是第一个位置） =====
      // 重新打开剪贴板，并删除上一条记录（视频文件）
      console.log("[Step 2-3-5] 重新打开剪贴板，删除上一条视频记录");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiTap("点击第一个记录右上角的删除按钮");
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log("[Step 2-3-5] 拖拽应用程序文件记录 1881215_app.desktop");
      await agent.aiDrag("剪贴板中第一个应用程序文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("[Assert] 验证弹出提示框：源文件不存在，显示跳过和重试按钮");
      await agent.aiAssert("弹出提示框提示源文件不存在，显示跳过和重试按钮");
      await agent.aiTap("点击跳过");
      console.log("[OK] 应用程序文件步骤完成");

      console.log("========== Test2 完成 ==========");
    },
    { timeout: 600000, tags: ["1881215", "level2"] },
  );

  // 数据清理
  afterEach(async ({ device, system }) => {
    console.log("========== afterEach: 清理测试数据 ==========");
    console.log("[Step] 清理测试文件");
    system.exec(`rm -f /home/$USER/Desktop/1881215*`);
    system.exec(`rm -rf /home/$USER/Desktop/1881215_dir`);
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
