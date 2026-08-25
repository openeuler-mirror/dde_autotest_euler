/**
 * 用例 PMSID: 1882613
 * 用例标题: 【桌面】【剪贴板】剪贴板文本类型记录展示
 * 生成时间: 2026-02-03 19:42:02
 * 用例编写人：UT000224(何权)
 */

describe('1882613-【桌面】【剪贴板】剪贴板文本类型记录展示', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
    // 重启剪贴板服务确保干净环境
    system.exec(`systemctl --user restart dde-clipboard.service`);
  });


  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1882613-【桌面】【剪贴板】剪贴板文本类型记录展示', async ({ device, agent, uos, system }) => {
    // 步骤1: 打开文本编辑器，写入随机英文字符136个字符，复制字符
    console.log('步骤1: 测试136个字符的文本显示');
    
    // 生成136个随机英文字符
    const randomText136 = Array.from({length: 136}, () => Math.floor(Math.random() * 10)).join('');
    
    // 打开文本编辑器
    await uos.openApp('文本编辑器');
    await agent.aiWaitFor("文本编辑器界面已显示", {
      timeoutMs: 30000,
      checkIntervalMs: 5000,
    });

    // 新建一个标签页
    await system.exec(`xdotool key Ctrl+t`);
    
    // 输入136个字符的文本
    await device.typeText(randomText136);
    
    // 全选并复制文本
    await device.pressKey("Ctrl", "a");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Ctrl", "c");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 打开剪贴板查看记录
    await system.exec(`xdotool key Super+v`);
    await new Promise(resolve => setTimeout(resolve, 1000));    
    // 验证136个字符的显示效果
    await agent.aiAssert(`剪切板第一条文本记录框中显示4行，有记录下方显示136字符，文本内容完整显示，记录结尾无省略号`);
    
    // 步骤2: 打开文本编辑器，写入随机数字137个字符，复制字符
    console.log('步骤2: 测试137个字符的文本显示');   
    // 生成137个随机英文字符
    const randomText137 = Array.from({length: 137}, () => Math.floor(Math.random() * 10)).join('');
    
    // 清空当前文本编辑器内容
    await agent.aiTap('文本编辑器界面');
    await device.pressKey("Ctrl", "a");
    await device.pressKey("Delete");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 输入137个字符的文本
    await device.typeText(randomText137);
    await new Promise(resolve => setTimeout(resolve, 1000));   
    // 全选并复制文本
    await device.pressKey("Ctrl", "a");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Ctrl", "c");
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 打开剪贴板查看记录
    await system.exec(`xdotool key Super+v`);
    
    // 验证137个字符的显示效果
    await agent.aiAssert(`剪切板第一条文本记录框中显示4行，有记录下方显示137字符，文字内容结尾省略（...）展示`);
  }, { timeout: 1200000, tags: ['1882613', 'level3' ] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理可能残留的进程
    await system.exec(`killall deepin-editor`);
    await system.exec(
      `dbus-send --session --print-reply --dest=org.deepin.dde.Clipboard1 /org/deepin/dde/Clipboard1 org.deepin.dde.Clipboard1.Hide`,
    );    
    await system.exec(`xdotool key Super+v`);
    await agent.aiTap("全部清除");
  });
});
