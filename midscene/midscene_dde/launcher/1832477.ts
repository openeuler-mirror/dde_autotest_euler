/**
 * 用例 PMSID: 1832477
 * 用例标题: 【启动器】【窗口模式】【键盘交互规则】在"最近安装"区域内点击键盘方向键切换应用
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 */

// 公共方法：createTestApp 通过创建 .desktop 文件模拟安装应用，保证"最近安装"分类可见
const { createTestApp, cleanupTestApps } = require(process.env.TESTCASE_DIR + '/midscene_dde/common/common');

describe('1832477-【启动器】【窗口模式】【键盘交互规则】在"最近安装"区域内点击键盘方向键切换应用', () => {
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  // 模拟安装 4 个测试应用（最后创建的"测试安装丁"最新，排在"最近安装"首位）
  const testApps = [
    { name: '测试安装甲', file: 'ut-install-a' },
    { name: '测试安装乙', file: 'ut-install-b' },
    { name: '测试安装丙', file: 'ut-install-c' },
    { name: '测试安装丁', file: 'ut-install-d' },
  ];

  beforeAll(async ({ device, system }) => {
    console.log('========== beforeAll: 创建 4 个最近安装测试应用 ==========');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 依次创建，统一不重启 dde-shell，创建完再重启
    for (const app of testApps) {
      await createTestApp(system, app.name, app.file, 'deepin-editor', 'deepin-editor', 'Development;', false);
    }
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('  - 已创建 4 个测试应用并重启 dde-shell');
    // 前置条件再重启一次 dde-shell，彻底刷新应用列表并重置键盘焦点，降低偶发 flake
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('  - 前置条件已二次重启 dde-shell');
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

  test('1832477-【启动器】【窗口模式】【键盘交互规则】在"最近安装"区域内点击键盘方向键切换应用', async ({ device, agent, uos }) => {
    console.log('========== 用例执行开始 ==========');

    // 断言工具：检查"最近安装"区域指定位置的应用是否被选中（带重试，AI 视觉对小图标偶发误判）
    const assertSelected = async (posDesc) => {
      let ok = false;
      for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
        ok = await agent.aiBoolean(`${posDesc}处于选中状态（图标四周有蓝色边框或高亮底色）`, { deepThink: true });
        if (!ok) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      await agent.aiAssert(`${posDesc}处于选中状态（图标四周有蓝色边框或高亮底色）`);
    };

    // ── 步骤 1/3：打开启动器窗口模式 ──
    console.log('[步骤 1/3] 打开启动器窗口模式');
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('启动器窗口已显示，包含"最近安装"区域');

    // ── 步骤 2/3：按 Tab 键切换到"最近安装"区域首位应用（最多 10 次）──
    console.log('[步骤 2/3] 循环按 Tab 键，直到"最近安装"首位应用被选中（最多 10 次）');
    let got = false;
    for (let i = 1; i <= 10; i++) {
      await device.pressKey('Tab');
      await new Promise(resolve => setTimeout(resolve, 800));
      got = await agent.aiBoolean('启动器"最近安装"区域应用网格中最左侧第一个应用图标处于选中状态（图标四周有蓝色边框或高亮底色）', { deepThink: true });
      console.log(`  第 ${i} 次 Tab 后"最近安装"首位应用选中状态: ${got}`);
      if (got) {
        break;
      }
    }
    if (!got) {
      throw new Error('按 Tab 键 10 次后，"最近安装"区域首位应用仍未处于选中状态');
    }
    console.log('  - 验证通过：Tab 使"最近安装"首位应用被选中');

    // ── 步骤 3/3：右移 3 下断言最右侧应用选中，再左移 3 下断言回到首位 ──
    console.log('[步骤 3/3] 右键 3 次断言最右侧应用选中，左键 3 次断言回到首位应用选中');
    await device.pressKey('Right');
    await new Promise(resolve => setTimeout(resolve, 600));
    await device.pressKey('Right');
    await new Promise(resolve => setTimeout(resolve, 600));
    await device.pressKey('Right');
    await new Promise(resolve => setTimeout(resolve, 800));
    await assertSelected('启动器"最近安装"区域应用网格中从左往右第4个（最右侧）应用图标');
    console.log('  - 验证通过：右键 3 次后最右侧应用被选中');

    await device.pressKey('Left');
    await new Promise(resolve => setTimeout(resolve, 600));
    await device.pressKey('Left');
    await new Promise(resolve => setTimeout(resolve, 600));
    await device.pressKey('Left');
    await new Promise(resolve => setTimeout(resolve, 800));
    await assertSelected('启动器"最近安装"区域应用网格中最左侧第一个应用图标');
    console.log('  - 验证通过：左键 3 次后回到首位应用被选中');

    // ── 收尾：关闭启动器，还原桌面 ──
    await device.pressKey('esc');
    await new Promise(resolve => setTimeout(resolve, 800));
    await uos.showDesktop();
    console.log('  - 已关闭启动器并显示桌面');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1832477', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll: 清理测试应用并还原 ==========');
    // 删除 4 个测试 .desktop 文件 + 清缓存 + 重启 dde-shell，避免残留影响后续用例
    for (const app of testApps) {
      await system.exec(`rm -f /home/uos/.local/share/applications/${app.file}.desktop 2>/dev/null`);
    }
    await cleanupTestApps(system, testApps.map(a => a.name));
    await system.exec('update-desktop-database /home/uos/.local/share/applications/ 2>/dev/null');
    await system.exec('systemctl --user restart dde-shell@DDE');
    await new Promise(resolve => setTimeout(resolve, 4000));
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});