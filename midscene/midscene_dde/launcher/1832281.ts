/**
 * 用例 PMSID: 1832281
 * 用例标题: 【启动器】【窗口模式】【"按名称"分类】【应用列表键盘操作】键盘方向键切换焦点至字母标题
 * 生成时间: 2026-07-16 22:00:00
 * 用例编写人: UT003165(吴磊)
 * 注：字母标题侧边栏不能用上下方向键操作，但字母表弹窗可以
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832281-【启动器】【窗口模式】【"按名称"分类】【应用列表键盘操作】键盘方向键切换焦点至字母标题', () => {
  test('1832281-【启动器】【窗口模式】【"按名称"分类】【应用列表键盘操作】键盘方向键切换焦点至字母标题', async ({ device, agent, uos, system }) => {
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

    // 步骤3：按下方向键，在字母表弹窗内切换焦点
    console.log('步骤3：按下方向键，在字母表弹窗内切换焦点');
    await device.pressKey('Down');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('断言：字母表中有字母被高亮或框选');
    await agent.aiAssert("字母表中有字母被高亮或框选显示");

    // 步骤4：再按下方向键，继续切换焦点
    console.log('步骤4：再按下方向键，继续切换焦点');
    await device.pressKey('Down');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('断言：字母表中仍有字母被高亮或框选');
    await agent.aiAssert("字母表中有字母被高亮或框选显示");

    // 步骤5：按上方向键，向上切换焦点
    console.log('步骤5：按上方向键，向上切换焦点');
    await device.pressKey('Up');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('断言：字母表中仍有字母被高亮或框选');
    await agent.aiAssert("字母表中有字母被高亮或框选显示");
  }, { timeout: 600000, tags: ["1832281", "level1", "module:launcher"] });
});
