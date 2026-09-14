/**
 * 用例 PMSID: 1881225
 * 用例标题: 【桌面】【剪贴板】同一多个文件连续多次复制/剪切，只生成一条剪贴板记录
 * 生成时间: 2026-02-05 16:08:00
 * 用例编写人：UT000224(何权)
 */

describe("1881225-【桌面】【剪贴板】同一多个文件连续多次复制/剪切，只生成一条剪贴板记录", () => {
  beforeAll(async ({ device, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    system.exec(`systemctl --user restart dde-clipboard`);
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log("2. beforeEach: 每个测试前的准备");
    // 清理剪贴板
    system.exec(`systemctl --user restart dde-clipboard`);
  });

  test(
    "1881225-【桌面】【剪贴板】同一多个文件连续多次复制/剪切，只生成一条剪贴板记录",
    async ({ device, agent, uos, system}) => {
      const tempDir = `/tmp/clipboard_test_${Date.now()}`;
      
      // 测试场景1: 2个文件连续多次复制
      console.log("测试场景1: 2个文件连续多次复制");
      
      // 创建临时目录并使用touch创建2个测试文件
      system.exec(`mkdir -p ${tempDir}`);
      system.exec(`touch ${tempDir}/test_file_1.txt`);
      system.exec(`touch ${tempDir}/test_file_2.txt`);
      
      // 打开临时目录
      system.exec(`dde-file-manager ${tempDir}`);
      await agent.aiWaitFor("文件管理器界面已显示");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 第一次复制: Ctrl+A选中所有文件，Ctrl+C复制
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 300));
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 第二次复制（相同内容）
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 300));
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 第三次复制（相同内容）
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 300));
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 验证剪贴板只有1条记录
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiAssert("右侧的剪贴板窗口中只有1条记录，剪贴板记录左上角显示文件，下方显示文件名等2个文件");

      // 关闭剪贴板
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
      );
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 清理
      system.exec("killall dde-file-manager");
      await new Promise(resolve => setTimeout(resolve, 500));
      system.exec(`rm -rf ${tempDir}`);
      
      // 清理剪贴板
      system.exec(`systemctl --user restart dde-clipboard`);
      
      // 测试场景2: 3个文件连续多次剪切
      console.log("测试场景2: 3个文件连续多次剪切");
      
      // 创建临时目录并使用touch创建3个测试文件
      const tempDir2 = `/tmp/clipboard_test_${Date.now()}_2`;
      system.exec(`mkdir -p ${tempDir2}`);
      system.exec(`touch ${tempDir2}/test_file_1.txt`);
      system.exec(`touch ${tempDir2}/test_file_2.txt`);
      system.exec(`touch ${tempDir2}/test_file_3.txt`);
      
      // 打开临时目录
      system.exec(`dde-file-manager ${tempDir2}`);
      await agent.aiWaitFor("文件管理器界面已显示");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 第一次剪切: Ctrl+A选中所有文件，Ctrl+X剪切
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 300));
      await device.pressKey("Ctrl", "x");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 第二次剪切（相同内容）
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 300));
      await device.pressKey("Ctrl", "x");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 第三次剪切（相同内容）
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 300));
      await device.pressKey("Ctrl", "x");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 验证剪贴板只有1条记录
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiAssert("右侧的剪贴板窗口中只有1条记录，剪贴板记录左上角显示文件，下方显示文件名等3个文件");

      // 关闭剪贴板
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
      );
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 清理
      system.exec("killall dde-file-manager");
      await new Promise(resolve => setTimeout(resolve, 500));
      system.exec(`rm -rf ${tempDir2}`);
      
      // 清理剪贴板
      system.exec(`systemctl --user restart dde-clipboard`);
    },
    { timeout: 1200000, tags: ["1881225", "level3"] },
  );

  afterEach(async ({ device , agent}) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
    system.exec(`systemctl --user restart dde-clipboard`);
    system.exec("killall dde-file-manager");
  });
});