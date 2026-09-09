/**
 * 用例 PMSID: 1832169
 * 用例标题: 【启动器】【全屏模式】【搜索框】鼠标左键点击搜索框，随后关闭启动器再打开，启动器状态恢复为原状态
 * 生成时间: 2026/2/9 10:44
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832169-【启动器】【全屏模式】【搜索框】鼠标左键点击搜索框，随后关闭启动器再打开，启动器状态恢复为原状态', () => {
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

    test('1832169-【启动器】【全屏模式】【搜索框】鼠标左键点击搜索框，随后关闭启动器再打开，启动器状态恢复为原状态', async ({ device, agent, uos }) => {
      // 提高健壮性：启动器打开 + 3次重试 + 界面判断，规避环境问题、AI点击错误导致的异常
       let launchSuccess = false;
       for (let tryCount = 1; tryCount <= 3; tryCount++) {
	    console.log(`第 ${tryCount} 次尝试打开启动器...`);
	       
	    // 步骤 1: 打开启动器，使用快捷键，避免点击到其他位置
	    await device.pressKey('Super');
	
	    // 判断：是否出现「我的常用」= 启动器打开成功
	    launchSuccess = await agent.aiBoolean("界面存在文字：我的常用");
	       
	    if (launchSuccess) {
	      console.log('✅ 启动器打开成功！');
	      break;
	    } else {
	      console.log(`❌ 启动器未打开，准备重试（剩余 ${3 - tryCount} 次）`);
	      await device.pressKey('Esc');
	    }
      }

    // 如果3次都失败，抛出错误
      if (!launchSuccess) {
        throw new Error('❌ 启动器打开失败：3次重试均未成功');
      }

      // 步骤 2: 点击全屏模式
      await agent.aiTap({
      prompt: '识别指定图标坐标：在启动器窗口模式右下角的全屏模式图标',
      images: [
        {
          name: '全屏模式小图标',
          url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832203-1.png',
        },
      ],
      deepThink: true,
    });
      await agent.aiWaitFor("启动器页面已显示");
      await agent.aiAssert("启动器页面展示浏览器应用、搜索输入框，一行最多显示了8个应用图标");

      //步骤3：点击搜索框
      await agent.aiTap("鼠标左键点击搜索框");
      //检查：搜索框被激活
      await agent.aiAssert("搜索字样不可见,放大镜图标显示在输入框最左边");

      //步骤4：关闭启动器后再次打开启动器
      await device.pressKey("esc");
      await agent.device.pressKey('Super');
      //检查：启动器窗口
      await agent.aiAssert("启动器页面展示：一行最多显示了8个应用图标");
      await agent.aiAssert("启动器页面存在：位于底布正中央、带有放大镜图标和“搜索”提示文字的长方形搜索输入框");
    }, { timeout: 300000, tags: ["1832169", "level3"] });

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