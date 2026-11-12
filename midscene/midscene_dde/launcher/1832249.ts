/**
 * 用例 PMSID: 1832249
 * 用例标题: 【启动器】【窗口模式】【“按名称”分类】【字母排序规则】不存在某字母或拼音开头的应用，隐藏该分类
 * 生成时间: 2026/7/17
 * 用例编写人: UT002485（卢燕）
 */

describe('1832249-【启动器】【窗口模式】【“按名称”分类】【字母排序规则】不存在某字母或拼音开头的应用，隐藏该分类', () => {
  beforeAll(async ({ device, uos, agent, env, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const installCmd = `echo '${env.testPassword}' | sudo -S apt install -y com.hmja.notepad`;
    await system.exec(installCmd, 120000);
  });

  beforeEach(async ({ device, agent, uos, env, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
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

      if (isFullscreen) {
        console.log('检测到全屏模式，执行ESC确保启动器被关闭...');
        await device.pressKey('ESC');
        console.log('重新打开启动器...');
        await uos.openLauncher();
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
      await device.pressKey('ESC'); 
      if (isWindowed) {
        console.log('检测到窗口模式，无需操作');
      }
    }
  });

  test('1832249-【启动器】【窗口模式】【“按名称”分类】【字母排序规则】不存在某字母或拼音开头的应用，隐藏该分类', async ({ device, agent, uos, system }) => {
    await uos.openLauncher();
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
    await agent.aiAssert("启动器窗口显示：自由排序、按分类、按名称");
    await agent.aiTap("按名称");
    await agent.aiAssert("启动器应用名称列存在字母分类：A、B、C");
    await agent.aiTap("启动器应用名称列的字母A");
    await agent.aiWaitFor('字母列表中没有字母I');
    await agent.aiAssert("启动器界面不存在I分类");
    await agent.aiWaitFor('字母列表中有字母N');
    await agent.aiAssert("启动器界面存在N分类");
    await agent.aiTap("字母列表中的字母L");
    await agent.aiWaitFor('启动器应用名称列显示字母N、Notepad--');
    await agent.aiRightClick('Notepad--');
    await agent.aiTap("卸载");
    await agent.aiWaitFor('卸载确认对话框已显示');
    await agent.aiTap("确定");
    await new Promise(resolve => setTimeout(resolve, 5000));
    // 通过命令检查包是否已卸载，而非依赖通知中心
    const checkResult = await system.exec('dpkg -l com.hmja.notepad 2>/dev/null | grep "^ii"');
    if (checkResult.stdout.trim() === '') {
      console.log('Notepad--已卸载成功');
    } else {
      throw new Error('Notepad--卸载失败，包仍然存在');
    }

    await uos.openLauncher();
    await agent.aiTap("启动器应用名称列的字母A");
    await agent.aiWaitFor('字母列表中没有字母N');   
    await agent.aiAssert("启动器界面不存在N分类");
  }, { timeout: 500000, tags: ["1832249", "level3"] });

  afterEach(async ({ agent, device, system, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    for (let i = 0; i < 3; i++) {
      try {
        const result = await system.exec('dde-dconfig get org.deepin.dde.shell -r org.deepin.ds.launchpad categoryType');

        if (result.success) {
        console.log('获取启动器当前处于哪种窗口模式类型');
        const raw = result.stdout.toString().trim().replace(/"/g, '');
        const categoryType = parseInt(raw, 10);
    
        console.log(`启动器窗口模式：2 自由模式、1 按分类、0 按名称 | 当前值: ${categoryType} | 第 ${i + 1} 次检查`);
        if (categoryType === 2) {
            console.log('当前已是自由排序模式，无需恢复');
            break;
          }

        console.log(`第 ${i + 1} 次尝试恢复启动器为自由排序模式...`);
        await uos.openLauncher();
        await new Promise(resolve => setTimeout(resolve, 1000));
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
          await device.pressKey('ESC');
        } else {
          console.error(`第 ${i + 1} 次获取配置失败:`, result.stderr);
        }
      } catch (err) {
        console.warn(`第 ${i + 1} 次执行异常:`, err.message);
      }
    }
  });

  afterAll(async ({ uos, device, env, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.hmja.notepad`;
    await system.exec(uninstallCmd, 120000);
    await uos.closeCurrentWindow();
  });
});