/**
 * 用例 PMSID: 1830005
 * 用例标题: 【任务栏】【状态】任务栏一直隐藏时，hover到任务栏区域边界才会自动展示
 * 生成时间: 2026-09-21
 * 用例编写人: UT005044(王亮)
 */

describe('1830005-【任务栏】【状态】任务栏一直隐藏时，hover到任务栏区域边界才会自动展示', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
  });

  test('1830005-【任务栏】【状态】任务栏一直隐藏时，hover到任务栏区域边界才会自动展示', async ({ device, agent, uos, system }) => {
    const pcService = device.getPCService();

    // 前置: 右键任务栏设置"一直隐藏"
    console.log('前置: 通过右键菜单设置任务栏为一直隐藏');
    await agent.aiRightClick('任务栏空白区域');
    await new Promise(r => setTimeout(r, 1000));
    await agent.aiHover('状态');
    await new Promise(r => setTimeout(r, 500));
    await agent.aiTap('一直隐藏');
    await new Promise(r => setTimeout(r, 3000));
    console.log('已设置一直隐藏');

    // 步骤 1: 鼠标移到屏幕中间（远离任务栏边界），任务栏保持隐藏
    console.log('步骤 1: 鼠标在屏幕中间，验证任务栏保持隐藏');
    await pcService.mouse.move([{ x: 960, y: 540 }]);
    await new Promise(r => setTimeout(r, 3000));
    await agent.aiAssert('当前屏幕上没有显示任务栏，任务栏处于隐藏状态');
    console.log('步骤1验证完成：任务栏保持隐藏');

    // 步骤 2: 鼠标hover到屏幕底部边界，任务栏自动展示
    console.log('步骤 2: hover到屏幕底部边界');
    await pcService.mouse.move([{ x: 960, y: 1079 }]);
    await new Promise(r => setTimeout(r, 2000));
    await agent.aiAssert('任务栏已自动显示出来，可以看到任务栏上的图标');
    console.log('步骤2验证完成：任务栏自动展示');

    // 步骤 3: 鼠标移到屏幕左侧边界（任务栏在底部时），任务栏保持隐藏
    console.log('步骤 3: 鼠标移到屏幕左侧，验证任务栏隐藏');
    await pcService.mouse.move([{ x: 0, y: 540 }]);
    await new Promise(r => setTimeout(r, 3000));
    await agent.aiAssert('当前屏幕上没有显示任务栏，任务栏处于隐藏状态');
    console.log('步骤3验证完成：任务栏保持隐藏');

    // 步骤 4: 鼠标hover到屏幕右侧边界，任务栏保持隐藏（因为任务栏在底部不在右侧）
    console.log('步骤 4: 鼠标移到屏幕右侧，验证任务栏保持隐藏');
    await pcService.mouse.move([{ x: 1919, y: 540 }]);
    await new Promise(r => setTimeout(r, 3000));
    await agent.aiAssert('当前屏幕上没有显示任务栏，任务栏处于隐藏状态');
    console.log('步骤4验证完成：任务栏保持隐藏');

    // 步骤 5: 鼠标再次hover到屏幕底部边界，任务栏再次自动展示
    console.log('步骤 5: 再次hover到底部边界');
    await pcService.mouse.move([{ x: 960, y: 1079 }]);
    await new Promise(r => setTimeout(r, 2000));
    await agent.aiAssert('任务栏已自动显示出来，可以看到任务栏上的图标');
    console.log('步骤5验证完成：任务栏再次自动展示');

  }, { timeout: 600000, tags: ['1830005', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('esc');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复任务栏为一直显示
    const pcService = device.getPCService();
    // hover到屏幕底部边界唤出任务栏
    await pcService.mouse.move([{ x: 960, y: 1079 }]);
    await new Promise(r => setTimeout(r, 2000));
    try {
      await agent.aiRightClick('任务栏空白区域');
      await new Promise(r => setTimeout(r, 1000));
      await agent.aiHover('状态');
      await new Promise(r => setTimeout(r, 500));
      await agent.aiTap('一直显示');
      await new Promise(r => setTimeout(r, 2000));
      console.log('已恢复任务栏为一直显示');
    } catch (e) {
      console.log('恢复任务栏状态失败，使用dde-dconfig恢复');
      await system.exec("dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Hide_Mode -v 'keep-showing'");
      await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null || true');
      await new Promise(r => setTimeout(r, 5000));
    }
    await uos.showDesktop();
  });
});
