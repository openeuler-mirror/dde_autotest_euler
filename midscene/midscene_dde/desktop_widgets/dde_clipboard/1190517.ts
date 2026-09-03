/**
 * 用例 PMSID: 1190517
 * 用例标题: 【桌面】【剪贴板】剪贴板记录界面展示检查
 * 生成时间: 2026-01-29 20:45:00
 * 用例编写人：UT000224(何权)
 */

describe("1190517-【桌面】【剪贴板】剪贴板记录界面展示检查", () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    // 清理剪贴板历史记录
    system.exec(`systemctl --user restart dde-clipboard`);   
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log("2. beforeEach: 每个测试前的准备");
    // 确保剪贴板处于隐藏状态
    system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
    );
  });

  test(
    "1190517-【桌面】【剪贴板】剪贴板记录界面展示检查",
    async ({ device, agent, uos, system }) => {
      // 步骤1: 打开剪贴板，检查剪贴板界面，剪贴板无记录，窗口上方写有"剪贴板"标题，中间存在提示文字"复制内容进剪贴板"
      await new Promise(resolve => setTimeout(resolve, 500));
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiAssert("剪贴板窗口上方显示'剪贴板'标题");
      await agent.aiAssert("剪贴板窗口中间显示'复制内容进剪贴板'提示文字");
      
      // 关闭剪贴板
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 步骤2: 打开文本编辑器，输入随机内容，全选复制，打开剪贴板，检查剪贴板界面，显示一条记录，记录左上角显示文本，下方显示XX字符
      await system.exec('/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor /home/$USER/Desktop/10M_text_file.txt');
      await agent.aiWaitFor("文本编辑器已打开");
  
      // 输入随机内容
      const randomText = "这是一个随机的测试文本 " + Math.random().toString(36).substring(7);
      await device.typeText(randomText);
      
      // 全选并复制
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 500));
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 再次打开剪贴板
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 验证剪贴板界面显示一条记录
      await agent.aiAssert(`剪贴板第一条数据的左上角显示文本内容，第一条记录下方字符数和文本编辑器下方的字符数一样"`);

      // 关闭剪贴板
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // 关闭文本编辑器
      system.exec("killall deepin-editor");

      // 步骤3: 发送快捷键Ctrl+alt+A截图, 发送鼠标双击，打开剪贴板，剪贴板新增一条记录，第一条记录左上角显示图片，下方显示有图片分辨率px
      // 截图操作
      await device.pressKey("Ctrl", "Alt", "A");
      await new Promise(resolve => setTimeout(resolve, 1000)); // 等待截图工具启动
      
      // 双击确认截图
      await agent.aiDoubleClick("桌面");
      await new Promise(resolve => setTimeout(resolve, 1000)); // 等待截图保存到剪贴板
      
      // 打开剪贴板
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 验证新增记录为图片
      await agent.aiAssert("剪贴板界面显示新添加的图片记录");
      await agent.aiAssert("记录下方显示图片分辨率信息，单位为px");
      
      // 关闭剪贴板
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // 步骤4: 文件管理器打开音乐目录，单击选择mp3文件，发送Ctrl+c复制，打开剪贴板，第一条记录左上角显示文件，下方显示文件名称bensound-sunny.mp3
      // 打开文件管理器到音乐目录，增加等待时间存在打开慢的情况
      await system.exec(`dde-file-manager /home/$USER/Music`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      await system.exec(`xdotool key Ctrl+2`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 选择mp3文件并复制
      await agent.aiTap("bensound-sunny.mp3");
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 打开剪贴板
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 验证文件记录
      await agent.aiAssert("剪贴板界面显示文件记录");
      await agent.aiAssert("记录下方显示文件名称bensound-sunny.mp3");
      
      // 关闭剪贴板
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 步骤5: 打开剪贴板，查看剪贴板第二条、第三条数据，在右上角均显示XX分钟前
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 验证第三条记录的时间显示
      await agent.aiAssert("剪贴板第三条数据右上角显示XX分钟前");
    },
    { timeout: 1200000, tags: ["1190517", "level1", "smoke"] },
  );

  afterEach(async ({ device, system }) => {
    console.log("4. afterEach: 每个测试后的清理");
    //清理剪贴板
    system.exec(`systemctl --user restart dde-clipboard`);   
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
    // 关闭可能打开的应用程序
    system.exec(`killall deepin-editor`);
    system.exec(`killall dde-file-manager`);
  });
});