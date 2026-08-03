/**
 * 用例 PMSID: 1884497
 * 用例标题:【控制中心】【个性化】【壁纸】设置本地图片为壁纸后，自动同步添加到“壁纸-我的图片”中
 * 生成时间: 2026-01-19 10:08:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1884497-【控制中心】【个性化】【壁纸】不同路径下的本地图片设置壁纸后，都可添加到“壁纸-我的图片”中', () => {

  // 前置：初始化+清理旧数据
  beforeAll(async ({ device, uos, system, agent, env }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    // 清理“我的图片”中旧的测试图片
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    //清空控制中心我的图片壁纸
    await system.exec("killall dde-control-center");
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf  /var/cache/wallpapers/custom-wallpapers/${env.testUsername}/*`);
  });

  // 每个测试前的准备（空实现，预留扩展）
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  // 核心测试用例：遍历4张本地图片，依次验证
  test('1884497-【控制中心】【个性化】【壁纸】不同路径下的本地图片设置壁纸后，都可添加到“壁纸-我的图片”中”', async ({ device, agent, uos, system, env }) => {

    // 复制测试文件到桌面（先检查源路径是否存在）
    const caseDir = process.env.TESTCASE_DIR;
    const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1884495`;
    // 复制文件到桌面
    await system.exec(`cp -r "${sourcePath}"/1.png ~/Desktop`);
    await system.exec(`cp -r "${sourcePath}"/2.jpg ~`);
    await system.exec(`cp -r "${sourcePath}"/3.bmp /tmp`);
    await system.exec(`cp -r "${sourcePath}"/4.png ~/Pictures`);
    console.log(`测试文件已复制到指定目录`);
    //步骤1:桌面自定义壁纸
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的桌面");
    await agent.aiRightClick("1.png");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("设置壁纸");
    await new Promise(resolve => setTimeout(resolve, 1000));//等到1秒
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//切换到桌面
    await new Promise(resolve => setTimeout(resolve, 2000));//等到2秒
    await agent.aiAssert("桌面壁纸:绿色草原和白云的壁纸");

    //步骤2:家目录自定义壁纸
    //切换到文管
    await system.exec("killall dde-file-manager");
    await system.exec("dde-file-manager");
    await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒
    await agent.aiTap("左侧导航栏的主目录");
    await agent.aiRightClick("2.jpg");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("设置壁纸");
    await new Promise(resolve => setTimeout(resolve, 1000));//等到1秒
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//切换到桌面
    await new Promise(resolve => setTimeout(resolve, 2000));//等到2秒
    await agent.aiAssert("桌面壁纸:森林和天空铺满霞光的壁纸");

    //步骤3:tmp目录自定义壁纸
    //切换到文管
    await system.exec("killall dde-file-manager");
    await system.exec("dde-file-manager");
    await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒
    await agent.aiTap("左侧导航栏的系统");
    await agent.aiDoubleClick("tmp");
    await agent.aiRightClick("3.bmp");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("设置壁纸");
    await new Promise(resolve => setTimeout(resolve, 1000));//等到1秒
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//切换到桌面
    await new Promise(resolve => setTimeout(resolve, 2000));//等到2秒
    await agent.aiAssert("桌面壁纸:云雾缭绕的山峦和行人走在石拱桥的湖面的壁纸");

    //步骤4:图片目录自定义壁纸
    //切换到文管
    await system.exec("killall dde-file-manager");
    await system.exec("dde-file-manager");
    await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒
    await agent.aiTap("左侧导航栏的图片");
    await agent.aiRightClick("4.png的图片");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("设置壁纸");
    await new Promise(resolve => setTimeout(resolve, 1000));//等到1秒
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//切换到桌面
    await new Promise(resolve => setTimeout(resolve, 2000));//等到2秒
    await agent.aiAssert("桌面壁纸:湖面有座石拱桥的夕阳的壁纸");

    //步骤5: 检查我的图片存在以上4张壁纸
    await uos.openApp("控制中心");
    await agent.aiWaitFor("个性化");
    await agent.aiTap("个性化");
    await agent.aiTap("壁纸");
    await agent.aiWaitFor("我的图片");
    await agent.aiAssert("我的图片存在4张图片，显示顺序依次为：湖面有座石拱桥的夕阳的图片、云雾缭绕的图片、森林和天空铺满霞光的图片、绿色草原和白云的图片");
  }, { timeout: 1800000, tags: ["1884497", "level3", "wallpaper_screensaver", "yefei"] });
  // 延长超时（4张图片需更多时间）

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, env }) => {
    console.log('3. afterAll: 清理测试残留');
    // 删除桌面的测试目录
    await system.exec(`rm -rf ~/Desktop/1.png`);
    await system.exec(`rm -rf ~/2.jpg`);
    await system.exec(`rm -rf /tmp/3.bmp`);
    await system.exec(`rm -rf ~/Pictures/4.png`);
    await system.exec("killall dde-file-manager");
    // 清理“我的图片”中的测试图片
    await uos.openApp("控制中心");
    await agent.aiTap("个性化");
    await agent.aiTap("bloom");
    await agent.aiTap("origin");
    await system.exec("killall dde-control-center");
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf  /var/cache/wallpapers/custom-wallpapers/${env.testUsername}/*`);
    // 初始化文管配置和进程
    await system.cleanupFileManager();
  });
}); 