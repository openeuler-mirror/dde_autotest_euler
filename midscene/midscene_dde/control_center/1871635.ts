
/**
 * 用例 PMSID: 1871635
 * 用例标题: 【控制中心】【系统】【辅助信息】关于本机页面版本授权是待激活状态，点击激活按钮正常弹出授权管理页面
 * 生成时间: 2025-12-18 13:27:17
 * 用例编写人: UT001924(李鹤)
 */

describe('1871635-【控制中心】【系统】【辅助信息】关于本机页面版本授权是待激活状态，点击激活按钮正常弹出授权管理页面', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 修改激活网址让系统变为待激活状态
    // 定义需要使用的变量
    const deactivateSystemCmd = "uos-activator-cmd -s --kms kms.uniontech.com:8900:Vlc1cGIyNTBaV05v1";
    // 修改系统激活kms地址为不存在地址，使系统失活
    system.exec(deactivateSystemCmd);
  });

  test('1871635-【控制中心】【系统】【辅助信息】关于本机页面版本授权是待激活状态，点击激活按钮正常弹出授权管理页面', async ({ device, agent, uos }) => {
    // 打开控制中心并最大化
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 等待关于本机菜单出现后点击进入关于本机页面
    await agent.aiWaitFor("'关于本机'文字可见");
    await agent.aiTap("关于本机", { deepThink: true });
    // 确认已经进入关于本机页面
    await agent.aiWaitFor("'版本授权'文字可见");
    // 点击激活并确认授权管理页面弹出
    await agent.aiTap("激活", {maximizeWindow: true});
    await agent.aiAssert("授权管理页面已弹出,'授权模式'文字可见");
  }, { timeout: 1200000, tags: ['1871635', 'level2', 'smoke'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭当前窗口-授权管理页面
    await device.pressKey("alt", "F4");
    // 恢复窗口默认大小(控制中心)
    await device.pressKey("super", "Down");
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
    // 定义需要使用的变量
    const activateSystemCmd = "uos-activator-cmd -s --kms kms.uniontech.com:8900:Vlc1cGIyNTBaV05v";
    // 恢复系统激活状态
    system.exec(activateSystemCmd);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
