/**
 * 用例 PMSID: 1881217
 * 用例标题: 【桌面】【剪贴板】文件类记录拖拽到同一用户级路径下，可自动复制并重命名
 * 生成时间: 2026-04-23
 * 用例编写人：UT003165(吴磊)
 */

describe("1881217-【桌面】【剪贴板】文件类记录拖拽到同一用户级路径下，可自动复制并重命名", () => {
  // 场景构造：清理可能存在的旧测试文件
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    // 确保桌面干净
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    // 清理可能存在的旧测试文件
    system.exec(`rm -f /home/$USER/Desktop/1881217*`);
    system.exec(`rm -f /home/$USER/1881217*`);
  });

  // 测试数据构造：创建测试文件
  beforeEach(async ({ device, uos, agent, system }) => {
    console.log("2. beforeEach: 每个测试前的准备");
    // 重启剪贴板服务，确保干净状态
    system.exec(`systemctl --user restart dde-clipboard`);
    // 复制视频文件到桌面（用例编号命名）
    system.exec(`cp /usr/share/dde-introduction/uos/1-DDE.mp4 /home/$USER/Desktop/1881217_video.mp4`);
    // 创建zip测试文件（用视频文件压缩生成真实的zip文件）
    system.exec(`cd /home/$USER/Desktop && zip 1881217_archive.zip 1881217_video.mp4`);
    // 下载iso测试文件
    system.exec(`wget -q -O /home/$USER/Desktop/1881217_image.iso "https://cdimage.uniontech.com/iso-v20/uos-20-home-desktop-amd64.iso"`);
    // 创建sh脚本测试文件
    system.exec(`touch /home/$USER/Desktop/1881217_script.sh`);
    // 等待文件显示
    await agent.aiWaitFor("1881217_video.mp4在桌面显示");
  });

  test(
    "1881217-【桌面】【剪贴板】文件类记录拖拽到同一用户级路径下，可自动复制并重命名",
    async ({ device, agent, uos, system }) => {
      // ===== 步骤1：视频文件复制后拖拽到桌面 =====
      // 桌面右键复制视频文件
      await agent.aiRightClick("点击1881217_video.mp4");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");

      // 打开剪贴板
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");

      // 断言1.1：剪贴板中有视频记录
      await agent.aiAssert("剪贴板中有1条视频记录1881217_video.mp4");

      // 拖拽剪贴板记录到桌面
      await agent.aiDrag("剪贴板中的1881217_video.mp4视频记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 断言1.2：桌面生成视频副本文件
      await agent.aiAssert("桌面生成一个1881217_video(副本).mp4视频文件");

      // 清理剪贴板（避免步骤1的记录影响步骤2）
      system.exec(`systemctl --user restart dde-clipboard`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // ===== 步骤2：压缩文件复制后拖拽到桌面 =====
      // 桌面右键复制压缩文件
      await agent.aiRightClick("点击1881217_archive.zip");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");

      // 打开剪贴板
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");

      // 断言2.1：剪贴板中有压缩文件记录
      await agent.aiAssert("剪贴板中有1条压缩文件记录1881217_archive.zip");

      // 拖拽剪贴板记录到桌面
      await agent.aiDrag("剪贴板中的1881217_archive.zip压缩文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 断言2.2：桌面生成压缩文件副本
      await agent.aiAssert("桌面生成一个1881217_archive(副本).zip压缩文件");

      // 清理剪贴板（避免步骤2的记录影响步骤3）
      system.exec(`systemctl --user restart dde-clipboard`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // ===== 步骤3：镜像文件复制后拖拽到桌面 =====
      // 桌面右键复制镜像文件
      await agent.aiRightClick("点击1881217_image.iso");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");

      // 打开剪贴板
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");

      // 断言3.1：剪贴板中有镜像文件记录
      await agent.aiAssert("剪贴板中有1条镜像文件记录1881217_image.iso");

      // 拖拽剪贴板记录到桌面
      await agent.aiDrag("剪贴板中的1881217_image.iso镜像文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 断言3.2：桌面生成镜像文件副本
      await agent.aiAssert("桌面生成一个1881217_image(副本).iso镜像文件");

      // 清理剪贴板（避免步骤3的记录影响步骤4）
      system.exec(`systemctl --user restart dde-clipboard`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // ===== 步骤4：脚本文件复制后拖拽到桌面 =====
      // 桌面右键复制脚本文件
      await agent.aiRightClick("点击1881217_script.sh");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");

      // 打开剪贴板
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");

      // 断言4.1：剪贴板中有脚本文件记录
      await agent.aiAssert("剪贴板中有1条脚本文件记录1881217_script.sh");

      // 拖拽剪贴板记录到桌面
      await agent.aiDrag("剪贴板中的1881217_script.sh脚本文件记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 断言4.2：桌面生成脚本文件副本
      await agent.aiAssert("桌面生成一个1881217_script(副本).sh脚本文件");
    },
    { timeout: 600000, tags: ["1881217", "level2"] },
  );

  // 数据清理
  afterEach(async ({ device, system }) => {
    console.log("4. afterEach: 每个测试后的清理");
    // 清理测试文件（使用更宽泛的匹配模式，避免中文括号编码问题）
    system.exec(`rm -f /home/$USER/Desktop/1881217*`);
    system.exec(`rm -f /home/$USER/1881217*`);
  });

  // 环境恢复
  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
    // 重启剪贴板服务恢复状态
    system.exec(`systemctl --user restart dde-clipboard`);
    // 关闭文件管理器
    system.exec(`killall dde-file-manager`);
  });
});
