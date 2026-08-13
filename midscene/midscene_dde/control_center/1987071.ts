/**
 * 用例 PMSID: 1987071
 * 用例标题: 【控制中心】【系统更新】【公网】修改过传递优化配置项的下载限速数值，打开开关，展示修改的值
 * 生成时间: 2026-06-01 10:00:00
 * 用例编写人:UT000327(秦家喜)
 */

describe('1987071-【控制中心】【系统更新】【公网】修改过传递优化配置项的下载限速数值，打开开关，展示修改的值', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.openApp("控制中心", {maximizeWindow: true});
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1987071-修改过下载限速数值打开开关展示修改的值', async ({ device, agent, uos }) => {
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'有可用的更新'或'重新检查更新'文字可见", {timeoutMs: 30000});
    await agent.aiTap("更新设置", { deepThink: true });
    await agent.aiWaitFor("'更新类型'文字可见");
    await agent.aiWaitFor("'展开'文字可见");
    await agent.aiTap("'展开'文字", { deepThink: true });
    await agent.aiWaitFor("'收起'文字可见");

    await agent.aiAssert("传递优化开关为开启状态");
    await agent.aiTap("'传递优化-下载限速'区域复选框");    
    await agent.aiWaitFor("'传递优化-下载限速'区域输入框可编辑");

    await agent.aiTap("'传递优化-下载限速'区域输入框");
    await device.pressKey("ctrl", "a");
    await device.typeText("50000");
    await device.pressKey("Tab");
    await agent.aiAssert("传递优化-下载限速输入框显示50000");
  }, { timeout: 600000, tags: ['1987071', 'level3'] });

  afterEach(async ({ device, system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const resetDownloadSpeedLimitCmd = "busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 \
      org.deepin.dde.Lastore1.Updater SetDeliveryDownloadSpeedLimit s \
      '{\"SpeedLimitEnabled\":true,\"LimitSpeed\":\"10240\",\"IsOnlineSpeedLimit\":false}'";
    system.exec(resetDownloadSpeedLimitCmd);
    await agent.aiTap("'传递优化-下载限速'区域复选框");
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow();
  });
});
