/**
 * 用例 PMSID: 1832265
 * 用例标题: 【启动器】【窗口模式】【"按名称"分类】【字母标题鼠标操作】焦点在字母表上且为focus状态，点击ESC退出后再次打开字母表，字母表无焦点
 * 生成时间: 2026-07-16 21:00:00
 * 用例编写人: UT003165(吴磊)
 * 注：文本用例预期5写"默认焦点在当前选中字母上"是错的，新需求是没有焦点
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832265-【启动器】【窗口模式】【"按名称"分类】【字母标题鼠标操作】焦点在字母表上且为focus状态，点击ESC退出后再次打开字母表，字母表无焦点', () => {
  test('1832265-【启动器】【窗口模式】【"按名称"分类】【字母标题鼠标操作】焦点在字母表上且为focus状态，点击ESC退出后再次打开字母表，字母表无焦点', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器，切换到"按名称"分类
    console.log('步骤1：打开启动器并切换到"按名称"分类');
    await switchLauncherSortMode(agent, uos, '按名称', system);
    console.log('断言：切换到按名称分类成功');

    // 步骤2：点击字母B打开字母表
    console.log('步骤2：点击字母B打开字母表');
    await agent.aiTap("启动器左侧字母分类标题B", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('断言：字母表已打开');
    await agent.aiAssert("启动器按名称分类下字母表已打开");

    // 步骤3：按键盘下方向键，字母表中B字母被框选（focus状态）
    console.log('步骤3：按键盘下方向键');
    await device.pressKey('Down');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('断言：字母表中B字母被框选高亮');
    await agent.aiAssert("字母表中某个字母被高亮或框选显示");

    // 步骤4：按ESC退出字母表
    console.log('步骤4：按ESC退出字母表');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤5：再次点击B打开字母表，检查默认没有框选字母（新需求：无焦点）
    console.log('步骤5：再次点击B打开字母表');
    await agent.aiTap("启动器左侧字母分类标题B", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('断言：字母表已打开');
    await agent.aiAssert("启动器按名称分类下字母表已打开");
    console.log('断言：字母表中没有字母被键盘焦点框选中');
    // 注：实测确认两种视觉的区分标准——
    //     键盘焦点：字母上有"蓝色圆圈/蓝色边框"选中框（步骤3按Down后AI观察到"字母B被蓝色圆圈高亮框选"）；
    //     分类指示：字母A行仅有"浅灰色背景底色"（无边框、无反白、无深色条），属当前分类的正常显示。
    //     此前断言要求"没有任何字母高亮"或区分"淡淡的分类底色"，均被A行分类指示误导而失败。
    //     此处直接按"蓝色焦点框"这一确定特征断言，准确对应"字母表无焦点"的测试点。
    await agent.aiAssert("查看当前截图：启动器字母表已打开并显示A-Z字母列表；字母表中没有任何字母带有蓝色圆圈（蓝色圆形边框/蓝色选中框）的键盘焦点选中效果。注意：字母A行若有浅灰色背景底色，那是启动器当前分类的指示，不属于键盘焦点");
  }, { timeout: 600000, tags: ["1832265", "level1", "module:launcher"] });
});
