
/**
 * 用例 PMSID: 1878143
 * 用例标题: 【控制中心】【系统更新】更新设置页面，开启自动下载开关，出现闲时下载选项
 * 生成时间: 2026-01-22 09:05:46
 * 用例编写人: UT001924(李鹤)
 */

describe('1878143-【控制中心】【系统更新】更新设置页面，开启自动下载开关，出现闲时下载选项', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1878143-【控制中心】【系统更新】更新设置页面，开启自动下载开关，出现闲时下载选项', async ({ device, agent, uos }) => {
    // 打开控制中心并进入系统更新页面
    await uos.openApp("控制中心");
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'有可用的更新'或'您的系统已经是最新的'文字可见", {timeoutMs: 30000});
    // 点击更新设置进入更新设置页面
    await agent.aiTap("更新设置", { deepThink: true });
    await agent.aiWaitFor("'展开'文字可见");
    // 点击高级设置的展开按钮展开高级设置项
    await agent.aiTap("'展开'文字", { deepThink: true });
    await agent.aiWaitFor("'收起'文字可见");
    // 确认默认状态闲时下载选项不展开
    await agent.aiAssert("'闲时下载'文字不可见");
    // 打开自动下载开关展示闲时下载选项
    await agent.aiTap("'自动下载'区域开关", { deepThink: true });
    // 检查闲时下载选项展示元素
    await agent.aiAssert("'闲时下载'左边的复选框未勾选,开始时间为17:00,结束时间为20:00");
  }, { timeout: 600000, tags: ['1878143', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭自动下载开关恢复默认状态
    system.exec("busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Updater SetAutoDownloadUpdates b 0")
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
