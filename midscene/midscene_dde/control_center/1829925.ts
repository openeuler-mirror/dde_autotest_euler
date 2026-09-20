/**
 * 用例 PMSID: 1829925
 * 用例标题: 【控制中心】【个性化】【任务栏】多屏-仅X屏模式不展示"多屏显示设置"
 * 生成时间: 2026-08-26
 * 用例编写人: UT002485（卢燕）
 */

const PRIMARY_MONITOR = 'eDP';
const SECONDARY_MONITOR = 'HDMI-A-0';

describe('1829925-【控制中心】【个性化】【任务栏】多屏-仅X屏模式不展示"多屏显示设置"', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    const r = await system.exec('xrandr --query');
    const _connectedOutputs = r.stdout.split('\n').filter(l => / connected/.test(l) && !/disconnected/.test(l));
    if (_connectedOutputs.length < 2) {
      throw new Error('当前环境未检测到双屏，需要外接HDMI显示器才能执行本用例');
    }
    if (!_connectedOutputs.some(l => l.startsWith(SECONDARY_MONITOR))) {
      throw new Error(`未检测到副屏 ${SECONDARY_MONITOR}，无法执行本用例`);
    }
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1829925-【控制中心】【个性化】【任务栏】多屏-仅X屏模式不展示"多屏显示设置"', async ({ device, agent, uos, system }) => {
    // 步骤1: 多屏下仅X屏1（仅eDP），检查"多屏显示设置"
    console.log('步骤1: 仅eDP屏模式');
    await system.exec(`xrandr --output ${PRIMARY_MONITOR} --mode 1920x1080 --pos 0x0 --primary --output ${SECONDARY_MONITOR} --disable`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    await uos.openApp('控制中心', { maximizeWindow: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('busctl --user call com.deepin.dde.ControlCenter /com/deepin/dde/ControlCenter com.deepin.dde.ControlCenter ShowModule s "personalization/dock"');
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 预期1: 不展示"多屏显示设置"，任务栏固定展示
    let hasMultiScreenSetting = await agent.aiBoolean('界面中存在"多屏显示设置"这一设置项');
    assertFalse(hasMultiScreenSetting, '仅eDP屏模式下不应展示"多屏显示设置"设置项');
    await agent.aiAssert('任务栏固定展示，界面设置项正常');

    // 关闭控制中心
    await uos.closeCurrentWindow();
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤2: 多屏下仅X屏2（仅HDMI-A-0），检查"多屏显示设置"
    console.log('步骤2: 仅HDMI-A-0屏模式');
    await system.exec(`xrandr --output ${SECONDARY_MONITOR} --mode 1920x1080 --pos 0x0 --primary --output ${PRIMARY_MONITOR} --disable`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    await uos.openApp('控制中心', { maximizeWindow: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('busctl --user call com.deepin.dde.ControlCenter /com/deepin/dde/ControlCenter com.deepin.dde.ControlCenter ShowModule s "personalization/dock"');
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 预期2: 不展示"多屏显示设置"，任务栏固定展示
    hasMultiScreenSetting = await agent.aiBoolean('界面中存在"多屏显示设置"这一设置项');
    assertFalse(hasMultiScreenSetting, '仅HDMI-A-0屏模式下不应展示"多屏显示设置"设置项');
    await agent.aiAssert('任务栏固定展示，界面设置项正常');
  }, { timeout: 600000, tags: ['1829925', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    try { await uos.closeCurrentWindow(); } catch (e) {}
    // 还原双屏克隆模式
    try {
      await system.exec(`xrandr --output ${PRIMARY_MONITOR} --mode 1920x1080 --pos 0x0 --primary --output ${SECONDARY_MONITOR} --mode 1920x1080 --same-as ${PRIMARY_MONITOR}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {}
    console.log('afterAll 完成');
  });
});
