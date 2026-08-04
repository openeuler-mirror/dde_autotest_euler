/**
 * 用例 PMSID: 1952223
 * 用例标题: 认证日志-授权失败不显示认证日志内容
 * 生成时间: 2026-05-17
 * 用例编写人: UT006165（李日华）
 */

describe('1952223-认证日志-授权失败不显示认证日志内容', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1952223-认证日志-授权失败不显示认证日志内容', async ({ device, agent, uos, system }) => {
    // 步骤 1: 启动器打开日志收集工具
    await uos.openApp("日志收集工具");
    await agent.aiWaitFor("日志收集工具窗口打开");
    await agent.aiAssert("日志收集工具窗口已打开");

    // 步骤 2: 点击认证日志
    await agent.aiTap("认证日志");

    // 步骤 3: 弹出授权窗口
    await agent.aiWaitFor("弹出授权窗口");
    await agent.aiAssert("授权窗口已弹出");

    // 步骤 4: 点击取消按钮
    await agent.aiTap("取消按钮");

    // 步骤 5: 日志收集工具右侧日志记录区域显示无搜索结果
    await agent.aiWaitFor("无搜索结果显示");
    await agent.aiAssert("右侧日志记录区域显示无搜索结果");

  }, { timeout: 600000, tags: ['1952223', 'level2', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 杀掉日志收集工具进程
    await system.exec("pkill -f deepin-log-viewer");
  });

});
