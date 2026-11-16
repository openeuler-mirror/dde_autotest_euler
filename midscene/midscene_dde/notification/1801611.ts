/**
 * 用例 PMSID: 1801611
 * 用例标题: 【通知中心】隐藏和显示下方任务栏，打开通知中心，边距符合要求
 * 生成时间: 2026-07-27 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1801611-【通知中心】隐藏和显示下方任务栏，打开通知中心，边距符合要求', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const dbSet = (prop, val) =>
    `dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:${prop} variant:int32:${val}`;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);

    console.log('确保任务栏在底部');
    await system.exec(dbSet('Position', 2));
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801611-隐藏和显示下方任务栏检查通知中心边距', async ({ device, agent, system, uos }) => {
    await system.exec(dbSet('Position', 2));
    await system.exec(dbSet('HideMode', 0));
    await new Promise(resolve => setTimeout(resolve, 1000));

    await uos.showDesktop();
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -t 0 "应用${i}通知" "应用${i}的第1条通知"`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await system.exec(`notify-send -t 0 "应用${i}通知" "应用${i}的第2条通知"`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    await new Promise(resolve => setTimeout(resolve, 2000));

    const checkNC = async (label) => {
      await device.pressKey('super', 'm');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await agent.aiAssert('通知中心面板展示正常，边距合理无异常');
      console.log(`${label}: 通知中心面板展示正常`);
      await device.pressKey('super', 'm');
      await new Promise(resolve => setTimeout(resolve, 500));
    };

    await system.exec(dbSet('Position', 2));
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec(dbSet('HideMode', 1));
    await new Promise(resolve => setTimeout(resolve, 3000));
    await checkNC('隐藏');

    await system.exec(dbSet('HideMode', 0));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await checkNC('显示');
  }, { timeout: 300000, tags: ['1801611', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(dbSet('Position', 2));
    await system.exec(dbSet('HideMode', 0));
    await new Promise(resolve => setTimeout(resolve, 3000));
    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});