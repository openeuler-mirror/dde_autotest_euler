/**
 * 用例 PMSID: 1839831
 * 用例标题: 【任务栏】【应用区域】hover未打开应用图标显示tooltips
 * 生成时间: 2026-09-14
 * 用例编写人: UT005044(王亮)
 */

describe('1839831-【任务栏】【应用区域】hover未打开应用图标显示tooltips', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    // 前置: 关闭所有运行中的应用，确保hover的是未打开的驻留图标
    console.log('前置: 关闭所有运行中的应用');
    await system.exec('killall dde-file-manager 2>/dev/null || true');
    await system.exec('killall dde-control-center 2>/dev/null || true');
    await new Promise(r => setTimeout(r, 2000));
    await uos.showDesktop();
    console.log('已关闭所有运行中的应用');
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1839831-【任务栏】【应用区域】hover未打开应用图标显示tooltips', async ({ device, agent, uos, system }) => {
    const pcService = device.getPCService();

    // 步骤 1: 鼠标hover到任务栏上应用区的未打开驻留图标
    console.log('步骤 1: 鼠标hover到任务栏上应用区的未打开驻留图标');
    // 使用aiHover定位任务栏上的文件管理器驻留图标（未运行状态）
    await agent.aiHover('任务栏应用区域中的黄色的文件管理器图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 2000));
    console.log('已hover到任务栏上的文件管理器图标');

    // 检查1: 驻留图标上方显示了tooltips，文案为应用名称
    await agent.aiAssert('任务栏上文件管理器图标的上方显示了tooltips提示框，文案为：文件管理器');

    // 步骤 2: 鼠标移出应用图标外
    console.log('步骤 2: 鼠标移出应用图标外');
    await pcService.mouse.move([{ x: 100, y: 500 }]);
    await new Promise(r => setTimeout(r, 1000));
    console.log('鼠标已移出应用图标外');

    // 检查2: 驻留图标上方显示了tooltips消失
    await agent.aiAssert('任务栏上文件管理器图标的上方不存在tooltips提示，无文案：文件管理器');

    //步骤3： hover到任务栏上新驻留的控制中心图标
    console.log('hover到任务栏上新驻留的控制中心图标');
    await agent.aiHover('任务栏应用区域中的齿轮状的控制中心图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 2000));
    console.log('已hover到任务栏上的控制中心图标');

    // 检查3: 新驻留图标上方显示了tooltips，文案为应用名称
    await agent.aiAssert('任务栏上控制中心图标的上方显示了tooltips提示框，文案为：控制中心'); 

    // 步骤 4: 鼠标移出控制中心图标外
    console.log('步骤 4: 鼠标移出控制中心图标外');
    await pcService.mouse.move([{ x: 100, y: 500 }]);
    await new Promise(r => setTimeout(r, 1000));
    console.log('鼠标已移出控制中心图标外，tooltips已消失');

    // 检查4: 驻留图标上方显示了tooltips消失
    await agent.aiAssert('任务栏上控制中心图标的上方不存在tooltips提示，无文案：控制中心'); 

  }, { timeout: 300000, tags: ['1839831', 'level2', 'smoke', 'dock'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('systemctl --user restart dde-shell@DDE', 60000);
    await system.exec('sleep 5');
    console.log('dde-shell 服务已重启');
    await system.exec('systemctl --user daemon-reload');
    console.log('systemctl --user daemon-reload 已执行');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
