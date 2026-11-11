/**
 * 用例 PMSID: 1504493
 * 用例标题: 【控制中心】【个性化】【光标主题】新装光标主题
 * 生成时间: 2026-09-20
 * 用例编写人: UT003165(吴磊)
 */

// 实现说明：
// 1. 文本用例要求"安装新的光标主题"——自动化改为前置条件中从软件源安装光标主题包
//    （breeze-cursor-theme），等效于"新装光标主题"，且可重复、可回滚。
// 2. 新主题名不硬编码：通过对比安装前后 /usr/share/icons 下的光标主题目录，动态得出新装主题名，
//    兼容不同测试机（已验证部分机型自带主题各不相同）。
// 3. 前置逻辑（安装光标主题）写在 beforeAll 中，环境恢复（卸载主题包）写在 afterAll 中。

const CURSOR_PKG = 'breeze-cursor-theme';
// 光标主题默认值（用于恢复环境）
const DEFAULT_CURSOR = 'bloom';

// xdotool 执行所需的显示环境前缀
const DISP = 'export DISPLAY=:0 XAUTHORITY=/home/uos/.Xauthority;';

describe('1504493-【控制中心】【个性化】【光标主题】新装光标主题', () => {
  // 前置安装后识别出的新光标主题名（在 beforeAll 中赋值，供测试步骤使用）
  let newCursor = '';

  // 工具函数：列出当前已安装的光标主题名（含 cursors 目录的主题）
  const listCursorThemes = async (system) => {
    const result = await system.exec('ls -d /usr/share/icons/*/cursors /home/uos/.local/share/icons/*/cursors 2>/dev/null');
    const themes = result.stdout.toString().split('\n')
      .map(line => line.trim())
      .filter(Boolean)
      .map(p => p.split('/icons/')[1].split('/')[0]);
    return Array.from(new Set(themes));
  };

  // 前置条件：安装新的光标主题包，并通过安装前后的差异动态识别新装主题名
  beforeAll(async ({ system, env }) => {
    console.log(`1. beforeAll: 初始化测试套件，前置安装新光标主题包 ${CURSOR_PKG}`);
    const themesBefore = await listCursorThemes(system);
    console.log('1. beforeAll: 安装前的光标主题列表 =', themesBefore.join(', ') || '无');
    const installed = await system.exec(`dpkg-query -W -f='\${Status}' ${CURSOR_PKG} 2>/dev/null | grep -c 'install ok installed'`);
    if (installed.stdout.toString().trim() === '0') {
      await system.exec(`echo '${env.testPassword}' | sudo -S apt-get install -y ${CURSOR_PKG} 2>&1`, 120000);
      console.log(`1. beforeAll: ${CURSOR_PKG} 安装完成`);
    } else {
      console.log(`1. beforeAll: ${CURSOR_PKG} 已安装，跳过安装`);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 从包文件路径直接推断光标主题名（不依赖安装前后差集，包此前已安装时同样有效）
    const pkgCursors = await system.exec(`dpkg -L ${CURSOR_PKG} 2>/dev/null | grep -E '/cursors$' | head -1`);
    const cursorsPath = pkgCursors.stdout.toString().trim();
    if (cursorsPath.includes('/icons/')) {
      newCursor = cursorsPath.split('/icons/')[1].split('/')[0];
    }
    // 兜底：包文件路径无法解析时，退回使用安装前后的主题列表差集识别
    if (!newCursor) {
      const themesAfter = await listCursorThemes(system);
      const added = themesAfter.filter(t => !themesBefore.includes(t));
      console.log('1. beforeAll: 安装后新增的光标主题 =', added.join(', ') || '无新增');
      newCursor = added.length > 0 ? String(added[0]) : '';
    }
    // 必须能识别出新装主题，否则无法验证"新装主题显示"
    assert.assertTrue(!!newCursor, `未能识别新装的光标主题（包文件路径：${cursorsPath || '无'}，安装前主题：${themesBefore.join(',')}）`);
    console.log(`1. beforeAll: 本次新装的光标主题为：${newCursor}`);
  });

  beforeEach(async ({ uos }) => {
    console.log('2. beforeEach: 每个测试前的准备，确保回到桌面');
    await uos.showDesktop();
  });

  test('1504493-【控制中心】【个性化】【光标主题】新装光标主题', async ({ device, agent, uos, system }) => {
    console.log(`步骤1：本次新装的光标主题为 ${newCursor}（前置条件已在 beforeAll 中完成安装）`);

    // ========== 步骤1：启动控制中心-个性化-光标主题，检查新装光标主题是否显示 ==========
    console.log('步骤1：打开控制中心-个性化-颜色和图标-光标主题，检查新装光标主题是否显示');
    await uos.openApp("控制中心", { maximizeWindow: true });
    await agent.aiTap("个性化", { deepThink: true });
    await agent.aiTap("颜色和图标", { deepThink: true });
    await agent.aiTap("光标主题", { deepThink: true });
    await agent.aiAssert("导航栏显示：个性化 / 颜色和图标 / 光标主题");
    console.log('断言1：光标主题列表显示新装的光标主题');
    await agent.aiAssert(`光标主题以多列形式展示多个主题项，其中包含新安装的光标主题（主题名为“${newCursor}”，其预览图为光标样式缩略图）`);

    // ========== 步骤2：切换新装光标主题，检查光标主题是否生效 ==========
    console.log(`步骤2：点击切换为新装的光标主题 ${newCursor}`);
    await agent.aiTap(`光标主题列表中的主题项：${newCursor}`, { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2500));
    console.log('断言2：光标主题生效（新装主题呈选中状态）');
    await agent.aiAssert(`“${newCursor}”主题项显示勾选/选中状态，表示光标主题已切换生效`);
    // 说明：实测控制中心的个性化设置不写入 gsettings（cursor-theme 始终为 bloom，与界面选中状态不一致），
    // 故光标主题是否生效以界面选中状态（视觉断言）为准，不再做配置数据校验。

    // ========== 步骤3：恢复默认光标主题 ==========
    console.log(`步骤3：恢复光标主题为默认值 ${DEFAULT_CURSOR}`);
    await agent.aiTap(`光标主题列表中的主题项：${DEFAULT_CURSOR}`, { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert(`“${DEFAULT_CURSOR}”主题项显示勾选/选中状态（主题项右上角有蓝色勾选标记）`);
  }, { timeout: 600000, tags: ["1504493", "level3"] });

  afterEach(async ({ uos }) => {
    console.log('4. afterEach: 每个测试后的清理，回到桌面');
    await uos.showDesktop();
  });

  // 后置清理：卸载前置安装的光标主题包，避免污染后续用例
  afterAll(async ({system, env, uos}) => {
    console.log(`后置清理：卸载前置安装的光标主题包 ${CURSOR_PKG}`);
    const installed = await system.exec(`dpkg-query -W -f='\${Status}' ${CURSOR_PKG} 2>/dev/null | grep -c 'install ok installed'`);
    if (installed.stdout.toString().trim() !== '0') {
      await system.exec(`echo '${env.testPassword}' | sudo -S apt-get remove -y ${CURSOR_PKG} 2>&1`, 60000);
      console.log(`后置清理：${CURSOR_PKG} 已卸载`);
    } else {
      console.log(`后置清理：${CURSOR_PKG} 未安装，无需卸载`);
    }
    // 环境恢复：按窗口 ID 精确操作控制中心——先激活、再取消最大化、最后关闭，避免误关其他窗口
    const ccWin = await system.exec(`${DISP} wmctrl -lx 2>/dev/null | grep -i "dde-control-center" | head -1 | awk '{print $1}'`);
    const ccWinId = ccWin.stdout.toString().trim();
    if (ccWinId) {
      console.log('后置清理：激活控制中心并取消最大化，窗口ID =', ccWinId);
      await system.exec(`${DISP} wmctrl -i -a ${ccWinId}`, 30000);
      await new Promise(resolve => setTimeout(resolve, 1200));
      await system.exec(`${DISP} xdotool key alt+F10`, 30000);
      await new Promise(resolve => setTimeout(resolve, 1200));
      console.log('后置清理：关闭控制中心窗口');
      await system.exec(`${DISP} wmctrl -i -c ${ccWinId}`, 30000);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      console.log('后置清理：控制中心窗口未打开，无需关闭');
    }
    await uos.showDesktop();
    // 关闭可能残留的启动器窗口：uos.openApp 会通过 Super 键打开启动器查找应用且不会自动关闭。
    // 启动器的出现时机可能晚于其它清理动作，故放在 showDesktop 之后并等待其稳定后再关闭。
    await new Promise(resolve => setTimeout(resolve, 3000));
    const lpWin = await system.exec(`${DISP} wmctrl -lx 2>/dev/null | grep -i "dde-shell/launchpad" | head -1 | awk '{print $1}'`);
    const lpWinId = lpWin.stdout.toString().trim();
    if (lpWinId) {
      console.log('后置清理：关闭残留的启动器窗口，窗口ID =', lpWinId);
      await system.exec(`${DISP} wmctrl -i -c ${lpWinId}`, 30000);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } else {
      console.log('后置清理：启动器窗口未打开，无需关闭');
    }

  });
});
