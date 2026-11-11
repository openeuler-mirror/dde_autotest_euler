/**
 * 用例 PMSID: 1849233
 * 用例标题: 【控制中心】【系统】【语言和区域】【区域格式】区域格式为英式英语时，短时间时间格式取值范围检查
 * 生成时间: 2026-08-31 18:00:00
 * 用例编写人: UT003072(陈佳梅)
 */

describe('1849233-【控制中心】【系统】【语言和区域】【区域格式】区域格式为英式英语时，短时间时间格式取值范围检查', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1849233-【控制中心】【系统】【语言和区域】【区域格式】区域格式为英式英语时，短时间时间格式取值范围检查', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开控制中心且最大化控制中心
    await uos.openApp('控制中心', { maximizeWindow: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('busctl --user call com.deepin.dde.ControlCenter /com/deepin/dde/ControlCenter com.deepin.dde.ControlCenter ShowModule s "system/langAndFormat"');
    await new Promise(resolve => setTimeout(resolve, 2500));
    await agent.aiWaitFor('区域格式');

    // 前置条件: 区域格式设置为英语(英国)
    await agent.aiTap('区域格式下拉框');
    await agent.aiTap('搜索框');
    await device.typeText('英国');
    await agent.aiTap('英语(英国)');
    await agent.aiTap('保存');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 步骤 3: 点击区域格式子设置项短时间下拉框
    await agent.aiTap("'短时间'设置项右侧的下拉箭头按钮", { deepThink: true });

    // 预期: 短时间设置选项正常显示
    await agent.aiAssert('短时间下拉框显示所有选项：HH:mm、H:mm、hh:mm AM、h:mm AM');
    await device.pressKey('Escape');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }, { timeout: 600000, tags: ['1849233', 'level3'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    try {
      // 尝试通过 UI 切回中文(中国)区域格式
      await device.pressKey('Escape');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await system.exec('busctl --user call com.deepin.dde.ControlCenter /com/deepin/dde/ControlCenter com.deepin.dde.ControlCenter ShowModule s "system/langAndFormat"');
      await new Promise(resolve => setTimeout(resolve, 2500));
      await agent.aiWaitFor('区域格式');
      await agent.aiTap('区域格式下拉框', { deepThink: true });
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiTap('区域格式选择弹窗中的搜索框', { deepThink: true });
      await device.pressKey('ctrl', 'a');
      await device.pressKey('BackSpace');
      await device.typeText('中文');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await agent.aiTap('中文(中国)');
      await agent.aiTap('保存');
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (e) {
      console.log('afterEach 清理失败:', e.message);
    }
    await device.pressKey('Super', 'Down');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
