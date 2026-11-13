/**
 * 用例 PMSID: 1832533
 * 用例标题: 【启动器】【全屏模式】调节字号为最大，检查字体和图标高度
 * 生成时间: 2026/8/5
 * 用例编写人: UT002485（卢燕）
 */

const DDE_SHELL_CONFIG_PATH = '~/.config/deepin/org.deepin.dde-shell/settings.ini';
const APPEARANCE_BUS = 'org.deepin.dde.Appearance1';
const APPEARANCE_PATH = '/org/deepin/dde/Appearance1';
const APPEARANCE_IFACE = 'org.deepin.dde.Appearance1';
const DEFAULT_FONTSIZE = '12';
const MAX_FONTSIZE = '18';
const REF_PATH = '/tmp/launcher_default_font_1832533.png';
const REF_PATH_JPG = '/tmp/launcher_default_font_1832533.jpg';
describe('1832533-【启动器】【全屏模式】调节字号为最大，检查字体和图标高度', () => {
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

  test('1832533-【启动器】【全屏模式】调节字号为最大，检查字体和图标高度', async ({ device, agent, uos, system }) => {
    // 步骤1：先用默认字号打开启动器全屏，截图记录默认字体下的图标和文字状态
    await system.exec(`busctl --user call ${APPEARANCE_BUS} ${APPEARANCE_PATH} ${APPEARANCE_IFACE} Set "ss" "fontsize" "${DEFAULT_FONTSIZE}"`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    await uos.openLauncher();
    await agent.aiWaitFor('启动器全屏模式已打开', { timeoutMs: 20000 });
    await system.exec(`rm -f ${REF_PATH} ${REF_PATH_JPG}`);
    await system.exec(`scrot ${REF_PATH}`, 15000);
    let defaultRefUrl = '';
    // 用 ImageMagick 压缩为小尺寸 JPEG，减小 base64 体积
    await system.exec(`convert ${REF_PATH} -resize 960x540 -quality 60 ${REF_PATH_JPG}`, 10000);
    // 优先读取 JPEG（体积小），回退到 PNG
    let b64Res = await system.exec(`base64 -w 0 ${REF_PATH_JPG} 2>/dev/null`, 30000);
    if (b64Res.success && b64Res.stdout && b64Res.stdout.trim().length > 100) {
      defaultRefUrl = `data:image/jpeg;base64,${b64Res.stdout.trim()}`;
      console.log(`已捕获默认字号参考图(JPEG压缩), base64 长度: ${defaultRefUrl.length}`);
    } else {
      b64Res = await system.exec(`base64 -w 0 ${REF_PATH} 2>/dev/null`, 30000);
      if (b64Res.success && b64Res.stdout && b64Res.stdout.trim().length > 100) {
        defaultRefUrl = `data:image/png;base64,${b64Res.stdout.trim()}`;
        console.log(`已捕获默认字号参考图(PNG), base64 长度: ${defaultRefUrl.length}`);
      }
    }
    if (!defaultRefUrl) {
      console.log('警告: 未能捕获参考图 base64，将使用无参考图方式断言');
    }
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤2：调节字号为最大
    console.log('设置字号为最大: 18');
    await system.exec(`busctl --user call ${APPEARANCE_BUS} ${APPEARANCE_PATH} ${APPEARANCE_IFACE} Set "ss" "fontsize" "${MAX_FONTSIZE}"`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤3：再次打开启动器全屏模式
    await uos.openLauncher();
    await agent.aiWaitFor('启动器全屏模式已打开', { timeoutMs: 20000 });

    // 检查：应用图标大小不变，字体变大（与默认字号参考图对比）
    if (defaultRefUrl) {
      const matched = await agent.aiBoolean({
        prompt: '当前启动器界面与参考图相比：应用图标大小基本不变，但应用名称文字明显变大（参考图为默认字号，当前为最大字号，文字应更大）',
        images: [{ name: '默认字号下的启动器参考图', url: defaultRefUrl }],
      });
      if (!matched) {
        throw new Error('应用图标大小未保持一致或字体未变大');
      }
    } else {
      // 无参考图时，验证当前字号为最大字号18的应用名称文字明显较大
      await agent.aiAssert('启动器全屏模式下的应用名称文字字体较大且清晰醒目（当前字号已设置为18号最大字号），应用图标大小正常');
    }

    // 关闭启动器
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 500));
  }, { timeout: 600000, tags: ['1832533', 'level3'] });

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
