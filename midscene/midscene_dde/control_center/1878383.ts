
/**
 * 用例 PMSID: 1878383
 * 用例标题: 【控制中心】【系统更新】系统未激活，检查更新界面提示 “当前系统未激活，无法启动更新服务”
 * 生成时间: 2026-02-06 14:57:10
 * 用例编写人: UT001924（李鹤）
 */

describe('1878383-【控制中心】【系统更新】系统未激活，检查更新界面提示 “当前系统未激活，无法启动更新服务”', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 定义需要使用的变量
    const deactivateSystemCmd = "uos-activator-cmd -s --kms kms.uniontech.com:8900:Vlc1cGIyNTBaV05v1";
    // 修改系统激活kms地址为不存在地址，使系统失活
    system.exec(deactivateSystemCmd);
  });

  test('1878383-【控制中心】【系统更新】系统未激活，检查更新界面提示 “当前系统未激活，无法启动更新服务”', async ({ device, agent, uos }) => {
    // 打开控制中心并最大化
    await uos.openApp("控制中心", {maximizeWindow: true});
    // 进入系统更新页面
    await agent.aiWaitFor("'系统更新'文字可见");
    await agent.aiTap("系统更新", { deepThink: true });
    // 断言显示文案
    await agent.aiAssert("提示文案为:'当前系统未激活，无法启动更新服务'且'更新设置'文字不可见");
  }, { timeout: 600000, tags: ['1878383', 'level3'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 定义需要使用的变量
    const activateSystemCmd = "uos-activator-cmd -s --kms kms.uniontech.com:8900:Vlc1cGIyNTBaV05v";
    // 恢复系统激活状态
    system.exec(activateSystemCmd);
    // 恢复默认窗口大小(控制中心)
    await device.pressKey("super", "Down");
    // 关闭当前窗口-控制中心
    await device.pressKey("alt", "F4");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
