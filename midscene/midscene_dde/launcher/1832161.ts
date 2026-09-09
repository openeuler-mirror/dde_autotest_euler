/**
 * 用例 PMSID: 1832161
 * 用例标题: 【启动器】【全屏模式】【搜索框】搜索框长驻显示
 * 生成时间: 2025/12/22 10:41
 * 用例编写人: UT002998(熊林辉)
 */

 describe('1832161-【启动器】【全屏模式】【搜索框】搜索框长驻显示', () => {
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

    test('1832161-【启动器】【全屏模式】【搜索框】搜索框长驻显示', async ({ device, agent, uos }) => {
      // 步骤 1: 打开启动器
      await uos.openLauncher();

      // 步骤 2: 点击全屏模式
      await agent.aiTap({
      prompt: '识别指定图标坐标：在启动器窗口模式左下角的全屏模式图标',
      images: [
        {
          name: '全屏模式小图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203-1.png',
        },
      ],
      deepThink: true,
    });
      await agent.aiWaitFor("启动器页面已显示");
      await agent.aiAssert("启动器页面存在：启动器页面存在：界面顶部中央有2个圆点，底部中央有一个带放大镜图标的搜索框,右上角有一个四角星图标");

      // 检查: 检查搜索框UI和位置
      await agent.aiAssert("启动器页面正下方存在：搜索输入框");

    }, { timeout: 600000, tags: ["1832161", "level1", "smoke"] });

    afterEach(async ({ device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
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
      await device.pressKey("esc");
    });
  });

