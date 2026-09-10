/**
 * 用例 PMSID: 1832185
 * 用例标题: 【启动器】【全屏模式】【搜索规则】实时输入字符精准搜索
 * 生成时间: 2026-02-06
 * 用例编写人: UT005044(王亮)
 */

describe('1832185-【启动器】【全屏模式】【搜索规则】实时输入字符精准搜索', () => {
    beforeAll(async ({ device, uos, agent }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

    beforeEach(async ({ device, agent, uos, env, system }) => {
      console.log('2. beforeEach: 每个测试前的准备');
      //预置步骤1：读取配置文件 current_frame 的值
      const result = await system.exec(`cat /home/${env.testUsername}/.config/deepin/org.deepin.dde-shell/settings.ini`);
      console.log('配置文件内容：',result.success, result.stdout, result.stderr);
      if (!result.success) {
        console.log('配置文件不存在，默认为窗口模式 → 不做任何操作');
      } else {
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
        //预置步骤5：收尾按ESC关闭启动器，保持环境干净
        await device.pressKey('ESC'); 
        if (isWindowed) {
          console.log('检测到窗口模式，无需操作');
        }
      }
    });

    test('1832185-【启动器】【全屏模式】【搜索规则】实时输入字符精准搜索', async ({ device, agent, uos }) => {
      // 步骤 1: 打开启动器
      await uos.openLauncher();

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
      await agent.aiWaitFor("启动器全屏页面显示");
      await agent.aiAssert("页面展示浏览器应用、搜索输入框，对应展示超大图标和标题，整体相对对齐");

      // 步骤 3: 鼠标没有点击搜索框时敲键盘任意键
      await agent.aiTap("启动器底部中央的搜索输入框，呈矩形，内有放大镜图标");
      await device.typeText('music');
      await agent.aiWaitFor("底部中央的搜索输入框，呈矩形，内有放大镜图标和字符：music");

      // 检查 1：实时响应搜索并显示结果
      await agent.aiAssert("界面显示应用：音乐，仅1个搜索结果项")

      // 步骤 4：清除搜索框关键字后继续搜索
      await agent.aiTap('点击搜索框中右侧的x', { deepThink : true } )
      await agent.aiAssert("启动器的搜索框中为空");
      await device.typeText('日志收集工具');
      await agent.aiWaitFor("底部中央的搜索输入框，呈矩形，内有放大镜图标和字符:日志收集工具");

       // 检查 2：实时响应搜索并显示结果
      await agent.aiAssert("界面显示1个应用：日志收集工具");

      // 步骤 5：清除搜索框关键字后继续搜索
      await agent.aiTap('点击搜索框中右侧的x', { deepThink : true } )
      await agent.aiAssert("启动器的搜索框中为空");
      await device.typeText('jisuanji');
      await agent.aiWaitFor("底部中央的搜索输入框，呈矩形，内有放大镜图标和字符:jisuanji");

       // 检查 3：实时响应搜索并显示结果
      await agent.aiAssert("界面显示1个应用：计算机");   

    }, { timeout: 400000, tags: ["1832185", "level3"] });

    afterEach(async ({agent, device }) => {
      console.log('4. afterEach: 每个测试后的清理');
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
    });

    afterAll(async ({ uos, agent}) => {
      console.log('5. afterAll: 清理测试套件');
      await uos.closeCurrentWindow();
    });
  });