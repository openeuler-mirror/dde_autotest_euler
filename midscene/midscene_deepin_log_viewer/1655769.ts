/**
 * 用例 PMSID: 1655769
 * 用例标题: 搜索框功能正常
 * 生成时间: 2026-04-26
 * 用例编写人: UT006165（李日华）
 */

describe('1655769-搜索框功能正常', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1655769-搜索框功能正常', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开日志收集工具，日志收集工具可以正常打开
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具已显示");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 点击标题栏上的搜索框，输入launch，日志显示进程有launch进程
    await agent.aiTap("标题栏上的搜索框");
    await device.typeText("launch", false);
    await agent.aiWaitFor("日志显示进程有launch进程");
    await agent.aiAssert("日志显示进程有launch进程");

    // 步骤 3: 输入ppppppppp，日志内容显示为空
    await agent.aiTap("标题栏上的搜索框");
    // 清空原有内容
    await device.pressKey("Control+A");
    await device.pressKey("Backspace");
    await device.typeText("ppppppppp", false);
    await agent.aiWaitFor("日志内容显示为空");
    await agent.aiAssert("日志内容显示为空");

    // 步骤 4: 清空输入内容，日志内容正常刷新显示
    await agent.aiTap("标题栏上的搜索框");
    await device.pressKey("Control+A");
    await device.pressKey("Backspace");
    await agent.aiWaitFor("日志内容正常刷新显示");
    await agent.aiAssert("日志内容正常刷新显示");

  }, { timeout: 500000, tags: ['1655769', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
  });

});
