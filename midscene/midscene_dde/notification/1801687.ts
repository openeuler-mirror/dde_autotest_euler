/**
 * 用例 PMSID: 1801687
 * 用例标题: 【通知中心】通知中心通知消息超过通知中心高度显示范围，滚动条正常展示
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801687-【通知中心】通知中心通知消息超过通知中心高度显示范围滚动条正常展示', () => {
  const caseDir = process.env.TESTCASE_DIR;
  // 滚动条显示策略 dconfig（对应 控制中心-个性化-窗口效果-滚动条设置 项）：
  // 0=滚动时显示(默认)，2=一直显示。用于收尾恢复默认值。
  const SB_APPID = 'org.deepin.dde.appearance';
  const SB_RES = 'org.deepin.dde.appearance';
  const SB_KEY = 'Qt_Scrollbar_Policy';
  let defaultScrollbarPolicy = '0';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { getDconfigValue, clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    // 记录滚动条显示策略默认值，用于收尾恢复
    defaultScrollbarPolicy = await getDconfigValue(SB_APPID, SB_RES, SB_KEY, system);
    // 清理残留通知：删除数据库并重启 shell 服务
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801687-【通知中心】通知中心通知消息超过通知中心高度显示范围滚动条正常展示', async ({ device, agent, uos, system }) => {
    // 多个不同应用发送通知，不同应用通知作为独立卡片排列、不折叠，确保内容超出通知中心可视高度以触发滚动条
    // 不使用 -t 0：-t 0 会使通知成为常驻桌面横幅，不进入长驻区域，导致无法在通知中心展示与滚动
    const apps = [
      'dde-control-center', 'org.deepin.browser', 'dde-file-manager', 'deepin-music', 'deepin-movie',
      'dde-calendar', 'dde-terminal', 'dde-screenshot', 'dde-calculator', 'deepin-system-monitor',
      'deepin-editor', 'deepin-draw', 'deepin-reader', 'deepin-picker', 'deepin-image-viewer',
    ];

    // 打开控制中心并导航至 个性化-窗口效果-滚动条 设置项
    const navToScrollbarSetting = async () => {
      await uos.openApp("控制中心", 2000, 20000, true);
      await agent.aiWaitFor("'个性化'文字可见");
      await agent.aiTap("个性化", { deepThink: true });
      await agent.aiWaitFor("'窗口效果'文字可见");
      await agent.aiTap("窗口效果", { deepThink: true });
      await agent.aiWaitFor("'滚动条'文字可见");
    };
    const closeControlCenter = async () => {
      await device.pressKey("alt", "F4");
      await new Promise(resolve => setTimeout(resolve, 1000));
    };
    // 打开通知中心/关闭通知中心
    const openNC = async () => {
      await device.pressKey("super", "m");
      await agent.aiWaitFor("通知中心界面已显示");
      await agent.aiAssert("通知中心有通知消息");
    };
    const closeNC = async () => {
      await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 800));
    };
    // 上下滚动并断言可正常滚动显示、滚动条正常展示
    const scrollAndAssert = async () => {
      await agent.aiScroll("通知中心通知消息区域", { direction: 'down', distance: 500 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiScroll("通知中心通知消息区域", { direction: 'up', distance: 500 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiAssert("通知中心通知消息可以正常上下滚动显示，滚动条正常展示", { deepThink: true });
    };

    // 前置：打开 控制中心-个性化-窗口效果-滚动条设置，确认存在"滚动时显示"和"一直显示"两个选项
    await navToScrollbarSetting();
    await agent.aiAssert("窗口效果界面存在'滚动条'设置项，为下拉框控件", { deepThink: true });
    await agent.aiTap("窗口效果界面'滚动条'设置项的下拉框(显示当前值)", { deepThink: true });
    await agent.aiWaitFor("滚动条下拉列表已展开");
    // 体现"滚动时显示"和"一直显示"两种设置项的差异：下拉列表存在两个可选项
    await agent.aiAssert("滚动条下拉列表中存在'滚动时显示'和'一直显示'两个选项", { deepThink: true });

    // ===== 场景一：滚动条设置为"一直显示" =====
    await agent.aiTap("滚动条下拉列表中的'一直显示'选项", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 800));
    await agent.aiAssert("窗口效果界面'滚动条'设置项的当前值已变更为'一直显示'", { deepThink: true });
    await closeControlCenter();

    // 发送多条不同应用通知，使通知消息超过通知中心高度显示范围
    for (let i = 0; i < apps.length; i++) {
      await system.exec(`notify-send -a "${apps[i]}" "通知${i + 1}" "第${i + 1}条通知内容，用于测试通知中心滚动条展示"`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await agent.aiWaitFor("桌面右下角有通知横幅", { timeoutMs: 15000 });
    await new Promise(resolve => setTimeout(resolve, 10000));
    // 打开通知中心
    await openNC();
    // 检查1: 通知消息超过显示范围，滚动条正常展示
    await agent.aiAssert("通知中心通知消息超过显示范围，通知消息区域右侧显示有滚动条", { deepThink: true });
    // 步骤1: 鼠标滚轮上下滚动
    await scrollAndAssert();
    await closeNC();

    // ===== 场景二：滚动条设置为"滚动时显示" =====
    await navToScrollbarSetting();
    await agent.aiTap("窗口效果界面'滚动条'设置项的下拉框(显示当前值)", { deepThink: true });
    await agent.aiWaitFor("滚动条下拉列表已展开");
    await agent.aiTap("滚动条下拉列表中的'滚动时显示'选项", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 800));
    await agent.aiAssert("窗口效果界面'滚动条'设置项的当前值已变更为'滚动时显示'", { deepThink: true });
    await closeControlCenter();

    // 重新打开通知中心（通知仍保留在数据库中），验证滚动条正常展示
    await openNC();
    // 检查2: 通知消息超过显示范围，滚动条正常展示
    await agent.aiAssert("通知中心通知消息超过显示范围，通知消息区域右侧不会显示滚动条", { deepThink: true });
    // 步骤2: 鼠标滚轮上下滚动
    await scrollAndAssert();
    await closeNC();
  }, { timeout: 1200000, tags: ['1801687', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 关闭可能残留的控制中心窗口
    try { await device.pressKey("alt", "F4"); } catch (e) { console.log('close window skipped'); }
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 收尾：恢复滚动条显示策略为默认值
    try {
      const { setDconfigValue } = await import(`${caseDir}midscene_dde/common/common.ts`);
      await setDconfigValue(SB_APPID, SB_RES, SB_KEY, defaultScrollbarPolicy, system);
    } catch (e) { console.log('restore scrollbar policy skipped'); }
    // 清理通知：删除数据库并重启 shell 服务
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
