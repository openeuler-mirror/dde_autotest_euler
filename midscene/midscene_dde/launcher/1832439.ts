/**
 * 用例 PMSID: 1832439
 * 用例标题: 【启动器】【窗口模式】【我的常用】拖拽应用至任务栏
 * 生成时间: 2026/1/23 09:23
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832439-【启动器】【窗口模式】【我的常用】拖拽应用至任务栏', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
      // 避免计算器被打开对脚本的影响
      console.log('杀掉计算器进程...');
      await system.exec('killall -9 deepin-calculator');

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

    test('1832439-【启动器】【窗口模式】【我的常用】拖拽应用至任务栏', async ({ device, agent, uos }) => {

    // 步骤1：打开启动器
      await uos.openLauncher();

    // 步骤 2: 鼠标右键点击浏览器，点击“从任务栏上移除”
      await agent.aiRightClick('启动器我的常用菜单下的计算器图标');
      await agent.aiTap("从任务栏上移除");
      await agent.aiAssert("任务栏应用区域不存在计算器图标");
    // 步骤 3: 拖拽我的常用模块下方的应用到任务栏
    //  await agent.aiAction("拖拽启动器我的常用菜单下方的浏览器到任务栏驻留");
    //  await agent.aiAssert("任务栏应用区域存在浏览器图标");

      await agent.aiRightClick("启动器我的常用菜单下的计算器图标", {deepinThink:true});
      await agent.aiTap("发送到任务栏");
      await agent.aiAssert("任务栏有一个带有加减乘除（+ - × ÷）符号的计算器图标，位于任务栏应用列表中，是一个白蓝配色的方形图标，带有计算器的典型运算符号标识");

    // 步骤 4：继续拖拽我的常用模块下方的应用到任务栏
    //  await agent.aiAction("拖拽启动器我的常用菜单下方的浏览器到任务栏驻留");
    //  await agent.aiAssert("任务栏应用区域存在浏览器图标");

    }, { timeout: 420000, tags: ["1832439", "level2", "smoke"] });

    afterEach(async ({agent, device }) => {
      console.log('4. afterEach: 每个测试后的清理');
    });

    afterAll(async ({ uos, agent}) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });