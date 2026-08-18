
/**
 * 用例 PMSID: 1803299
 * 用例标题: 【控制中心】【系统】【辅助信息】“开源软件声明”界面正常展示
 * 生成时间: 2025-12-17 16:52:37
 * 用例编写人: UT001924(李鹤)
 */

describe('1803299-【控制中心】【系统】【辅助信息】“开源软件声明”界面正常展示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1803299-【控制中心】【系统】【辅助信息】“开源软件声明”界面正常展示', async ({ device, agent, uos }) => {
    // 打开控制中心并最大化
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 等待开源软件声明菜单出现并点击进入开源软件声明页面
    await agent.aiWaitFor("'开源软件声明'文字可见");
    await agent.aiTap("'开源软件声明'", { deepThink: true });
    // 确认已经进入开源软件声明页面并检查页面元素展示
    await agent.aiWaitFor("'Open Source Software Notice'文字可见");
    await agent.aiAssert("开源软件声明正常展示且内容为英文");
  }, { timeout: 1200000, tags: ['1803299', 'level1', 'smoke'] });

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
