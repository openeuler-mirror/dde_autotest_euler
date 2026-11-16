/**
 * 用例 PMSID: 2018841
 * 用例标题: 【启动器】【窗口模式】鼠标左键单击打开应用正常
 * 生成时间: 2026-08-13 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('2018841-【启动器】【窗口模式】鼠标左键单击打开应用正常', () => {
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';

  beforeAll(async ({ device, uos, agent }) => {
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

  test('2018841-【启动器】【窗口模式】鼠标左键单击打开应用正常', async ({ device, agent, uos }) => {
    // 步骤1：打开启动器窗口模式
    await uos.openLauncher();
    await new Promise(resolve => setTimeout(resolve, 1200));

    // 步骤2：搜索控制中心并左键点击，确保图标可见
    await uos.searchInLauncher('控制中心');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('搜索结果中名称为控制中心的应用图标', { deepThink: true });

    // 步骤3：控制中心打开成功，启动器窗口模式退出
    await agent.aiAssert('屏幕中间显示标题为"系统"的控制中心设置窗口');
    await agent.aiAssert('启动器窗口模式已退出');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['2018841', 'level1', 'smoke'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
  });

  afterAll(async ({ uos, device }) => {
    console.log('========== afterAll: 清理测试套件 ==========');
    await device.pressKey('Alt', 'F4');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
