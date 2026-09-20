/**
 * 用例 PMSID: 1801363
 * 用例标题: 【控制中心】【设备】【键盘】【快捷键】"切换多屏模式"快捷键固定一直展示
 * 生成时间: 2026-08-26
 * 用例编写人: UT002485（卢燕）
 */

const PRIMARY_MONITOR = 'eDP';
const SECONDARY_MONITOR = 'HDMI-A-0';

describe('1801363-【控制中心】【设备】【键盘】【快捷键】"切换多屏模式"快捷键固定一直展示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  // 辅助函数：打开控制中心-键盘-快捷键，通过 dogtail 检查"切换多屏模式"快捷键
  async function checkSwitchMultiScreenShortcut(uos, system, dogtail, scenario) {
    await uos.openApp('控制中心', { maximizeWindow: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await system.exec('busctl --user call com.deepin.dde.ControlCenter /com/deepin/dde/ControlCenter com.deepin.dde.ControlCenter ShowModule s "device/keyboard/shortcutSettingsView"');
    await new Promise(resolve => setTimeout(resolve, 2500));

    // 用 dogtail 在 AT-SPI 树中查找"切换多屏模式"快捷键（比 AI 截图识别更可靠）
    const items = await dogtail.findAppChildren('dde-control-center', '切换多屏模式', { exact: true, onlyVisible: false });
    assertTrue(items && items.length > 0, `${scenario}：快捷键界面应显示"切换多屏模式"快捷键`);
    console.log(`${scenario}: 切换多屏模式快捷键已确认显示（dogtail 找到 ${items.length} 个匹配节点）`);

    await uos.closeCurrentWindow();
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  test('1801363-【控制中心】【设备】【键盘】【快捷键】"切换多屏模式"快捷键固定一直显示', async ({ device, agent, uos, system, dogtail }) => {
    // 步骤1: 单屏环境下，快捷键界面检查"切换多屏模式"显示
    console.log('步骤1: 单屏环境（禁用副屏）');
    await system.exec(`xrandr --output ${SECONDARY_MONITOR} --off`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await checkSwitchMultiScreenShortcut(uos, system, dogtail, '单屏环境');

    // 步骤2: 接入多屏后，快捷键界面检查"切换多屏模式"显示
    console.log('步骤2: 多屏环境（启用副屏扩展模式）');
    await system.exec(`xrandr --output ${PRIMARY_MONITOR} --mode 1920x1080 --pos 0x0 --primary --output ${SECONDARY_MONITOR} --mode 1920x1080 --pos 1920x0`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await checkSwitchMultiScreenShortcut(uos, system, dogtail, '多屏环境');

    // 步骤3: 接入多屏后，再拔掉只剩余单屏，快捷键界面检查"切换多屏模式"显示
    console.log('步骤3: 拔掉副屏回到单屏');
    await system.exec(`xrandr --output ${SECONDARY_MONITOR} --off`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await system.exec('busctl --user call org.deepin.dde.Display1 /org/deepin/dde/Display1 org.deepin.dde.Display1 ApplyChanges');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await checkSwitchMultiScreenShortcut(uos, system, dogtail, '拔掉后单屏环境');
  }, { timeout: 600000, tags: ['1801363', 'level3'] });

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
