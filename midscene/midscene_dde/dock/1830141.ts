/**
 * 用例 PMSID: 1830141
 * 用例标题: 【任务栏】【模式】任务栏经典模式展示效果
 * 生成时间: 2026-09-14
 * 用例编写人: UT005044(王亮)
 */

const SET_CLASSIC_MODE = `dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k DisplayMode -v 0`;

describe('1830141-【任务栏】【模式】任务栏经典模式展示效果', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 设置任务栏为经典模式
    await system.exec(SET_CLASSIC_MODE);
    await new Promise(r => setTimeout(r, 2000));
    console.log('已设置任务栏为经典模式');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
  });

  test('1830141-【任务栏】【模式】任务栏经典模式展示效果', async ({ device, agent, uos, system }) => {
    const pcService = device.getPCService();

    // 步骤 1: 检查任务栏经典模式展示（默认底部）
    console.log('步骤 1: 检查任务栏经典模式展示效果');
    await agent.aiAssert('任务栏处于经典模式，显示在屏幕底部，任务栏长度与桌面平齐无空隙，左侧有启动器图标和应用区域图标,相对居左显示');
    console.log('步骤1验证完成');

    // 步骤 2: 设置任务栏位置为上方
    console.log('步骤 2: 设置任务栏位置为上方');
    await agent.aiRightClick('任务栏空白区域');
    await new Promise(r => setTimeout(r, 1000));
    await agent.aiHover('位置');
    await new Promise(r => setTimeout(r, 500));
    await agent.aiTap('上');
    await new Promise(r => setTimeout(r, 2000));
    await agent.aiAssert('任务栏显示在屏幕顶部，任务栏长度与桌面平齐无空隙，左侧固定区域和应用区域居左显示');
    console.log('步骤2验证完成');

    // 步骤 3: 设置任务栏位置为左
    console.log('步骤 3: 设置任务栏位置为左');
    await agent.aiRightClick('任务栏空白区域');
    await new Promise(r => setTimeout(r, 1000));
    await agent.aiHover('位置');
    await new Promise(r => setTimeout(r, 500));
    await agent.aiTap('左');
    await new Promise(r => setTimeout(r, 2000));
    await agent.aiAssert('任务栏显示在屏幕左侧，任务栏长度与桌面平齐无空隙，固定区域和应用区域居上显示');
    console.log('步骤3验证完成');

    // 步骤 4: 设置任务栏位置为右
    console.log('步骤 4: 设置任务栏位置为右');
    await agent.aiRightClick('任务栏空白区域');
    await new Promise(r => setTimeout(r, 1000));
    await agent.aiHover('位置');
    await new Promise(r => setTimeout(r, 500));
    await agent.aiTap('右');
    await new Promise(r => setTimeout(r, 2000));
    await agent.aiAssert('任务栏显示在屏幕右侧，任务栏长度与桌面平齐无空隙，固定区域和应用区域居上显示');
    console.log('步骤4验证完成');

  }, { timeout: 600000, tags: ['1830141', 'level2', 'smoke', 'dock'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('esc');
    // 恢复任务栏到默认位置（底部）
    await system.exec(`dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Position -v 0`);
    await new Promise(r => setTimeout(r, 2000));
    await system.exec('systemctl --user restart dde-shell@DDE', 60000);
    await system.exec('sleep 5');
    await system.exec('systemctl --user daemon-reload');
  });

  afterAll(async ({ uos, agent, device }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.showDesktop();
  });
});
