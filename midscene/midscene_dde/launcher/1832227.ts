/**
 * 用例 PMSID: 1832227
 * 用例标题: 【启动器】【窗口模式】调节字号为最小，检查字体和图标高度
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832227-【启动器】【窗口模式】调节字号为最小，检查字体和图标高度', () => {
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  const fontGetCmd = 'busctl --user get-property org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 FontSize';
  const fontSetCmd = (size) => `busctl --user call org.deepin.dde.Appearance1 /org/deepin/dde/Appearance1 org.deepin.dde.Appearance1 Set "ss" "fontsize" "${size}"`;
  // 控制中心字号档位为 px：[11,12,13,14,...]，DBus FontSize 为 pt；11px = 8.25pt，14px = 10.5pt
  const MIN_FONT = '8.25';      // 最小字号 11px
  const DEFAULT_FONT = '10.5';  // 默认字号 14px

  beforeAll(async ({ device, system }) => {
    console.log('========== beforeAll: 初始化测试套件 ==========');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  beforeEach(async ({ device, system }) => {
    console.log('========== beforeEach: 确保启动器窗口模式 ==========');
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const curFrame = frameMatch ? frameMatch[1] : '';
    if (curFrame !== 'WindowedFrame') {
      console.log('  - 当前非窗口模式，切换为 WindowedFrame 并重启 dde-shell');
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${settingsIni}`);
      await system.exec('systemctl --user restart dde-shell@DDE');
      await new Promise(resolve => setTimeout(resolve, 4000));
    } else {
      console.log('  - 已是窗口模式，无需处理');
    }
    await device.pressKey('ESC');
  });

  test('1832227-【启动器】【窗口模式】调节字号为最小，检查字体和图标高度', async ({ device, agent, uos, system }) => {
    // 步骤1：通过 DBus 将系统字号调整为最小（11px = 8.25pt）
    console.log('[步骤 1/3] 调整字号为最小 ' + MIN_FONT);
    const setResult = await system.exec(fontSetCmd(MIN_FONT));
    if (!setResult.success) {
      throw new Error('调整字号为最小失败');
    }
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 步骤2：DBus 读回校验字号确实已调整为最小
    console.log('[步骤 2/3] DBus 校验字号已调整为最小');
    const checkResult = await system.exec(fontGetCmd);
    const checkMatch = checkResult.stdout ? checkResult.stdout.match(/(\d+(?:\.\d+)?)/) : null;
    assertTrue(
      checkMatch && Math.abs(parseFloat(checkMatch[1]) - parseFloat(MIN_FONT)) < 0.01,
      '字号未成功调整为最小，当前为 ' + (checkMatch ? checkMatch[1] : '未知')
    );
    console.log('  校验通过，当前字号: ' + (checkMatch ? checkMatch[1] : ''));

    // 步骤3：打开启动器窗口模式，检查字号变小后界面显示正常
    console.log('[步骤 3/3] 打开启动器窗口模式，检查字体和图标高度');
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiAssert('启动器窗口模式已显示，应用名称字号较小，文字清晰可读');

    // 图标高度几何测量：多次采样取中位数，过滤AI识别误差
    const measureIconHeight = async () => {
      const heights = [];
      for (let i = 0; i < 3; i++) {
        const loc = await agent.aiLocate('启动器窗口左侧应用列表中的应用图标');
        const h = loc && loc.rect ? loc.rect.height : 0;
        if (h > 0) heights.push(h);
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      heights.sort((a, b) => a - b);
      return heights[Math.floor(heights.length / 2)];
    };
    const iconHeight = await measureIconHeight();
    console.log('  最小字号下应用图标高度: ' + iconHeight);
    assertTrue(iconHeight > 0, '最小字号下应用图标高度测量失败');
    await agent.aiAssert('启动器窗口模式应用图标高度正常，图标完整显示无截断，与应用名称布局合理');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1832227', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll: 清理测试套件，还原字号为默认 14px(' + DEFAULT_FONT + 'pt) ==========');
    await system.exec(fontSetCmd(DEFAULT_FONT));
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 收尾：检查启动器模式，非窗口模式则切换为窗口模式（已窗口则保持不变）
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    const curFrame = frameMatch ? frameMatch[1] : '';
    console.log('  收尾检查启动器模式: ' + (curFrame || '未知'));
    if (curFrame !== 'WindowedFrame') {
      await system.exec(`sed -i "s/current_frame=.*/current_frame=WindowedFrame/" ${settingsIni}`);
      await system.exec('systemctl --user restart dde-shell@DDE');
      await new Promise(resolve => setTimeout(resolve, 4000));
      console.log('  已切换启动器为窗口模式');
    } else {
      console.log('  启动器已是窗口模式，保持不变');
    }
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
