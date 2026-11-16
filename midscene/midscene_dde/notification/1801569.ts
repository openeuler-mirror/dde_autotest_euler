/**
 * 用例 PMSID: 1801569
 * 用例标题: 【通知中心】任务栏在下，隐藏或显示通知横幅区域底部边框间距正常
 * 生成时间: 2026-08-03 17:10:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1801569-【通知中心】任务栏在下，隐藏或显示通知横幅区域底部边框间距正常', () => {
  const delay = (ms) => new Promise(r => setTimeout(r, ms));
  const dbSet = (prop, val) =>
    `dbus-send --session --dest=org.deepin.dde.daemon.Dock1 --type=method_call /org/deepin/dde/daemon/Dock1 org.freedesktop.DBus.Properties.Set string:"org.deepin.dde.daemon.Dock1" string:${prop} variant:int32:${val}`;

  beforeAll(async ({ device, uos, agent, system }) => {
    const { clearNotifications } = await import(`${process.env.TESTCASE_DIR}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await delay(3000);

    console.log('确保任务栏在底部');
    await system.exec(dbSet('Position', 2));
    await delay(3000);

    await uos.showDesktop();
  });

  beforeEach(async () => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801569-隐藏或显示任务栏检查通知横幅底部间距', async ({ device, uos, agent, system }) => {
    console.log('步骤1: 设置任务栏在底部，高度默认56，一直显示');
    await agent.aiHover('桌面空白区域，无应用图标的区域');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec(dbSet('Position', 2));
    await system.exec(dbSet('WindowSizeEfficient', 56));
    await system.exec(dbSet('HideMode', 0));
    await delay(1000);

    console.log('步骤2: 显示桌面，发送5条常驻通知');
    await uos.showDesktop();
    await delay(500);
    for (let i = 1; i <= 5; i++) {
      await system.exec(`notify-send -t 0 "通知${i}" "第${i}条常驻通知"`);
      await delay(300);
    }
    await delay(2000);

    console.log('步骤3: 隐藏任务栏，检查横幅间距');
    await system.exec(dbSet('HideMode', 1));
    await delay(3000);
    await uos.showDesktop();
    await agent.aiAssert('通知横幅区域展示正常，无异常，通知的上方有多层多余的通知卡片顶部边缘');

    console.log('步骤4: 显示任务栏，检查横幅间距');
    await system.exec(dbSet('HideMode', 0));
    await delay(2000);
    await uos.showDesktop();
    await agent.aiAssert('通知横幅区域展示正常，无异常，通知的上方有多层多余的通知卡片顶部边缘');

    console.log('步骤5: 反复隐藏显示任务栏4轮');
    for (let i = 1; i <= 2; i++) {
      console.log(`  第${i}轮: 隐藏任务栏`);
      await system.exec(dbSet('HideMode', 1));
      await delay(3000);
      await uos.showDesktop();
      await agent.aiAssert('通知横幅区域展示正常，无异常，通知的上方有多层多余的通知卡片顶部边缘');

      console.log(`  第${i}轮: 显示任务栏`);
      await system.exec(dbSet('HideMode', 0));
      await delay(2000);
      await uos.showDesktop();
      await agent.aiAssert('右下角的通知区域，可以看到有三条通知，在最上方通知的顶部，还露出了多层多余的通知卡片顶部边缘');
    }
  }, { timeout: 500000, tags: ['1801569', 'level3'] });

  afterEach(async () => {
    console.log('1. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('恢复任务栏位置到底部');
    await system.exec(dbSet('Position', 2));
    await delay(3000);

    const { clearNotifications } = await import(`${process.env.TESTCASE_DIR}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await delay(3000);
  });
});
