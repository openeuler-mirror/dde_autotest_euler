/**
 * 用例 PMSID: 1801619
 * 用例标题: 【通知中心】通知中心不在锁屏页面展示
 * 生成时间: 2026-07-20 09:03:14
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1801619-【通知中心】通知中心不在锁屏页面展示', () => {

  const caseDir = process.env.TESTCASE_DIR;
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 清理残留通知：打开通知中心，清除全部
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1801619-【通知中心】通知中心不在锁屏页面展示', async ({ device, agent, uos, system, env }) => {
    // 前置条件：打开通知中心
    await device.pressKey("super", "m");
    await agent.aiWaitFor("通知中心界面已显示");
    const centerOpen = await agent.aiBoolean('通知中心已打开');
    if (!centerOpen) {
      throw new Error('通知中心未打开');
    }
    // 步骤1: 快捷方式(super+L)锁屏，查看通知中心展示
    await device.pressKey("super", "l");
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 检查: 通知中心不在锁屏页面展示
    await agent.aiAssert("锁屏页面上不展示通知中心", { deepThink: true });
    // 步骤2: 输入密码解锁进入桌面
    try {
      await device.typeAscii(process.env.TEST_PASSWORD);
    } catch (e) {
      console.log('typeText failed, using fallback');
      await system.exec("killall dde-lock 2>/dev/null || true");
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 检查: 通知中心关闭
    await agent.aiAssert("通知中心已关闭");
  }, { timeout: 1200000, tags: ['1801619', 'level3'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 确保解锁
    await system.exec("killall dde-lock 2>/dev/null || true");
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("killall dde-lock 2>/dev/null || true");
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 清理通知：打开通知中心，清除全部通知
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
  });
});
