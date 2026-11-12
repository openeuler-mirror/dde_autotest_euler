/**
 * 用例 PMSID: 1832259
 * 用例标题: 【启动器】【窗口模式】【"按名称"分类】【字母标题鼠标操作】字母分类标题hover效果检查
 * 生成时间: 2026-07-16 21:00:00
 * 用例编写人: UT003165(吴磊)
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832259-【启动器】【窗口模式】【"按名称"分类】【字母标题鼠标操作】字母分类标题hover效果检查', () => {
  test('1832259-【启动器】【窗口模式】【"按名称"分类】【字母标题鼠标操作】字母分类标题hover效果检查', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器并切换到"按名称"分类
    console.log('步骤1：打开启动器并切换到"按名称"分类');
    await switchLauncherSortMode(agent, uos, '按名称', system);
    console.log('断言：切换到按名称分类成功');

    // 步骤2：鼠标hover到字母分类标题（如B），检查hover效果
    // 注意：不能hover字母A——A与排序菜单/提示框中的"A"标识并存，AI会误认（此前1832263等已确认），改用B。
    console.log('步骤2：鼠标hover到字母分类标题B');
    await agent.aiHover("启动器左侧字母导航栏中的字母分类标题B", { deepThink: true });
    // 检查：标题上有hover效果（hover时字母区域出现浅灰/深色背景底色）
    // 注：不再限定"仅字母B文字区域"——实测hover底色会覆盖字母B及其下方一小片区域，限定过窄会导致AI判定失败
    console.log('断言：字母分类标题B有hover效果（背景底色高亮）');
    await agent.aiAssert("查看当前截图，启动器左侧字母导航栏中字母B标题上出现了hover高亮效果：字母B所在区域显示浅灰色/深色背景底色（覆盖字母B及其紧邻下方区域）。同时确认该高亮不是排序模式提示框（排序菜单未展开）");
  }, { timeout: 600000, tags: ["1832259", "level1", "module:launcher"] });
});
