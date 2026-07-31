/**
 * 用例 PMSID: 1884481
 * 用例标题:【控制中心】【个性化】【主题】nirvana主题下更换外观深浅色，会同步更新深浅色壁纸
 * 生成时间: 2026-01-15 13:53:26
 * 用例编写人：UT000054（叶飞）
 */

describe('1884481-【控制中心】【个性化】【主题】nirvana主题下更换外观深浅色，会同步更新深浅色壁纸', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1884481-【控制中心】【个性化】【主题】nirvana主题下更换外观深浅色，会同步更新深浅色壁纸', async ({ device, agent, uos, system, env }) => {

    //步骤1：设置控制中心主题nirvana 、外观：浅色
    await system.exec("killall dde-control-center");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec("dde-control-center -s");
    await new Promise(resolve => setTimeout(resolve, 5000));
    await agent.aiTap("个性化");
    await agent.aiTap("nirvana");
    await agent.aiTap("外观右侧向下的箭头");
    await agent.aiWaitFor("出现菜单：浅色、自动、深色");
    await agent.aiTap("浅色");
    //等到3秒，壁纸设置生效
    await new Promise(resolve => setTimeout(resolve, 500));
    //检查控制中心个性化主题
    await agent.aiAssert("nirvana题被选中：外边框有方框");
    //检查桌面壁纸
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("桌面壁纸是一张‌蓝色带有波浪条纹且有UOS字样的壁纸");
    //检查锁屏壁纸
    await device.pressKey("Super+L");
    await agent.aiWaitFor("屏幕被锁定，出现账户和密码输入框");
    await agent.aiAssert("锁屏壁纸背景是一张蓝色图片");
    await device.typeText(env.testPassword);
    await device.pressKey("Enter");

    //步骤2：外观设置：深色，检查主题和桌面壁纸
    //切换到控制中心, 按快捷键直到个性化可见，停止按快捷键
    await system.exec("killall dde-control-center");
    await system.exec("dde-control-center -s");
    await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒
    await agent.aiWaitFor("个性化可见");
    await agent.aiTap("个性化");
    await agent.aiTap("外观右侧向下的箭头");
    await agent.aiWaitFor("出现菜单：浅色、自动、深色");
    await agent.aiTap("深色");
    await new Promise(resolve => setTimeout(resolve, 3000)); // 等待3秒
    //检查桌面壁纸
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await agent.aiAssert("桌面壁纸是一张‌深蓝色带有波浪条纹和UOS字样的壁纸");
    //检查锁屏壁纸
    await device.pressKey("Super+L");
    await agent.aiWaitFor("屏幕被锁定，出现账户和密码输入框");
    await agent.aiAssert("锁屏壁纸背景是一张深蓝色带有波浪条纹的图片");
    await device.typeText(env.testPassword);
    await device.pressKey("Enter");

    //步骤3： 多次切换浅色-深色
    await system.exec("killall dde-control-center");
    await system.exec("dde-control-center -s");
    await agent.aiWaitFor("个性化可见", { timeout: 5000 });
    await agent.aiTap("个性化");
    await agent.aiTap("外观右侧向下的箭头");
    await agent.aiWaitFor("出现菜单：浅色、自动、深色");
    await agent.aiTap("浅色");
    //检查桌面壁纸
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("桌面壁纸是一张‌蓝色带有波浪条纹且有UOS字样的壁纸");
    //检查锁屏壁纸
    await device.pressKey("Super+L");
    await agent.aiWaitFor("屏幕被锁定，出现账户和密码输入框");
    await agent.aiAssert("锁屏壁纸背景是一张蓝色的图片");
    await device.typeText(env.testPassword);
    await device.pressKey("Enter");

    //切换到深色
    await system.exec("killall dde-control-center");
    await system.exec("dde-control-center -s");
    await agent.aiWaitFor("个性化可见", { timeout: 5000 });
    await agent.aiTap("个性化");
    await agent.aiTap("外观右侧向下的箭头");
    await agent.aiWaitFor("出现菜单：浅色、自动、深色");
    await agent.aiTap("深色");
    await new Promise(resolve => setTimeout(resolve, 3000)); // 等待3秒
    //检查桌面壁纸
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await system.exec("killall dde-control-center");//清除控制中心进程
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("桌面壁纸是一张‌深蓝色带有波浪条纹和UOS字样的壁纸");
    //检查锁屏壁纸
    await device.pressKey("Super+L");
    await agent.aiWaitFor("屏幕被锁定，出现账户和密码输入框");
    await agent.aiAssert("锁屏壁纸背景是一张深蓝色带有波浪条纹的图片");
    await device.typeText(env.testPassword);
    await device.pressKey("Enter");


  }, { timeout: 600000, tags: ["1884481", "level3", "wallpaper_screensaver", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //主题、外观设置为默认
    await system.exec("killall dde-control-center");
    await system.exec("dde-control-center -s");
    await agent.aiWaitFor("个性化可见", { timeout: 5000 });
    await agent.aiTap("个性化");
    await agent.aiWaitFor("主题可见");
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
