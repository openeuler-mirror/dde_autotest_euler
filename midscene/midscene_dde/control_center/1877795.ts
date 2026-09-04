
/**
 * 用例 PMSID: 1877795
 * 用例标题: 【控制中心】【系统更新】更新设置页面，下载限速开关开启，输入非阿拉伯数字字符，无法输入
 * 生成时间: 2026-02-04 15:21:27
 * 用例编写人: UT001924（李鹤）
 */

describe('1877795-【控制中心】【系统更新】更新设置页面，下载限速开关开启，输入非阿拉伯数字字符，无法输入', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1877795-【控制中心】【系统更新】更新设置页面，下载限速开关开启，输入非阿拉伯数字字符，无法输入', async ({ device, agent, uos }) => {
    // 打开控制中心并最大化
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 进入更新设置页面
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'有可用的更新'或'重新检查更新'文字可见", {timeoutMs: 30000});
    await agent.aiTap("更新设置", { deepThink: true });
    // 确认进入更新设置页面后，点击高级设置展开控件
    await agent.aiWaitFor("'展开'文字可见");
    await agent.aiTap("'展开'文字", { deepThink: true });
    await agent.aiWaitFor("'收起'文字可见"); 
    // 打开下载限速开关
    await agent.aiTap("'下载限速'区域开关");
    await agent.aiWaitFor("'限速设置'文字可见");
    // 选中下载限速输入框，全选后输入值
    await agent.aiTap("限速设置'区域输入框");
    await device.pressKey("ctrl", "a");
    await device.typeText("wqfsd!@!#@");
    // 断言不支持非阿拉伯数字输入
    await agent.aiAssert("限速设置区域输入框中不显示'wqfsd!@!#@'");
  }, { timeout: 600000, tags: ['1877795', 'level4'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const resetDownloadSpeedLimitCmd = "busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 \
      org.deepin.dde.Lastore1.Updater SetDownloadSpeedLimit s \
      '{\"DownloadSpeedLimitEnabled\":false,\"LimitSpeed\":\"1024\"}'";
    // 关闭下载限速开关恢复默认值
    system.exec(resetDownloadSpeedLimitCmd);
    // 恢复默认窗口大小(控制中心)
    await device.pressKey("super", "Down");
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
