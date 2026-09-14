/**
 * 用例 PMSID: 1881219
 * 用例标题: 【桌面】【剪贴板】图片文件记录拖拽到同一用户级路径下，可自动复制并重命名
 * 生成时间: 2026-04-22
 * 用例编写人：UT003165(吴磊)
 */

describe("1881219-【桌面】【剪贴板】图片文件记录拖拽到同一用户级路径下，可自动复制并重命名", () => {
  // 场景构造：清理可能存在的旧测试文件
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    // 确保桌面干净
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    // 清理可能存在的旧测试文件（使用更宽泛的匹配模式，避免中文括号编码问题）
    system.exec(`rm -f /home/$USER/Desktop/1881219_desktop*`);
    system.exec(`rm -f /home/$USER/1881219_home*`);
    system.exec(`rm -f /home/$USER/Desktop/1881219*`);
    system.exec(`rm -f /home/$USER/1881219*`);
  });

  // 测试数据构造：创建测试图片
  beforeEach(async ({ device, uos, agent, system }) => {
    console.log("2. beforeEach: 每个测试前的准备");
    // 重启剪贴板服务，确保干净状态
    system.exec(`systemctl --user restart dde-clipboard`);
    // 复制系统图片到桌面（用例编号命名）
    system.exec(`cp /usr/share/backgrounds/default_background.jpg /home/$USER/Desktop/1881219_desktop.png`);
    // 复制系统图片到主目录
    system.exec(`cp /usr/share/backgrounds/default_background.jpg /home/$USER/1881219_home.png`);
    // 等待文件显示
    await agent.aiWaitFor("1881219_desktop.png在桌面显示");
  });

  test(
    "1881219-【桌面】【剪贴板】图片文件记录拖拽到同一用户级路径下，可自动复制并重命名",
    async ({ device, agent, uos, system }) => {
      // ===== 步骤1：桌面图片复制后拖拽到桌面 =====
      // 桌面右键复制图片文件
      await agent.aiRightClick("点击1881219_desktop.png");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");

      // 打开剪贴板
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");

      // 断言1.1：剪贴板中有图片记录
      await agent.aiAssert("剪贴板中有1条图片记录1881219_desktop.png");

      // 拖拽剪贴板记录到桌面
      await agent.aiDrag("剪贴板中的1881219_desktop.png图片记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 断言1.2：桌面生成图片副本文件
      await agent.aiAssert("桌面生成一个1881219_desktop(副本).png图片文件");

      // 清理剪贴板（避免步骤1的记录影响步骤2）
      system.exec(`systemctl --user restart dde-clipboard`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // ===== 步骤2：主目录图片复制后拖拽到主目录 =====
      // 关闭当前文件管理器
      await system.exec(`killall dde-file-manager`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // 打开文件管理器并导航到主目录
      system.exec(`dde-file-manager /home/$USER`);
      await agent.aiWaitFor("文件管理器界面已显示");
      await new Promise(resolve => setTimeout(resolve, 500));

      // 主目录右键复制图片文件
      await agent.aiTap("点击1881219_home.png");
      await agent.aiRightClick("点击1881219_home.png");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");

      // 打开剪贴板
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");

      // 断言2.1：剪贴板中有图片记录
      await agent.aiAssert("剪贴板中有1条图片记录1881219_home.png");

      // 拖拽剪贴板记录到主目录空白处
      await agent.aiDrag("剪贴板中的1881219_home.png图片记录", "主目录窗口的空白区域");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 断言2.2：主目录生成图片副本文件
      await agent.aiAssert("主目录下生成一个1881219_home(副本).png图片文件");
    },
    { timeout: 600000, tags: ["1881219", "level2"] },
  );

  // 数据清理
  afterEach(async ({ device, system }) => {
    console.log("4. afterEach: 每个测试后的清理");
    // 清理测试文件（使用更宽泛的匹配模式，避免中文括号编码问题）
    system.exec(`rm -f /home/$USER/Desktop/1881219_desktop*`);
    system.exec(`rm -f /home/$USER/1881219_home*`);
    system.exec(`rm -f /home/$USER/Desktop/1881219*`);
    system.exec(`rm -f /home/$USER/1881219*`);
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
