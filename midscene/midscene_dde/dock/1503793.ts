/**
 * 用例 PMSID: 1503793
 * 用例标题: 【任务栏】【快捷面板】快捷操作面板默认展示内容
 * 生成时间: 2026-09-14
 * 用例编写人: UT005044(王亮)
 */

describe('1503793-【任务栏】【快捷面板】快捷操作面板默认展示内容', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
  });

  test('1503793-【任务栏】【快捷面板】快捷操作面板默认展示内容', async ({ device, agent, uos }) => {
    const pcService = device.getPCService();

    // 步骤 1: 点击任务栏右下角快捷面板图标打开快捷面板
    console.log('步骤 1: 点击任务栏右下角快捷面板图标打开快捷面板');
    // 先点击任务栏右侧托盘区域的声音图标打开快捷面板
    await agent.aiTap('任务栏右侧托盘区域中的声音图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 2000));
    console.log('已点击声音图标');

    // 验证快捷面板已打开，显示功能图标
    await agent.aiAssert('任务栏声音图标位置上方显示了快捷面板，面板中包含多个功能图标');

    // 步骤 2: 检查面板中显示的功能图标
    console.log('步骤 2: 检查快捷面板中的功能图标');
    await agent.aiAssert('快捷面板中显示了至少以下功能图标中：无线/有线网络、勿扰模式、截图、录屏、剪贴板、全局搜索、系统监视器、亮度调节条、声音调节条');
    console.log('步骤2验证完成：快捷面板展示了默认功能图标');

    // 关闭面板
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));

  }, { timeout: 300000, tags: ['1503793', 'level1', 'smoke', 'dock'] });

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
