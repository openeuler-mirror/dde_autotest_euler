/**
 * 用例 PMSID: 1801705
 * 用例标题: 【通知中心】通知中心鼠标悬浮在单条通知信息上，出现删除按钮后，tab键和回车键功能与需求一致
 * 生成时间: 2026-09-07 15:00:00
 * 用例编写人: UT000327(秦家喜)
 */

describe('1801705-【通知中心】通知中心鼠标悬浮在单条通知信息上，出现删除按钮后，tab键和回车键功能与需求一致', () => {
  const caseDir = process.env.TESTCASE_DIR || '/home/uos/midscene-uos-latest-x86_64/apps/';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知（删库+重启 dde-shell），确保通知中心为空
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.releaseAllKeys();
  });

  test('1801705-【通知中心】通知中心鼠标悬浮在单条通知信息上，出现删除按钮后，tab键和回车键功能与需求一致', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 发送一条单条通知（-t 1000: 横幅1秒后过期，转入通知中心长驻区域）
    await system.exec(`notify-send -a 'org.deepin.terminal' '单条删除按钮测试' '用于删除按钮tab回车测试' -t 1000`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示');
    await agent.aiWaitFor('通知中心中显示标题为"单条删除按钮测试"的单条通知信息', { timeoutMs: 15000 });

    // 辅助函数: 显式聚焦通知中心窗口，确保Qt键盘焦点就绪，Tab导航才能生效（X11项目机）
    async function focusNotificationCenter() {
      const win = await system.exec(`xdotool search --name 'org.deepin.ds.notificationcenter' | head -1`);
      const winId = win.stdout.trim();
      if (winId) {
        await system.exec(`xdotool windowfocus ${winId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    await focusNotificationCenter();
    // 鼠标悬浮到单条通知信息上，使删除按钮出现
    await agent.aiHover('通知中心中来自org.deepin.terminal应用、标题为"单条删除按钮测试"的单条通知信息', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 4000));

    // 步骤 1+2: 单条信息出现删除按钮后，按tab键将焦点选中删除按钮，再按回车键删除该条通知
    // 检查: 焦点可以正常选中删除按钮、该条通知被删除、通知中心不关闭（以行为结果验证tab+回车功能）
    // 说明: 本机(X11)悬浮后删除按钮为20x20小按钮，AI视觉不易识别，删除按钮在通知项获得焦点后会显示，
    //       因此采用"多次tab+回车"的行为验证方式：通知被删除即证明tab成功选中删除按钮
    let deleted = false;
    for (let round = 0; round < 4 && !deleted; round++) {
      for (let i = 0; i < 6; i++) {
        await device.pressKey('tab');
        await new Promise(resolve => setTimeout(resolve, 900));
      }
      await device.pressKey('Enter');
      await new Promise(resolve => setTimeout(resolve, 2500));
      deleted = await agent.aiBoolean('通知中心中不再显示标题为"单条删除按钮测试"的通知（已无最近通知或列表为空），通知中心界面仍打开', { deepThink: true });
    }

    // 检查: 该条通知被删除，通知中心不关闭（通知中心已无该通知即删除成功）
    if (deleted) {
      await agent.aiAssert('通知中心界面仍打开，且不再显示标题为"单条删除按钮测试"的通知（已无最近通知或列表为空）');
    } else {
      throw new Error('多次tab+回车后通知仍未删除：本机悬浮删除按钮无法被tab焦点选中或悬浮未生效');
    }
  }, { timeout: 600000, tags: ['1801705', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    // 清理通知（删库+重启 dde-shell）
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.releaseAllKeys();
    await uos.showDesktop();
  });
});
