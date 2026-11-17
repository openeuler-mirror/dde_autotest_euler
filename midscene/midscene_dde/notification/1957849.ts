/**
 * 用例 PMSID: 1957849
 * 用例标题: 【通知中心】通知横幅新增、折叠、删除、超时消失动效符合设计预期
 * 生成时间: 2026-09-09 09:00:00
 * 用例编写人: UT003072(陈佳梅)
 * 动效参考: 通知横幅.mp4 / 通知横幅动效说明.pdf
 */

describe('1957849-【通知中心】通知横幅新增、折叠、删除、超时消失动效符合设计预期', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1957849-【通知中心】通知横幅新增、折叠、删除、超时消失动效符合设计预期', async ({ device, agent, uos, system }) => {
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);

    // 确保桌面干净
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 8000));

    // 步骤 1: 发送一条通知，查看新出现效果（带重试：dde-shell刚重启可能导致通知服务未就绪）
    let bannerShown = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      await system.exec('notify-send "动效新增测试" "查看通知横幅新增动效" -t 300000');
      await new Promise(resolve => setTimeout(resolve, 3000));
      try {
        const appeared = await agent.aiBoolean('桌面右下角是否出现了一条通知横幅，内容包含"动效新增测试"');
        if (appeared) { bannerShown = true; break; }
        console.log(`第${attempt}次发送通知后未看到横幅，重试`);
      } catch (e) { console.log(`第${attempt}次检测异常: ${e.message}`); }
    }
    await agent.aiWaitFor('桌面右下角出现一条通知横幅', { timeoutMs: 30000 });
    await agent.logScreenshot('步骤1-通知横幅新增动效');
    await agent.aiAssert('桌面右下角出现了一条通知横幅，从屏幕右侧，从右往左平移出现后完整显示在屏幕内，横幅内容包含"动效新增测试"');

    // 步骤 2: 发送多条通知，依次验证新增补位动效和折叠动效（断言验证各动效完成后的结果状态）
    // 先清空通知，确保从1条开始逐条观察
    await clearNotifications(agent, device, system);
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 2.1 已有1条横幅时新增1条：新增横幅在最后一条，已有横幅整体向上移动补位
    await system.exec(`notify-send "动效折叠测试1" "第1条折叠动效测试通知" -t 300000`);
    await new Promise(resolve => setTimeout(resolve, 2500));
    await system.exec(`notify-send "动效折叠测试2" "第2条折叠动效测试通知" -t 300000`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.logScreenshot('步骤2-新增横幅补位动效完成');
    await agent.aiAssert('新增横幅动效完成后：新增横幅（动效折叠测试2）从屏幕右侧外向左位移出现后位于最后⼀条（最下⽅）位置，已有的横幅若不在最后⼀条则其他通知⼀起向上移动补位——已有横幅（动效折叠测试1）位于新增横幅上方，两条横幅排列紧凑、⽆重叠错位');

    // 2.2 已有2条横幅时新增第3条：新增横幅3在最后一条，已有横幅1、2整体向上移动空位
    await system.exec(`notify-send "动效折叠测试3" "第3条折叠动效测试通知" -t 300000`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.logScreenshot('步骤2-三条横幅补位动效完成');
    await agent.aiAssert('新增横幅动效完成后：桌面右下角新增横幅3（动效折叠测试3）从屏幕右侧向左移动出现后位于最下⽅（最后⼀条）位置，已有的横幅1、2整体向上移动空位给横幅3——三条横幅从上到下依次为动效折叠测试1、动效折叠测试2、动效折叠测试3，排列紧凑、⽆重叠');

    // 2.3 发送超过3条通知，查看折叠动效：未被折叠的通知整体向上移动至合适位置，最早的横幅被折叠
    await system.exec(`notify-send "动效折叠测试4" "第4条折叠动效测试通知" -t 300000`);
    await new Promise(resolve => setTimeout(resolve, 2500));
    await system.exec(`notify-send "动效折叠测试5" "第5条折叠动效测试通知" -t 300000`);
    await new Promise(resolve => setTimeout(resolve, 3500));
    await agent.logScreenshot('步骤2-通知横幅折叠动效');
    await agent.aiAssert('折叠动效完成后：桌面右下角未被折叠的通知整体向上移动⾄合适位置——未被折叠的三条横幅从上到下依次为动效折叠测试3、动效折叠测试4、动效折叠测试5，排列紧凑、⽆重叠；最早的动效折叠测试1、动效折叠测试2已被折叠不再显示');

    // 步骤 3: 删除一个通知横幅，查看删除效果
    // 先清空所有通知，确保新通知能进入暂驻区域
    await clearNotifications(agent, device, system);
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 发送一条独立应用名的通知，横幅显示在桌面右下角
    await system.exec(`notify-send -a 'deletetest' "删除动效测试" "删除这条通知查看删除动效" -t 300000`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiWaitFor('桌面右下角出现一条通知横幅，标题为"删除动效测试"', { timeoutMs: 15000 });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 直接悬浮到桌面右下角的横幅通知上，点击横幅上的删除按钮（重试提升稳定性）
    let deleted = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await agent.aiHover('桌面右下角标题为"删除动效测试"的通知横幅', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1500));
        await agent.aiTap('该横幅右上角的关闭按钮', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 3000));
        const isGone = await agent.aiBoolean('桌面右下角看不到标题为"删除动效测试"的通知横幅');
        if (isGone) {
          deleted = true;
          break;
        }
        console.log(`第${attempt}次删除失败，横幅仍存在，重试`);
      } catch (e) {
        console.log(`第${attempt}次删除操作异常: ${e.message}`);
      }
    }
    if (!deleted) {
      console.log('三次删除操作均未确认成功，继续执行删除结果断言');
    }
    // 清理误点击可能还原的窗口，保证断言截图干净（showDesktop不影响通知横幅显示）
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.logScreenshot('步骤3-通知横幅删除动效');
    await agent.aiAssert('删除动效完成后：桌面右下角标题为"删除动效测试"的通知横幅已被删除（从当前位置从左往右向屏幕右侧移出⾄屏幕外后消失），桌面右下角看不到该横幅');

    // 步骤 3.5: 多条通知横幅时，删除中间一条，查看剩余通知整体靠下补位效果
    // 发送3条通知，形成3条横幅（从上到下：补位测试1、补位测试2、补位测试3）
    await system.exec(`notify-send "补位测试1" "第1条补位测试通知" -t 300000`);
    await new Promise(resolve => setTimeout(resolve, 2500));
    await system.exec(`notify-send "补位测试2" "第2条补位测试通知" -t 300000`);
    await new Promise(resolve => setTimeout(resolve, 2500));
    await system.exec(`notify-send "补位测试3" "第3条补位测试通知" -t 300000`);
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiWaitFor('桌面右下角出现三条通知横幅，最下方一条标题为"补位测试3"', { timeoutMs: 20000 });

    // 悬浮到中间那条横幅（补位测试2）上，点击关闭按钮删除（重试提升稳定性）
    let middleDeleted = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await agent.aiHover('桌面右下角三条通知横幅中中间的那条，标题为"补位测试2"', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1500));
        await agent.aiTap('标题为"补位测试2"的横幅右上角的关闭按钮', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 3000));
        const middleGone = await agent.aiBoolean('桌面右下角是否看不到标题为"补位测试2"的通知横幅，且仍能看到"补位测试1"和"补位测试3"两条横幅');
        if (middleGone) {
          middleDeleted = true;
          break;
        }
        console.log(`第${attempt}次删除中间横幅失败，重试`);
      } catch (e) {
        console.log(`第${attempt}次删除中间横幅操作异常: ${e.message}`);
      }
    }
    if (!middleDeleted) {
      console.log('三次删除中间横幅均未确认成功，继续执行补位结果断言');
    }
    // 清理误点击可能还原的窗口，保证断言截图干净（showDesktop不影响通知横幅显示）
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.logScreenshot('步骤3.5-删除中间横幅补位动效');
    await agent.aiAssert('删除中间横幅动效完成后：被删除的中间横幅（补位测试2）已从当前位置从左往右向屏幕右侧移出⾄屏幕外后消失；剩余通知整体靠下进⾏补位——桌面右下角从上到下仅显示"补位测试1"、"补位测试3"两条横幅，补位测试3位于最下⽅（最后⼀条）位置，两条横幅排列紧凑、⽆空位残留');

    // 步骤 4: 等待非常驻通知自动消失，查看消失效果
    // 清空步骤3.5遗留的通知横幅，确保步骤4为独立的单横幅超时场景
    await clearNotifications(agent, device, system);
    // 发送一条短超时的通知，等待自动消失
    // 先将鼠标移离右下角横幅区域，避免鼠标悬浮暂停横幅的自动消失计时
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec('notify-send "超时消失测试" "等待自动消失" -t 8000');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiWaitFor('桌面右下角出现一条通知横幅，标题为"超时消失测试"', { timeoutMs: 10000 });
    await agent.logScreenshot('步骤4-通知横幅出现');
    // 等待通知自动超时消失（若横幅仍在，可能是鼠标悬浮导致计时暂停，移开鼠标后继续等待）
    for (let waitRound = 1; waitRound <= 3; waitRound++) {
      await new Promise(resolve => setTimeout(resolve, 9000));
      const gone = await agent.aiBoolean('桌面右下角是否已看不到标题为"超时消失测试"的通知横幅');
      if (gone) break;
      console.log(`第${waitRound}轮等待后横幅仍显示，移开鼠标后继续等待`);
      await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
    }
    // 清理误点击可能还原的窗口，保证断言截图干净（showDesktop不影响通知横幅显示）
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.logScreenshot('步骤4-通知横幅超时消失动效');
    await agent.aiAssert('桌面右下角看不到标题为"超时消失测试"的通知横幅（已自动消失，从当前位置移动出屏幕外；剩余通知整体靠下进⾏补位）');
  }, { timeout: 600000, tags: ['1957849', 'level4'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await uos.showDesktop();
  });
});
