/**
 * 用例 PMSID: 1503387
 * 用例标题: 【任务栏】【插件区域】【关机】关机图标右键菜单-菜单项检查
 * 生成时间: 2026-02-06 16:55:00
 * 用例编写人：UT000224(何权)
 */

describe('1503387-【任务栏】【插件区域】【关机】关机图标右键菜单-菜单项检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1503387-【任务栏】【插件区域】【关机】关机图标右键菜单-菜单项检查', async ({ device, agent, uos, system, env }) => {

    // 测试1: 系统有多个帐户，右键点击电源图标，检查菜单项
    console.log('测试1: 多账户系统右键菜单检查');
    // 注意：多账户环境需要预先配置，这里验证菜单项包含"切换帐户"
    // 创建测试用户
    await system.exec(`echo '${env.testPassword}' | sudo -S sh -c 'sudo dbus-send --system --print-reply --dest=org.deepin.dde.Accounts1 /org/deepin/dde/Accounts1 org.deepin.dde.Accounts1.CreateUser string:'hqtestuser' string:"Test User" int32:0'`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiRightClick("任务栏右侧电源开关图标", { deepThink: true });
    await agent.aiWaitFor("右键菜单显示");
    
    // 验证菜单项从上到下依次显示，包含"切换帐户"
    await agent.aiAssert("菜单从上到下依次显示菜单项：关机、重启、待机、休眠、锁屏、注销、切换用户、电源设置、移除驻留");
    
    // 点击空白处关闭菜单
    await agent.aiTap("桌面空白处");

    // 删除测试账户
    await system.exec(`echo '${env.testPassword}' | sudo -S sh -c 'sudo dbus-send --system --print-reply --dest=org.deepin.dde.Accounts1 /org/deepin/dde/Accounts1 org.deepin.dde.Accounts1.DeleteUser string:'hqtestuser' boolean:true'`);
 
    // 测试2: 系统只有一个帐户，右键点击电源图标，检查菜单项
    console.log('测试2: 单账户系统右键菜单检查');
    await agent.aiRightClick("任务栏右侧电源开关图标", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 验证菜单项从上到下依次显示
    await agent.aiAssert("菜单从上到下依次显示菜单项：关机、重启、待机、休眠、锁屏、注销、电源设置、移除驻留");
    
    // 点击空白处关闭菜单
    await agent.aiTap("桌面空白处");
    await new Promise(resolve => setTimeout(resolve, 500));    
  }, { timeout: 600000, tags: ['1503387', 'level1', 'smoke'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    // 确保菜单已关闭
    await agent.aiTap("桌面空白处");
    await system.exec(`echo '${env.testPassword}' | sudo -S sh -c 'sudo dbus-send --system --print-reply --dest=org.deepin.dde.Accounts1 /org/deepin/dde/Accounts1 org.deepin.dde.Accounts1.DeleteUser string:'hqtestuser' boolean:true'`);
  });
});