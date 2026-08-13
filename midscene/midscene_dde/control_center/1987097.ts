/**
 * 用例 PMSID: 1987097
 * 用例标题: 【控制中心】【系统更新】【公网】更新设置页面，传递优化设置项下方展示信息与需求一致
 * 生成时间: 2026-06-01 10:00:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1987097-【控制中心】【系统更新】【公网】更新设置页面，传递优化设置项下方展示信息与需求一致', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.openApp("控制中心", {maximizeWindow: true});
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1987097-传递优化设置项下方展示信息与需求一致', async ({ device, agent, uos }) => {
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'有可用的更新'或'重新检查更新'文字可见", {timeoutMs: 30000});
    await agent.aiTap("更新设置", { deepThink: true });
    await agent.aiWaitFor("'更新类型'文字可见");
    await agent.aiWaitFor("'展开'文字可见");
    await agent.aiTap("'展开'文字", { deepThink: true });
    await agent.aiWaitFor("'收起'文字可见");

    await agent.aiAssert("传递优化配置项下方展示信息：开启此功能，你的设备可能会将以前下载的部分系统更新发送到本地网络的设备上。关闭此功能后，将在重启时清除更新传递优化时缓存的文件");
  }, { timeout: 1200000, tags: ['1987097', 'level1', 'smoke'] });

  afterEach(async ({ device, system, agent }) => { 
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
  });
});
