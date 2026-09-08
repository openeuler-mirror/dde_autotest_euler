/**

 * 用例 PMSID: 1671629
 * 用例标题：多个窗口总在最前,同级窗口遵循鼠标选中规则
 * 生成时间: 2026-01-07 14:28:00
 * 用例编写人: UT006165（李日华）
 */

describe('1671629-多个窗口总在最前,同级窗口遵循鼠标选中规则', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await uos.setWindowEffect("最佳性能")
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1671629-多个窗口总在最前,同级窗口遵循鼠标选中规则', async ({ device, agent, uos, system }) => {
    //前置,关闭多余终端窗口，防止影响后续操作
    await system.exec('killall deepin-terminal');

    // 步骤1：打开终端应用，键入"alt+space"组合键，选择总在最前
    await uos.openApp("终端");
    await agent.aiAssert("桌面显示终端窗口");
    await device.pressKey("Alt", "Space");
    await agent.aiAssert("窗口右键菜单已显示");
    await agent.aiTap('窗口菜单中的"总在最前"选项', { deepThink: true });
    // 预期结果1：终端窗口显示在其他应用窗口上层
    await agent.aiAssert('终端窗口显示在其他应用窗口上层');
    // 点击应用右上角最小化"-"按钮
    await agent.aiTap('终端窗口右上角的最小化按钮', { deepThink: true });  
    // 应用窗口最小化到任务栏
    await agent.aiAssert('终端窗口已最小化');

    // 步骤2：打开文件管理器应用，键入"alt+space"组合键，选择总在最前
    await uos.openApp("文件管理器");
    await agent.aiAssert("文件管理器窗口已打开");
    await device.pressKey("Alt", "Space");
    await agent.aiAssert("窗口右键菜单已显示");
    await agent.aiTap('窗口菜单中的"总在最前"选项', { deepThink: true });
    // 预期结果2：文件管理器窗口置顶显示
    await agent.aiAssert('文件管理器窗口显示在其他应用窗口上层');
    // 点击应用右上角最小化"-"按钮
    await agent.aiTap('文件管理器窗口右上角的最小化按钮', { deepThink: true });  
    // 应用窗口最小化到任务栏
    await agent.aiAssert('文件管理器窗口已最小化');

    // 步骤3：打开控制中心应用，键入"alt+space"组合键，选择总在最前
    await uos.openApp("控制中心");
    // await agent.aiWaitFor("控制中心窗口已打开");
    await agent.aiAssert("系统设置窗口已打开");
    await device.pressKey("Alt", "Space");
    await agent.aiAssert("窗口右键菜单已显示");
    await agent.aiTap('窗口菜单中的"总在最前"选项', { deepThink: true });
    // 预期结果3：控制中心窗口置顶显示
    await agent.aiAssert('系统设置窗口显示在其他应用窗口上层');

    // 点击任务栏文件管理器图标
    await agent.aiTap("任务栏文件管理器图标", { deepThink: true }); 
    // 文件管理器窗口置顶显示
    await agent.aiAssert('文件管理器窗口显示在其他应用窗口上层');

    // 步骤4：点击任务栏终端图标
    await agent.aiTap("任务栏终端图标", { deepThink: true }); 
    // 预期结果4：终端窗口置顶显示
    await agent.aiAssert('终端窗口显示在其他应用窗口上层');
  }, { timeout: 600000, tags: ['1671629', 'level2','x11','window_rules','2d_wm'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop(); 
    // 关闭文件管理器窗口
    await system.exec('killall dde-file-manager');
    // 关闭终端窗口
    await system.exec('killall deepin-terminal');
    // // 关闭控制中心窗口
    await system.exec('killall dde-control-center');
    // 最后设置窗口效果，并且上一层关闭控制中心的保险
    await device.pressKey("Esc");
    await uos.showDesktop(); 
    await uos.setWindowEffect("最佳视觉")
  });
});