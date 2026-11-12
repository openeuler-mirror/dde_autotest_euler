/**
 * 用例 PMSID: 1832247
 * 用例标题: 【启动器】【窗口模式】【“按名称”分类】【字母排序规则】检查整个分类顺序
 * 生成时间: 2026/7/17
 * 用例编写人: UT002485（卢燕）
 */

const DDE_SHELL_CONFIG_PATH = '~/.config/deepin/org.deepin.dde-shell/settings.ini';

describe('1832247-【启动器】【窗口模式】【“按名称”分类】【字母排序规则】检查整个分类顺序', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 确保启动器为窗口模式
    const result = await system.exec(`cat ${DDE_SHELL_CONFIG_PATH}`);
    const content = result.stdout.toString();
    if (content.includes('current_frame=FullscreenFrame')) {
      await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${DDE_SHELL_CONFIG_PATH}`);
      await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  });

  beforeEach(async ({ device, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  test('1832247-【启动器】【窗口模式】【“按名称”分类】【字母排序规则】检查整个分类顺序', async ({ device, agent, uos }) => {
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示', { timeoutMs: 30000 });

    // 点击左上角排序模式按钮
    await agent.aiTap('启动器小窗口左上角的排序模式按钮（显示自由排序、按分类、按名称选项的图标）', { deepThink: true });
    await agent.aiWaitFor('排序模式菜单已显示', { timeoutMs: 10000 });
    await agent.aiAssert("启动器窗口显示：自由排序、按分类、按名称");
    await agent.aiTap("按名称");
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert("启动器应用名称列存在字母分类：A、B、C");
    await agent.aiAssert("启动器应用名称列字母分类按字母顺序排列");
    // 点击字母A，跳转到A字母分类下的应用
    await agent.aiTap("启动器应用名称列的字母A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("启动器应用名称列字母分类按字母顺序排列");
    await device.pressKey('Esc');
    await new Promise(resolve => setTimeout(resolve, 500));

    // 重新打开启动器，滚动检查字母分类排序
    await uos.openLauncher();
    await agent.aiWaitFor('启动器应用名称列');
    await agent.aiScroll('启动器应用名称列', { direction: 'down', distance: 200 });
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert("启动器应用名称列的字母分类按字母顺序排列（字母分类可能不完整，但已有的字母需按A-Z顺序排列）", { deepThink: true });
  }, { timeout: 500000, tags: ["1832247", "level3"] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    // 恢复启动器为自由排序模式
    for (let i = 0; i < 3; i++) {
      try {
        const result = await system.exec('dde-dconfig get -a org.deepin.dde.shell -r org.deepin.ds.launchpad -k categoryType');
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
          await agent.aiTap('启动器小窗口左上角的排序模式按钮', { deepThink: true });
          await agent.aiWaitFor('排序模式菜单已显示', { timeoutMs: 10000 });
          await agent.aiTap("自由排序");
          await device.pressKey('ESC');
          break;
        } else {
          console.error(`第 ${i + 1} 次获取配置失败:`, result.stderr);
        }
      } catch (err) {
        console.warn(`第 ${i + 1} 次执行异常:`, err.message);
      }
    }
  });

  afterAll(async ({ uos, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
  });
});