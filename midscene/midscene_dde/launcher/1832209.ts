/**
 * 用例 PMSID: 1832209
 * 用例标题: 【启动器】【窗口模式】启动器模式切换
 * 生成时间: 2026/1/22 13:53
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832209-【启动器】【窗口模式】启动器模式切换', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, uos, system}) => {
      console.log('2. beforeEach: 每个测试前的准备');
    //预置步骤1：读取配置文件 current_frame 的值
      const result = await system.exec('cat ~/.config/deepin/org.deepin.dde-shell/settings.ini');
      assertTrue(result.success, '读取配置文件失败');

      const content = result.stdout.toString();
      const isFullscreen = content.includes('current_frame=FullscreenFrame');
      const isWindowed = content.includes('current_frame=WindowedFrame');

      console.log('配置文件内容：', content);
      console.log('isFullscreen：', isFullscreen);
      console.log('isWindowed：', isWindowed);

      //预置步骤2：如果是全屏模式 → 按ESC关闭 → 重新打开启动器
      if (isFullscreen) {
        console.log('检测到全屏模式，执行ESC确保启动器被关闭...');
        await device.pressKey('ESC');

        console.log('重新打开启动器...');
        await uos.openLauncher();
  
       //预置步骤3：点击启动器全屏模式右上角的“窗口模式”图标
        console.log('切换启动器全屏模式到窗口模式，确保测试环境正常...');
        await agent.aiTap({
        prompt: '识别指定图标坐标：在启动器全屏模式右上角的窗口模式图标',
        images: [
          {
            name: '窗口模式小图标',
            url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203.png',
          },
        ],
        deepThink: true,
          });
      }
    //预置步骤4：如果是窗口模式 → 不做任何操作
       console.log('如果是窗口模式 → 不做任何操作');
    if (isWindowed) {
      console.log('检测到窗口模式，无需操作');
    }
  //预置步骤5：收尾按ESC关闭启动器，保持环境干净
    await device.pressKey('ESC'); 
    });

    test('1832209-【启动器】【窗口模式】启动器模式切换', async ({ device, agent, uos }) => {
      //步骤1：打开启动器
      await uos.openLauncher();

      //步骤2：点击启动器左上角的自由排序菜单
      await agent.aiTap({
      prompt: '识别指定图标坐标：在启动器小窗口左上角的自由排序图标',
      images: [
        {
          name: '自由排序小图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832207.png',
        },
      ],
      deepThink: true,
    });
      //检查：启动器窗口模式菜单被打开
      await agent.aiAssert("启动器窗口显示：自由排序选项前有对勾标记");
      await agent.aiAssert("启动器窗口显示：自由排序、按分类、按名称");

    // 步骤 3: 鼠标左键点击“按分类”
      await agent.aiTap("按分类");
      await agent.aiAssert("启动器界面存在分类：网络应用");

    // 步骤4：点击启动器左上角的按分类菜单
      await agent.aiTap({
      prompt: '识别指定图标坐标：在启动器小窗口左上角的按分类菜单',
      images: [
        {
          name: '按分类小图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832209-1.png',
        },
      ],
      deepThink: true,
    });
      //检查：桌面文件夹被打开
      await agent.aiAssert("启动器窗口显示：按分类排序被选中");
      await agent.aiAssert("启动器窗口显示：自由排序、按分类、按名称");

    // 步骤 5: 鼠标左键点击“按名称”
      await agent.aiTap("按名称");
      await agent.aiAssert("启动器界面存在字母分类：A、B、C、D");

    // 步骤6：点击启动器左上角的按名称类菜单
      await agent.aiTap({
      prompt: '识别指定图标坐标：在启动器小窗口左上角的按名称菜单',
      images: [
        {
          name: '按名称小图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832209-2.png',
        },
      ],
      deepThink: true,
    });
    //检查：启动器左上角按名称排序菜单被打开
      await agent.aiAssert("启动器窗口显示：按名称排序被选中");
      await agent.aiAssert("启动器窗口显示：自由排序、按分类、按名称");

    // 步骤 7: 鼠标左键点击“自由排序”
      await agent.aiTap("自由排序");
      await agent.aiTap({
      prompt: '识别指定图标坐标：在启动器小窗口左上角的自由排序图标',
      images: [
        {
          name: '自由排序小图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832207.png',
        },
      ],
      deepThink: true,
    });
    // 检查：启动器切回到自由排序模式
     await agent.aiAssert("启动器窗口显示：自由排序、按分类、按名称");

    }, { timeout: 420000, tags: ["1832209", "level2", "smoke"] });

    afterEach(async ({agent, device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent}) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });