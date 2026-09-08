
/**
 * 用例 PMSID: 1878161
 * 用例标题: 【控制中心】【系统更新】更新设置页面，取消闲时下载前面复选框的对勾，闲时下载时间段配置项置灰不可编辑
 * 生成时间: 2026-01-27 14:20:47
 * 用例编写人: UT001924(李鹤)
 */

describe('1878161-【控制中心】【系统更新】更新设置页面，取消闲时下载前面复选框的对勾，闲时下载时间段配置项置灰不可编辑', () => {

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

  test('1878161-【控制中心】【系统更新】更新设置页面，取消闲时下载前面复选框的对勾，闲时下载时间段配置项置灰不可编辑', async ({ device, agent, uos }) => {
    // 打开控制中心并最大化
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 确认出现系统更新菜单，点击菜单进入系统更新页面
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'有可用的更新'或'您的系统已经是最新的'文字可见", {timeoutMs: 30000});
    // 点击更新设置进入更新设置页面
    await agent.aiTap("更新设置", { deepThink: true });
    await agent.aiWaitFor("'更新类型'文字可见");
    // 点击高级设置展开按钮展开高级设置
    await agent.aiTap("展开", { deepThink: true });
    // 确认高级设置已经展开
    await agent.aiWaitFor("'收起'文字可见");
    // 打开自动下载开关展示闲时下载选项
    await agent.aiTap("'自动下载'区域开关", { deepThink: true});
    // 确认开关已打开
    await agent.aiWaitFor("'闲时下载'文字可见");
    // 获取闲时下载前面的复选框是否勾选bool值
    const IdleDownloadEnabled = await agent.aiBoolean("'闲时下载'前面的复选框是未勾选状态");
    // 根据闲时下载前面的复选框是否勾选做不同的操作后断言
    if (IdleDownloadEnabled) {
      console.log("闲时下载前面复现框是未勾选状态直接断言");
      // 断言时间不可编辑
      await agent.aiAssert("'闲时下载'开始时间和结束时间置灰不可编辑");
    } else {
      console.log("闲时下载前面复现框是勾选状态需要先取消勾选再断言");
      // 取消复选框的勾选后再断言时间不可编辑
      await agent.aiTap("'闲时下载'前面的复选框");
      await agent.aiWaitFor("'闲时下载'前面的复选框未勾选");
      await agent.aiAssert("闲时下载开始时间和结束时间置灰不可编辑");
    }
  }, { timeout: 600000, tags: ['1878161', 'level3'] });

  afterEach(async ({ device, system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const { resetUpdateSettings,closeAuthDialog } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await closeAuthDialog(agent, device);
    await resetUpdateSettings(system);
    // 恢复默认窗口大小(控制中心)
    await device.pressKey("super", "Down");
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
