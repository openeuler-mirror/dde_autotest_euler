/**
 * 用例 PMSID: 1832487
 * 用例标题: 【启动器】【窗口模式】窗口“按名称”模式和全屏模式来回切换
 * 生成时间: 2026/03/20 15:12
 * 用例编写人: UT005044(王亮)
 */

describe('1832487-【启动器】【窗口模式】窗口“按名称”模式和全屏模式来回切换', () => {
  beforeAll(async ({ device, uos, agent}) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, env, system}) => {
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

  test('1832487-【启动器】【窗口模式】窗口“按名称”模式和全屏模式来回切换', async ({ device, agent, uos }) => {
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
    await agent.aiAssert("启动器窗口显示：自由排序被选中");
    await agent.aiAssert("启动器窗口显示：自由排序、按分类、按名称");

    // 步骤 3: 鼠标左键点击“按名称”
    await agent.aiTap("按名称");
    await agent.aiAssert("启动器界面存在字母分类：A、B、C、D");

    // 步骤 4: 点击字母B分类
    await agent.aiTap('B');
    await agent.aiAssert("启动器界面存在分类：A、B、C、D、F、G、H");

    // 步骤 5: 点击键盘ESC，隐藏分类面板
    await device.pressKey('ESC');
    await agent.aiAssert("启动器界面存在字母分类：A、B、C、D");

    // 步骤 6: 切换至全屏模式
    await agent.aiTap("启动器右下角全屏模式图标");
    await agent.aiWaitFor("启动器页面已显示");
    await agent.aiAssert("界面存在：浏览器");

   // 步骤 7: 点击窗口模式
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
    await agent.aiWaitFor("启动器页面已显示");

   // 检查： 界面显示正常
   await agent.aiAssert("启动器界面存在标题：我的常用");
   await agent.aiAssert("启动器界面下方存在选项：搜索");

    
  }, { timeout: 500000, tags: ["1832487", "level3"] });

  afterEach(async ({ agent, device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 循环3次，检查是否从按名称成功切换到自由排序模式
    for (let i = 0; i < 3; i++) {
      try {
        const result = await system.exec('dde-dconfig get org.deepin.dde.shell -r org.deepin.ds.launchpad categoryType');

        if (result.success) {
        console.log('获取启动器当前处于哪种窗口模式类型');
        //去掉引号并转数字，获取的为字符，如 "2"
        const raw = result.stdout.toString().trim().replace(/"/g, '');
        const categoryType = parseInt(raw, 10);
    
        console.log(`启动器窗口模式：2 自由模式、1 按分类、0 按名称 | 当前值: ${categoryType} | 第 ${i + 1} 次检查`);
        //整型对比，提高准确性
        if (categoryType === 2) {
            console.log('当前已是自由排序模式，无需恢复');
            break;
          }

        console.log(`第 ${i + 1} 次尝试恢复启动器为自由排序模式...`);
        await agent.aiTap({
          prompt: '识别指定图标坐标：在启动器小窗口左上角的按分类图标',
            images: [
              {
                name: '按分类小图标',
                url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832313.png',
              },
            ],
            deepThink: true,
          });
          await agent.aiTap("自由排序");
        } else {
          console.error(`第 ${i + 1} 次获取配置失败:`, result.stderr);
        }
      } catch (err) {
        console.warn(`第 ${i + 1} 次执行异常:`, err.message);
      }
    }
    await device.pressKey('ESC');
  });

  afterAll(async ({ uos, device }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});