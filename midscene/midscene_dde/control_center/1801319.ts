
/**
 * 用例 PMSID: 1801319
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】取消添加自定义快捷键
 * 生成时间: 2026-04-23 09:13:56
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801319-【控制中心】【设备】【键盘】【快捷键】取消添加自定义快捷键', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  test('1801319-【控制中心】【设备】【键盘】【快捷键】取消添加自定义快捷键', async ({ device, agent, uos, system }) => {
    // 步骤1：快捷键界面，点击添加快捷键按钮-添加自定义快捷键弹窗，不做任何操作点击右上角的"x"
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiScroll('设备/键盘/快捷键下方区域',{direction:'down',distance:30});
    await agent.aiTap("添加快捷键按钮");
    await agent.aiAssert("添加自定义快捷键弹窗已显示");
    await agent.aiTap("添加自定义快捷键弹窗右上角的关闭按钮");
    await agent.aiAssert("自定义快捷键只有:UOS AI Talk;UOS AI随航/写作;UOS AI Screenshot;UOS AI");
    
    // 步骤2：快捷键界面，点击添加快捷键按钮-添加自定义快捷键弹窗，输入框中输入合理的数据，点击取消按钮
    await agent.aiTap("添加快捷键按钮");
    await agent.aiTap("名称下方必填");
    await device.typeText("测试快捷键");
    await agent.aiTap("命令下方必填");
    await device.typeText("echo test");
    await agent.aiTap("快捷键右侧：无");
    await device.pressKey("Ctrl", "T");
    await agent.aiTap("取消按钮");
    await agent.aiAssert("自定义快捷键只有:UOS AI Talk;UOS AI随航/写作;UOS AI Screenshot;UOS AI");
    
  }, { timeout: 600000, tags: ['1801319', 'level3'] });

  afterEach(async ({ device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();
    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
