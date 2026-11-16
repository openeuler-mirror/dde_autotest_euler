/**
 * 用例 PMSID: 1801719
 * 用例标题: 【通知中心】通知中心展开折叠信息，tab键和回车键功能与需求一致
 * 生成时间: 2026-09-07 15:00:00
 * 用例编写人: UT000327(秦家喜)
 */

describe('1801719-【通知中心】通知中心展开折叠信息，tab键和回车键功能与需求一致', () => {
  const caseDir = process.env.TESTCASE_DIR || '/home/uos/midscene-uos-latest-x86_64/apps/';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.releaseAllKeys();
  });

  test('1801719-【通知中心】通知中心展开折叠信息，tab键和回车键功能与需求一致', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 用两个不同的真实应用名发送通知，形成折叠信息
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -a 'dde-control-center' '控制中心通知' '这是第${i}条控制中心通知' -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    for (let i = 1; i <= 3; i++) {
      await system.exec(`notify-send -a 'org.deepin.browser' '浏览器通知' '这是第${i}条浏览器通知' -t 1000`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    await new Promise(resolve => setTimeout(resolve, 6000));

    // 打开通知中心
    await device.pressKey('super', 'm');
    await agent.aiWaitFor('通知中心界面已显示', { timeoutMs: 20000 });
    await agent.aiWaitFor('通知中心列表中显示通知信息', { timeoutMs: 15000 });

    // 展开第一条通知信息
    await agent.aiTap('通知中心列表中最上方的通知条目', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤 1: 多次按tab键，焦点在通知条目上移动
    for (let i = 0; i < 3; i++) {
      await device.pressKey('tab');
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    await agent.aiAssert('通知中心界面正常展示通知列表');

    // 步骤 2: tab键切换焦点，按回车键
    await device.pressKey('tab');
    await new Promise(resolve => setTimeout(resolve, 600));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('通知中心未关闭');

    // 步骤 3: 右键通知条目唤出设置菜单
    await agent.aiRightClick('通知中心列表中最上方的通知条目', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('通知条目已唤出操作菜单');
    await device.pressKey('Escape');
    await new Promise(resolve => setTimeout(resolve, 800));

    // 步骤 4: 按 Enter 触发清除或操作
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('通知中心未收起，剩余通知正常展示');
  }, { timeout: 600000, tags: ['1801719', 'level3'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await agent.aiTap('任务栏没有图标的区域', { deepThink: true });
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
    const { clearNotifications } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await clearNotifications(agent, device, system);
    await device.releaseAllKeys();
    await uos.showDesktop();
  });
});
