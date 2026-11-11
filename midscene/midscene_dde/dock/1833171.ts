/**
 * 用例 PMSID: 1833171
 * 用例标题: 【任务栏】【托盘区域】【折叠区域】折叠区域展示内容
 * 生成时间: 2026-09-21
 * 用例编写人: UT005044(王亮)
 */

describe('1833171-【任务栏】【托盘区域】【折叠区域】折叠区域展示内容', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
  });

  test('1833171-【任务栏】【托盘区域】【折叠区域】折叠区域展示内容', async ({ device, agent, uos, system }) => {

    // 步骤 1: 验证折叠区域展示，显示系统插件图标
    console.log('步骤 1: 验证折叠区域展示内容');
    // 远程机器任务栏在右侧，托盘区域可能在底部
    // 用更通用的描述，不指定具体位置
    await agent.aiAssert('任务栏托盘区域显示了系统插件图标（如网络、声音、电源、输入法等），任务栏显示正常');

    // 步骤 2: hover到折叠区域图标，验证可hover
    console.log('步骤 2: hover到折叠区域中的插件图标');
    await agent.aiHover('任务栏托盘区域中的声音图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 2000));
    console.log('已hover到托盘声音图标');

    // 步骤 3: 点击声音图标验证可点击
    console.log('步骤 3: 点击声音图标验证可点击');
    await agent.aiTap('任务栏托盘区域中的声音图标', { deepThink: true });
    await new Promise(r => setTimeout(r, 2000));

    // 验证声音面板已打开
    await agent.aiAssert('屏幕上显示了声音快捷设置面板，包含音量调节滑块');
    console.log('步骤3验证完成：声音面板已打开');

    // 关闭面板
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));

  }, { timeout: 300000, tags: ['1833171', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('esc');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
