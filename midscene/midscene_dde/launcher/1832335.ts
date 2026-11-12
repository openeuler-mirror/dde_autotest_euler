/**
 * 用例 PMSID: 1832335
 * 用例标题: 【启动器】【窗口模式】【"按分类"分类】【鼠标操作】任务栏有某应用图标，拖动应用到任务栏时应用不可驻留
 * 生成时间: 2026-07-30 00:00:00
 * 用例编写人: UT003165(吴磊)
 */
const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode, createTestApp, cleanupTestApps, pinToDock, unpinFromDock } = require(helperPath);

describe('1832335-【启动器】【窗口模式】【"按分类"分类】【鼠标操作】任务栏有某应用图标，拖动应用到任务栏时应用不可驻留', () => {
  test('1832335-【启动器】【窗口模式】【"按分类"分类】【鼠标操作】任务栏有某应用图标，拖动应用到任务栏时应用不可驻留', async ({ device, agent, uos, system}) => {
    const desktopFile = 'A-Test-Drag.desktop';
    console.log('步骤0：先驻留应用到任务栏');
    await unpinFromDock(system, desktopFile);
    await createTestApp(system, 'ADragTest', 'A-Test-Drag', '/bin/true', 'terminal', 'Network;WebBrowser;');
    await pinToDock(system, desktopFile);

    console.log('步骤1：打开启动器并切换到按分类');
    await switchLauncherSortMode(agent, uos, '按分类', system);

    console.log('步骤2：尝试再次驻留');
    await pinToDock(system, desktopFile);

    console.log('步骤3：验证驻留列表中只有一个该应用');
    const verifyResult = await system.exec('XDG_RUNTIME_DIR=/run/user/1000 gsettings get com.deepin.dde.dock docked-apps');
    const list = verifyResult.stdout.toString().trim();
    const count = list.split(desktopFile).length - 1;
    if (count !== 1) throw new Error('驻留列表中应有且仅有一个该应用，实际=' + count);
    console.log('验证通过：驻留列表中仅有一个该应用');

    console.log('步骤4：清理');
    await unpinFromDock(system, desktopFile);
    await cleanupTestApps(system, ['A-Test-Drag']);
  }, { timeout: 600000, tags: ['1832335', 'level1', 'module:launcher'] });
});
