/**
 * 用例 PMSID: 1503125
 * 用例标题: 【任务栏】【固定区域】【日历】日历插件面板展示效果
 * 生成时间: 2026-09-14
 * 用例编写人: UT005044(王亮)
 */

describe('1503125-【任务栏】【固定区域】【日历】日历插件面板展示效果', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
  });

  test('1503125-【任务栏】【固定区域】【日历】日历插件面板展示效果', async ({ device, agent, uos }) => {

    // 步骤 1: 左键点击任务栏上的时间插件图标
    console.log('步骤 1: 点击任务栏时间插件图标');
    await agent.aiTap('任务栏右侧的时间日期显示区域', { deepThink: true });
    await new Promise(r => setTimeout(r, 2000));
    console.log('已点击时间日期区域');

    // 验证日历插件面板已打开
    await agent.aiAssert('屏幕上显示了日历插件面板，面板包含左侧和右侧两个区域');
    console.log('步骤1验证完成：日历面板已打开');

    // 步骤 2: 检查左侧区域展示内容
    console.log('步骤 2: 检查日历面板左侧区域展示内容');
    await agent.aiAssert('日历面板左侧区域从上到下显示了：当天简略日期（格式为日/月），当天星期几，公历完整日期（年月日），农历日期信息，以及"打开日历"按钮');
    console.log('步骤2验证完成：左侧区域内容正常');

    // 步骤 3: 检查右侧区域展示内容
    console.log('步骤 3: 检查日历面板右侧区域展示内容');
    await agent.aiAssert('日历面板右侧区域显示了日历表格，包含当前月份标题，今天快捷按钮（非当月时显示），上月和下月切换按钮（左右箭头）');
    console.log('步骤3验证完成：右侧区域内容正常');

  }, { timeout: 300000, tags: ['1503125', 'level1', 'smoke', 'dock'] });

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
