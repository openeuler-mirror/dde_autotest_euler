/**
 * 用例 PMSID: 1655725
 * 用例标题: 筛选后只会显示对应类型的日志
 * 生成时间: 2026-05-18
 * 用例编写人: UT006165（李日华）
 */

describe('1655725-筛选后只会显示对应类型的日志', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1655725-筛选后只会显示对应类型的日志', async ({ device, agent, uos, system }) => {
    // 步骤 1: 启动器打开日志收集工具
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具窗口打开");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 选择"开关机事件"
    await agent.aiTap("开关机事件");

    // 步骤 3: 切换到"开关机事件"界面
    await agent.aiWaitFor("切换到开关机事件界面");
    await agent.aiAssert("已进入开关机事件页面");

    // 步骤 4: 点击事件类型后的下拉框，弹出下拉菜单，选择全部
    await agent.aiTap("事件类型下拉框");
    await agent.aiTap("全部事件选项");

    // 步骤 5: 验证显示对应分类日志信息
    await agent.aiAssert("显示对应分类日志信息");

    // 步骤 6: 点击事件类型后的下拉框，弹出下拉菜单，选择登录
    await agent.aiTap("事件类型下拉框");
    await agent.aiTap("登录事件选项");

    // 步骤 7: 验证显示Login类型日志
    await agent.aiAssert("显示Login类型日志");

    // 步骤 8: 点击事件类型后的下拉框，弹出下拉菜单，选择开机
    await agent.aiTap("事件类型下拉框");
    await agent.aiTap("事件类型下拉框下的开机事件选项");

    // 步骤 9: 验证显示Boot类型日志
    await agent.aiAssert("显示Boot类型日志");

    // 步骤 10: 点击事件类型后的下拉框，弹出下拉菜单，选择关机
    await agent.aiTap("事件类型下拉框");
    await agent.aiTap("关机事件选项");

    // 步骤 11: 验证显示Shutdown类型日志
    await agent.aiAssert("显示Shutdown类型日志");

  }, { timeout: 600000, tags: ['1655725', 'level2', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
