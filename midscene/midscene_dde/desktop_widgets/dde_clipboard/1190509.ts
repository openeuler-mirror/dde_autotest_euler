/**
 * 用例 PMSID: 1190509
 * 用例标题: 【桌面】【剪贴板】剪贴板界面打开（快捷键）
 * 生成时间: 2025-12-16 16:33:33
 * 用例编写人：UT000224(何权)
 */

describe("1190509-【桌面】【剪贴板】剪贴板界面打开（快捷键）", () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log("1. beforeAll: 初始化测试套件");
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log("2. beforeEach: 每个测试前的准备");
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
  });

  test(
    "1190509-【桌面】【剪贴板】剪贴板界面打开（快捷键）",
    async ({ device, agent, uos, system }) => {
      await agent.aiWaitFor("桌面无应用窗口显示");
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪切板界面已从屏幕右侧边界显示");
      await agent.aiAssert("剪切板界面从屏幕右侧边界打开");
      await uos.openApp("文件管理器", {
        waitAfterOpen: 3000,
        maximizeWindow: true,
      });
      await agent.aiWaitFor("文件管理器界面已显示");
      await system.exec(`xdotool key Super+v`);
      await agent.aiAssert("剪切板界面从屏幕右侧边界打开");
      // 调用命令关闭剪切板
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
      );
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:1`,
      );
      await new Promise(resolve => setTimeout(resolve, 500));
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiAssert("剪切板界面从屏幕右侧边界打开,剪切板在任务栏左边");
    },
    { timeout: 1200000, tags: ["1190509", "level2", "smoke"] },
  );

  afterEach(async ({ device, system }) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.daemon.Dock1 /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:"Position" variant:int32:2`,
    );
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
    );
    await uos.openApp("文件管理器", {
      waitAfterOpen: 3000,
      maximizeWindow: false,
    });
    await system.exec(`killall dde-file-manager`);
  });
});
