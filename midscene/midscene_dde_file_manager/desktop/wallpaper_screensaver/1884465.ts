/**
 * 用例 PMSID: 1884465
 * 用例标题: 【控制中心】【个性化】【主题】手动同时修改壁纸，不会生成自定义主题项 
 * 生成时间: 2026-01-13 16:46:26
 * 用例编写人：UT000054（叶飞）
 */

describe('1884465-【控制中心】【个性化】【主题】手动同时修改壁纸，不会生成自定义主题项 ', () => {
  beforeAll(async ({ device, uos, system, agent, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    //清空自定义图片壁纸
    await system.exec("killall dde-control-center");
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf  /var/cache/wallpapers/custom-wallpapers/${env.testUsername}/*`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1884465-【控制中心】【个性化】【主题】手动同时修改壁纸，不会生成自定义主题项', async ({ device, agent, uos, system, env }) => {

    // 用例第一步：将midscene_dde_file_manager/resources/1807945 
    const caseDir = process.env.TESTCASE_DIR;
    const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1884465.jpg`;

    await system.exec(`cp  "${sourcePath}" ~/Desktop`);
    console.log(`文件已复制到: 桌面目录`);

    //步骤1：打开控制中心,手动设置壁纸，检查桌面、锁屏壁纸
    await uos.openApp("控制中心", { maximizeWindow: true });
    await agent.aiWaitFor("个性化可见");
    await agent.aiTap("控制中心窗口的左侧导航栏：个性化");
    await agent.aiWaitFor("壁纸可见");
    //设置主题：square
    await agent.aiTap("square");
    await agent.aiTap("壁纸");
    await agent.aiWaitFor("我的图片可见");
    await agent.aiTap("我的图片下面的：+");
    await agent.aiWaitFor("文件管理器对话框窗口弹出");

    await agent.aiDoubleClick("对话框窗口导航栏的：桌面");
    await agent.aiWaitFor("1884465.jpg可见");
    await agent.aiTap("文件管理器对话框: 1884465.jpg");
    await agent.aiWaitFor("1884465.jpg被选中");
    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
    await agent.aiTap("打开");
    //等到5秒，壁纸设置生效
    await new Promise(resolve => setTimeout(resolve, 5000));

    //检查控制中心个性化主题
    await agent.aiTap("左侧导航栏：个性化");
    await agent.aiWaitFor("主题可见");
    await agent.aiAssert("square主题被选中：外边框有方框");
    //检查任务栏图标
    await agent.aiAssert("桌面最下方的任务栏图标主题为square");
    // //检查桌面图标
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("桌面图标主题为square");
    //检查桌面壁纸
    await agent.aiAssert("桌面壁纸是一张带有火车的壁纸");
    //检查锁屏壁纸
    await device.pressKey("Super+L");
    await agent.aiWaitFor("屏幕被锁定，出现账户和密码输入框");
    await agent.aiAssert("锁屏壁纸背景是一张带有火车的图片");
    await device.typeText(env.testPassword);
    await device.pressKey("Enter");

    //步骤2：设置系统壁纸
    await system.exec("killall dde-control-center");
    await new Promise(resolve => setTimeout(resolve, 2000));//等到2秒
    await uos.openApp("控制中心", { maximizeWindow: true });
    await new Promise(resolve => setTimeout(resolve, 5000));//等到5秒
    await agent.aiWaitFor("个性化可见");
    await agent.aiTap("个性化");
    await agent.aiTap("壁纸");
    await agent.aiWaitFor("系统壁纸可见");
    await agent.aiTap("系统壁纸下的第二张图片");
    //等到5秒，壁纸设置生效
    await new Promise(resolve => setTimeout(resolve, 2000));
    //检查控制中心个性化主题
    await agent.aiTap("左侧导航栏：个性化");
    await agent.aiWaitFor("主题可见");
    await agent.aiAssert("square主题被选中：外边框有方框");
    //检查任务栏图标
    await agent.aiAssert("桌面最下面的任务栏图标主题为square");
    //检查桌面图标
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("桌面图标主题为square");
    //检查桌面壁纸
    await agent.aiAssert("桌面壁纸是一张森林壁纸");
    //检查锁屏壁纸
    await device.pressKey("Super+L");
    await agent.aiWaitFor("屏幕被锁定，出现账户和密码输入框");
    await agent.aiAssert("锁屏壁纸背景是一张森林的图片");
    await device.typeText(env.testPassword);
    await device.pressKey("Enter");

    //步骤3： 纯色壁纸
    await uos.openApp("控制中心", { maximizeWindow: true });
    await agent.aiWaitFor("个性化可见");
    await agent.aiTap("壁纸");
    await agent.aiWaitFor("纯色壁纸可见");
    await agent.aiTap("纯色壁纸下的最后一张图片");
    //等到2秒，壁纸设置生效
    await new Promise(resolve => setTimeout(resolve, 2000));
    //检查控制中心个性化主题
    await agent.aiTap("左侧导航栏：个性化");
    await agent.aiWaitFor("主题可见");
    await agent.aiAssert("square主题被选中：外边框有方框");
    //检查任务栏图标
    await agent.aiAssert("桌面最下面的任务栏图标主题为square");
    //检查桌面图标
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("桌面图标主题与任务栏图标主题一致，为square");
    //检查桌面壁纸
    await agent.aiAssert("桌面壁纸是一张纯色的壁纸");
    //检查锁屏壁纸
    await device.pressKey("Super+L");
    await agent.aiWaitFor("屏幕被锁定，出现账户和密码输入框");
    await agent.aiAssert("锁屏壁纸背景是一张纯色的图片");
    await device.typeText(env.testPassword);
    await device.pressKey("Enter");

  }, { timeout: 1200000, tags: ["1884465", "level3", "wallpaper_screensaver", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理测试文件
    await system.exec("rm ~/Desktop/1884465.jpg");
    // 关闭文件管理器\控制中心窗口
    await system.exec("killall dde-file-manager");
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    await device.pressKey("ESC");
    await system.exec("killall dde-control-center");
    //还原控制中心壁纸 以及清除自定义壁纸
    await uos.openApp("控制中心");
    await agent.aiWaitFor("个性化");
    await agent.aiTap("个性化");
    await agent.aiTap("主题");
    await agent.aiTap("bloom");
    await agent.aiTap("origin");
    await system.exec("killall dde-control-center");
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf  /var/cache/wallpapers/custom-wallpapers/${env.testUsername}/*`);
  });
});
