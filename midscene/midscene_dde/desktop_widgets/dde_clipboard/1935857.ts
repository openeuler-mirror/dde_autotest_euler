/**
 * 用例 PMSID: 1935857
 * 用例标题: 【桌面】【剪贴板】剪贴板默认展示位置
 * 生成时间: 2025-12-23 15:27:06
 * 用例编写人：UT000224(何权)
 */

describe("1935857-【桌面】【剪贴板】剪贴板默认展示位置", () => {
  beforeAll(async ({ device, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    system.exec(`systemctl --user restart dde-clipboard`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log("2. beforeEach: 每个测试前的准备");
    // 确保剪贴板处于关闭状态
    await device.pressKey("Escape");
  });

  test(
    "1935857-【桌面】【剪贴板】剪贴板默认展示位置",
    async ({ device, agent, uos, system}) => {
      // 步骤1: 按压快捷键"Win+V"，唤出剪贴板窗口界面，默认展示在屏幕右侧位置，紧靠各方边界，有间隙，无重叠

      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板界面已显示");
      
      // 验证剪贴板默认展示位置在屏幕右侧
      await agent.aiAssert("剪贴板窗口显示在屏幕右侧位置,剪贴板窗口紧靠右侧边界，剪贴板窗口除桌面外无其他窗口重叠");

      // 关闭剪贴板
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      system.exec(`
        dbus-send --session   --dest=org.deepin.dde.Dock1   --type=method_call   /org/deepin/dde/Dock1   org.deepin.dde.Dock1.setItemOnDock   string:"Dock_Quick_Plugins"   string:"clipboard-key"   boolean:true`
      );
      // 步骤1: 鼠标hover到任务栏上的剪贴板图标
      await new Promise(resolve => setTimeout(resolve, 500)); 
      await agent.aiTap("桌面右下任务栏插件区域线上箭头旁的剪贴板图标", { deepThink: true });

      // 等待剪贴板界面显示
      await agent.aiWaitFor("剪贴板界面已显示");
      
      // 验证剪贴板默认展示位置在屏幕右侧
      await agent.aiAssert("剪贴板窗口显示在屏幕右侧位置,剪贴板窗口紧靠右侧边界，剪贴板窗口除桌面外无其他窗口重叠");
    },
    { timeout: 1200000, tags: ["1935857", "level3"] },
  );

  afterEach(async ({ device , agent, system}) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ agent, device, system}) => {
    console.log("5. afterAll: 清理测试套件");
    system.exec(`
      dbus-send --session   --dest=org.deepin.dde.Dock1   --type=method_call   /org/deepin/dde/Dock1   org.deepin.dde.Dock1.setItemOnDock   string:"Dock_Quick_Plugins"   string:"clipboard-key"   boolean:false`
    );
    // 确保关闭剪贴板
    system.exec(`systemctl --user restart dde-clipboard`);

  });
});