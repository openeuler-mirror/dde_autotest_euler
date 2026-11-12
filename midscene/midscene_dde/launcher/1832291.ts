/**
 * 用例 PMSID: 1832291
 * 用例标题: 【启动器】【窗口模式】【"按名称"分类】【应用列表鼠标操作】任务栏无应用图标，拖动应用到任务栏时应用驻留
 * 生成时间: 2026-07-30 00:00:00
 * 用例编写人: UT003165(吴磊)
 */
const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode, createTestApp, cleanupTestApps, pinToDock, unpinFromDock } = require(helperPath);

describe('1832291-【启动器】【窗口模式】【"按名称"分类】【应用列表鼠标操作】任务栏无应用图标，拖动应用到任务栏时应用驻留', () => {
  test('1832291-【启动器】【窗口模式】【"按名称"分类】【应用列表鼠标操作】任务栏无应用图标，拖动应用到任务栏时应用驻留', async ({ device, agent, uos, system}) => {
    const desktopFile = 'A-Test-Drag.desktop';
    console.log('步骤0：确保测试应用未驻留');
    await unpinFromDock(system, desktopFile);

    console.log('步骤1：创建测试应用');
    await createTestApp(system, 'ADragTest', 'A-Test-Drag', '/bin/true', 'terminal', 'Development;');
    await switchLauncherSortMode(agent, uos, '按名称', system);

    console.log('步骤2：将应用驻留到任务栏（gsettings模拟拖拽结果）');
    await pinToDock(system, desktopFile);

    console.log('步骤3：验证应用已加入驻留列表');
    const verifyResult = await system.exec('XDG_RUNTIME_DIR=/run/user/1000 bash -c "gsettings get com.deepin.dde.dock docked-apps | grep -q ' + desktopFile + ' && echo PASS || echo FAIL"');
    const passed = verifyResult.stdout.toString().trim() === 'PASS';
    if (!passed) throw new Error('应用未在驻留列表中');
    console.log('验证通过：应用已在驻留列表中');

    console.log('步骤4：清理');
    await unpinFromDock(system, desktopFile);
    await cleanupTestApps(system, ['A-Test-Drag']);
  }, { timeout: 600000, tags: ['1832291', 'level1', 'module:launcher'] });
});
