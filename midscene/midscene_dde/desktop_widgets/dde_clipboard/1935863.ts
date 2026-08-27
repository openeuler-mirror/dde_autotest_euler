/**
 * 用例 PMSID: 1935863
 * 用例标题: 【桌面】【剪贴板】打开剪贴板后，再显示桌面直接关闭
 * 生成时间: 2025-12-23 21:00:00
 * 用例编写人：UT000224(何权)
 */

describe("1935863-【桌面】【剪贴板】打开剪贴板后，再显示桌面直接关闭", () => {
  beforeAll(async ({ device, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    // 确保剪贴板服务正常运行
    system.exec(`systemctl --user restart dde-clipboard`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log("2. beforeEach: 每个测试前的准备");
  });

  test(
    "1935863-【桌面】【剪贴板】打开剪贴板后，再显示桌面直接关闭",
    async ({ device, agent, uos, system}) => {
      // 步骤1: 先快捷键"Win+V"调出剪贴板，点击任务栏最右侧"显示桌面区域"
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
      );

      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");
      
      await uos.showDesktop();
      await agent.aiAssert("桌面右侧无打开的窗口");
      
      
      // 再次按压快捷键"Win+V"
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiAssert("剪贴板显示正常");
      await agent.aiAssert("其它应用窗口保持隐藏");
      
    },
    { timeout: 600000, tags: ["1935863", "level3"] },
  );

  afterEach(async ({ device , agent, system}) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
  });
});