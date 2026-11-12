/**
 * 用例 PMSID: 1832241
 * 用例标题: 【启动器】【窗口模式】【“按名称”分类】【字母排序规则】下载一个带有数字的应用，检查“#分类”
 * 生成时间: 2026/7/17
 * 用例编写人: UT002485（卢燕）
 */

describe('1832241-【启动器】【窗口模式】【“按名称”分类】【字母排序规则】下载一个带有数字的应用，检查“#分类”', () => {
  beforeAll(async ({ device, uos, agent, env, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const installCmd = `echo '${env.testPassword}' | sudo -S apt install -y com.qihoo.360zip`;
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

  test('1832241-【启动器】【窗口模式】【“按名称”分类】【字母排序规则】下载一个带有数字的应用，检查“#分类”', async ({ device, agent, uos, system }) => {
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 500));
    await system.exec('wmctrl -c "1832617.ts - midscene-uos-latest-x86_64 - Trae CN" 2>/dev/null || true');
    await system.exec('wmctrl -c "测试主页 - 禅道 - 浏览器v7" 2>/dev/null || true');
    await system.exec('wmctrl -c "语音记事本" 2>/dev/null || true');
    await system.exec('wmctrl -c "控制中心" 2>/dev/null || true');
    await system.exec('wmctrl -c "DDE自动化测试任务跟踪表-luy.xlsx * - WPS 表格" 2>/dev/null || true');
    await system.exec('wmctrl -c "AI在测试中应用.xlsx - WPS 表格" 2>/dev/null || true');
    await system.exec('wmctrl -c "是否保存文档？" 2>/dev/null || true');
    await new Promise(resolve => setTimeout(resolve, 500));
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec('dde-dconfig set org.deepin.dde.shell -r org.deepin.ds.launchpad categoryType 2');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await uos.openLauncher();
    await agent.aiWaitFor('启动器小窗口已显示，包含应用图标和搜索框');
    let sortIconTapped = false;
    for (let i = 0; i < 3; i++) {
      try {
        await agent.aiTap('启动器小窗口左上角的排序模式切换图标（小图标按钮）', { deepThink: true });
        sortIconTapped = true;
        break;
      } catch (err) {
        console.warn(`第 ${i + 1} 次点击排序图标失败:`, err.message);
        await device.pressKey('ESC');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await uos.showDesktop();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await system.exec('dde-dconfig set org.deepin.dde.shell -r org.deepin.ds.launchpad categoryType 2');
        await new Promise(resolve => setTimeout(resolve, 1000));
        await uos.openLauncher();
        await agent.aiWaitFor('启动器小窗口已显示，包含应用图标和搜索框');
      }
    }
    if (!sortIconTapped) {
      throw new Error('3次尝试后仍无法点击自由排序图标');
    }
    await agent.aiAssert("启动器窗口显示：自由排序、按分类、按名称");
    await agent.aiTap("按名称");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 500));
    await uos.openLauncher();
    await agent.aiWaitFor('启动器小窗口已显示，处于按名称排序模式，左侧显示字母分类列表');
    await agent.aiAssert("启动器应用名称列存在#分类，且#分类排在所有字母分类之前");
    await agent.aiTap('#');
    await agent.aiWaitFor('启动器应用名称列的字母列表已显示');
    await agent.aiAssert("启动器应用名称列#分类显示在字母A~Z顺序之前");
    await agent.aiTap('#');
    await agent.aiWaitFor('启动器界面显示360压缩应用');
    await agent.aiAssert("启动器应用名称列#分类下显示360压缩");
  }, { timeout: 500000, tags: ["1832241", "level3"] });

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
    const uninstallCmd = `echo '${env.testPassword}' | sudo -S apt remove -y com.qihoo.360zip`;
    await system.exec(uninstallCmd, 120000);
    await uos.closeCurrentWindow();
  });
});