/**
 * 用例 PMSID: 1801615
 * 用例标题: 【通知中心】调整任务栏高度，通知中心间距正常
 * 生成时间: 2026-07-27 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1801615-【通知中心】调整任务栏高度，通知中心间距正常', () => {
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

  test('1801615-调整任务栏高度检查通知中心边距', async ({ device, agent, system, uos }) => {
    await system.exec(dbSet('HideMode', 0));
    await new Promise(resolve => setTimeout(resolve, 1000));

    await uos.showDesktop();
    await system.exec(`notify-send -t 0 "通知1" "测试通知"`);
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
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec(dbSet('WindowSizeEfficient', 100));
    await new Promise(resolve => setTimeout(resolve, 1500));
    await checkNC('任务栏在下高度100');

    await system.exec(dbSet('Position', 0));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec(dbSet('WindowSizeEfficient', 37));
    await new Promise(resolve => setTimeout(resolve, 1500));
    await checkNC('任务栏在上高度37');

    await system.exec(dbSet('Position', 1));
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec(dbSet('WindowSizeEfficient', 100));
    await new Promise(resolve => setTimeout(resolve, 1500));
    await checkNC('任务栏在右高度100');
  }, { timeout: 300000, tags: ['1801615', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(dbSet('Position', 2));
    await new Promise(resolve => setTimeout(resolve, 3000));
    await system.exec(dbSet('WindowSizeEfficient', 56));
    await system.exec(dbSet('HideMode', 0));
    await new Promise(resolve => setTimeout(resolve, 3000));
    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});