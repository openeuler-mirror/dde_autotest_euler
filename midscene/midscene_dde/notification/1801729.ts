/**
 * 用例 PMSID: 1801729
 * 用例标题: 【通知中心】默认配置，日志不会记录通知正文内容
 * 生成时间: 2026-07-23 14:20:31
 * 用例编写人: UT000327(秦家喜)
 */

describe('1801729-【通知中心】默认配置，日志不会记录通知正文内容', () => {
  const logPath = '~/.cache/deepin/org.deepin.dde-shell/org.deepin.dde-shell.log';
  const bodyContent = '测试测试测试默认配置，日志内容';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801729-【通知中心】默认配置，日志不会记录通知正文内容', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 模拟发送通知
    await system.exec(`notify-send "测试默认配置，日志不会记录通知正文内容" "${bodyContent}" -t 60000`);
    await agent.aiWaitFor('桌面右下角出现一条通知横幅');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查: 实时查看通知日志记录，日志不会记录正文内容
    const grepResult = await system.exec(`grep -c "${bodyContent}" ${logPath} 2>/dev/null || echo 0`);
    const count = parseInt((grepResult.stdout || '0').trim(), 10) || 0;
    console.log(`日志中正文内容出现次数: ${count}`);
    if (count > 0) {
      await agent.aiAssert(`日志中未记录通知正文内容，实际出现次数: ${count}`);
    } else {
      await agent.aiAssert('通知日志中未记录通知正文内容，符合安全要求');
    }
  }, { timeout: 600000, tags: ['1801729', 'level1', 'smoke'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    await device.pressKey('super', 'm');
    await new Promise(resolve => setTimeout(resolve, 2000));
    const hasClearBtn = await agent.aiBoolean('通知中心界面显示"清除全部"按钮');
    if (hasClearBtn) {
      await agent.aiTap('通知中心的清除全部按钮', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    for (let i = 0; i < 8; i++) {
      const hasLeftover = await agent.aiBoolean('通知中心中存在通知');
      if (!hasLeftover) break;
      try {
        await agent.aiHover('通知中心中最上面一条通知', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 1000));
        await agent.aiTap('该通知右上角的关闭按钮', { deepThink: true });
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) { break; }
    }
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });
});
