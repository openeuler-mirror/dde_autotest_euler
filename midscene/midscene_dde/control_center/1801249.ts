
/**
 * 用例 PMSID: 1801249
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】添加自定义快捷键冲突
 * 生成时间: 2026-03-02
 * 用例编写人:UT005571(王艺桥)
 */

describe('1801249-【控制中心】【设备】【键盘】【快捷键】添加自定义快捷键冲突', async () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801249-【控制中心】【设备】【键盘】【快捷键】添加自定义快捷键冲突', async ({ device, agent, uos }) => {
    // 步骤 1: 新建自定义快捷键，快捷键与已有的冲突
    await uos.openApp("控制中心",{maximizeWindow: true});
    await agent.aiTap("左侧：蓝牙和其他设备");
    await agent.aiTap("键盘");
    await agent.aiTap("快捷键");
    await agent.aiTap("窗口右下角：添加快捷键",{ deepThink: true });
    await agent.aiTap("名称下方：必填");
    await device.typeText("深度影音");
    await agent.aiTap("必填");
    await device.typeText("/usr/bin/ll-cli run org.deepin.movie");
    await agent.aiTap("添加自定义快捷键窗口下方快捷键右侧:无",{ deepThink: true });
    await device.pressKey("Super", "L");

    // 检查: 提示快捷键冲突
    await agent.aiAssert("红色提示文案:此快捷键与[锁屏界面]冲突,点击添加使这个快捷键生效");

    // 步骤 2: 取消添加
    await agent.aiTap("添加",{ deepThink: true });
    await agent.aiAssert("不存在添加自定义快捷键窗口");

    // 步骤 3: 检查锁屏界面快捷键显示
    await agent.aiScroll('蓝牙和其他设备/快捷键/键盘下方区域',{direction:'down',distance:5});
    await agent.aiAssert("锁屏界面右侧是:无");

    // 步骤 4: 使用锁屏界面快捷键,显示深度影音窗口
    await device.pressKey("Super", "L");
    await new Promise(resolve => setTimeout(resolve,1000));
    await agent.aiAssert("出现窗口,窗口中间有一个带播放箭头的媒体播放图标");

  }, { timeout: 600000, tags: ['1801249', 'level3'] });

  afterEach(async ({ device, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭深度影音
    await system.exec(`killall deepin-movie`)

    // 关闭控制中心窗口
    await device.pressKey("Super", "Down");
    await uos.closeCurrentWindow();

    // 恢复默认快捷键
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.DeleteCustomShortcut string:"深度影音"`);
    await system.exec(`dbus-send --session --print-reply --dest=com.deepin.daemon.Keybinding /com/deepin/daemon/Keybinding com.deepin.daemon.Keybinding.Reset`);
  });
    

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
