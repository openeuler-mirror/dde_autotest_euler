/**
 * 用例 PMSID: 1801683
 * 用例标题: 【通知中心】通知中心展开任一应用通知后，标题栏[收起]按钮功能与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801683-【通知中心】通知中心展开任一应用通知后，标题栏[收起]按钮功能与需求一致', () => {
  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：删除数据库并重启 shell 服务
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801683-【通知中心】通知中心展开任一应用通知后，标题栏[收起]按钮功能与需求一致', async ({ device, agent, uos, system }) => {
    // 发送多个不同应用的通知（每类应用多条使其折叠），用于展开多个应用折叠通知并验证标题栏[收起]按钮
    // 使用已注册应用 'dde-control-center'(显示为"控制中心")、'org.deepin.terminal'(显示为"终端")确保通知按应用分组折叠
    // 关键：同应用同标题(summary)不同正文(body)的通知会累积并按应用折叠为 overlap 折叠组；
    // 折叠状态下只显示最新一条通知，展开后可见全部
    // 不使用 -t 0：-t 0 会使通知成为常驻桌面横幅，不进入长驻区域，导致无法折叠与操作
    const apps = [
      { name: 'dde-control-center', display: '控制中心', title: '控制中心通知', prefix: '控制中心', count: 3 },
      { name: 'org.deepin.terminal', display: '终端', title: '终端通知', prefix: '终端', count: 3 },
    ];
    for (const app of apps) {
      for (let i = 1; i <= app.count; i++) {
        await system.exec(`notify-send -a '${app.name}' "${app.title}" "${app.prefix}第${i}条通知" -t 1000`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    // 等待桌面横幅过期、通知写入数据库并进入通知中心长驻区域按应用折叠
    await new Promise(resolve => setTimeout(resolve, 10000));
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await agent.aiAssert("通知中心文案下面(长驻区域)有来自不同应用的通知信息，不同应用通知分开排列折叠展示", { deepThink: true });

    // 展开指定应用折叠通知（若已展开则跳过，避免重复切换；带重试防止AI点击偏差导致未展开）
    const expandNotification = async (app) => {
      for (let attempt = 0; attempt < 3; attempt++) {
        const expanded = await agent.aiBoolean(`通知中心文案下面(长驻区域)'${app.name}'(${app.display})通知信息处于展开状态，显示全部${app.count}条通知内容，不只是只显示最新一条`, { deepThink: true });
        if (expanded) return;
        await agent.aiTap(`通知中心文案下面(长驻区域)'${app.display}'应用的折叠通知信息`, { deepThink: true });
        await new Promise(r => setTimeout(r, 1200));
      }
      const expanded = await agent.aiBoolean(`通知中心文案下面(长驻区域)'${app.name}'(${app.display})通知信息处于展开状态，显示全部${app.count}条通知内容`, { deepThink: true });
      if (!expanded) {
        throw new Error(`展开'${app.display}'折叠通知失败`);
      }
    };

    // 步骤1: 展开多个应用的折叠通知
    for (const app of apps) {
      await expandNotification(app);
    }
    // 检查1: 标题栏右侧出现[收起]按钮(向上箭头图标)，且位于[设置]按钮左侧
    await agent.aiAssert("通知中心标题栏右侧出现向上箭头图标(收起)按钮，且该收起按钮位于设置(更多)按钮的左侧", { deepThink: true });

    // 步骤2: 点击标题栏的[收起]按钮
    await agent.aiTap("通知中心标题栏的向上箭头图标(收起)按钮", { deepThink: true });
    await new Promise(r => setTimeout(r, 1200));
    // 检查2: 所有应用展开的通知信息恢复折叠状态(只显示最新一条，不再展开显示全部)
    for (const app of apps) {
      const collapsed = await agent.aiBoolean(`通知中心文案下面(长驻区域)'${app.name}'(${app.display})通知信息处于折叠状态，只显示最新一条通知，没有展开显示全部${app.count}条通知`, { deepThink: true });
      if (!collapsed) {
        throw new Error(`'${app.display}'通知未恢复折叠状态`);
      }
    }
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  }, { timeout: 1200000, tags: ['1801683', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理通知：删除数据库并重启 shell 服务
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
