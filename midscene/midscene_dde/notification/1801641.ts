/**
 * 用例 PMSID: 1801641
 * 用例标题: 【通知中心】通知中心长驻区域同一个应用程序产生的通知信息展示规则与需求一致
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801641-【通知中心】通知中心长驻区域同一个应用程序产生的通知信息展示规则与需求一致', () => {
  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await device.releaseAllKeys();
    // 优化前置清理：删除通知数据库并重启 dde-shell，确保通知中心无残留、面板状态干净
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801641-通知中心长驻区域同一个应用程序产生的通知信息展示规则与需求一致', async ({ device, agent, uos, system }) => {
    // 发送不同条数的通知，验证折叠条条数与通知条数一致：
    // 控制中心发2条（期望2个折叠条），终端发3条（期望3个折叠条）
    // 关键：每条通知间隔2秒发送，确保 dde-shell 通知服务完整处理每条通知并分别记录，
    // 间隔过短（如200ms）会导致通知被合并/丢弃，折叠条数量不符合预期
    for (let i = 1; i <= 2; i++) {
      await system.exec(`notify-send -a 'dde-control-center' '控制中心通知' '控制中心第${i}条通知'`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -a 'deepin-terminal' '终端通知' '终端第${i}条通知'`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    // 等待桌面通知横幅消失，通知进入通知中心长驻区域
    await new Promise(resolve => setTimeout(resolve, 8000));
    // 打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示", { timeoutMs: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查1: 通知信息按应用程序分类，不同应用通知分开排列，同一应用通知集合显示在一块
    await agent.aiAssert("通知中心标题栏下方的长驻区域中，终端应用的通知和控制中心应用的通知分别集中排列在不同区域，同一应用的通知集合显示在一起，不同应用的通知分开排列", { deepThink: true });

    // 检查2: 终端应用3条通知，最新一条展开显示在最上方，其余2条折叠为浅灰色折叠条展示在下方
    await agent.aiAssert("通知中心长驻区域中，终端应用的通知区域最上方是最新一条通知（终端第3条通知）展开显示，其下方有2个浅灰色折叠条，一共有3条通知条", { deepThink: true });

    // 检查3: 控制中心2条通知，最新一条展开显示在最上方，其余1条折叠为浅灰色折叠条展示在下方
    await agent.aiAssert("通知中心长驻区域中，控制中心应用的通知区域最上方是最新一条通知（控制中心第2条通知）展开显示，其下方有1个浅灰色折叠条，一共有2条通知条", { deepThink: true });

    // 收尾：关闭通知中心
    await device.pressKey("super", "m");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  }, { timeout: 1200000, tags: ['1801641', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    try {
      await agent.aiTap("任务栏没有图标的区域", { deepThink: true });
    } catch (e) { /* 忽略清理阶段的点击失败 */ }
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    await device.releaseAllKeys();
    // 优化后置清理：删除通知数据库并重启 dde-shell，彻底清除通知残留
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
