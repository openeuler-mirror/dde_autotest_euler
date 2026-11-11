/**
 * 用例 PMSID: 1829939
 * 用例标题: 【控制中心】【个性化】【任务栏】单屏模式不展示"多屏显示设置"
 * 生成时间: 2026-08-26
 * 用例编写人: UT002485（卢燕）
 */

const SECONDARY_MONITOR = 'HDMI-A-0';
let originSecondaryEnabled = true;

describe('1829939-【控制中心】【个性化】【任务栏】单屏模式不展示"多屏显示设置"', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 记录副屏原始状态
    const r = await system.exec('xrandr --query');
    originSecondaryEnabled = r.stdout.includes(`${SECONDARY_MONITOR} connected primary`) || /HDMI-A-0 connected (?!\(normal)/.test(r.stdout) ? !r.stdout.includes(`${SECONDARY_MONITOR} connected (normal`) : true;
    const isConnected = /HDMI-A-0 connected/.test(r.stdout);
    originSecondaryEnabled = isConnected;

    // 单屏模式：禁用副屏
    await system.exec(`xrandr --output ${SECONDARY_MONITOR} --disable`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('已设置为单屏模式');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1829939-【控制中心】【个性化】【任务栏】单屏模式不展示"多屏显示设置"', async ({ device, agent, uos, system }) => {
    // 步骤1: 打开控制中心-个性化-桌面和任务栏
    await uos.openApp('控制中心', { maximizeWindow: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('busctl --user call com.deepin.dde.ControlCenter /com/deepin/dde/ControlCenter com.deepin.dde.ControlCenter ShowModule s "personalization/dock"');
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 预期1: 不展示"多屏显示设置"设置项
    const hasMultiScreenSetting = await agent.aiBoolean('界面中存在"多屏显示设置"这一设置项');
    if (hasMultiScreenSetting) {
      throw new Error('单屏模式下不应展示"多屏显示设置"设置项');
    }
    await agent.aiAssert('控制中心桌面和任务栏设置页面正常显示，单屏模式下不展示"多屏显示设置"设置项，任务栏相关设置项正常展示');
  }, { timeout: 600000, tags: ['1829939', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    try { await uos.closeCurrentWindow(); } catch (e) {}
    // 还原副屏（重新启用）
    if (originSecondaryEnabled) {
      try {
        await system.exec(`xrandr --output ${SECONDARY_MONITOR} --mode 1920x1080 --same-as eDP`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) { console.log(`还原副屏失败: ${e.message}`); }
    }
    // 关闭可能残留的控制中心窗口，恢复环境
    try {
      await system.exec('killall dde-control-center 2>/dev/null || true');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (e) {}
    // 确认回到桌面
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('afterAll 完成，环境已恢复');
  });
});
