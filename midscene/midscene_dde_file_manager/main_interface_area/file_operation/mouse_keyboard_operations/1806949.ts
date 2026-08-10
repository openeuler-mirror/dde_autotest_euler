/**
 * 用例 PMSID: 1806949
 * 用例标题: 桌面，选中计算机图标，空格预览
 * 生成时间: 2025-12-12 13:37:27
 * 用例编写人: UT000193（郑豪）
 */
describe('1806949-桌面，选中计算机图标，空格预览', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1806949-桌面，选中计算机图标，空格预览', async ({ device, agent, uos }) => {
    await agent.aiWaitFor("桌面界面已显示");
    await agent.aiTap("点击桌面中的计算机图标");
    await device.pressKey('Space');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await agent.aiAssert("弹出计算机图标的预览窗口，显示大小、类型字段并且存在dde-computer.desktop");
  }, { timeout: 300000, tags: ['1806949', 'level3', 'mouse_keyboard_operations', 'zhenghao'] });
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });
  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
