/**
 * 用例 PMSID: 1882553
 * 用例标题: 【桌面】【剪贴板】不可拖拽文本信息记录可到WPS各类文档中(V25不支持)
 * 生成时间: 2026-02-05 19:27:05
 * 用例编写人：UT000224(何权)
 */

describe('1882553-【桌面】【剪贴板】从WPS各文档中复制图片后，可在图片类应用中粘贴成功', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1882553-【桌面】【剪贴板】从WPS各文档中复制图片后，可在图片类应用中粘贴成功', async ({ device, agent, uos, system }) => {
    console.log("用例大部分测试活动在其他用例已覆盖，脚本测试用例word中复制文件到画图中粘贴");
    // 桌面创建截图文件    
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec(`ffmpeg -f lavfi -i color=c=blue:s=640x480:d=1 -vframes 1 ~/Desktop/output.png`);

    // 创建Word文件
    await agent.aiDoubleClick('WPS Office');
    console.log("步骤3: 在Word文档中复制任意文本字符");
    await agent.aiTap('新建');
    await agent.aiWaitFor('出现新建文档选项', {
      timeoutMs: 30000,
      checkIntervalMs: 5000,
    });
    await agent.aiTap('文字');
    await new Promise(resolve => setTimeout(resolve, 2000));

    await agent.aiTap('空白文档');
    await agent.aiWaitFor('文档界面已显示', {
      timeoutMs: 30000,
      checkIntervalMs: 5000,
    });

    //快捷键打开选择本地图片
    await system.exec(`xdotool keydown Alt key N key P key P keyup Alt`);    
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 选择打开文件
    await agent.aiTap('桌面');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('png结尾的文件');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('打开');
    
    // 在word中复制
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('蓝色纯色图片');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec(`xdotool key Ctrl+c`);  
    await new Promise(resolve => setTimeout(resolve, 500));  

    //检查剪切板复制成功
    await system.exec(`xdotool key Super+v`);  
    await new Promise(resolve => setTimeout(resolve, 500));  
    await agent.aiAssert("剪贴板界面第一条是图片格式的记录");

    // 粘贴测试
    await system.exec("/usr/bin/ll-cli run org.deepin.draw --url %U -- -- deepin-draw  %%U");
    await new Promise(resolve => setTimeout(resolve, 1000));  
    await system.exec(`xdotool key ctrl+v`);  
    await new Promise(resolve => setTimeout(resolve, 500));  
    await agent.aiAssert("画板中存在粘贴的蓝色纯色内容");
    await system.exec("killall et wps wpp pdf wpsoffice deepin-draw");
  }, { timeout: 1200000, tags: ['1882553', 'level3','module:dde_clipboard'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理可能残留的进程
    await system.exec('killall et wps wpp pdf wpsoffice');
    await system.exec('killall deepin-draw');
    await system.exec(`rm -rf ~/Desktop/*.png`);
    // 优化通过UI清理剪贴板
    await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Show`);
    await agent.aiWaitFor("剪贴板界面已显示");
    await agent.aiTap("全部清除");
    await system.exec(`dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`);  
  });
});