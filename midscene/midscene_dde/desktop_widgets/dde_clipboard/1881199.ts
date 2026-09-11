/**
 * 用例 PMSID: 1881199
 * 用例标题: 【桌面】【剪贴板】拖拽剪切板图片文件3次到桌面
 * 生成时间: 2025-12-23 19:30:00
 * 用例编写人：UT000224(何权)
 */

describe("1881199-【桌面】【剪贴板】拖拽剪切板图片文件3次到桌面", () => {
  beforeAll(async ({ device, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    system.exec(`rm -f /home/$USER/Desktop/desktop*`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log("2. beforeEach: 每个测试前的准备");
  });

  test(
    "1881199-【桌面】【剪贴板】拖拽剪切板图片文件3次到桌面",
    async ({ device, agent, uos, system}) => {
       // 打开主目录图片Wallpapers目录
      await new Promise(resolve => setTimeout(resolve, 200));
      system.exec(`dde-file-manager ~/Pictures/Wallpapers`);
      await agent.aiWaitFor("文件管理器界面已显示");
      await device.pressKey("Ctrl", "2");
      await new Promise(resolve => setTimeout(resolve, 200)); // 等待目录加载    

      await agent.aiTap('desktop.jpg');
      await agent.aiRightClick("desktop.jpg");
      await agent.aiWaitFor("右键菜单显示");
      await agent.aiTap('点击复制')
      await new Promise(resolve => setTimeout(resolve, 200));
      system.exec(`killall dde-file-manager`);
      
      // 唤出剪贴板窗口界面
      await system.exec(`xdotool key Super+v`);
      await agent.aiWaitFor("剪贴板窗口显示");
     
      // 拖拽剪贴板中记录到桌面三次
      await agent.aiAction('拖拽桌面右侧剪贴板窗口下的文件desktop.jpg到桌面', { deepThink: true });

      await system.exec(
       `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`
      );
      await new Promise(resolve => setTimeout(resolve, 200));
      await agent.aiAction("拖拽桌面右侧剪贴板窗口下的JPEG图标文件到桌面", { deepThink: true }); 

      await system.exec(
       `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`
      );
      await new Promise(resolve => setTimeout(resolve, 200));
      await agent.aiAction("拖拽桌面右侧剪贴板窗口下的JPEG图标文件到桌面"); 
      
      // 检查桌面是否存在三个文件
      system.exec(`dde-file-manager ~/Desktop`);
      await agent.aiWaitFor("文件管理器界面已显示");
      system.exec("xdotool key Ctrl+2");
      await new Promise(resolve => setTimeout(resolve, 200)); // 等待目录加载
      await agent.aiAssert("桌面文件夹中存在desktop.jpg、desktop(副本).jpg、desktop(副本1).jpg");
    },
    { timeout: 600000, tags: ["1881199", "level3"] },
  );

  afterEach(async ({ device , agent, system}) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
    // 关闭剪贴板窗口
    system.exec(`killall dde-file-manager`);
    // 删除桌面生成的三个文件
    system.exec(`rm -f /home/$USER/Desktop/desktop*`);
    // 清除剪贴板内容
    system.exec(`systemctl --user restart dde-clipboard`)
  });
});