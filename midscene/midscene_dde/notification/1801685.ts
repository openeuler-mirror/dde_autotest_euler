/**
 * 用例 PMSID: 1801685
 * 用例标题: 【通知中心】通知中心展开任一应用通知后，重新打开通知中心，应用通知消息恢复为折叠状态
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801685-【通知中心】通知中心展开任一应用通知后重新打开通知中心应用通知消息恢复为折叠状态', () => {
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

  test('1801685-【通知中心】通知中心展开任一应用通知后重新打开通知中心应用通知消息恢复为折叠状态', async ({ device, agent, uos, system }) => {
    // 发送多条同一应用的通知，使其在长驻区域按应用折叠显示
    // 使用已注册应用 'dde-control-center'(显示为"控制中心")确保通知按应用分组折叠
    // 关键：同应用同标题(summary)不同正文(body)的通知会累积并按应用折叠为 overlap 折叠组；
    // 折叠状态下只显示最新一条通知，展开后可见全部
    // 不使用 -t 0：-t 0 会使通知成为常驻桌面横幅，不进入长驻区域，导致无法折叠与操作
    for (let i = 1; i <= 5; i++) {
      await system.exec(`notify-send -a 'dde-control-center' "控制中心通知" "控制中心第${i}条通知内容" -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    // 等待桌面横幅过期、通知写入数据库并进入通知中心长驻区域按应用折叠
    await new Promise(resolve => setTimeout(resolve, 10000));
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await agent.aiAssert("通知中心文案下面(长驻区域)显示控制中心的折叠通知信息，折叠状态下只显示最新一条通知(内容为'控制中心第5条通知内容')", { deepThink: true });

    // 展开折叠通知（若已展开则跳过，避免重复切换；带重试防止AI点击偏差导致未展开）
    const expandNotification = async () => {
      for (let attempt = 0; attempt < 3; attempt++) {
        const expanded = await agent.aiBoolean("通知中心文案下面(长驻区域)'dde-control-center'(控制中心)通知信息处于展开状态，显示全部5条通知内容，不只是只显示最新一条", { deepThink: true });
        if (expanded) return;
        await agent.aiTap("通知中心文案下面(长驻区域)控制中心的折叠通知信息", { deepThink: true });
        await new Promise(r => setTimeout(r, 1200));
      }
      const expanded = await agent.aiBoolean("通知中心文案下面(长驻区域)'dde-control-center'(控制中心)通知信息处于展开状态，显示全部5条通知内容", { deepThink: true });
      if (!expanded) {
        throw new Error("展开'控制中心'折叠通知失败");
      }
    };

    // 步骤1: 展开任一应用的折叠通知
    await expandNotification();
    await agent.aiAssert("通知中心文案下面(长驻区域)'dde-control-center'(控制中心)通知信息处于展开状态，显示全部5条通知内容", { deepThink: true });

    // 步骤2: 重新打开通知中心（关闭后再次打开）
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心已关闭");
    await new Promise(r => setTimeout(r, 800));
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    await new Promise(r => setTimeout(r, 800));

    // 检查: 应用通知消息恢复为折叠状态（重新打开通知中心后，展开的通知恢复折叠，只显示最新一条）
    const collapsed = await agent.aiBoolean("通知中心文案下面(长驻区域)'dde-control-center'(控制中心)通知信息处于折叠状态，只显示最新一条通知(内容为'控制中心第5条通知内容')，没有展开显示全部5条通知", { deepThink: true });
    if (!collapsed) {
      throw new Error("重新打开通知中心后，应用通知消息未恢复为折叠状态");
    }
    await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
  }, { timeout: 1200000, tags: ['1801685', 'level3'] });

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
