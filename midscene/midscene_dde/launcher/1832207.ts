/**
 * 用例 PMSID: 1832207
 * 用例标题: 【启动器】【窗口模式】【展示规则】检查启动器首次打开的模式 
 * 生成时间: 2025/12/22 09:05
 * 用例编写人: UT002998(熊林辉)
 */

 describe('1832207-【启动器】【窗口模式】【展示规则】检查启动器首次打开的模式', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
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

  test('1832207-【启动器】【窗口模式】【展示规则】检查启动器首次打开的模式', async ({ device, agent, uos }) => {
    //步骤1：打开启动器
    await uos.openLauncher();
    //步骤2：打开桌面文件夹
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
    //检查：桌面文件夹被打开
    await agent.aiAssert("启动器窗口显示：自由排序被选中")

  }, { timeout: 600000, tags: ['1832207', 'level1', 'smoke'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});

