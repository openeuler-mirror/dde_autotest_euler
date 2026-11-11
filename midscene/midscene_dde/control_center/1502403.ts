/**
 * 用例 PMSID: 1502403
 * 用例标题: 【控制中心】【个性化】【桌面和任务栏】任务栏插件区域插件项默认展示
 * 生成时间: 2026-09-14
 * 用例编写人: UT005044(王亮)
 */

describe('1502403-【控制中心】【个性化】【桌面和任务栏】任务栏插件区域插件项默认展示', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
  });

  test('1502403-【控制中心】【个性化】【桌面和任务栏】任务栏插件区域插件项默认展示', async ({ device, agent, uos, system }) => {

    // 步骤 1: 打开控制中心，进入个性化-桌面和任务栏
    console.log('步骤 1: 打开控制中心-个性化-桌面和任务栏');
    await uos.openApp('控制中心', { maximizeWindow: true });
    await agent.aiWaitFor('显示系统设置界面', { timeoutMs: 15000 });
    await agent.aiTap('个性化');
    await new Promise(r => setTimeout(r, 1500));
    await agent.aiTap('桌面和任务栏');
    await new Promise(r => setTimeout(r, 1500));
    await agent.aiTap('插件区域');
    await new Promise(r => setTimeout(r, 1500));
    console.log('已进入插件区域设置页面');

    // 步骤 2: 检查插件区域界面默认展示
    console.log('步骤 2: 检查插件区域界面默认展示');
    await agent.aiAssert('设置页面中显示了插件区域配置项，可以配置显示所有插件项，每个插件项包含图标和名称，包括但不限于（无须按顺序，无须勾选状态）：多任务视图、更新状态、通知、关机、网络、剪贴板，勿扰模式、系统监视器、录屏、截图');
    console.log('步骤2验证完成：插件区域界面正常展示');

    // 步骤 3: 检查插件默认勾选项
    console.log('步骤 3: 检查插件默认勾选项');
    await agent.aiAssert('任务栏右侧的插件区域中至少默认勾选了以下插件项：时间、多任务视图、更新状态、关机、网络');
    console.log('步骤3验证完成：插件默认勾选项正常');

    // 关闭控制中心
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));

  }, { timeout: 600000, tags: ['1502403', 'level1', 'smoke', 'control_center'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('esc');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
