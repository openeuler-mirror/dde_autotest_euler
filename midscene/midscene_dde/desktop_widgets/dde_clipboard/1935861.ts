/**
 * 用例 PMSID: 1935861
 * 用例标题: 【桌面】【剪贴板】打开插件图标面板后，再调出剪贴板窗口
 * 生成时间: 2026-02-04 16:08:00
 * 用例编写人：UT000224(何权)
 */

describe("1935861-【桌面】【剪贴板】打开插件图标面板后，再调出剪贴板窗口", () => {
  beforeAll(async ({ device, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log("2. beforeEach: 每个测试前的准备");
  });

  test(
    "1935861-【桌面】【剪贴板】打开插件图标面板后，再调出剪贴板窗口",
    async ({ device, agent, uos, system }) => {
      // 测试场景1: 点击任务栏时间插件，弹出时间面板，快捷键Win+V调出剪贴板
      console.log("测试场景1: 时间插件面板 + 剪贴板");

      // 点击任务栏时间插件
      await agent.aiTap("任务栏右侧时间插件图标", { deepThink: true });
      await agent.aiWaitFor("时间日期面板已显示");
      
      // 使用快捷键Win+V调出剪贴板
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");
      
      // 验证时间面板消失，剪贴板在屏幕右侧正常展现.存在bug：340799
      await agent.aiAssert("时间日期面板已关闭,剪贴板窗口紧靠右侧边界，无重叠显示");
      
      // 关闭剪贴板
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`
      );
      await new Promise(resolve => setTimeout(resolve, 500));

      // 测试场景2: 点击任务栏声音图标，弹出插件面板，快捷键Win+V调出剪贴板
      console.log("测试场景2: 声音插件面板 + 剪贴板");
      
      // 点击任务栏声音图标
      await agent.aiTap("任务栏右侧声音图标", { deepThink: true });
      await agent.aiWaitFor("声音控制面板已显示");
      
      // 使用快捷键Win+V调出剪贴板
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");
      
      // 验证声音面板消失，剪贴板在屏幕右侧正常展现
      await agent.aiAssert("声音控制面板已关闭,剪贴板窗口下无其他窗口，无重叠显示");
      
      // 关闭剪贴板
      await system.exec(
        `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`
      );
      await new Promise(resolve => setTimeout(resolve, 500));
      // 关闭插件面板
      system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);

    },
    { timeout: 1200000, tags: ["1935861", "level3"] }
  );

  afterEach(async ({ device, system }) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    await agent.aiTap('桌面');
    await system.exec(`systemctl --user restart dde-clipboard`);
    console.log("5. afterAll: 清理测试套件");
  });
});