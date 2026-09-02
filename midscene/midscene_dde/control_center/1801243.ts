/**
 * 用例 PMSID: 1801243
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】自定义快捷键-特殊名称字符
 * 生成时间: 2026-02-26 16:45:13
 * 用例编写人:UT005571(王艺桥)
 */

/**
 * 调用添加自定义快捷键的D-Bus命令的实例
 * @param {string} shortcutName - 快捷键名称
 * @param {string} execCommand - 执行命令
 * @param {string} shortcutKey - 快捷键组合
 * @param {Array<string>} shortcutNames - 要删除的快捷键名称列表
 */
async function addCustomShortcut(system, shortcutName, execCommand, shortcutKey) {
   // 执行D-Bus命令添加自定义快捷键
  await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.AddCustomShortcut string:"${shortcutName.replace(/"/g, '\\"')}" string:"${execCommand}" string:"${shortcutKey}"`);
}

async function deleteMultipleShortcuts(system, shortcutNames) {
  // 遍历名称列表，依次调用删除接口
  for (const name of shortcutNames) {
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"${name.replace(/"/g, '\\"')}"`);
    console.log(`已执行删除快捷键：${name}`);
  }
}

describe('1801243-【控制中心】【设备】【键盘】【快捷键】自定义快捷键-特殊名称字符', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复默认快捷键（原始逻辑不变）
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  test('1801243-【控制中心】【设备】【键盘】【快捷键】自定义快捷键-特殊名称字符', async ({ device, agent, uos, system }) => {
    // 打开控制中心
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");

    // 步骤 1: 带<html>标签的名称
    // 1.1 构造环境
    await addCustomShortcut(system, "<html>uos123</html>", "/usr/bin/ll-cli run org.deepin.movie", "<Super>H");
    // 1.2 检查
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:25});
    await agent.aiAssert("<html>uos123</html>右侧显示:Super H");
    await device.pressKey("Super", "H");
    await agent.aiAssert("出现窗口");
    // 1.3 清理
    await system.exec(`killall deepin-movie`);

    // 步骤 2: 带<body>标签的名称
    // 2.1 构造环境
    await addCustomShortcut(system, "<body>uos123</body>", "/usr/bin/ll-cli run org.deepin.music", "<Super>J");
    // 2.2 检查
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:1});
    await agent.aiAssert("<body>uos123</body>右侧显示:Super J");
    await device.pressKey("Super", "J");
    await agent.aiAssert("出现窗口");
    // 2.3 清理
    await system.exec(`killall deepin-music`);

    // 步骤 3: 带<td>标签的名称 
    // 3.1 构造环境
    await addCustomShortcut(system, "<td>uos123</td>", "/usr/bin/ll-cli run org.deepin.movie", "<Super>K");
    // 3.2 检查
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:1});
    await agent.aiAssert("<td>uos123</td>右侧显示:Super K");
    await device.pressKey("Super", "K");
    await agent.aiAssert("出现窗口");
    // 3.3 清理
    await system.exec(`killall deepin-movie`);

    // 步骤 4: 特殊符号组合名称
    // 4.1 构造环境
    await addCustomShortcut(system, `<>?:"{}|_)(*&^%$#@!+123ABC` , "/usr/bin/ll-cli run org.deepin.movie", "<Super>O");
    // 4.2 检查
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:1});
    await agent.aiAssert(`<>?:\\\"{}|_)(*&^%$#@!+123ABC右侧显示:Super O`);
    await device.pressKey("Super", "O");
    await new Promise(resolve => setTimeout(resolve,1000));
    await agent.aiAssert("出现窗口");
    // 4.3 清理
    await system.exec(`killall deepin-movie`);
   
  }, { timeout: 600000, tags: ['1801243', 'level3'] });

  afterEach(async ({ device, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理'); // 原始逻辑不变
    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    
    // 删除自定义快捷键
    await deleteMultipleShortcuts(system, [
      "<html>uos123</html>",
      "<body>uos123</body>",
      "<td>uos123</td>",
      `<>?:"{}|_)(*&^%$#@!+123ABC`
    ]);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件'); // 原始逻辑不变
  });
});