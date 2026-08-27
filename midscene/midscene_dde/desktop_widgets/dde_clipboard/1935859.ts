/**
 * 用例 PMSID: 1935859
 * 用例标题: 【桌面】【剪贴板】快捷键和图标点击循环测试
 * 生成时间: 2026-03-04 15:30:00
 * 用例编写人：UT000224(何权)
 */

describe('1935859-【桌面】【剪贴板】快捷键和图标点击循环测试', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    // 清空剪贴板历史记录
    await system.exec(`systemctl --user restart dde-clipboard`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 设置剪贴板插件到任务栏
    await system.exec(`
        dbus-send --session   --dest=org.deepin.dde.Dock1   --type=method_call   /org/deepin/dde/Dock1   org.deepin.dde.Dock1.setItemOnDock   string:"Dock_Quick_Plugins"   string:"clipboard-key"   boolean:true`
    );
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1935859-【桌面】【剪贴板】快捷键和图标点击循环测试', async ({ device, agent, uos, system }) => {
    console.log('========== 测试场景1: 连续按压快捷键Win+V 20次+，循环唤出/关闭剪贴板 ==========');
    
    // 循环20次按压Win+V快捷键
    for (let i = 1; i <= 20; i++) {
      console.log(`第 ${i} 次按压 Win+V`);    
      // 按压Win+V唤出剪贴板
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      // 再次按压Win+V关闭剪贴板
    await system.exec(`xdotool key Super+v`);
    await new Promise(resolve => setTimeout(resolve, 800));

    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
    );
    await new Promise(resolve => setTimeout(resolve, 800));
    // 验证剪贴板窗口可以正常打开
    await system.exec(`xdotool key Super+v`);
    await agent.aiAssert("剪贴板窗口已打开");
    await new Promise(resolve => setTimeout(resolve, 800));
    await system.exec(`xdotool key Super+v`);
    await agent.aiAssert("剪贴板窗口已关闭");
    
    console.log('✅ 连续20次快捷键测试完成\n');
    
    console.log('========== 测试场景2: 通过文本编辑器进行多次复制操作，生成超过一屏的剪贴板记录 ==========');
    
    // 1. 打开文本编辑器（deepin-editor）
    console.log('打开文本编辑器...');
    await system.exec(`/usr/bin/ll-cli run org.deepin.editor --file -- -- deepin-editor -w %F`);
    await agent.aiWaitFor("文本编辑器界面已显示");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 2. 在文本编辑器中输入并复制不同的文本内容（15条）
    console.log('在文本编辑器中输入并复制不同的文本内容...');
    const textContents = [
      "这是第一条测试文本内容",
      "剪贴板功能测试第二条记录",
      "第三条测试数据用于验证",
      "第四条文本内容测试",
      "第五条记录测试文本",
      "第六条测试文本内容",
      "第七条记录验证文本",
      "第八条测试数据",
      "第九条文本记录",
      "第十条测试内容",
      "第十一条记录",
      "第十二条测试文本",
      "第十三条记录",
      "第十四条测试",
      "第十五条文本"
    ];
    
    for (let i = 0; i < textContents.length; i++) {
      // 清空编辑器内容
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 100));
      await device.pressKey("Delete");
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 输入文本内容
      await device.typeText(textContents[i]);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // 全选并复制
      await device.pressKey("Ctrl", "a");
      await new Promise(resolve => setTimeout(resolve, 100));
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 验证剪贴板记录
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiAssert(`剪贴板中第一条记录显示${textContents[i]},类型是文本`);
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log(`✅ 已复制并验证文本 ${i + 1}/${textContents.length}`);
    }
    
    // 3. 复制文件（5个）
    console.log('复制文件到剪贴板...');
    for (let i = 1; i <= 5; i++) {
      await system.exec(`echo "文件${i}内容" > ~/Desktop/test${i}.txt`);
      await agent.aiTap(`test${i}.txt`);
      await device.pressKey("Ctrl", "c");
      await device.pressKey("Ctrl", "c");
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 验证剪贴板记录
      await system.exec(`xdotool key Super+v`);
      await agent.aiAssert(`剪贴板中第一条记录显示'test${i}.txt}',类型是文件`);
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log(`✅ 已复制并验证文件 ${i}/5`);
    }
    
    // 4. 复制图片（5张）- 参考1882553.ts的方式
    console.log('复制图片到剪贴板...');
    await system.exec(`mkdir -p /tmp/clipboard_images`);
    
    // 生成纯色图片并复制到剪贴板
    const colors = ['red', 'blue', 'green', 'yellow', 'purple'];
    for (let i = 1; i <= 5; i++) {
      // 生成纯色图片
      await system.exec(`ffmpeg -f lavfi -i color=c=${colors[i-1]}:s=200x200:d=1 -vframes 1 /tmp/clipboard_images/test_image_${i}.png`);
      // 使用xclip复制图片到剪贴板
      await system.exec(`xclip -selection clipboard -t image/png -i /tmp/clipboard_images/test_image_${i}.png`);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 验证剪贴板记录
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiAssert(`剪贴板中最新记录显示图片大小'200*200px'，颜色是${colors[i-1]},类型是图片`);
      await system.exec(`xdotool key Super+v`);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log(`✅ 已复制并验证图片 ${i}/5`);
    }
    
    // 关闭文本编辑器
    await system.exec(`killall deepin-editor`);
    await new Promise(resolve => setTimeout(resolve, 500));

    // 关闭剪贴板
    await system.exec(`xdotool key Super+v`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('✅ 多次复制操作测试完成\n');
    
    console.log('========== 测试场景3: 连续点击任务栏插件图标20次+，循环唤出/关闭剪贴板 ==========');
    
    // 循环20次点击任务栏剪贴板图标
    await agent.aiHover("桌面右下任务栏插件区域第一个剪贴板图标", { deepThink: true });
    for (let i = 1; i <= 20; i++) {
      console.log(`第 ${i} 次点击任务栏剪贴板图标`);
      await system.exec(`xdotool click  --repeat 2 1`);
      await new Promise(resolve => setTimeout(resolve, 50));      
    }

    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
    );
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 验证剪贴板窗口可以正常打开
    await system.exec(`xdotool key Super+v`);
    await agent.aiAssert("剪贴板窗口已打开");
    await new Promise(resolve => setTimeout(resolve, 800));
    await system.exec(`xdotool key Super+v`);
    await agent.aiAssert("剪贴板窗口已关闭");    
    
    console.log('✅ 连续20次图标点击测试完成');
  }, { timeout: 1200000, tags: ['1935859', 'level3'] });

  afterEach(async ({ device, system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 移除剪贴板插件从任务栏
    await system.exec(`
        dbus-send --session   --dest=org.deepin.dde.Dock1   --type=method_call   /org/deepin/dde/Dock1   org.deepin.dde.Dock1.setItemOnDock   string:"Dock_Quick_Plugins"   string:"clipboard-key"   boolean:false`
    );
    
    // 清理临时文件
    await system.exec(`rm -rf ~/Desktop/test*.txt`);
    await system.exec(`rm -rf /tmp/clipboard_images`);
    await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`);
    await agent.aiWaitFor("剪贴板界面已显示");
    await agent.aiTap("全部清除");
    await new Promise(resolve => setTimeout(resolve, 500));    
    await system.exec(`xdotool key Super+v`);
  });
});