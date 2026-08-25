/**
 * 用例 PMSID: 1882575
 * 用例标题: 【桌面】【剪贴板】设置不同字号下，剪贴板界面各记录内容同步更新展示
 * 生成时间: 2026-03-05 13:32:48
 * 用例编写人：UT000224(何权)
 */

describe("1882575-【桌面】【剪贴板】设置不同字号下，剪贴板界面各记录内容同步更新展示", () => {
  beforeAll(async ({ device, agent, system }) => {
    console.log("1. beforeAll: 初始化测试套件");
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log("2. beforeEach: 每个测试前的准备");
  });

  test(
    "1882575-【桌面】【剪贴板】设置不同字号下，剪贴板界面各记录内容同步更新展示",
    async ({ device, agent, uos, system}) => {
      // 步骤1: 打开文本编辑器，输入并复制文本内容
      console.log("步骤1: 打开文本编辑器并复制文本内容");
      await system.exec(`/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor -w %F`);
      await agent.aiWaitFor("文本编辑器界面已显示");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 输入文本内容
      const textContent = "1882575测试";
      await device.typeText(textContent);
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 全选并复制
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 100));
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 验证剪贴板记录
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiAssert(`剪贴板中第一条记录显示${textContent},类型是文本`);
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 关闭文本编辑器
      await system.exec(`killall deepin-editor`);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 步骤2: 生成并复制图片
      console.log("步骤2: 生成并复制图片");
      await system.exec(`mkdir -p /tmp/clipboard_images`);
      await system.exec(`ffmpeg -f lavfi -i color=c=blue:s=200x200:d=1 -vframes 1 /tmp/clipboard_images/test_image.png`);
      // 使用xclip复制图片到剪贴板
      await system.exec(`xclip -selection clipboard -t image/png -i /tmp/clipboard_images/test_image.png`);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 验证剪贴板记录
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiAssert("剪贴板中最新记录显示图片大小200*200px,颜色是blue,类型是图片");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 步骤3: 截图并保存到剪贴板--测试项重复，生成的图片已覆盖图片类型
      // 步骤4: 创建并复制多个文件
      console.log("步骤4: 创建并复制多个文件");
      await system.exec(`mkdir -p /tmp/test_files`);
      for (let i = 1; i <= 3; i++) {
        await system.exec(`echo "文件${i}内容" > /tmp/test_files/file${i}.txt`);
      }
      
      // 打开文件夹并复制文件
      await system.exec(`xdg-open /tmp/test_files`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 全选文件
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 100));
      // 复制文件
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 验证剪贴板记录
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiAssert("剪贴板中记录包含file.txt等3个文件,类型是文件");
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 关闭文件夹窗口
      await system.exec(`xdotool key "alt+F4"`);
      await new Promise(resolve => setTimeout(resolve, 500));

      // 步骤5: 设置字号11并验证
      console.log("步骤5: 设置字号11");
      await setFontSizeAndVerify(agent, system, uos, 11);
      
      // 步骤6: 设置字号16并验证
      console.log("步骤6: 设置字号16");
      await setFontSizeAndVerify(agent, system, uos, 16);
      
      // 步骤7: 设置字号20并验证
      console.log("步骤7: 设置字号20");
      await setFontSizeAndVerify(agent, system, uos, 20);
      
      // 步骤8: 设置字号14并验证
      console.log("步骤8: 设置字号14");
      await setFontSizeAndVerify(agent, system, uos, 14);
    },
    { timeout: 1200000, tags: ["1882575", "level3"] },
  );

  afterEach(async ({ device , agent}) => {
    console.log("4. afterEach: 每个测试后的清理");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log("5. afterAll: 清理测试套件");
    await system.exec(`rm -rf /tmp/clipboard_images /tmp/test_files`);
    await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`);
    await new Promise(resolve => setTimeout(resolve, 500));    
    await agent.aiTap("全部清除");
    await system.exec(`dde-control-center -p personalization/font/fontSize &`);
    await agent.aiAction("设滑动刻度控件设置字号为14");
    await system.exec(`killall dde-control-center dde-file-manager`);
  });
});

/**
 * 设置字体大小并验证剪贴板显示
 */
async function setFontSizeAndVerify(agent, system, uos, fontSize) {  
  // 打开控制中心-个性化-字体和字号界面
  await system.exec(`dde-control-center -p personalization/font/fontSize &`);     
  
  // 使用滑动条设置字号
  await agent.aiAction(`滑动刻度控件设置字号为${fontSize}`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 打开剪贴板并验证，关闭控制中心避免干扰
  await system.exec(`xdotool key Super+v`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  await system.exec(`killall dde-control-center`);
  
  // 验证剪贴板界面的文字内容都自动更新为设置的字号大小
  await agent.aiAssert(`剪贴板标题字号为${fontSize}`);
  
  // 关闭剪贴板
  await system.exec(`xdotool key Super+v`);
  await new Promise(resolve => setTimeout(resolve, 500));

}