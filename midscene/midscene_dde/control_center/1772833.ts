/**
 * 用例 PMSID: 1772833
 * 用例标题: 【控制中心】【首页】【列表模式】面包屑导航栏各级标题支持点击跳转
 * 生成时间: 2026-09-22
 * 用例编写人: UT001707(陈慧)
 * 修复记录: 2026-09-22 修复内容:
 *   1) 打开控制中心后先复位到默认首页，修复会话残留页面导致菜单项定位失败；
 *   2) 各级菜单项点击增加"定位重试 + deepThink"，修复"桌面和任务栏"偶发定位失败；
 *   3) 断言措辞对齐产品实际表现（点击一级/二级菜单标题跳转到对应界面）。
 */

describe('1772833-【控制中心】【首页】【列表模式】面包屑导航栏各级标题支持点击跳转', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1772833-【控制中心】【首页】【列表模式】面包屑导航栏各级标题支持点击跳转', async ({ device, agent, uos, system }) => {
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

    // 打开到多级别（三级）菜单界面
    const gotoLevel3 = async () => {
      if (!await tapWithRetry('左侧导航栏的"个性化"菜单项', 3)) throw new Error('未能进入个性化一级菜单界面');
      await sleep(1600);
      if (!await tapWithRetry('个性化设置界面中的"桌面和任务栏"选项', 3)) throw new Error('未能进入"桌面和任务栏"二级菜单界面');
      await sleep(1600);
      if (!await tapWithRetry('"桌面和任务栏"界面中的"插件区域"选项', 3)) throw new Error('未能进入"插件区域"三级菜单界面');
      await sleep(1800);
    };

    // 步骤 1: 打开到多级别的菜单设置项界面，导航栏各级名称展示完全
    console.log('步骤 1: 打开控制中心到多级别菜单设置项界面');
    await uos.openApp('控制中心', { maximizeWindow: true });
    await system.exec('W=$(xdotool search --onlyvisible --class "dde-control-center" | head -1); [ -n "$W" ] && wmctrl -i -a $W 2>/dev/null; true');
    await sleep(1000);

    await agent.aiWaitFor('显示系统设置界面', { timeoutMs: 15000 });
    await sleep(1500);
    // 复位到默认首页
    await tapWithRetry('左侧导航栏的"系统"菜单项', 2);
    await sleep(1200);
    await gotoLevel3();

    // 验证1: 导航栏各级名称展示完全
    console.log('验证1: 导航栏各级名称展示完全');
    await agent.aiAssert('面包屑导航栏展示多级标题，各级标题名称完整可见');

    // 步骤 2: 直接点击一级菜单标题
    console.log('步骤 2: 点击一级菜单标题');
    await tapWithRetry('面包屑导航栏中的一级菜单标题（如"个性化"）', 2);
    await sleep(1800);

    // 验证2: 跳转到一级菜单界面
    console.log('验证2: 跳转到一级菜单界面');
    await agent.aiAssert('右侧界面跳转到对应的一级菜单界面（"个性化"页面，显示该一级菜单下的二级菜单列表），界面显示正常，导航栏更新正常');

    // 步骤 3: 先点击二级菜单标题，继续点击一级菜单标题
    console.log('步骤 3: 先点击二级菜单标题，再点击一级菜单标题');
    await gotoLevel3();
    // 点击二级菜单标题
    await tapWithRetry('面包屑导航栏中的二级菜单标题（如"桌面和任务栏"）', 2);
    await sleep(1800);

    // 验证3: 跳转到二级菜单界面
    console.log('验证3: 二级菜单界面显示正常');
    await agent.aiAssert('右侧界面跳转到对应的二级菜单界面（"桌面和任务栏"页面，显示该二级菜单下的子设置项列表），显示正常，导航栏更新正常');

    // 步骤 4: 再点击一级菜单标题
    console.log('步骤 4: 点击一级菜单标题');
    await tapWithRetry('面包屑导航栏中的一级菜单标题（如"个性化"）', 2);
    await sleep(1800);

    // 验证4: 跳转到一级菜单界面
    console.log('验证4: 跳转到一级菜单界面');
    await agent.aiAssert('右侧界面跳转到对应的一级菜单界面，二级菜单列表显示正常，导航栏更新正常');

    // 步骤 5: 直接点击最后一级菜单标题
    console.log('步骤 5: 点击最后一级菜单标题（当前层级）');
    await gotoLevel3();
    try {
      await tapWithRetry('面包屑导航栏中当前最后一级菜单标题', 1);
    } catch (e) {
      console.log('最后一级菜单标题不可点击/未定位到点击目标: ' + String((e && e.message) || e).split('\n')[0]);
    }
    await sleep(1200);

    // 验证5: 当前层级标题不可点击，无反应
    console.log('验证5: 当前层级标题不可点击');
    await agent.aiAssert('当前界面无变化，最后一级菜单标题不可点击，无反应，界面显示正常');

  }, { timeout: 600000, tags: ['1772833', 'level3', 'control_center'] });

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
