/**
 * 用例 PMSID: 1330033
 * 用例标题: 【桌面】【剪贴板】关闭剪贴板
 * 生成时间: 2025-12-17 13:27:09
 * 用例编写人：UT000224(何权)
 */

describe("1330033-【桌面】【剪贴板】关闭剪贴板", () => {
  beforeAll(async ({ device, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    system.exec(`killall deepin-editor`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log("2. beforeEach: 每个测试前的准备");
  });

  test(
    "1330033-【桌面】【剪贴板】关闭剪贴板",
    async ({ device, agent, uos, system}) => {
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 5000));  
      await agent.aiAssert("桌面无剪贴板模块");

      await system.exec("/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor -w %F");
      await new Promise(resolve => setTimeout(resolve, 500));
      await device.typeText("test");
      await device.pressKey("Ctrl", "a");
      await device.pressKey("Ctrl", "c");
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiDoubleClick('剪贴板中的 "test"', { deepThink: true });
      await agent.aiAssert("屏幕右侧的验证剪贴板已关闭");
      await agent.aiTap("文本编辑器");
      await device.pressKey("Ctrl", "v");
      await agent.aiAssert( "文本管理器中的文本内容相比之前发生了变化", { deepThink: true });

      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");
      await agent.aiTap("桌面");
      await agent.aiAssert("屏幕右侧的验证剪贴板已关闭");
    },
    { timeout: 1200000, tags: ["1330033", "level2"] },
  );

  afterEach(async ({ device , system}) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
    system.exec(`killall deepin-editor`);
  });
});
