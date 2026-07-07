
/**
 * 用例 PMSID: 1888821
 * 用例标题: 【控制中心】【系统更新】“功能更新”，“安全更新”，“第三方仓库更新”三种更新配置开关关闭，查看控制中心-更新-检查更新页面日志展示区展示
 * 生成时间: 2026-02-06 14:30:45
 * 用例编写人: UT001924（李鹤）
 */

describe('1888821-【控制中心】【系统更新】“功能更新”，“安全更新”，“第三方仓库更新”三种更新配置开关关闭，查看控制中心-更新-检查更新页面日志展示区展示', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, env, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 定义需要使用的变量
    const PASSWD = env.testPassword;
    const disableFeatureAndSecurityUpdateCmd = "busctl --system set-property \
      org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Manager UpdateMode t 0";
    // 关闭功能和安全更新，专业版第三方更新默认关闭
    system.exec(`echo ${PASSWD} | sudo -S ${disableFeatureAndSecurityUpdateCmd}`);
  });

  test('1888821-【控制中心】【系统更新】“功能更新”，“安全更新”，“第三方仓库更新”三种更新配置开关关闭，查看控制中心-更新-检查更新页面日志展示区展示', async ({ device, agent, uos }) => {
    // 打开控制中心并最大化
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 进入系统更新页面
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    // 断言显示文案
    await agent.aiAssert("提示文案为:'开启更新内容开关，可以获得更优质的功能体验哦'");
  }, { timeout: 600000, tags: ['1888821', 'level4'] });

  afterEach(async ({ device, env, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const PASSWD = env.testPassword;
    const enableFeatureAndSecurityUpdateCmd = "busctl --system set-property \
      org.deepin.dde.Lastore1 /org/deepin/dde/Lastore1 org.deepin.dde.Lastore1.Manager UpdateMode t 5";
    // 打开功能和安全更新
    system.exec(`echo ${PASSWD} | sudo -S ${enableFeatureAndSecurityUpdateCmd}`);
    // 恢复默认窗口大小(控制中心)
    await device.pressKey("super", "Down");
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
