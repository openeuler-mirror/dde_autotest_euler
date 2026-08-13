/**
 * 用例 PMSID: 1987099
 * 用例标题: 【控制中心】【系统更新】【公网】更新设置页面，传递优化、下载限速、上传限速设置项默认展示
 * 生成时间: 2026-06-01 10:00:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1987099-【控制中心】【系统更新】【公网】更新设置页面，传递优化、下载限速、上传限速设置项默认展示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.openApp("控制中心", {maximizeWindow: true});
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1987099-传递优化下载限速上传限速设置项默认展示', async ({ device, agent, uos }) => {
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'有可用的更新'或'重新检查更新'文字可见", {timeoutMs: 30000});
    await agent.aiTap("更新设置", { deepThink: true });
    await agent.aiWaitFor("'更新类型'文字可见");
    await agent.aiWaitFor("'展开'文字可见");
    await agent.aiTap("'展开'文字", { deepThink: true });
    await agent.aiWaitFor("'收起'文字可见");

    await agent.aiAssert("传递优化设置项默认展示，开关是开启状态");
    await agent.aiAssert("传递优化-下载限速子设置项默认展示，复选框默认不勾选，输入框置灰不可编辑，默认数值展示10240");  
    await agent.aiAssert("传递优化-上传限速子设置项默认展示，复选框默认不勾选，输入框置灰不可编辑，默认数值展示10240");
  }, { timeout: 1200000, tags: ['1987099', 'level1', 'smoke'] });

  afterEach(async ({ device, system, agent }) => { 
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
  });
});
