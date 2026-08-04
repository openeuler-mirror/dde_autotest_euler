/**
 * 用例 PMSID: 1655749
 * 用例标题: 筛选后只会显示对应周期内的日志
 * 生成时间: 2026-05-17
 * 用例编写人: UT006165（李日华）
 */

describe('1655749-筛选后只会显示对应周期内的日志', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1655749-筛选后只会显示对应周期内的日志', async ({ device, agent, uos, system }) => {
    // 步骤 1: 启动器打开日志收集工具
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具窗口打开");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 点击周期后的全部选项
    await agent.aiTap("全部周期选项");

    // 步骤 3: 全部按钮蓝色背景选中状态且显示全部日志
    await agent.aiAssert("全部按钮蓝色背景选中状态");
    await agent.aiAssert("显示全部日志");

    // 步骤 4: 选择周期后的今天
    await agent.aiTap("今天周期选项");

    // 步骤 5: 今天按钮蓝色背景选中状态且显示今天日志
    await agent.aiAssert("今天按钮蓝色背景选中状态");
    await agent.aiAssert("显示今天日志");

    // 步骤 6: 点击周期后的近三天选项
    await agent.aiTap("近三天周期选项");

    // 步骤 7: 近三天按钮蓝色背景选中状态且显示近三天日志
    await agent.aiAssert("近三天按钮蓝色背景选中状态");
    await agent.aiAssert("显示近三天日志");

    // 步骤 8: 点击周期后的近一个月选项
    await agent.aiTap("近一个月周期选项");

    // 步骤 9: 近一个月按钮蓝色背景选中状态且显示近一个月日志
    await agent.aiAssert("近一个月按钮蓝色背景选中状态");
    await agent.aiAssert("显示近一个月日志");

    // 步骤 10: 点击周期后的近三个月选项
    await agent.aiTap("近三个月周期选项");

    // 步骤 11: 近三个月按钮蓝色背景选中状态且显示近三个月日志
    await agent.aiAssert("近三个月按钮蓝色背景选中状态");
    await agent.aiAssert("显示近三个月日志");

  }, { timeout: 600000, tags: ['1655749', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
