/**
 * 用例 PMSID: 1832481
 * 用例标题: 【启动器】【窗口模式】【键盘交互规则】在"左侧菜单"区域内点击键盘方向键切换应用
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 * 注：左侧快捷访问栏图标顺序：计算机→图片→文档→桌面→控制中心（SideBar.qml KeyNavigation 链）
 *     "排序模式"按钮在最上方；内网参考图 URL 必须加 convertHttpImage2Base64 由框架转 base64
 */

describe('1832481-【启动器】【窗口模式】【键盘交互规则】在"左侧菜单"区域内点击键盘方向键切换应用', () => {
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  const IMG = {
    computer: 'http://10.7.62.32/midscene-uos/midscene_dde/resources/launcher/Computer.png',
    documents: 'http://10.7.62.32/midscene-uos/midscene_dde/resources/launcher/Documents.png',
  };
  // 左侧快捷访问栏定位锚点（右上角"排序模式"按钮正下方的竖向图标列，紧贴窗口左边缘；不是应用网格也不是任务栏）
  const SIDE = '启动器窗口左上角"排序模式"按钮正下方的那一列竖向侧边栏快捷访问图标（最左侧紧贴左边缘的小图标列）';

  beforeAll(async ({ device }) => {
    console.log('========== beforeAll: 初始化测试套件 ==========');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device, system }) => {
    console.log('========== beforeEach: 确保启动器窗口模式并重置键盘焦点 ==========');
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const curFrame = frameMatch ? frameMatch[1] : '';
    if (curFrame !== 'WindowedFrame') {
      console.log('  - 当前非窗口模式，切换为 WindowedFrame');
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${settingsIni}`);
    } else {
      console.log('  - 已是窗口模式');
    }
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.pressKey('ESC');
  });

  test('1832481-【启动器】【窗口模式】【键盘交互规则】在"左侧菜单"区域内点击键盘方向键切换应用', async ({ device, agent, uos, system }) => {
    console.log('========== 用例执行开始 ==========');

    // 断言工具：检查侧边栏中与参考图片一致的图标被选中（aiBoolean 文本重试 + aiAssert 带参考图终验，渲染进 HTML）
    const assertIconSelected = async (iconDesc, refImg) => {
      let ok = false;
      for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
        ok = await agent.aiBoolean(`${SIDE}中${iconDesc}处于选中状态（图标四周有蓝色边框或高亮选中底色）`, { deepThink: true });
        if (!ok) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
      await agent.aiAssert({
        prompt: `${SIDE}中，与左侧参考图片一致的那个图标当前处于选中状态（图标四周有蓝色边框或高亮选中底色）`,
        images: [{ name: refImg.name, url: refImg.url }],
        convertHttpImage2Base64: true,
      }, { deepThink: true });
    };

    // ── 步骤 1/5：打开启动器窗口模式 ──
    console.log('[步骤 1/5] 打开启动器窗口模式');
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ── 步骤 2/5：按 Tab 键循环，直到"排序模式"按钮被选中（最多 10 次）──
    console.log('[步骤 2/5] 循环按 Tab 键，直到焦点切到"排序模式"按钮（最多 10 次）');
    let onSort = false;
    for (let i = 1; i <= 10; i++) {
      await device.pressKey('Tab');
      await new Promise(resolve => setTimeout(resolve, 800));
      onSort = await agent.aiBoolean('启动器窗口左上角"排序模式"按钮处于选中/聚焦状态（按钮四周有蓝色边框或高亮选中底色）', { deepThink: true });
      console.log(`  第 ${i} 次 Tab 后"排序模式"选中状态: ${onSort}`);
      if (onSort) {
        break;
      }
    }
    if (!onSort) {
      throw new Error('按 Tab 键 10 次后，焦点未切换到"排序模式"按钮');
    }
    console.log('  - 验证通过：Tab 使焦点切到"排序模式"按钮');

    // ── 步骤 3/5：下键导航到计算机图标并断言；再下键 4 次（每次等 3s）到控制中心，再上键 2 次到文档图标并断言 ──
    console.log('[步骤 3/5] 下键1次断言计算机选中；下键4次(每次等3s)；上键2次断言文档选中');
    await device.pressKey('Down');
    await new Promise(resolve => setTimeout(resolve, 1200));
    await assertIconSelected('从上往下第1个图标（黑色显示器/电脑图形，计算机图标）', { name: '计算机图标', url: IMG.computer });
    console.log('  验证通过：下键 1 次后计算机图标被选中（Computer.png）');

    for (let i = 0; i < 4; i++) {
      await device.pressKey('Down');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    await new Promise(resolve => setTimeout(resolve, 500));

    await device.pressKey('Up');
    await new Promise(resolve => setTimeout(resolve, 800));
    await device.pressKey('Up');
    await new Promise(resolve => setTimeout(resolve, 1200));
    await assertIconSelected('文档图标（纸张/文档图形，文档图标）', { name: '文档图标', url: IMG.documents });
    console.log('  验证通过：下键4次、上键2次后文档图标被选中（Documents.png）');

    // ── 步骤 4/5：按 Enter 打开文档目录，断言文件管理器已打开且左侧"文档"菜单被选中 ──
    console.log('[步骤 4/5] 按 Enter 打开文档，断言文件管理器打开且左侧"文档"菜单被选中');
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 8000));
    await agent.aiAssert('文件管理器已打开，窗口左侧导航栏中"文档"分类被选中（高亮），主窗口显示文档文件夹内容', undefined, { deepThink: true });
    console.log('  验证通过：文件管理器已打开，左侧"文档"菜单被选中');

    // ── 步骤 5/5：收尾关闭所有窗口，显示桌面 ──
    console.log('[步骤 5/5] 收尾：关闭打开的应用窗口');
    await device.pressKey('Alt', 'F4');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await uos.showDesktop();
    await device.pressKey('esc');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1832481', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll: 清理测试套件 ==========');
    // 兜底关闭可能残留的窗口
    const wm = ((await system.exec('wmctrl -l', 5000)).stdout || '');
    const extra = wm.split('\n').filter(l => !l.includes('桌面') && !l.includes('org.deepin.ds.dock') && l.trim());
    for (const line of extra) {
      const wid = line.trim().split(/\s+/)[0];
      await system.exec(`wmctrl -ic ${wid} 2>/dev/null`, 3000);
    }
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 重启 dde-shell 收尾，避免残留状态影响后续用例
    console.log('  - 重启 dde-shell 清理残留状态');
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});