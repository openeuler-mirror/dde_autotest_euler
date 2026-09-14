/**
 * 用例 PMSID: 1881221
 * 用例标题: 【桌面】【剪贴板】文本文件记录拖拽到同一用户级路径下，可自动复制并重命名
 * 生成时间: 2026-04-22
 * 用例编写人：UT003165(吴磊)
 */

describe("1881221-【桌面】【剪贴板】文本文件记录拖拽到同一用户级路径下，可自动复制并重命名", () => {
  // 场景构造：创建测试数据
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    // 确保桌面干净
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    // 清理可能存在的旧测试文件（使用更宽泛的匹配模式，避免中文括号编码问题）
    system.exec(`rm -f /home/$USER/Desktop/1881221_desktop*`);
    system.exec(`rm -f /home/$USER/1881221_home*`);
    system.exec(`rm -f /home/$USER/Desktop/1881221*`);
    system.exec(`rm -f /home/$USER/1881221*`);
  });

  // 测试数据构造
  beforeEach(async ({ device, uos, agent, system }) => {
    console.log("2. beforeEach: 每个测试前的准备");
    // 重启剪贴板服务，确保干净状态
    system.exec(`systemctl --user restart dde-clipboard`);
    // 创建桌面文本文件（用例编号命名）
    system.exec(`touch /home/$USER/Desktop/1881221_desktop.txt`);
    // 创建主目录文本文件（与桌面文件名区分）
    system.exec(`touch /home/$USER/1881221_home.txt`);
    // 等待文件显示
    await agent.aiWaitFor("1881221_desktop.txt在桌面显示");
  });

  test(
    "1881221-【桌面】【剪贴板】文本文件记录拖拽到同一用户级路径下，可自动复制并重命名",
    async ({ device, agent, uos, system }) => {
      // ===== 步骤1：桌面文本复制后拖拽到桌面 =====
      // 桌面右键复制文本文件
      await agent.aiRightClick("点击1881221_desktop.txt");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");

      // 打开剪贴板
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");

      // 断言1.1：剪贴板中有文本记录
      await agent.aiAssert("剪贴板中有1条文本记录1881221_desktop.txt");

      // 拖拽剪贴板记录到桌面
      await agent.aiDrag("剪贴板中的1881221_desktop.txt文本记录", "桌面中间位置");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 断言1.2：桌面生成"1881221_desktop(副本).txt"文件
      await agent.aiAssert("桌面生成一个1881221_desktop(副本).txt文件");

      // 清理剪贴板（避免步骤1的记录影响步骤2）
      system.exec(`systemctl --user restart dde-clipboard`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // ===== 步骤2：主目录文本复制后拖拽到主目录 =====
      // 关闭当前文件管理器
      await system.exec(`killall dde-file-manager`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // 打开文件管理器并导航到主目录
      system.exec(`dde-file-manager /home/$USER`);
      await agent.aiWaitFor("文件管理器界面已显示");
      await new Promise(resolve => setTimeout(resolve, 500));

      // 主目录右键复制文本文件
      await agent.aiTap("点击1881221_home.txt");
      await agent.aiRightClick("点击1881221_home.txt");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("点击复制");

      // 打开剪贴板
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");

      // 断言2.1：剪贴板中有文本记录
      await agent.aiAssert("剪贴板中有1条文本记录1881221_home.txt");

      // 拖拽剪贴板记录到主目录空白处
      await agent.aiDrag("剪贴板中的1881221_home.txt文本记录", "主目录窗口的空白区域");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 断言2.2：主目录生成"1881221_home(副本).txt"文件
      await agent.aiAssert("主目录下生成一个1881221_home(副本).txt文件");
    },
    { timeout: 600000, tags: ["1881221", "level2"] },
  );

  // 数据清理
  afterEach(async ({ device, system }) => {
    console.log("4. afterEach: 每个测试后的清理");
    // 清理测试文件（使用更宽泛的匹配模式，避免中文括号编码问题）
    system.exec(`rm -f /home/$USER/Desktop/1881221_desktop*`);
    system.exec(`rm -f /home/$USER/1881221_home*`);
    system.exec(`rm -f /home/$USER/Desktop/1881221*`);
    system.exec(`rm -f /home/$USER/1881221*`);
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
