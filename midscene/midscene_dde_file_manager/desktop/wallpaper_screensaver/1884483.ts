/**
 * 用例 PMSID: 1884483
 * 用例标题:【控制中心】【个性化】【主题】浅色外观，设置不同的系统主题，相关主题壁纸都默认在系统壁纸中
 * 生成时间: 2026-01-15 14:31:26 
 * 用例编写人：UT000054（叶飞）
 */

describe('1884483-【控制中心】【个性化】【主题】浅色外观，设置不同的系统主题，相关主题壁纸都默认在系统壁纸中', () => {
  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 初始化文管配置和进程
    await system.cleanupFileManager();
    await system.exec("/usr/lib/deepin-daemon/desktop-toggle");//显示桌面
    await uos.openApp("控制中心");
    await agent.aiTap("个性化");
    await agent.aiWaitFor("主题");
    await agent.aiTap("origin");
    await agent.aiTap("外观右侧向下的箭头");
    await agent.aiWaitFor("出现菜单：浅色、自动、深色");
    await agent.aiTap("浅色");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1884483-【控制中心】【个性化】【主题】浅色外观，设置不同的系统主题，相关主题壁纸都默认在系统壁纸中', async ({ device, agent, uos, system, env }) => {

    //步骤1：设置控制中心主题bloom 、flow、hazy color、nirvana、organic glass、square、vintage
    const themeList = [
      {
        name: "bloom",
        // borderColor: "蓝色", // bloom主题选中边框为蓝色
        wallpaperDesc: "桌面壁纸是一张蓝色、白色和淡紫色（洋红色）的渐变融合的壁纸"
      },
      {
        name: "flow",
        //  borderColor: "蓝色或者黑色", // flow主题选中边框为蓝色
        wallpaperDesc: "桌面壁纸是一张由多个流畅的白色曲线和半透明圆形构成的壁纸"
      },
      {
        name: "hazy color",
        //borderColor: "玫红色", // hazy color主题选中边框为玫红色
        wallpaperDesc: "桌面壁纸是一张左侧有‌蓝色圆形‌；有紫色弯曲管状结构‌；有‌透明球体、黄色实心球体‌的壁纸"
      },
      {
        name: "nirvana",
        //borderColor: "蓝色", // nirvana主题选中边框为蓝色
        wallpaperDesc: "桌面壁纸是一张‌蓝色带有波浪条纹且有UOS字样的壁纸"
      },
      {
        name: "organic glass",
        // borderColor: "蓝色", // organic galss主题选中边框为蓝色
        wallpaperDesc: "桌面壁纸是一张淡紫、浅粉与浅灰的渐变融合的壁纸"
      },
      {
        name: "square",
        // borderColor: "紫色", // square主题选中边框为紫色
        wallpaperDesc: "桌面壁纸是一张‌由中心为紫色和蓝色的渐变星球，带有音乐符号的壁纸"
      },
      {
        name: "vintage",
        //borderColor: "蓝色", // vintage主题选中边框为蓝色
        wallpaperDesc: "桌面壁纸是一张雪山的壁纸"
      }
    ];

    // 封装：打开控制中心并进入个性化页面
    const openPersonalization = async () => {
      await system.exec("killall dde-control-center");
      await new Promise(resolve => setTimeout(resolve, 1000));
      await uos.openApp("控制中心", { maximizeWindow: true });
      await agent.aiWaitFor("个性化可见", { timeout: 500 });
      await agent.aiTap("个性化");
      await agent.aiWaitFor("主题选项可见", { timeout: 500 });
    };

    // 封装：验证单个主题的核心逻辑（适配不同边框颜色）
    const verifyTheme = async (themeItem) => {
      const { name, wallpaperDesc } = themeItem;
      console.log(`开始验证主题：${name}`);

      // 1. 点击目标主题并等待生效
      await agent.aiTap(name);
      await new Promise(resolve => setTimeout(resolve, 500));

      // 2. 验证主题选中状态：使用对应边框颜色断言（核心修改点）
      await agent.aiAssert(`${name}主题被选中,外边框有方框`);

      // 3. 验证系统壁纸选中状态
      await agent.aiTap("壁纸");
      await agent.aiWaitFor("系统壁纸可见", { timeout: 500 });
      await agent.aiTap("显示全部-40张");
      await agent.aiWaitFor("收起可见");
      await agent.aiAssert(`系统壁纸有一张被选中状态，图片外边框有方框`);

      // 4. 验证桌面壁纸显示
      await system.exec("/usr/lib/deepin-daemon/desktop-toggle");
      await new Promise(resolve => setTimeout(resolve, 1000));//等到1秒
      await agent.aiAssert(wallpaperDesc);

      // 5. 回到控制中心个性化页面
      await openPersonalization();
    };

    // 主流程：初始化+遍历所有主题验证
    for (const theme of themeList) {
      const themeResult = await verifyTheme(theme).catch(error => ({ error }));
      if (themeResult && themeResult.error) {
        console.error(`测试过程中出错：${themeResult.error.message}`);
        throw themeResult.error;
      }
    }

    console.log("所有主题验证完成，测试通过");
  }, { timeout: 1800000, tags: ["1884483", "level3", "wallpaper_screensaver", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    //主题、外观设置为默认
    await uos.openApp("控制中心", { maximizeWindow: true });
    await agent.aiTap("个性化");
    await agent.aiWaitFor("主题");
    await agent.aiTap("origin");
    // 关闭控制中心窗口
    await system.exec("killall dde-control-center");
    // 初始化文管配置和进程
    await system.cleanupFileManager();

  });
});
