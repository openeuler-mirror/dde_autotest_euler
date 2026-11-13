/**
 * 用例 PMSID: 1832509
 * 用例标题: 【启动器】【右键菜单】应用右键菜单功能验证---"禁用屏幕缩放"功能
 * 生成时间: 2026-09-01 15:12:25
 * 用例编写人: UT002998(熊林辉)
 */

describe('1832509-【启动器】【右键菜单】应用右键菜单功能验证---"禁用屏幕缩放"功能', () => {
  let originalFrame = 'WindowedFrame';
  let originalScale = 0;
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  const appearance = 'org.deepin.dde.Appearance1';
  // 屏幕缩放比设置（与"禁用屏幕缩放"右键菜单联动的前置条件）：控制中心「显示→缩放」的 DDE API 入口
  const scaleGetCmd = `busctl --user call ${appearance} /org/deepin/dde/Appearance1 ${appearance} GetScaleFactor`;
  const scaleSetCmd = (v) => `busctl --user call ${appearance} /org/deepin/dde/Appearance1 ${appearance} SetScaleFactor "d" ${v}`;

  // 工具函数：读取当前屏幕缩放比（GetScaleFactor 返回 d 类型，如 "d 1" / "d 1.25"）
  const readScaleFactor = async (system) => {
    const result = await system.exec(scaleGetCmd);
    if (!result.success) throw new Error('读取屏幕缩放比失败');
    const m = result.stdout ? result.stdout.match(/(\d+(?:\.\d+)?)/) : null;
    return m ? parseFloat(m[1]) : NaN;
  };

  // 工具函数：DBus 直接打开启动器（不依赖 Super 快捷键；dde-shell 重启后快捷键注册偶发失效）
  const openLauncherByDbus = async (system) => {
    await system.exec('busctl --user call org.deepin.dde.shell /org/deepin/dde/Launcher1 org.deepin.dde.Launcher1 Show');
    await new Promise(resolve => setTimeout(resolve, 2000));
  };

  beforeAll(async ({ device, system }) => {
    console.log('========== beforeAll: 记录并设置屏幕缩放为 1.25 ==========');
    // 记录原始缩放比与启动器模式
    const scaleVal = await readScaleFactor(system);
    if (!isNaN(scaleVal)) {
      originalScale = scaleVal;
    }
    const frameResult = await system.exec(`cat ${settingsIni}`);
    const frameMatch = frameResult.success ? frameResult.stdout.match(/current_frame=(\w+)/) : null;
    if (frameMatch) {
      originalFrame = frameMatch[1];
    }
    console.log('  记录原始缩放比: ' + originalScale + '，原始启动器模式: ' + originalFrame);

    // 前置条件：设置屏幕缩放为 1.25（"禁用屏幕缩放"菜单项只在缩放≠1 时出现）
    await system.exec(scaleSetCmd(1.25));
    await new Promise(resolve => setTimeout(resolve, 3000));
    const appliedScale = await readScaleFactor(system);
    console.log('  设置后缩放比: ' + appliedScale);
    assertTrue(Math.abs(appliedScale - 1.25) < 0.001, '前置条件失败：屏幕缩放未成功设置为 1.25');
    console.log('  前置条件就绪：屏幕缩放 = 1.25');

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

  test('1832509-【启动器】【右键菜单】应用右键菜单功能验证---"禁用屏幕缩放"功能', async ({ device, agent, system }) => {
    console.log('========== 用例执行开始 ==========');
    // 步骤1：打开启动器窗口模式
    console.log('[步骤 1/3] 打开启动器窗口模式');
    await openLauncherByDbus(system);
    await agent.aiWaitFor('启动器窗口已显示，左侧应用列表中有应用图标');

    // 步骤2：右键点击左侧应用列表边缘的应用图标
    console.log('[步骤 2/3] 右键点击左侧应用列表中的应用图标');
    await agent.aiRightClick('启动器窗口左侧应用列表区域中的任意一个应用图标（如文件管理器）', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤3：检查右键菜单存在"禁用屏幕缩放"项
    console.log('[步骤 3/3] 检查右键菜单存在"禁用屏幕缩放"项');
    await agent.aiAssert('启动器应用右键菜单中显示"禁用屏幕缩放"菜单项');
    console.log('  验证通过：右键菜单存在"禁用屏幕缩放"项');
    await device.pressKey('esc');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1832509', 'level4'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, agent, system }) => {
    console.log('========== afterAll: 还原缩放为 1 并清理环境 ==========');
    // 1. 还原屏幕缩放为 1（原始值）
    const restoreScale = originalScale || 1;
    await system.exec(scaleSetCmd(restoreScale));
    await new Promise(resolve => setTimeout(resolve, 3000));
    const restoredScale = await readScaleFactor(system);
    console.log('  还原后缩放比: ' + restoredScale + '（期望 ' + restoreScale + '）');
    assertTrue(Math.abs(restoredScale - restoreScale) < 0.001, '屏幕缩放未还原，当前: ' + restoredScale);
    // 2. 收尾：检查启动器模式，非窗口模式则切换为窗口模式（已窗口则保持不变）
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
    // 3. 清空通知中心
    console.log('  清空通知中心...');
    try {
      const { clearNotifications } = await import(`${process.env.TESTCASE_DIR}midscene_dde/common/common.ts`);
      await clearNotifications(agent, device, system);
      console.log('  通知中心已清空');
    } catch (e) {
      console.log('  clearNotifications 失败（记录不阻塞收尾）: ' + e.message);
    }
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});