/**
 * 用例 PMSID: 1772829
 * 用例标题: 【控制中心】【首页】【列表模式】面包屑导航栏界面展示
 * 生成时间: 2026-09-22
 * 用例编写人: UT001707(陈慧)
 * 修复记录: 2026-09-22 修复内容:
 *   1) 打开控制中心后先复位到默认首页，避免上次会话残留页面导致菜单项定位失败；
 *   2) 二级/三级菜单项点击增加"定位重试 + deepThink"，修复"桌面和任务栏"偶发定位失败；
 *   3) 断言措辞对齐产品实际表现（当前菜单标题为活动色，各级标题完整展示）。
 */

describe('1772829-【控制中心】【首页】【列表模式】面包屑导航栏界面展示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1772829-【控制中心】【首页】【列表模式】面包屑导航栏界面展示', async ({ device, agent, uos, system }) => {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const tapWithRetry = async (prompt, tries) => {
      for (let i = 0; i < (tries || 3); i++) {
        try {
          await agent.aiTap(prompt, { deepThink: true });
          return true;
        } catch (e) {
          console.log('点击失败重试: ' + String((e && e.message) || e).split('\n')[0]);
          await sleep(800);
        }
      }
      return false;
    };

    // 步骤 1: 打开控制中心，进入任意一级菜单项的二级菜单界面
    console.log('步骤 1: 打开控制中心，进入二级菜单界面');
    await uos.openApp('控制中心', { maximizeWindow: true });
    await system.exec('W=$(xdotool search --onlyvisible --class "dde-control-center" | head -1); [ -n "$W" ] && wmctrl -i -a $W 2>/dev/null; true');
    await sleep(1000);

    await agent.aiWaitFor('显示系统设置界面', { timeoutMs: 15000 });
    await sleep(1500);
    // 复位到默认首页
    await tapWithRetry('左侧导航栏的"系统"菜单项', 2);
    await sleep(1200);
    if (!await tapWithRetry('左侧导航栏的"个性化"菜单项', 3)) throw new Error('未能进入个性化一级菜单界面');
    await sleep(1600);
    // 点击二级菜单项进入列表模式
    if (!await tapWithRetry('个性化设置界面中的"桌面和任务栏"选项', 3)) throw new Error('未能进入"桌面和任务栏"二级菜单界面');
    await sleep(1800);

    // 验证1: 二级菜单界面，面包屑导航栏展示
    console.log('验证1: 二级菜单界面面包屑导航栏展示');
    await agent.aiAssert('右侧区域上方标题栏位置展示面包屑导航栏，包含"<"返回按钮、一级菜单标题（如"个性化"）和当前二级菜单标题（如"桌面和任务栏"），当前菜单标题为活动色，面包屑导航栏展示正常');

    // 步骤 2: 点击二级菜单打开到三级菜单项界面
    console.log('步骤 2: 打开到三级菜单项界面');
    if (!await tapWithRetry('"桌面和任务栏"界面中的"插件区域"选项', 3)) throw new Error('未能进入"插件区域"三级菜单界面');
    await sleep(1800);

    // 验证2: 三级菜单界面，面包屑导航栏展示
    console.log('验证2: 三级菜单界面面包屑导航栏展示');
    await agent.aiAssert('右侧区域上方标题栏位置展示面包屑导航栏，包含"<"返回按钮、一级菜单标题（如"个性化"）、二级菜单标题（如"桌面和任务栏"）和当前三级菜单标题（如"插件区域"），当前菜单标题为活动色，面包屑导航栏展示正常');

  }, { timeout: 600000, tags: ['1772829', 'level3', 'control_center'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('ESC');
    await system.exec('killall dde-control-center 2>/dev/null');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
