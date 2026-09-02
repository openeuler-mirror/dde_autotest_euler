/**
 * 用例 PMSID: 1801245
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】自定义快捷键-名称重复冲突
 * 生成时间: 2026-03-02
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801245-【控制中心】【设备】【键盘】【快捷键】自定义快捷键-名称重复冲突', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 添加自定义快捷键：深度影音
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.AddCustomShortcut string:"深度影音" string:"/usr/bin/ll-cli run org.deepin.movie" string:"<Super>H"`);
  });

  test('1801245-【控制中心】【设备】【键盘】【快捷键】自定义快捷键-名称重复冲突', async ({ device, agent, uos }) => {
    // 步骤 1: 添加自定义快捷键弹框内，名称输入＂系统＂类别中已存在的重复名称，点击添加按钮，例如：终端          
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiTap("窗口右下角：添加快捷键",{ deepThink: true });
    await agent.aiTap("名称下方：必填");
    await device.typeText("终端");
    await agent.aiTap("命令下方：必填");
    await device.typeText("/usr/bin/ll-cli run org.deepin.music");
    await agent.aiTap("添加自定义快捷键窗口下方快捷键右侧:无",{ deepThink: true });
    await device.pressKey("Super", "K");
    await agent.aiTap("添加");

    // 检查: 输入框变红框提醒，添加按钮点击不生效，还存在添加自定义快捷键窗口
    await agent.aiAssert("存在添加自定义快捷键窗口；输入框底色变为红色，终端下方红色字体显示：快捷键名称已被占用，请修改名称；添加按钮置灰");

    // 步骤 2: 添加自定义快捷键弹框内，名称输入＂窗口＂类别中已存在的重复名称，点击添加按钮，例如：最大化窗口
    await agent.aiTap("终端");
    await device.pressKey("Ctrl", "A");
    await device.typeText("最大化窗口");
    await agent.aiTap("添加");

     // 检查: 输入框变红框提醒，添加按钮点击不生效，还存在添加自定义快捷键窗口
    await agent.aiAssert("存在添加自定义快捷键窗口；输入框底色变为红色，终端下方红色字体显示：快捷键名称已被占用，请修改名称；添加按钮置灰");

    // 步骤 3: 添加自定义快捷键弹框内，名称输入＂工作区＂类别中已存在的重复名称，点击添加按钮，例如：切换到左边工作区
    await agent.aiTap("最大化窗口");
    await device.pressKey("Ctrl", "A");
    await device.typeText("切换到左边工作区");
    await agent.aiTap("添加");

    // 检查: 输入框变红框提醒，添加按钮点击不生效，还存在添加自定义快捷键窗口
    await agent.aiAssert("存在添加自定义快捷键窗口；输入框底色变为红色，终端下方红色字体显示：快捷键名称已被占用，请修改名称；添加按钮置灰");

    // 步骤 4: 添加自定义快捷键弹框内，名称输入＂辅助功能＂类别中已存在的重复名称，点击添加按钮，例如：语音听写
    await agent.aiTap("切换到左边工作区");
    await device.pressKey("Ctrl", "A");
    await device.typeText("语音听写");
    await agent.aiTap("添加");

     // 检查: 输入框变红框提醒，添加按钮点击不生效，还存在添加自定义快捷键窗口
    await agent.aiAssert("存在添加自定义快捷键窗口；输入框底色变为红色，终端下方红色字体显示：快捷键名称已被占用，请修改名称；添加按钮置灰");

    // 步骤 5: 添加自定义快捷键弹框内，名称输入＂自定义快捷键＂类别中已存在的重复名称，点击添加按钮，例如：UOS AI
    await agent.aiTap("语音听写");
    await device.pressKey("Ctrl", "A");
    await device.typeText("UOS AI");
    await agent.aiTap("添加");

     // 检查: 输入框变红框提醒，添加按钮点击不生效，还存在添加自定义快捷键窗口
    await agent.aiAssert("存在添加自定义快捷键窗口；输入框底色变为红色，终端下方红色字体显示：快捷键名称已被占用，请修改名称；添加按钮置灰");

    // 步骤 6: 添加自定义快捷键弹框内，名称输入不重复名称，点击添加按钮，例如：音乐
    await agent.aiTap("UOS AI");
    await device.pressKey("Ctrl", "A");
    await device.typeText("音乐");
    await agent.aiTap("添加");

    // 检查: 添加成功
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:30});
    await agent.aiAssert("音乐右侧是:Super K");

  }, { timeout: 600000, tags: ['1801245', 'level3'] });

  afterEach(async ({ device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    
    // 删除自定义快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"深度影音"`);
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"音乐"`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
