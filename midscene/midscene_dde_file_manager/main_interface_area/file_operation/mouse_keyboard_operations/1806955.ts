/**
 * 用例 PMSID: 1806955
 * 用例标题: 快捷键-桌面选中文件，快捷键alt+m调出右键菜单
 * 生成时间: 2025-12-16 19:49:25
 * 用例编写人: UT000193（郑豪）
 */

describe('1806955-快捷键-桌面选中文件，快捷键alt+m调出右键菜单', () => {
  beforeAll(async ({ device, uos, agent,system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806955-快捷键-桌面选中文件，快捷键alt+m调出右键菜单', async ({ device, agent, uos }) => {
    await agent.aiWaitFor("桌面界面已显示");
    await agent.aiTap("点击桌面中的计算机图标");
    // 步骤1：进入桌面-选中文件-按住alt+m键
    await device.pressKey('alt', 'M');
    await agent.aiAssert("弹出计算机右键菜单，显示打开、反选、发送到、属性4个选项");
  }, { timeout: 300000, tags: ['1806955', 'level3', 'mouse_keyboard_operations', 'zhenghao'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("点击桌面空白处");
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});