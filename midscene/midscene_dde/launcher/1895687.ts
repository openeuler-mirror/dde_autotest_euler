/**
 * 用例 PMSID: 1895687
 * 用例标题: 【启动器】【窗口模式】【搜索框】支持英文首字母匹配
 * 生成时间: 2026/1/30 14:27
 * 用例编写人: UT002998(熊林辉)
 */

describe('1895687-【启动器】【窗口模式】【搜索框】支持英文首字母匹配', () => {
    beforeAll(async ({ device, uos, agent}) => {
      console.log('1. beforeAll: 初始化测试套件');
    });

    beforeEach(async ({device, agent, system, uos}) => {
      console.log('2. beforeEach: 每个测试前的准备');
      system.exec(`/usr/lib/deepin-daemon/desktop-toggle`);
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

    test('1895687-【启动器】【窗口模式】【搜索框】支持英文首字母匹配', async ({ device, agent, uos}) => {
      // 步骤 1: 打开启动器
      await uos.openLauncher();

      // 步骤 2：搜索框输入as
      await device.typeText('as');
      // 检查：可搜索到app store应用
      await agent.aiAssert("启动器页面存在：所有应用");
      await agent.aiAssert("启动器页面存在：应用商店");
    }, { timeout: 300000, tags: ["1895687", "level3"] });

    afterEach(async ({agent, device}) => {
      console.log('3. afterEach: 每个测试后的清理');
    });

    afterAll(async ({uos, agent}) => {
      console.log('4. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });