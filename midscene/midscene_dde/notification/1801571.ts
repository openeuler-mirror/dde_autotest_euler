/**
 * 用例 PMSID: 1801571
 * 用例标题: 【通知中心】任务栏在右，隐藏或显示通知横幅区域右边边框间距正常
 * 生成时间: 2026-07-28 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1801571-【通知中心】任务栏在右，隐藏或显示通知横幅区域右边边框间距正常', () => {
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

  test('1801571-隐藏或显示右方任务栏检查通知横幅间距', async ({ device, uos, agent, system }) => {
    await system.exec(dbSet('Position', 1));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec(dbSet('HideMode', 0));
    await new Promise(resolve => setTimeout(resolve, 1000));

    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 500));
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -t 0 "通知${i}" "第${i}条常驻通知"`);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    await new Promise(resolve => setTimeout(resolve, 3000));

    await system.exec(dbSet('HideMode', 1));
    await new Promise(resolve => setTimeout(resolve, 3000));
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('通知横幅区域展示正常，无异常');

    await system.exec(dbSet('HideMode', 0));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('通知横幅区域展示正常，无异常');
  }, { timeout: 300000, tags: ['1801571', 'level3'] });

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
