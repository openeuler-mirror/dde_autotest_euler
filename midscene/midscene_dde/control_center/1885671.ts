
/**
 * 用例 PMSID: 1885671
 * 用例标题: 【控制中心】【系统更新】更新设置页面，勾选闲时下载后重新打开自动下载开关，闲时下载需要去勾选
 * 生成时间: 2026-02-03 11:12:18
 * 用例编写人: UT001924（李鹤）
 */

describe('1885671-【控制中心】【系统更新】更新设置页面，勾选闲时下载后重新打开自动下载开关，闲时下载需要去勾选', () => {

  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { resetUpdateSettings,closeAuthDialog } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await closeAuthDialog(agent, device);
    await resetUpdateSettings(system);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1885671-【控制中心】【系统更新】更新设置页面，勾选闲时下载后重新打开自动下载开关，闲时下载需要去勾选', async ({ device, agent, uos, system }) => {
    const clickAutoDownload = async () => {
    await agent.aiTap({
          prompt: '点击自动下载右侧按钮，按钮位置见"自动下载右侧按钮"图片红框框选位置按钮，按钮颜色可能是灰色也可能是蓝色',
          images: [
              { name: '自动下载右侧按钮', url: 'https://youqu.uniontech.com/_picture/professional-desktop/lihe/control-center/autoDownload.png' }
            ],
          convertHttpImage2Base64: true,
          deepThink: true,
          });
    }
    // 打开控制中心并最大化
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 进入更新设置页面
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'有可用的更新'或'您的系统已经是最新的'文字可见", {timeoutMs: 30000});
    await agent.aiTap("更新设置", { deepThink: true });
    // 确认进入更新设置页面后，点击高级设置展开控件
    await agent.aiWaitFor("'展开'文字可见");
    await agent.aiTap("'展开'文字", { deepThink: true });
    await agent.aiAssert("'收起'文字可见");  
    // 打开自动下载开关展示闲时下载选项
    await clickAutoDownload();
    // 恢复闲时下载默认状态和时间
    system.exec("busctl --system call org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Updater SetIdleDownloadConfig s '{\"IdleDownloadEnabled\":false,\"BeginTime\":\"17:00\",\"EndTime\":\"20:00\"}'");
    // 等待修改生效
    await agent.aiWaitFor("'闲时下载'左边的复选框是未勾选状态", {timeoutMs: 30000});
    // 勾选闲时下载
    await agent.aiTap("'闲时下载'左边的复选框");
    // 等待关闭生效
    await agent.aiWaitFor("'闲时下载'左边的复选框是勾选状态", {timeoutMs: 30000});
    // 关闭自动下载
    await clickAutoDownload();
    // 等待关闭生效
    await agent.aiWaitFor("'闲时下载'文字不可见", {timeoutMs: 30000});
    // 再次打开自动下载
    await clickAutoDownload();
    // 断言闲时下载左边的复选框是未勾选状态
    await agent.aiAssert("'闲时下载'左边的复选框是未勾选状态");
  }, { timeout: 600000, tags: ['1885671', 'level3'] });

  afterEach(async ({ device, system, agent}) => {
    console.log('4. afterEach: 每个测试后的清理');
    const { resetUpdateSettings,closeAuthDialog } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await closeAuthDialog(agent, device);
    await resetUpdateSettings(system);
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
