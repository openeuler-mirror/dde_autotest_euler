/**
 * 用例 PMSID: 1829989
 * 用例标题: 【任务栏】【状态】任务栏一直显示状态展示
 * 生成时间: 2026-09-14
 * 用例编写人: UT005044(王亮)
 */

const SET_KEEP_SHOWING = `dde-dconfig --set -a org.deepin.dde.shell -r org.deepin.ds.dock -k Hide_Mode -v 'keep-showing'`;

async function isDockVisible(system) {
  const res = await system.exec('xdotool search --name "org.deepin.ds.dock" getwindowgeometry --shell 2>/dev/null');
  const geo = res.stdout.trim();
  if (!geo) return false;
  const yMatch = geo.match(/Y[=:]\s*(\d+)/);
  if (!yMatch) return false;
  const y = parseInt(yMatch[1], 10);
  // 任务栏在屏幕底部，Y坐标应接近屏幕底部（大于500表示在屏幕内可见）
  return y >= 500;
}

describe('1829989-【任务栏】【状态】任务栏一直显示状态展示', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 设置任务栏为一直显示模式
    await system.exec(SET_KEEP_SHOWING);
    await new Promise(r => setTimeout(r, 2000));
    console.log('已设置任务栏为一直显示模式');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
  });

  test('1829989-【任务栏】【状态】任务栏一直显示状态展示', async ({ device, agent, uos, system }) => {
    const pcService = device.getPCService();

    // 步骤 1: 任务栏默认状态，验证一直展示
    console.log('步骤 1: 任务栏默认状态，验证一直展示');
    // 鼠标移到屏幕中间（远离任务栏），等待3秒
    await pcService.mouse.move([{ x: 960, y: 500 }]);
    await new Promise(r => setTimeout(r, 3000));
    // 验证任务栏仍然显示
    let dockVisible = await isDockVisible(system);
    assertTrue(dockVisible, '步骤1：任务栏默认状态应一直显示不消失');
    await agent.aiAssert('屏幕底部显示了任务栏,其左侧存在多个应用图标，右侧存在多个插件图标');
    console.log('步骤1验证完成：任务栏一直显示');

    // 步骤 2: 任务栏上鼠标左键点击操作，验证任务栏不消失
    console.log('步骤 2: 任务栏上鼠标左键点击操作');
    // 点击任务栏空白区域
    await pcService.mouse.move([{ x: 960, y: 1055 }]);
    await new Promise(r => setTimeout(r, 500));
    await pcService.mouse.pressButton(0);
    await new Promise(r => setTimeout(r, 200));
    await pcService.mouse.releaseButton(0);
    await new Promise(r => setTimeout(r, 2000));
    // 鼠标移开任务栏后验证
    await pcService.mouse.move([{ x: 960, y: 500 }]);
    await new Promise(r => setTimeout(r, 2000));
    dockVisible = await isDockVisible(system);
    assertTrue(dockVisible, '步骤2：左键点击任务栏后任务栏应仍显示');
    console.log('步骤2验证完成：左键点击后任务栏仍显示');

    await agent.aiAssert('屏幕底部一直显示了任务栏,其左侧存在多个应用图标，右侧存在多个插件图标');


    // 步骤 3: 任务栏上鼠标右键点击操作，验证任务栏不消失
    console.log('步骤 3: 任务栏上鼠标右键点击操作');
    // 右键点击任务栏空白区域
    await pcService.mouse.move([{ x: 800, y: 1055 }]);
    await new Promise(r => setTimeout(r, 500));
    await pcService.mouse.pressButton(2);
    await new Promise(r => setTimeout(r, 200));
    await pcService.mouse.releaseButton(2);
    await new Promise(r => setTimeout(r, 1500));
    // 按ESC关闭右键菜单
    await device.pressKey('ESC');
    await new Promise(r => setTimeout(r, 1000));
    // 验证任务栏仍然显示
    dockVisible = await isDockVisible(system);
    assertTrue(dockVisible, '步骤3：右键点击任务栏后任务栏应仍显示');
    console.log('步骤3验证完成：右键点击后任务栏仍显示'); 
    await agent.aiAssert('屏幕底部一直显示了任务栏,其左侧存在多个应用图标，右侧存在多个插件图标');

    // 步骤 4: 桌面上任意鼠标操作，验证任务栏不消失
    console.log('步骤 4: 桌面上任意鼠标操作');
    // 在桌面空白处点击
    await uos.showDesktop();
    await new Promise(r => setTimeout(r, 1000));
    await pcService.mouse.move([{ x: 1500, y: 800 }]);
    await new Promise(r => setTimeout(r, 500));
    await pcService.mouse.pressButton(0);
    await new Promise(r => setTimeout(r, 200));
    await pcService.mouse.releaseButton(0);
    await new Promise(r => setTimeout(r, 2000));
    // 验证任务栏仍然显示
    dockVisible = await isDockVisible(system);
    assertTrue(dockVisible, '步骤4：桌面操作后任务栏应仍显示');
    await agent.aiAssert('屏幕底部显示了任务栏，任务栏没有消失');
    console.log('步骤4验证完成：桌面操作后任务栏仍一直显示');
    await agent.aiAssert('屏幕底部一直显示了任务栏,其左侧存在多个应用图标，右侧存在多个插件图标');

  }, { timeout: 300000, tags: ['1829989', 'level2','smoke', 'dock'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.releaseAllKeys();
    await device.pressKey('esc');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复任务栏为一直显示模式（确保默认状态）
    await system.exec(SET_KEEP_SHOWING);
    await uos.showDesktop();
  });
});
