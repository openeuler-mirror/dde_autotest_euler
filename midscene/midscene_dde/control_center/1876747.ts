
/**
 * 用例 PMSID: 1876747
 * 用例标题: 【控制中心】【电源管理】【使用电源】【台式机】使用电源界面显示检查
 * 生成时间: 2025-12-18 08:44:31
 * 用例编写人: UT001924(李鹤)
 */

describe('1876747-【控制中心】【电源管理】【使用电源】【台式机】使用电源界面显示检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1876747-【控制中心】【电源管理】【使用电源】【台式机】使用电源界面显示检查', async ({ device, agent, uos }) => {
    // 打开控制中心并进入电源管理页面
    await uos.openApp("控制中心", {maximizeWindow: true});
    await agent.aiWaitFor("'电源管理'文字可见");
    await agent.aiTap("'电源管理'", { deepThink: true });
    await agent.aiWaitFor("'使用电源'文字可见");
    // 点击使用电源菜单进入使用电源页面
    await agent.aiTap("'使用电源'", { deepThink: true });
    // 电源页面显示元素检查
    await agent.aiAssert("'屏幕和待机'文字可见");
    await agent.aiAssert("关闭显示器时间刻度为1m、5m、10m、15m、30m、1h、从不");
    await agent.aiAssert("关闭显示器时间默认值为15分钟", { deepThink: true });
    await agent.aiAssert("自动锁屏时间刻度为1m、5m、10m、15m、30m、1h、从不");
    await agent.aiAssert("自动锁屏时间默认值为15分钟", { deepThink: true });
    await agent.aiAssert("进入待机时间刻度为10m、15m、30m、1h、2h、3h、从不");
    await agent.aiAssert("进入待机时间默认值为30分钟", { deepThink: true });
    await agent.aiAssert("按电源按钮时右侧显示'进入关机界面'");
  }, { timeout: 1200000, tags: ['1876747', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 恢复窗口默认大小(控制中心)
    await device.pressKey("super", "Down");
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
