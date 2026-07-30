/**
 * 用例 PMSID: 1655375
 * 用例标题: 支持自选刷新频率——工具栏增加“立即刷新”按钮
 * 生成时间: 2026-04-26
 * 用例编写人: UT006165（李日华）
 */

describe('1655375-支持自选刷新频率——工具栏增加“立即刷新”按钮', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    var isAuthVisible = await agent.aiBoolean("显示查看此日志需要授权的窗口");
    if (isAuthVisible) {
      await agent.aiTap("请输入密码框", { deepThink: true });
      await device.typeText("uos12345.", false);
      await agent.aiTap("确定按钮");
    }
  });

  test('1655375-支持自选刷新频率——工具栏增加“立即刷新”按钮', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开日志收集工具,日志收集工具被打开，窗口内容正确显示
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具已显示");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 点击窗口菜单栏右侧三条横线的菜单项，弹出菜单窗口
    await agent.aiTap("窗口菜单栏右侧三条横线的菜单项");
    await agent.aiWaitFor("弹出菜单窗口");
    await agent.aiAssert("菜单窗口已弹出");

    // 步骤 3: 点击刷新频率，展开刷新频率子菜单含选项每10秒、每1分钟、5分钟、不刷新
    await agent.aiTap("刷新频率");
    await agent.aiWaitFor("刷新频率子菜单");
    await agent.aiAssert("展开刷新频率子菜单含选项每10秒、每1分钟、5分钟、不刷新");

    // 步骤 4: 点击每10秒，每10秒被选中，菜单窗口和刷新频率子菜单均关闭
    await agent.aiTap("不刷新");
    await agent.aiWaitFor("菜单窗口和刷新频率子菜单均关闭");
    await agent.aiAssert("菜单窗口和刷新频率子菜单均关闭");

    // 步骤 5: 鼠标移至工具栏从左往右第二个功能按钮“立即刷新”按钮,显示“立即刷新”提示信息
    await agent.aiHover("工具栏从左往右第二个功能按钮");
    //await agent.aiWaitFor("工具栏从左往右第二个功能按钮，其下方悬浮提示显示为“立即刷新”");
    await agent.aiAssert("工具栏从左往右第二个功能按钮，其下方悬浮提示显示为“立即刷新”");

    // 步骤 6: 点击“立即刷新”按钮，当前窗口日志内容清空后重新显示
    await agent.aiTap("立即刷新按钮");
    await agent.aiWaitFor("当前窗口日志内容刷新显示");
    await agent.aiAssert("当前窗口日志内容刷新显示");

    // 步骤 7: 点击级别筛选项后的全部，页面显示全部日志
    await agent.aiTap("级别筛选项后的下拉框");
    await agent.aiTap("全部");
    await agent.aiWaitFor("页面显示全部日志");
    await agent.aiAssert("页面显示全部日志");

    // 步骤 8: 点击工具栏上从左往右第二个功能按钮立即刷新按钮，当前窗口日志内容清空后重新显示
    await agent.aiTap("工具栏从左往右第二个功能按钮");
    await agent.aiWaitFor("当前窗口日志内容刷新显示");
    await agent.aiAssert("当前窗口日志内容刷新显示");

  }, { timeout: 600000, tags: ['1655375', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await agent.aiTap("窗口右上角关闭按钮:X");
  });

});
