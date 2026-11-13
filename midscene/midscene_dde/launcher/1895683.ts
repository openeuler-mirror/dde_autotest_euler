/**
 * 用例 PMSID: 1895683
 * 用例标题: 【启动器】【窗口模式】【搜索框】中文环境下，支持开头字母为大写字母的单词匹配
 * 生成时间: 2026-08-13 10:00:00
 * 用例编写人: UT002998(熊林辉)
 */

describe('1895683-【启动器】【窗口模式】【搜索框】中文环境下，支持开头字母为大写字母的单词匹配', () => {
  const settingsIni = '/home/uos/.config/deepin/org.deepin.dde-shell/settings.ini';
  const appDir = '/home/uos/.local/share/applications';

  beforeAll(async ({ device, system }) => {
    console.log('========== beforeAll: 初始化测试套件 ==========');
    const { createTestApp } = require(process.env.TESTCASE_DIR + '/midscene_dde/common/common');
    // 构造模拟应用"统信Windows兼容引擎"（远程未安装该应用）
    await createTestApp(system, '统信Windows兼容引擎', 'windows-compat', 'deepin-editor', 'deepin-editor', 'Development;');
    // 构造模拟应用"WPS Office"（远程未安装该应用）
    await createTestApp(system, 'WPS Office', 'wps-office-test', 'deepin-editor', 'deepin-editor', 'Office;');
    await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null; true');
    await new Promise(resolve => setTimeout(resolve, 4000));
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

  test('1895683-【启动器】【窗口模式】【搜索框】中文环境下，支持开头字母为大写字母的单词匹配', async ({ device, agent, uos, system }) => {
    const searchAndCheck = async (text, expectDesc) => {
      await uos.openLauncher();
      await new Promise(resolve => setTimeout(resolve, 1200));
      await agent.aiTap('启动器搜索框');
      await device.typeText(text);
      await new Promise(resolve => setTimeout(resolve, 500));
      await agent.aiAssert(expectDesc);
      await device.pressKey('esc');
      await new Promise(resolve => setTimeout(resolve, 300));
    };

    // 步骤1：输入"Win"，可搜索到"统信Windows兼容引擎"
    await searchAndCheck('Win', '启动器搜索结果中显示了统信Windows兼容引擎应用，不带出不相关应用');
    // 步骤2：输入"Windows"，可搜索到"统信Windows兼容引擎"
    await searchAndCheck('Windows', '启动器搜索结果中显示了统信Windows兼容引擎应用，不带出不相关应用');
    // 步骤3：输入"dows"，可搜索到"统信Windows兼容引擎"
    await searchAndCheck('dows', '启动器搜索结果中显示了统信Windows兼容引擎应用，不带出不相关应用');
    // 步骤4：输入"WPS"，可搜索到"WPS Office"应用
    await searchAndCheck('WPS', '启动器搜索结果中显示了WPS Office应用');
    // 步骤5：输入"office"，可搜索到"WPS Office"应用
    await searchAndCheck('office', '启动器搜索结果中显示了WPS Office应用');
    // 步骤6：输入"ffice"，可搜索到"WPS Office"应用
    await searchAndCheck('ffice', '启动器搜索结果中显示了WPS Office应用');
    console.log('========== 用例执行结束 ==========');
  }, { timeout: 600000, tags: ['1895683', 'level3'] });

  afterEach(async ({ device }) => {
    console.log('========== afterEach ==========');
  });

  afterAll(async ({ device, system }) => {
    console.log('========== afterAll: 清理测试套件 ==========');
    await system.exec(`rm -f ${appDir}/windows-compat.desktop ${appDir}/wps-office-test.desktop`);
    await system.exec(`update-desktop-database ${appDir}/ 2>/dev/null; true`);
    await system.exec('systemctl --user restart dde-shell@DDE 2>/dev/null; true');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await device.pressKey('esc');
    await device.pressKey('Super', 'd');
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
