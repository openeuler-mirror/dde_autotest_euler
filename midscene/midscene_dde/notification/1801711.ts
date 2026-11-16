/**
 * 用例 PMSID: 1801711
 * 用例标题: 【通知中心】通知中心鼠标悬浮到折叠通知信息上，tab键和回车键功能与需求一致
 * 生成时间: 2026-09-07 15:00:00
 * 用例编写人: UT000327(秦家喜)
 */

describe('1801711-【通知中心】通知中心鼠标悬浮到折叠通知信息上，tab键和回车键功能与需求一致', () => {
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

  test('1801711-【通知中心】通知中心鼠标悬浮到折叠通知信息上，tab键和回车键功能与需求一致', async ({ device, agent, uos, system }) => {
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 用两个不同的应用名发送多条通知，形成折叠通知信息
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

    // 鼠标悬浮到第一条通知信息上，出现"清除通知"（×关闭）按钮
    await agent.aiHover('通知中心列表中最上方的通知条目', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤 1: 按tab键移动焦点
    for (let i = 0; i < 4; i++) {
      await device.pressKey('tab');
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    // 检查1: 焦点能选中按钮，通知条目右上角展示关闭/清除（×）按钮
    await agent.aiAssert('通知条目右上角显示关闭或清除（×）按钮');

    // 步骤 2: 焦点选中按钮后，按回车键
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 检查2: 清除此应用的所有通知消息，通知中心不收起，后面的通知往上方补位
    await agent.aiAssert('通知中心未收起，剩余通知条目正常展示');
  }, { timeout: 600000, tags: ['1801711', 'level3'] });

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
