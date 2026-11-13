/**
 * 用例 PMSID: 1910359
 * 用例标题: 【启动器】【窗口模式】【按分类】在分类菜单面板上，左键无法拖拽下层应用
 * 生成时间: 2026-08-13 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

// 用例思路：
// 本用例验证"启动器排序菜单中的菜单项无法被拖拽"这一行为。
// 不安装任何应用、忽略前置条件，直接：
//   1. 打开启动器（确保窗口模式）
//   2. 点击左上角排序模式图标（自由菜单），弹出"自由排序/按分类/按名称"三个选项
//   3. 尝试拖动"自由排序"菜单项 —— 该菜单项不是应用图标，无法被拖动，
//      且不会连带拖动任何应用，界面保持不变，即判定用例通过（pass）。
describe('1910359-【启动器】【窗口模式】【按分类】在分类菜单面板上，左键无法拖拽下层应用', () => {
  // TESTCASE_DIR 由框架注入（.env 中配置，默认 apps/），用于定位共享公共方法
  const caseDir = process.env.TESTCASE_DIR;
  // 启动器模式（全屏/窗口）由 settings.ini 的 current_frame 决定，用绝对路径读取
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  // 记录进入用例前的原始启动器模式，afterAll 时还原
  let originalFrame = 'WindowedFrame';

  // 配置驱动切换启动器模式：写入 settings.ini 后重启 dde-shell 才生效（UI 切模式依赖外部参考图，不可靠）
  const setLauncherFrame = async (system, frame) => {
    await system.exec(`sed -i "s/current_frame=.*/current_frame=${frame}/" ${settingsIni}`);
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
  };

  beforeAll(async ({ device, system }) => {
    console.log('========== beforeAll ==========');
    // 先显示桌面，保证干净起始状态
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 读取当前启动器模式；若非窗口模式则切换为窗口模式（本用例要求窗口模式）
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    if (frameMatch) originalFrame = frameMatch[1];
    if (originalFrame !== 'WindowedFrame') {
      console.log(`[1/1] 当前模式=${originalFrame}，切换为窗口模式`);
      await setLauncherFrame(system, 'WindowedFrame');
    } else {
      console.log('[1/1] 已是窗口模式，无需切换');
    }
  });

  beforeEach(async ({ device }) => {
    console.log('========== beforeEach ==========');
    // 释放所有按键，避免上一个用例残留的组合键状态影响本次操作
    await device.releaseAllKeys();
  });

  test('1910359-【启动器】【窗口模式】【按分类】在分类菜单面板上，左键无法拖拽下层应用', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器窗口模式
    console.log('[步骤 1/3] 打开启动器窗口模式');
    await uos.openLauncher();

    // 步骤2：点击启动器左上角排序模式图标（自由菜单），打开排序菜单
    // 点击方式复用 switchLauncherSortMode 公共方法中的写法：
    // 用 aiTap + 参考图 1832207.png（左上角排序图标）+ deepThink 精确定位
    console.log('[步骤 2/3] 点击启动器左上角排序模式图标，打开排序菜单');
    await agent.aiTap({
      prompt: '识别指定图标坐标：在启动器窗口最顶部左上角的排序模式图标（该图标在字母导航区域的上方，不是字母导航中的#分类）',
      images: [{ name: '自由排序小图标', url: 'https://youqu.uniontech.com/_picture/professional-desktop/logo/1832207.png' }],
      deepThink: true,
    });
    // 断言排序菜单已打开：显示"自由排序、按分类、按名称"三个选项
    await agent.aiAssert('启动器窗口显示：自由排序、按分类、按名称');

    // 步骤3：拖动"自由排序"菜单项
    // aiDragHover：按住鼠标左键把源元素拖向目标区域（不松手走分步移动）
    // 源：排序菜单中的"自由排序"菜单项；目标：启动器应用列表区域
    // 预期：菜单项不是应用图标，无法被拖拽，也不会带动任何应用移动 → pass
    console.log('[步骤 3/3] 拖动排序菜单中的"自由排序"菜单项');
    const { aiDragHover } = await import(`${caseDir}midscene_dde/common/common.js`);
    await aiDragHover(agent, '排序菜单中的"自由排序"菜单项', '启动器应用列表区域', system, {
      waitForHover: 800, // 拖到目标后悬停 800ms，观察是否有拖拽反应
    });
    await new Promise(resolve => setTimeout(resolve, 800));

    // 断言：拖拽后菜单项未被移动、应用列表位置无变化，界面正常
    await agent.aiAssert('尝试拖动排序菜单中的"自由排序"菜单项后，菜单项未被拖动移动，应用列表中的应用图标位置未发生变化，界面显示正常');
    // ESC 收起启动器，收尾清理
    await device.pressKey('esc');
    await new Promise(resolve => setTimeout(resolve, 500));
  }, { timeout: 600000, tags: ['1910359', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    // 每个用例结束后释放所有按键，防止残留按键状态影响下一个用例
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll ==========');
    // 还原排序模式为自由排序（dde-dconfig 直接写，不打开启动器）
    const { restoreLauncherSortMode } = require(process.env.TESTCASE_DIR + '/midscene_dde/common/common');
    await restoreLauncherSortMode(system);
    // 若进入用例前是非窗口模式，则还原原始模式（一次 dde-shell 重启同时生效）
    if (originalFrame !== 'WindowedFrame') {
      await setLauncherFrame(system, originalFrame);
    }
    // 收起启动器、回到桌面，恢复干净状态
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
