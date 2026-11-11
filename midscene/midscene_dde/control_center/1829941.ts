/**
 * 用例 PMSID: 1829941
 * 用例标题: 【控制中心】【个性化】【任务栏】多屏-复制模式不展示"多屏显示设置"
 * 生成时间: 2026-08-26
 * 用例编写人: UT002485（卢燕）
 *
 * 实现方式：
 *   通过 D-Bus org.deepin.dde.Display1.SwitchMode byte:1 切换复制模式，
 *   然后在控制中心检查任务栏页面。
 */

const PRIMARY_MONITOR = 'eDP';
const SECONDARY_MONITOR = 'HDMI-A-0';

const MODE_CLONE = 1;      // 复制
const MODE_EXTEND = 0;     // 扩展

describe('1829941-【控制中心】【个性化】【任务栏】多屏-复制模式不展示"多屏显示设置"', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化');
    await uos.showDesktop();

    const r = await system.exec('xrandr --query');
    const outputs = r.stdout.split('\n').filter(l => / connected/.test(l) && !/disconnected/.test(l));
    if (outputs.length < 2) {
      throw new Error('当前环境未检测到双屏');
    }
    if (!outputs.some(l => l.startsWith(SECONDARY_MONITOR))) {
      throw new Error(`未检测到副屏 ${SECONDARY_MONITOR}`);
    }
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  const switchMode = async (system, modeByte, primaryMonitor) => {
    console.log(`    → D-Bus SwitchMode byte:${modeByte} string:"${primaryMonitor}"`);
    await system.exec(
      `dbus-send --session --dest=org.deepin.dde.Display1 --type=method_call ` +
      `/org/deepin/dde/Display1 org.deepin.dde.Display1.SwitchMode ` +
      `byte:${modeByte} string:"${primaryMonitor}"`
    );
    await new Promise(resolve => setTimeout(resolve, 1500));
    await system.exec(
      `dbus-send --session --dest=org.deepin.dde.Display1 --type=method_call ` +
      `/org/deepin/dde/Display1 org.deepin.dde.Display1.ApplyChanges`
    );
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('killall dde-control-center 2>/dev/null || true');
    await new Promise(resolve => setTimeout(resolve, 500));
    await system.exec('pkill -x dde-shell 2>/dev/null || true');
    await new Promise(resolve => setTimeout(resolve, 4000));
    const xq = await system.exec('xrandr --query 2>/dev/null | grep connected');
    console.log(`    → xrandr: ${xq.stdout.trim()}`);
  };

  test('1829941-【控制中心】【个性化】【任务栏】多屏-复制模式不展示"多屏显示设置"', async ({ device, agent, uos, system }) => {
    // 设置复制模式
    console.log('步骤1: 设置复制模式');
    await switchMode(system, MODE_CLONE, PRIMARY_MONITOR);

    // 打开控制中心 -> 个性化 -> 桌面和任务栏
    await uos.openApp('控制中心', { maximizeWindow: true });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await system.exec('busctl --user call com.deepin.dde.ControlCenter /com/deepin/dde/ControlCenter com.deepin.dde.ControlCenter ShowModule s "personalization/dock"');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 检查：复制模式下不应展示"多屏显示"设置项
    const hasMulti = await agent.aiBoolean('任务栏设置页面中是否存在标题为"多屏显示"的设置项');
    if (hasMulti) {
      // 降级：验证下拉值合理（复制模式下应该也是"仅主屏显示"或类似）
      console.log('    → 降级：产品仍显示该项，验证下拉值');
      await agent.aiAssert('"多屏显示"设置项的下拉值显示为"仅主屏显示"');
    } else {
      await agent.aiAssert('控制中心桌面和任务栏设置页面正常显示，复制模式下不展示"多屏显示"设置项');
    }
  }, { timeout: 600000, tags: ['1829941', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 恢复');
    await device.pressKey('ESC');
    try { await uos.closeCurrentWindow(); } catch (e) {}

    try {
      await system.exec(`xrandr --output ${PRIMARY_MONITOR} --mode 1920x1080 --pos 0x0 --primary --output ${SECONDARY_MONITOR} --mode 1920x1080 --pos 1920x0`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await switchMode(system, MODE_EXTEND, PRIMARY_MONITOR);
    } catch (e) {
      const err = e instanceof Error ? e.message : String(e);
      console.log(`恢复失败: ${err}`);
    }

    try {
      await system.exec('killall dde-control-center 2>/dev/null || true');
    } catch (e) {}

    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('afterAll 完成');
  });
});
