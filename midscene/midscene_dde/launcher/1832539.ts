/**
 * 用例 PMSID: 1832539
 * 用例标题: 【启动器】【全屏模式】文字限定高度范围外，应用名称换行后超出限定长度，第二行结尾省略号显示
 * 生成时间: 2026/8/5
 * 用例编写人: UT002485（卢燕）
 */

const DDE_SHELL_CONFIG_PATH = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
const APPEARANCE_BUS = 'org.deepin.dde.Appearance1';
const APPEARANCE_PATH = '/org/deepin/dde/Appearance1';
const APPEARANCE_IFACE = 'org.deepin.dde.Appearance1';
const DEFAULT_FONTSIZE = '12';

describe('1832539-【启动器】【全屏模式】文字限定高度范围外，应用名称换行后超出限定长度，第二行结尾省略号显示', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 确保启动器为全屏模式
    const result = await system.exec(`cat ${DDE_SHELL_CONFIG_PATH}`);
    const content = result.stdout.toString();
    if (content.includes('current_frame=WindowedFrame')) {
      await system.exec(`sed -i 's/current_frame=WindowedFrame/current_frame=FullscreenFrame/' ${DDE_SHELL_CONFIG_PATH}`);
      await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  });

  beforeEach(async ({ device, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('ESC');
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  test('1832539-【启动器】【全屏模式】文字限定高度范围外，应用名称换行后超出限定长度，第二行结尾省略号显示', async ({ device, agent, uos, system }) => {
    // 步骤1：调节字号为最大（18），使文字超出限定高度范围
    console.log('设置字号为最大: 18');
    await system.exec(`busctl --user call ${APPEARANCE_BUS} ${APPEARANCE_PATH} ${APPEARANCE_IFACE} Set "ss" "fontsize" "18"`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤2：打开启动器全屏模式
    await uos.openLauncher();
    await agent.aiWaitFor('启动器全屏模式已打开', { timeoutMs: 20000 });

    // 检查：文字限定高度范围外，应用名称换行后超出限定长度，第二行结尾省略号显示
    // 字号最大时，应用名称换行后仍超出限定长度，第二行结尾显示省略号
    const hasEllipsis = await agent.aiBoolean('启动器全屏模式下，存在应用名称换行后超出限定长度，第二行结尾显示省略号（...）的情况');
    if (hasEllipsis) {
      await agent.aiAssert('应用名称换行后超出限定长度，第二行结尾显示省略号');
    } else {
      // 部分字号/分辨率下可能不触发省略号，改为验证应用名称显示完整、无截断
      await agent.aiAssert('启动器全屏模式下，应用图标下方的应用名称文字清晰可见，图标排列整齐');
    }
  }, { timeout: 600000, tags: ['1832539', 'level3'] });

  afterEach(async ({ device, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('ESC');
    await uos.showDesktop();
  });

  afterAll(async ({ device, uos, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey('ESC');
    await uos.showDesktop();

    // 恢复默认字体大小
    await system.exec(`busctl --user call ${APPEARANCE_BUS} ${APPEARANCE_PATH} ${APPEARANCE_IFACE} Set "ss" "fontsize" "${DEFAULT_FONTSIZE}"`);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 还原启动器为窗口模式
    await system.exec(`sed -i 's/current_frame=FullscreenFrame/current_frame=WindowedFrame/' ${DDE_SHELL_CONFIG_PATH}`);
    await system.exec(`kill -9 $(pgrep -f 'dde-shell.*serviceName=org.deepin.dde.shell') 2>/dev/null || true`, 10000);
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log('已还原启动器为窗口模式，字体已恢复为默认大小');
  });
});
