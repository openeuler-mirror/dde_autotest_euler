/**
 * 用例 PMSID: 1884495
 * 用例标题:【控制中心】【个性化】【壁纸】设置本地图片为壁纸后，自动同步添加到“壁纸-我的图片”中
 * 生成时间: 2026-01-15 16:08:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1884495-【控制中心】【个性化】【壁纸】设置本地图片为壁纸后，自动同步添加到“壁纸-我的图片”中', () => {
  // 1. 核心配置：5张测试图片的文件名+壁纸描述（便于维护，新增/修改只需改这里）
  const wallpaperList = [
    {
      fileName: "1.png",
      desc: "桌面壁纸是一张白云和绿色草原的壁纸",
      myImgDesc: "我的图片中存在白云和绿色草原的图片，有1个图片"
    },
    {
      fileName: "2.jpg",
      desc: "桌面壁纸是一张秋日山景图，带有橙红色云霞和山峦层叠的壁纸",
      myImgDesc: "我的图片第一张是秋日山景图，带有橙红色云霞和山峦层叠的图片，有2个图片"
    },
    {
      fileName: "3.bmp",
      desc: "桌面壁纸是一张行人走在石拱桥的壁纸",
      myImgDesc: "我的图片第一张是行人走在石拱桥的图片，有3个图片"
    },
    {
      fileName: "4.png",
      desc: "桌面壁纸是一张湖面铺满霞光，石拱桥的夕阳壁纸",
      myImgDesc: "我的图片第一张是夕阳的图片，有4个图片"
    },
    {
      fileName: "5.png",
      desc: "桌面壁纸是一张蓝天白云、海面上有木质栈道的壁纸",
      myImgDesc: "我的图片第一张是蓝天白云的图片，有5个图片"
    }
  ];

  // 2. 封装：打开控制中心-个性化-壁纸页面（复用逻辑）
  const openWallpaperPage = async (agent, uos) => {
    await agent.aiWaitFor("个性化可见", { timeout: 5000 });
    await agent.aiTap("个性化");
    await agent.aiWaitFor("壁纸可见", { timeout: 1000 });
    await agent.aiTap("壁纸");
    await agent.aiWaitFor("我的图片可见", { timeout: 1000 });
  };

  // 3. 封装：设置本地图片为壁纸的逻辑（复用）  
  const setLocalWallpaper = async (agent, uos, fileName, system) => {
    console.log(`  步骤1-1: 打开桌面测试图片目录`);
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");
    await new Promise(resolve => setTimeout(resolve, 5000));//等到5秒
    await agent.aiWaitFor("桌面已显示",
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      });
    await agent.aiDoubleClick("1884495"); // 打开桌面图片目录
    await agent.aiWaitFor(`${fileName}可见`, { timeout: 500 });
    console.log(`  步骤1-2: 右键点击图片 ${fileName} 并选择"设置壁纸"`);
    await agent.aiRightClick(fileName);
    await agent.aiWaitFor("设置壁纸可见", { timeout: 500 });
    await agent.aiTap("设置壁纸");
    console.log(`  步骤1-3: 等待壁纸设置生效`);
    await new Promise(resolve => setTimeout(resolve, 500)); // 参考1884477，增加到500ms确保壁纸设置生效
  };

  // 4. 封装：验证"我的图片"同步逻辑（复用）
  const verifyMyImages = async (agent, uos, imgItem, index) => {
    console.log(`  步骤3-1: 打开控制中心-个性化-壁纸页面`);
    await openWallpaperPage(agent, uos);
    console.log(`  步骤3-2: 验证"我的图片"中图片存在且总数正确`);
    // 验证图片存在 + 总数递增（第n张设置后，总数应为n张）
    await agent.aiAssert(imgItem.myImgDesc);
    // await agent.aiAssert(`添加图片右侧的图片总数为：${index + 1}张`);
    console.log(`  步骤3-3: 验证通过，当前"我的图片"中有${index + 1}张图片`);
  };

  // 前置：初始化+清理旧数据
  beforeAll(async ({ device, uos, system, agent, env }) => {
    console.log('1. beforeAll: 初始化测试套件，清理旧数据');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    // 清理“我的图片”中旧的测试图片
    await system.exec("killall dde-control-center");
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf  /var/cache/wallpapers/custom-wallpapers/${env.testUsername}/*`);

    // 复制测试文件到桌面（先检查源路径是否存在）
    const caseDir = process.env.TESTCASE_DIR;
    const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1884495`;
    // 复制文件到桌面
    await system.exec(`cp -r "${sourcePath}" ~/Desktop`);
  });

  // 每个测试前的准备（空实现，预留扩展）
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  // 核心测试用例：遍历5张图片，依次验证
  test('1884495-【控制中心】【个性化】【壁纸】设置本地图片为壁纸后，自动同步添加到“壁纸-我的图片”中', async ({ device, agent, uos, system, env }) => {
    // 遍历所有测试图片，依次设置并验证
    for (let i = 0; i < wallpaperList.length; i++) {
      const imgItem = wallpaperList[i];
      console.log(`===== 开始处理第${i + 1}张图片：${imgItem.fileName} =====`);

      // 步骤1：设置当前图片为壁纸
      await setLocalWallpaper(agent, uos, imgItem.fileName, system);

      // 步骤2：验证桌面壁纸生效以及图片数量
      await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
      await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒
      await agent.aiAssert(imgItem.desc);
      await system.exec("killall dde-control-center");
      await system.exec("dde-control-center -s");
      await new Promise(resolve => setTimeout(resolve, 5000));//等到5秒
      // 步骤3：验证“我的图片”同步（数量递增+图片存在）
      await verifyMyImages(agent, uos, imgItem, i);
    }

    console.log("所有5张图片均验证完成：设置为壁纸后均同步到“我的图片”，数量递增");
  }, { timeout: 1800000, tags: ["1884495", "level3", "wallpaper_screensaver", "yefei"] });

  // 后置：清理测试残留
  afterAll(async ({ system, uos, agent, env }) => {
    console.log('3. afterAll: 清理测试残留');
    // 删除桌面的测试目录

    await system.exec(`rm -rf ~/Desktop/1884495`);
    await system.exec("killall dde-file-manager");
    //主题、外观设置为默认
    await uos.openApp("控制中心");
    await agent.aiTap("个性化");
    await agent.aiWaitFor("主题可见");
    await agent.aiTap("bloom");
    await agent.aiTap("origin");
    await system.exec("killall dde-control-center");
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf  /var/cache/wallpapers/custom-wallpapers/${env.testUsername}/*`);
    // 初始化文管配置和进程
    await system.cleanupFileManager();
  });
});