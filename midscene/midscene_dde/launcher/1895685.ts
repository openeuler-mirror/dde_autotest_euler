/**
 * 用例 PMSID: 1895685
 * 用例标题: 【启动器】【窗口模式】【搜索框】中文环境下，  数字不在开头，支持数字搜索
 * 生成时间: 2026-08-13 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1895685-【启动器】【窗口模式】【搜索框】中文环境下，  数字不在开头，支持数字搜索', () => {
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

  test('1895685-【启动器】【窗口模式】【搜索框】中文环境下，  数字不在开头，支持数字搜索', async ({ device, agent, uos, system }) => {
    // 步骤1：创建测试应用"诗300"（数字不在开头）
    const { createTestApp } = require(process.env.TESTCASE_DIR + '/midscene_dde/common/common');
    await createTestApp(system, '诗300', 'shi-300', 'deepin-editor', 'deepin-editor', 'Office;');
    console.log('测试应用诗300已创建');

    // 步骤2：打开启动器窗口模式
    await uos.openLauncher();
    await agent.aiWaitFor('启动器窗口模式已显示');

    // 步骤3：搜索框输入数字组合"300"
    await agent.aiTap('启动器搜索框');
    await device.typeText('300');
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤4：搜索得到"诗300"应用
    await agent.aiAssert('启动器搜索结果中显示了诗300应用');

    // 清理测试应用
    await device.pressKey('esc');
    await system.exec('rm -f /home/uos/.local/share/applications/shi-300.desktop && update-desktop-database /home/uos/.local/share/applications/ 2>/dev/null');
    console.log('测试应用已清理');
  }, { timeout: 600000, tags: ['1895685', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('========== afterAll: 清理测试套件 ==========');
    await system.exec('rm -f /home/uos/.local/share/applications/shi-300.desktop && update-desktop-database /home/uos/.local/share/applications/ 2>/dev/null');
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
