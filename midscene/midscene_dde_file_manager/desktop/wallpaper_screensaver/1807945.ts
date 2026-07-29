/**
 * 用例 PMSID: 1807945
 * 用例标题: [t]自定义壁纸-tif/tiff格式图片设置桌面壁纸_112
 * 生成时间: 2026-01-07 10:45:26
 * 用例编写人：UT000054（叶飞）
 */

describe('1807945-[t]自定义壁纸-tif/tiff格式图片设置桌面壁纸_112', () => {
  beforeAll(async ({ device, uos, system, agent, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
        // 初始化文管配置和进程
    await system.cleanupFileManager();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    //清空我的图片自定义壁纸
    await system.exec("killall dde-control-center");
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf  /var/cache/wallpapers/custom-wallpapers/${env.testUsername}/*`);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1807945-[t]自定义壁纸-tif/tiff格式图片设置桌面壁纸_112', async ({ device, agent, uos, system, env }) => {

    // 用例第一步：将midscene_dde_file_manager/resources/1807945 
    const caseDir = process.env.TESTCASE_DIR;
    const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1807945`;

    // 使用系统命令复制文件
    await system.exec(`cp  "${sourcePath}"/*  ~/Desktop`);

    console.log(`文件已复制到: ~/Desktop`);


    //设置tif格式壁纸
    //在桌面操作
    await uos.showDesktop();
    await agent.aiRightClick("飞屋环游.tiff");
    await agent.aiWaitFor("右键菜单出现");
    await agent.aiTap("设置壁纸");
    //等到2秒，壁纸设置生效
    await new Promise(resolve => setTimeout(resolve, 2000));
    //显示桌面，检查桌面壁纸
    await agent.aiDoubleClick("飞屋环游.tiff");
    await agent.aiWaitFor("打开图片");
    await agent.aiAssert("桌面当前的壁纸与图片飞屋环游.tiff图片基本一致");
    await agent.aiTap("看图窗口的关闭按钮：X");

    //设置tiff格式壁纸   
    //进入桌面目录
    await agent.aiRightClick("夕阳.tif");
    await agent.aiWaitFor("右键菜单出现");
    await agent.aiTap("设置壁纸");
    //等到2秒，壁纸设置生效
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiDoubleClick("夕阳.tif");
    await agent.aiWaitFor("打开图片");
    await agent.aiAssert("桌面当前的壁纸与图片 夕阳.tif图片基本一致");

  }, { timeout: 600000, tags: ["1807945", "level3", "wallpaper_screensaver", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    //清理测试文件
    await system.exec("rm ~/Desktop/*.tif*");
    // 关闭文件管理器窗口、看图窗口
    await system.exec("killall dde-file-manager");
    // 初始化文管配置和进程
    await system.cleanupFileManager();
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
