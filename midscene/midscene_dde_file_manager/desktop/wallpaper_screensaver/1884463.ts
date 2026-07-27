/**
 * 用例 PMSID: 1884463
 * 用例标题: 【控制中心】【个性化】【主题】本地图片设置为桌面壁纸，不会生成自定义主题项
 * 生成时间: 2026-01-07 16:46:26
 * 用例编写人：UT000054（叶飞）
 */

describe('1884463-【控制中心】【个性化】【主题】本地图片设置为桌面壁纸，不会生成自定义主题项', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
        // 初始化文管配置和进程
    await system.cleanupFileManager();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1884463-【控制中心】【个性化】【主题】本地图片设置为桌面壁纸，不会生成自定义主题项', async ({ device, agent, uos, system, env }) => {

    // 用例第一步：将midscene_dde_file_manager/resources/1807945 
    const caseDir = process.env.TESTCASE_DIR;
    const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1807945`;

    // 使用系统命令复制文件
    await system.exec(`cp  "${sourcePath}"/*  ~/Desktop`);
    console.log(`文件已复制到: ~/Desktop`);

    await system.exec(`cp  "${sourcePath}"/夕阳.tif ~`);
    console.log(`文件已复制到: ~`);

    //步骤1：在桌面操作
    await agent.aiRightClick("飞屋环游.tiff");
    await agent.aiWaitFor("右键菜单出现");
    await agent.aiTap("设置壁纸");
    //等到5秒，壁纸设置生效
    await new Promise(resolve => setTimeout(resolve, 5000));
    //显示桌面，检查桌面壁纸
    await agent.aiDoubleClick("飞屋环游.tiff");
    await agent.aiWaitFor("打开图片")
    await agent.aiAssert("桌面当前的壁纸与图片飞屋环游.tiff图片基本一致");
    await agent.aiTap("看图窗口的关闭按钮：X");
    await agent.aiAssert("桌面图标和任务栏图标主题没有发生变化");

    //步骤2：进入家目录
    // 启动DDE文件管理器应用
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的主目录");
    await agent.aiWaitFor("目录中出现夕阳.tif出现");
    await agent.aiRightClick("夕阳.tif");
    await agent.aiWaitFor("右键菜单出现");
    await agent.aiTap("设置壁纸");
    //等到2秒，壁纸设置生效
    await new Promise(resolve => setTimeout(resolve, 2000));
    //显示桌面
    await uos.showDesktop();
    await agent.aiDoubleClick("夕阳.tif");
    await agent.aiWaitFor("打开图片");
    await agent.aiAssert("桌面当前的壁纸与图片 夕阳.tif图片基本一致");
    await agent.aiTap("看图窗口的关闭按钮：X");
    await system.exec("killall deepin-image-viewer");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("桌面图标和任务栏图标主题没有发生变化");

    //步骤3： 图片目录下的壁纸目录
    await agent.aiTap("任务栏上的文件管理器图标");
    await agent.aiWaitFor("文件管理器窗口打开");
    await agent.aiTap("左侧导航栏的图片");
    await agent.aiWaitFor("Wallpapers可见");
    await agent.aiDoubleClick("Wallpapers");
    await agent.aiWaitFor("目录中出现图片文件");
    await agent.aiRightClick("第一个图片");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("设置壁纸");
    //等到2秒，壁纸设置生效
    await new Promise(resolve => setTimeout(resolve, 2000));
    //显示桌面--关闭文管
    await system.exec("killall dde-file-manager");
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiAssert("桌面壁纸是一张波浪状的红砂岩纹理的峡谷");
    await agent.aiAssert("桌面图标和任务栏图标主题没有发生变化");

  }, { timeout: 1200000, tags: ["1884463", "level3", "wallpaper_screensaver", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system,env}) => {
    console.log('5. afterAll: 清理测试套件');
    //清理测试文件
    await system.exec("rm ~/Desktop/*.tif*");
    await system.exec("rm ~/*.tif*");
    // 关闭文件管理器窗口、看图窗口
    await system.exec("killall dde-file-manager");
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    await device.pressKey("ESC");
    await system.exec("killall deepin-image-viewer");
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
