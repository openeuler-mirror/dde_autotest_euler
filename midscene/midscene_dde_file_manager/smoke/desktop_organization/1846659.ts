/**
 * 用例 PMSID: 1846659
 * 用例标题: 桌面右键菜单点击跳转控制中心设置壁纸
 * 生成时间: 2026-01-21 09:30:00
 * 用例编写人: UT000159（游伟）
 */

let wallpaper = "";
let screensaver = "";
// let screensaver_dde_dconfig = "";
const default_wallpaper = "file:///usr/share/wallpapers/deepin/nirvana-wallpaper-light.jpg";
const default_screensaver = "blaster";

describe('1846659-桌面右键菜单点击跳转控制中心设置壁纸', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    let result = await system.queryDBus(
      'org.deepin.dde.Appearance1',
      '/org/deepin/dde/Appearance1',
      'org.deepin.dde.Appearance1',
      'GetCurrentWorkspaceBackground',
      [],
      { bus: 'session' }
    );
    if (result.success) {
      // ('file:///usr/share/wallpapers/deepin/desktop.jpg',) 
      wallpaper = result.stdout.replace("('", "").replace("',)", "").trim();
    } else {
      result = await system.exec("grep uri ~/.config/dde-appearance/config.json | head -n 1 | awk '{print $2}' | sed 's/\"//g' | sed 's/,//g'");
      if (result.success) {
        wallpaper = result.stdout;
      } else {
        // 获取壁纸失败, 使用默认壁纸
        wallpaper = default_wallpaper;
      }
    }
    console.log(`壁纸: ${wallpaper}`);

    result = await system.queryDBus(
      'com.deepin.ScreenSaver',
      '/com/deepin/ScreenSaver',
      'org.freedesktop.DBus.Properties',
      'Get',
      [ 'com.deepin.ScreenSaver', 'currentScreenSaver' ],
      { bus: 'session' }
    )

    if (result.success) {
      // (<'blaster'>,)
      screensaver = result.stdout.replace("(<'", "").replace("'>,)", "").trim();
    } else {
      result = await system.exec('dde-dconfig get -a org.deepin.screensaver -r org.deepin.screensaver -k currentScreenSaver');
      if (result.success) {
        screensaver = result.stdout;
      } else {
        // 获取屏保失败, 使用默认屏保
        screensaver = default_screensaver;
      }
    }

    console.log(`屏保: ${screensaver}`);
  });

  test('1846659-桌面右键菜单点击跳转控制中心设置壁纸', async ({ device, agent, uos }) => {
    // 步骤 1: 右击桌面空白处, 打开设置壁纸页面
    await agent.aiRightClick('桌面空白区域', { deepThink: true });
    await agent.aiWaitFor('显示右键菜单');
    await agent.aiTap('设置壁纸', { deepThink: true });
    await agent.aiWaitFor('显示设置壁纸页面');

    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');

    // 步骤 2: 点击系统壁纸下第一张壁纸
    await agent.aiTap('系统壁纸下第一张壁纸', { deepThink: true });
    await agent.aiWaitFor('壁纸设置成功, 系统壁纸下第一张壁纸被选中');

    // 步骤 3: 设置屏保
    // 步骤 3.1: 点击标题栏个性化, 进入个性化设置页面
    await agent.aiTap('标题栏个性化', { deepThink: true });
    await agent.aiWaitFor('显示个性化设置页面');

    // 步骤 3.2: 滚动页面到界面最下方
    await agent.aiScroll('个性化设置页面', { direction: 'down', distance: 500 });
    await agent.aiWaitFor('滚动到界面最下方, 界面中有屏幕保护设置选项');

    // 步骤 3.3: 点击屏保选项, 进入屏保设置页面
    await agent.aiTap('屏幕保护设置选项', { deepThink: true });
    await agent.aiWaitFor('显示屏幕保护设置页面');

    // 步骤 3.4: 点击系统屏保下第一行第一个选项
    await agent.aiTap('系统屏保下第一行最后一个屏幕保护选项', { deepThink: true });
    await agent.aiWaitFor('设置屏保成功, 系统屏保下第一行最后一个屏幕保护选项被选中');
    await agent.aiAssert('系统屏保下第一行最后一个屏幕保护选项被选中');

  }, { timeout: 600000, tags: ['1846659', 'level2', 'smoke', 'DITT', 'youwei', 'desktop', 'file-manager', 'wallpaper', 'screensaver'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.queryDBus(
      'org.deepin.dde.Appearance1',
      '/org/deepin/dde/Appearance1',
      'org.deepin.dde.Appearance1',
      'SetCurrentWorkspaceBackground',
      [ `'${wallpaper}'` ],
      { bus: 'session' }
    );

    // 恢复测试前的屏保
    await system.queryDBus(
      'com.deepin.ScreenSaver',
      '/com/deepin/ScreenSaver',
      'org.freedesktop.DBus.Properties',
      'Set',
      [ 'com.deepin.ScreenSaver', 'currentScreenSaver', `<"${screensaver}">` ],
      { bus: 'session' }
    )
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // await agent.aiTap('窗口右上角关闭按钮:X', { deepThink: true });
    await device.pressKey('Super', 'Down');
    await system.exec('killall dde-control-center');
  });
});
