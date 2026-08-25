/**
 * 用例 PMSID: 1881281
 * 用例标题: 【稳定性】【桌面】【剪贴板】剪贴板复制表格文档超过6W行数据，系统运行正常
 * 生成时间: 2026-01-28 13:58:06
 * 用例编写人：UT000224(何权)
 */

describe("1881281-【稳定性】【桌面】【剪贴板】剪贴板复制表格文档超过6W行数据，系统运行正常", () => {
  beforeAll(async ({ device, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    system.exec(`systemctl --user restart dde-clipboard`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log("2. beforeEach: 每个测试前的准备");
  });

  test(
    "1881281-【稳定性】【桌面】【剪贴板】剪贴板复制表格文档超过6W行数据，系统运行正常",
    async ({ device, agent, uos, system}) => {
      // 步骤1: 生成6W行的表格文档
      await new Promise(resolve => setTimeout(resolve, 500));
      await system.exec(`sh -c 'echo "ID,Value"; seq 1 60000 | awk "{print \ $ 1 \",\" int(rand()*1000)}"' > ~/Desktop/simple_6w.csv`);
      await new Promise(resolve => setTimeout(resolve, 1000));      
      // 步骤2：打开6W行的表格数据  
      await agent.aiDoubleClick("simple_6w.csv");
      await agent.aiWaitFor('表格正常打开', {
        timeoutMs: 30000,
        checkIntervalMs: 5000,
      });

      // 步骤3：复制表格数据
      await system.exec(`xdotool key Ctrl+a`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await system.exec(`xdotool key Ctrl+c`);     

      // 步骤4: 新建新的表格
      await system.exec(`xdotool key shift+F11`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 步骤5：粘贴验证表格数据
      await system.exec(`xdotool key Ctrl+v`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await system.exec(`xdotool key Ctrl+Down`);
      await agent.aiAssert("显示表格60001行存在数据");      
    },
    { timeout: 1200000, tags: ["1881281", "level3","module:dde_clipboard"] },
  );

  afterEach(async ({ device , agent, system}) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ agent, device, system}) => {
    console.log("5. afterAll: 清理测试套件");
    await system.exec(`
      dbus-send --session   --dest=org.deepin.dde.Dock1   --type=method_call   /org/deepin/dde/Dock1   org.deepin.dde.Dock1.setItemOnDock   string:"Dock_Quick_Plugins"   string:"clipboard-key"   boolean:false`
    );
    await system.exec("killall et wps wpp pdf wpsoffice");
    await system.exec(`systemctl --user restart dde-clipboard`);
    await system.exec(`rm -rf /home/$USER/Desktop/simple_6w.csv`);

  });
});