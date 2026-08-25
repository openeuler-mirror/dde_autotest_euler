/**
 * 用例 PMSID: 1881293
 * 用例标题: 【桌面】【剪贴板】同一图片连续多次复制/剪切，只生成一条剪贴板记录
 * 生成时间: 2025-12-23 19:04:33
 * 用例编写人：UT000224(何权)
 */

describe("1881293-【桌面】【剪贴板】同一图片连续多次复制/剪切，只生成一条剪贴板记录", () => {
  beforeAll(async ({ device, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    system.exec(`systemctl --user restart dde-clipboard`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log("2. beforeEach: 每个测试前的准备");
  });

  test(
    "1881293-【桌面】【剪贴板】同一图片连续多次复制/剪切，只生成一条剪贴板记录",
    async ({ device, agent, uos, system}) => {
      // 打开主目录图片Wallpapers目录
      system.exec(`dde-file-manager ~/Pictures/Wallpapers`);
      await agent.aiWaitFor("文件管理器界面已显示");
      await new Promise(resolve => setTimeout(resolve, 200)); // 等待目录加载
      
      // 第一次复制第一个图片
      await agent.aiRightClick("文件管理器中的第一个图片文件名称处");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("复制");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 第二次复制同一个图片
      await agent.aiRightClick("文件管理器中的第一个图片文件名称处");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("复制");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 第三次复制同一个图片
      await agent.aiRightClick("文件管理器中的第一个图片文件名称处");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap("复制");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 唤出剪贴板窗口界面
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");
      
      // 验证只有一条记录
      await agent.aiAssert("右侧的剪贴板窗口中只有1条图片记录，记录样式为图片预览图标");
    },
    { timeout: 600000, tags: ["1881293", "level3"] },
  );

  afterEach(async ({ device , agent, system}) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
    system.exec(`systemctl --user restart dde-clipboard`);
    system.exec("killall dde-file-manager");
  });
});