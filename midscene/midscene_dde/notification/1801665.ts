/**
 * 用例 PMSID: 1801665
 * 用例标题: 【通知中心】通知中心长驻区域，多个应用置顶规则与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801665-【通知中心】通知中心长驻区域，多个应用置顶规则与需求一致', () => {
  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：打开通知中心，清除全部
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801665-【通知中心】通知中心长驻区域，多个应用置顶规则与需求一致', async ({ device, agent, uos, system }) => {
    // 置顶通知（带重试，避免AI点击偏差导致置顶未生效；先检查菜单状态避免重复切换）
    const pinNotification = async (target, verifyMsg) => {
      for (let attempt = 0; attempt < 3; attempt++) {
        await agent.aiRightClick(target, { deepThink: true });
        await agent.aiWaitFor("右键菜单已展示");
        const alreadyPinned = await agent.aiBoolean("右键菜单中显示'取消置顶'按钮（表示该通知已置顶）", { deepThink: true });
        if (alreadyPinned) {
          await device.pressKey("Escape");
          await new Promise(r => setTimeout(r, 500));
          return;
        }
        await agent.aiTap("右键菜单中的'置顶'按钮", { deepThink: true });
        await new Promise(r => setTimeout(r, 1500));
        if (await agent.aiBoolean(verifyMsg, { deepThink: true })) return;
        await device.pressKey("Escape");
        await new Promise(r => setTimeout(r, 500));
      }
      throw new Error(`置顶失败: ${target}`);
    };

    // 取消置顶通知（带重试，避免AI点击偏差导致取消置顶未生效；先检查菜单状态避免重复切换）
    const unpinNotification = async (target, verifyMsg) => {
      for (let attempt = 0; attempt < 3; attempt++) {
        await agent.aiRightClick(target, { deepThink: true });
        await agent.aiWaitFor("右键菜单已展示");
        const alreadyUnpinned = await agent.aiBoolean("右键菜单中显示'置顶'按钮（表示该通知未置顶）", { deepThink: true });
        if (alreadyUnpinned) {
          await device.pressKey("Escape");
          await new Promise(r => setTimeout(r, 500));
          return;
        }
        await agent.aiTap("右键菜单中的'取消置顶'按钮", { deepThink: true });
        await new Promise(r => setTimeout(r, 1500));
        if (await agent.aiBoolean(verifyMsg, { deepThink: true })) return;
        await device.pressKey("Escape");
        await new Promise(r => setTimeout(r, 500));
      }
      throw new Error(`取消置顶失败: ${target}`);
    };

    // 发送多个不同应用的通知（每类应用多条使其折叠），按发送先后顺序排列：
    // 先发送的应用通知排在最下方，体现多个应用置顶后按时间倒序排列的规则
    // 两个应用之间间隔1分钟发送，确保通知按应用分组折叠展示
    const apps = [
      { name: 'dde-control-center', title: '应用A通知', prefix: '应用A' },
      { name: 'org.deepin.browser', title: '应用B通知', prefix: '应用B' },
    ];
    for (let a = 0; a < apps.length; a++) {
      const app = apps[a];
      for (let i = 1; i <= 3; i++) {
        await system.exec(`notify-send -a '${app.name}' "${app.title}" "${app.prefix}第${i}条通知"`);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      // 应用之间间隔1分钟，最后一个应用发送后无需等待
      if (a < apps.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 60000));
      }
    }
    // 等待最后一条通知横幅出现
    await agent.aiWaitFor("桌面右下角有通知横幅", { timeoutMs: 15000 });
    // 默认没指定通知消失时间，等待6秒后桌面通知消失进入通知中心
    await new Promise(resolve => setTimeout(resolve, 6000));
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await agent.aiAssert("通知中心文案下面(长驻区域)有来自不同应用的通知信息，不同应用通知分开排列折叠展示", { deepThink: true });
    // 置顶应用A（dde-control-center）
    await pinNotification(
      "通知中心文案下面(长驻区域)'dde-control-center'折叠通知信息",
      "'dde-control-center'的折叠通知已置顶展示"
    );
    // 置顶应用B（org.deepin.browser）
    await pinNotification(
      "通知中心文案下面(长驻区域)'org.deepin.browser'折叠通知信息",
      "'org.deepin.browser'的折叠通知已置顶展示"
    );
    // 将鼠标移出通知中心（移至桌面左侧），避免悬浮状态影响排列顺序的视觉判断
    await agent.aiHover("桌面左侧没有图标的空白区域", { deepThink: true });
    await new Promise(r => setTimeout(r, 500));
    // 检查: 按照应用通知时间倒序排列（最新接收的消息显示在最上方）
    await agent.aiAssert("通知中心文案下面(长驻区域)多个置顶应用的折叠通知按照时间倒序排列", { deepThink: true });
    await agent.aiAssert("通知中心文案下面(长驻区域)最上方是后置顶的'org.deepin.browser'的折叠通知，下方是先置顶的'dde-control-center'的折叠通知", { deepThink: true });
  }, { timeout: 1200000, tags: ['1801665', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 取消置顶恢复原状
    await agent.aiRightClick("通知中心文案下面(长驻区域)'dde-control-center'的置顶折叠通知信息", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiTap("右键菜单中的'取消置顶'按钮", { deepThink: true });
    await agent.aiRightClick("通知中心文案下面(长驻区域)'org.deepin.browser'的置顶折叠通知信息", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    await agent.aiTap("右键菜单中的'取消置顶'按钮", { deepThink: true });
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
