/**
 * 用例 PMSID: 1995233
 * 用例标题: 【控制中心】【系统更新】更新设置页面，下载限速开关开启，输入框输入支持的最大值和最小值，正常输入
 * 生成时间: 2026-06-09 11:50:00
 * 用例编写人: UT001924（李鹤）
 */

describe('1995233-【控制中心】【系统更新】更新设置页面，下载限速开关开启，输入框输入支持的最大值和最小值，正常输入', () => {
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

  test('1995233-【控制中心】【系统更新】更新设置页面，下载限速开关开启，输入框输入支持的最大值和最小值，正常输入', async ({ device, agent, uos, system }) => {
    const clickSetDownloadSpeedLimit = async () => {
    await agent.aiTap({
          prompt: '点击下载限速下方的的限速设置输入框，输入框位置见"限速设置输入框"图片红框框选位置输入框，不需要关注输入框中已有的数字显示',
          images: [
              { name: '限速设置输入框', url: 'https://youqu.uniontech.com/_picture/professional-desktop/lihe/control-center/setDownloadSpeedLimit.png' }
            ],
          convertHttpImage2Base64: true,
          deepThink: true,
          });
    }
    // 步骤1: 进入控制中心-更新-更新设置界面，打开下载限速开关，输入10
    await uos.openApp("控制中心");
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    await agent.aiWaitFor("'有可用的更新'或'您的系统已经是最新的'或'开启更新内容开关'文字可见", {timeoutMs: 40000});
    await agent.aiTap("更新设置", { deepThink: true });
    // 确认进入更新设置页面后，点击高级设置展开控件
    await agent.aiWaitFor("'展开'文字可见");
    await agent.aiTap("'展开'文字", { deepThink: true });
    await agent.aiAssert("'收起'文字可见"); 
    
    // 打开下载限速开关
    await agent.aiTap({
      prompt: '点击下载限速按钮，按钮位置见"下载限速按钮"图片红框框选位置按钮，按钮颜色可能是灰色也可能是蓝色',
      images: [
          { name: '下载限速按钮', url: 'https://youqu.uniontech.com/_picture/professional-desktop/lihe/control-center/downloadSpeedLimitButton.png' }
        ],
      convertHttpImage2Base64: true,
      deepThink: true,
      });
    await agent.aiWaitFor("'限速设置'文字可见");
    // 输入最小值10
    await clickSetDownloadSpeedLimit();
    await device.pressKey("ctrl", "a");
    await device.typeText("10");
    // 焦点离开输入框
    await device.pressKey("tab");
    // 验证: 输入框显示10
    await agent.aiAssert("下载限速开关下方的限速设置输入框显示10");

    // 步骤2: 输入最大值999999
    await clickSetDownloadSpeedLimit();
    await device.pressKey("ctrl", "a");
    await device.typeText("999999");
    // 焦点离开输入框
    await device.pressKey("tab");
    // 验证: 输入框显示999999
    await agent.aiAssert("下载限速开关下方的限速设置输入框显示999999");
  }, { timeout: 600000, tags: ['1995233', 'level3'] });

  afterEach(async ({ device, system, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const { resetUpdateSettings,closeAuthDialog } = await import(`${caseDir}midscene_dde/common/common.ts`);
    await closeAuthDialog(agent, device);
    await resetUpdateSettings(system);
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});