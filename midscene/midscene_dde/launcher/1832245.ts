/**
 * 用例 PMSID: 1832245
 * 用例标题: 【启动器】【窗口模式】【“按名称”分类】【字母排序规则】下载多个带有数字的应用，检查“#分类”及应用排序规则
 * 生成时间: 2026/7/18
 * 用例编写人: UT002485（卢燕）
 */

describe('1832245-【启动器】【窗口模式】【“按名称”分类】【字母排序规则】下载多个带有数字的应用，检查“#分类”及应用排序规则', () => {
  beforeAll(async ({ device, uos, agent, env, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 安装三款带有数字的应用
    const installCmd1 = `echo '${env.testPassword}' | sudo -S apt install -y org.7-zip.deepin`;
    await system.exec(installCmd1, 120000);
    const installCmd2 = `echo '${env.testPassword}' | sudo -S apt install -y com.qihoo.360zip`;
    await system.exec(installCmd2, 120000);
    const installCmd3 = `echo '${env.testPassword}' | sudo -S ll-cli install uos.web.2345`;
    await system.exec(installCmd3, 120000);
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

  test('1832245-【启动器】【窗口模式】【“按名称”分类】【字母排序规则】下载多个带有数字的应用，检查“#分类”及应用排序规则', async ({ device, agent, uos }) => {
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
    // 检查按称分类#及排序
    await agent.aiTap("按名称");
    await agent.aiAssert("启动器界面存在#分类，#分类位于所有分类最上方");
     await agent.aiTap('#');
    await agent.aiWaitFor('字母列表');
    await agent.aiAssert("启动器应用名称列#分类显示在字母A~Z顺序之前");
    await agent.aiTap('#');
    await agent.aiWaitFor('启动器界面显示#分类下的应用');
    await agent.aiAssert("#分类下应用按照名称首位的数字从小到大排列：2345游戏网页版、360压缩、7-Zip File Manager");
  }, { timeout: 500000, tags: ["1832245", "level3"] });

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
    await uos.showDesktop();
    const uninstallCmd1 = `echo '${env.testPassword}' | sudo -S apt remove -y org.7-zip.deepin`;
    await system.exec(uninstallCmd1, 120000);
    const uninstallCmd2 = `echo '${env.testPassword}' | sudo -S apt remove -y com.qihoo.360zip`;
    await system.exec(uninstallCmd2, 120000);
    const uninstallCmd3 = `echo '${env.testPassword}' | sudo -S ll-cli uninstall uos.web.2345`;
    await system.exec(uninstallCmd3, 120000);
  });
});