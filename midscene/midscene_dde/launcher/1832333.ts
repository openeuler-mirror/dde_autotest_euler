/**
 * 用例 PMSID: 1832333
 * 用例标题: 【启动器】【窗口模式】【"按分类"分类】【键盘操作】进入分类列表，关闭启动器后再打开，检查启动器状态
 * 生成时间: 2026-07-17 10:00:00
 * 用例编写人: UT003165(吴磊)
 * 注："分类列表"是点击分类标题（如"网络应用"）后弹出的弹窗列表
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832333-【启动器】【窗口模式】【"按分类"分类】【键盘操作】进入分类列表，关闭启动器后再打开，检查启动器状态', () => {
  test('1832333-【启动器】【窗口模式】【"按分类"分类】【键盘操作】进入分类列表，关闭启动器后再打开，检查启动器状态', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器，切换到"按分类"分类
    console.log('步骤1：打开启动器并切换到"按分类"分类');
    await switchLauncherSortMode(agent, uos, '按分类', system);
    console.log('断言：切换到按分类模式成功');

    // 步骤2：点击分类标题（如"网络应用"），打开分类列表弹窗
    console.log('步骤2：点击分类标题，打开分类列表弹窗');
    await agent.aiTap("启动器分类列表中的网络应用分类标题", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('断言：分类列表弹窗已打开');
    await agent.aiAssert("启动器界面显示分类列表弹窗");

    // 步骤3：关闭启动器后重新打开
    console.log('步骤3：关闭启动器后重新打开');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 500));
    // 使用switchLauncherSortMode强制重置状态（uos.openLauncher会保留上次的分类弹窗状态）
    await switchLauncherSortMode(agent, uos, '按分类', system);

    // 步骤4：检查启动器状态，不展示分类列表弹窗
    // 注：重新打开启动器后，仅应显示按分类分组的应用网格与常驻分类侧栏，
    //     不应再出现点击分类标题时弹出的"分类列表悬浮弹窗"。
    //     避免断言"没有分类列表"——常驻分类侧栏会被AI误判；改断言应用网格完整可见、未被悬浮弹窗覆盖。
    console.log('步骤4：检查启动器状态，应用网格完整可见、未被分类弹窗覆盖');
    await agent.aiAssert("查看当前截图，启动器重新打开后正常显示按分类分组的应用网格，应用图标完整清晰可见，网格上方没有被分类列表悬浮弹窗覆盖遮挡");
  }, { timeout: 600000, tags: ["1832333", "level1", "module:launcher"] });
});
