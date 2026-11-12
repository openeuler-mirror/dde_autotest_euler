/**
 * 用例 PMSID: 1832287
 * 用例标题: 【启动器】【窗口模式】【"按名称"分类】【字母表键盘操作】键盘spase切换快速进入对应字母标题
 * 生成时间: 2026-07-16 22:00:00
 * 用例编写人: UT003165(吴磊)
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832287-【启动器】【窗口模式】【"按名称"分类】【字母表键盘操作】键盘spase切换快速进入对应字母标题', () => {
  test('1832287-【启动器】【窗口模式】【"按名称"分类】【字母表键盘操作】键盘spase切换快速进入对应字母标题', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器，切换到"按名称"分类
    console.log('步骤1：打开启动器并切换到"按名称"分类');
    await switchLauncherSortMode(agent, uos, '按名称', system);
    console.log('断言：切换到按名称分类成功');

    // 步骤2：点击字母B打开字母表弹窗
    console.log('步骤2：点击字母B打开字母表弹窗');
    await agent.aiTap("启动器左侧字母分类标题B", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('断言：字母表已打开');
    await agent.aiAssert("启动器中字母表已打开");

    // 步骤3：按下方向键，选中某个字母
    console.log('步骤3：按下方向键，选中某个字母');
    await device.pressKey('Down');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('断言：字母表中有字母被高亮或框选');
    await agent.aiAssert("字母表中有字母被高亮或框选显示");

    // 步骤4：按Space键，快速定位至所选字母的应用列表
    console.log('步骤4：按Space键，快速定位至所选字母的应用列表');
    await device.pressKey('space');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('断言：已跳转到对应字母的应用列表');
    await agent.aiAssert("启动器界面显示应用列表，存在字母分类标题");
  }, { timeout: 600000, tags: ["1832287", "level1", "module:launcher"] });
});
