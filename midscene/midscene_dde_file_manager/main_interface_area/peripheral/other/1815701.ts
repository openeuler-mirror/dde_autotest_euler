/**
 * 用例 PMSID: 1815701
 * 用例标题: 【其他】 托盘窗口左键操作
 * 生成时间: 2026-10-20 19:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1815701-【其他】 托盘窗口左键操作', () => {

  const caseDir = process.env.TESTCASE_DIR;

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 关闭可能残留的文件管理器
    console.log('准备步骤：关闭可能残留的文件管理器');
    await system.exec('killall -15 dde-file-manager');

    // 准备步骤: 回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 准备步骤: 回到桌面，确保从一个干净状态开始
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理步骤: 关闭可能弹出的磁盘列表窗口
    console.log('清理步骤：关闭可能弹出的磁盘列表窗口');
    // await device.pressKey('Escape');
    await agent.aiTap('桌面空白位置');
    await agent.aiWaitFor('没有弹出的磁盘列表窗口');

    // 清理步骤: 回到桌面
    console.log('清理步骤：回到桌面');
    await uos.showDesktop();
  });

  afterAll(async ({ device, agent, uos, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理步骤: 关闭可能弹出的磁盘列表窗口
    console.log('清理步骤：关闭可能弹出的磁盘列表窗口');
    // await device.pressKey('Escape');
    await agent.aiTap('桌面空白位置');
    await agent.aiWaitFor('没有弹出的磁盘列表窗口');

    // 清理步骤: 回到桌面
    console.log('清理步骤：回到桌面');
    await uos.showDesktop();
  });

  test('1815701-【其他】 托盘窗口左键操作', async ({ device, agent, uos, system }) => {

    // 步骤 1: 在托盘窗口左键点击磁盘插件
    console.log('步骤 1：在托盘窗口左键点击磁盘插件');
    await agent.aiTap('任务栏托盘区域中的形如三叉戟的USB磁盘图标', { deepThink: true });
    await agent.aiWaitFor('弹出了显示已挂载磁盘列表的窗口');
    // 预期 1: 弹出已挂载的磁盘列表窗口
    console.log('预期 1：弹出已挂载的磁盘列表窗口');
    await agent.aiAssert('弹出了显示已挂载磁盘列表的窗口');

    // 步骤 2: 在任务栏托盘窗口左键点击磁盘插件
    console.log('步骤 2：在任务栏托盘窗口左键点击磁盘插件');
    // await device.pressKey('Escape');
    await agent.aiTap('桌面空白位置');
    await agent.aiWaitFor('没有弹出的磁盘列表窗口');
    await uos.showDesktop();
    await agent.aiTap('任务栏托盘窗口中的形如三叉戟的USB磁盘图标', { deepThink: true });
    await agent.aiWaitFor('弹出了显示已挂载磁盘列表的窗口');
    // 预期 2: 弹出已挂载的磁盘列表窗口
    console.log('预期 2：弹出已挂载的磁盘列表窗口');
    await agent.aiAssert('弹出了显示已挂载磁盘列表的窗口');

  }, { timeout: 600000, tags: ['1815701', 'level3', 'DITT', 'youwei', 'tray', 'disk plugin'] });
});
