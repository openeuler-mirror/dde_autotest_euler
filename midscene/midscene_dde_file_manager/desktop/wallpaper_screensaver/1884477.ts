/**
 * 用例 PMSID: 1884477
 * 用例标题: 【控制中心】【个性化】【主题】square主题下更换外观深浅色，会同步更新深浅色壁纸
 * 生成时间: 2026-01-14 16:13:26
 * 用例编写人：UT000054（叶飞）
 */

describe('1884477-【控制中心】【个性化】【主题】square主题下更换外观深浅色，会同步更新深浅色壁纸', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1884477-【控制中心】【个性化】【主题】square主题下更换外观深浅色，会同步更新深浅色壁纸', async ({ device, agent, uos, system, env }) => {

    //步骤1：设置控制中心主题square 、外观：浅色
    await uos.openApp("控制中心");
    await agent.aiTap("个性化");
    await agent.aiTap("square");
    await agent.aiTap("外观右侧向下的箭头");
    await agent.aiWaitFor("出现菜单：浅色、自动、深色");
    await agent.aiTap("浅色");
    //等到3秒，壁纸设置生效
    await new Promise(resolve => setTimeout(resolve, 3000));
    //检查控制中心个性化主题
    await agent.aiAssert("square题被选中：外边框有方框");
    //检查桌面壁纸
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("桌面壁纸是一张‌由中心为紫色和蓝色的渐变星球，带有音乐符号的壁纸");
    //检查锁屏壁纸
    await device.pressKey("Super+L");
    await agent.aiWaitFor("屏幕被锁定，出现账户和密码输入框");
    await agent.aiAssert("锁屏壁纸背景是一张蓝紫色带有星球的图片");
    await device.typeText(env.testPassword);
    await device.pressKey("Enter");

    //步骤2：外观设置：深色，检查主题和桌面壁纸
    //切换到控制中心
    await system.exec("killall dde-control-center");
    await system.exec("dde-control-center -s");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiTap("个性化");
    await agent.aiTap("外观右侧向下的箭头");
    await agent.aiWaitFor("出现菜单：浅色、自动、深色");
    await agent.aiTap("深色");
    await new Promise(resolve => setTimeout(resolve, 3000)); // 等待3秒
    //检查桌面壁纸
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("桌面壁纸是一张以紫色到蓝色的渐变色,带有星球和音乐符号‌的壁纸");
    //检查锁屏壁纸
    await device.pressKey("Super+L");
    await agent.aiWaitFor("屏幕被锁定，出现账户和密码输入框");
    await agent.aiAssert("锁屏壁纸背景是一张蓝紫色带有音乐符号的图片");
    await device.typeText(env.testPassword);
    await device.pressKey("Enter");

    //步骤3： 多次切换浅色-深色
    //打开控制中心，
    await system.exec("killall dde-control-center");
    await system.exec("dde-control-center -s");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiTap("个性化");
    await agent.aiTap("外观右侧向下的箭头");
    await agent.aiWaitFor("出现菜单：浅色、自动、深色");
    await agent.aiTap("浅色");
    //检查桌面壁纸
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("桌面壁纸是一张以蓝紫色星球与音乐符号‌的壁纸");
    //检查锁屏壁纸
    await device.pressKey("Super+L");
    await agent.aiWaitFor("屏幕被锁定，出现账户和密码输入框");
    await agent.aiAssert("锁屏壁纸背景是一张蓝紫色带有音乐符号的图片");
    await device.typeText(env.testPassword);
    await device.pressKey("Enter");

    //切换到深色
    //切换到控制中心,
    await system.exec("killall dde-control-center");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec("dde-control-center -s");
    await new Promise(resolve => setTimeout(resolve, 5000));
    await agent.aiTap("个性化");
    await agent.aiTap("外观右侧向下的箭头");
    await agent.aiWaitFor("出现菜单：浅色、自动、深色");
    await agent.aiTap("深色");
    await new Promise(resolve => setTimeout(resolve, 3000)); // 等待3秒
    //检查桌面壁纸
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("桌面壁纸是一张以紫色到蓝色的渐变色,带有星球和音乐符号‌的壁纸");
    //检查锁屏壁纸
    await device.pressKey("Super+L");
    await agent.aiWaitFor("屏幕被锁定，出现账户和密码输入框");
    await agent.aiAssert("锁屏壁纸背景是一张蓝紫色带有星球的图片");
    await device.typeText(env.testPassword);
    await device.pressKey("Enter");


  }, { timeout: 1800000, tags: ["1884477", "level3", "wallpaper_screensaver", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //主题、外观设置为默认
    await uos.openApp("控制中心");
    await agent.aiTap("origin");
    await agent.aiTap("外观右侧向下的箭头");
    await agent.aiWaitFor("出现菜单：浅色、自动、深色");
    await agent.aiTap("浅色");
    // 关闭控制中心窗口
    await system.exec("killall dde-control-center");
    // 初始化文管配置和进程
    await system.cleanupFileManager();

  });
});
