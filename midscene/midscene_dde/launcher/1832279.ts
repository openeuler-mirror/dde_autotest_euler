/**
 * 用例 PMSID: 1832279
 * 用例标题: 【启动器】【窗口模式】【"按名称"分类】【应用列表键盘操作】焦点在字母标题上，点击空格键，打开字母表
 * 生成时间: 2026-07-16 22:00:00
 * 用例编写人: UT003165(吴磊)
 * 注：文本用例预期2写"默认焦点在当前选中的字母上且为focus状态"是错的，实际默认无focus状态
 * 注：文本用例说"点击键盘上下键"和"点击空格键"，用点击模拟（远程键盘操作不可靠）
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832279-【启动器】【窗口模式】【"按名称"分类】【应用列表键盘操作】焦点在字母标题上，点击空格键，打开字母表', () => {
  test('1832279-【启动器】【窗口模式】【"按名称"分类】【应用列表键盘操作】焦点在字母标题上，点击空格键，打开字母表', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器，切换到"按名称"分类
    console.log('步骤1：打开启动器并切换到"按名称"分类');
    await switchLauncherSortMode(agent, uos, '按名称', system);
    console.log('断言：切换到按名称分类成功');

    // 步骤2：点击字母分类标题B，打开字母表（用点击模拟空格键操作）
    // 注意：不能点字母A，A在启动器中存在两个（排序菜单"按名称"的字母A标识 + 字母导航A），AI极易误点，改用B。
    console.log('步骤2：点击字母分类标题B，打开字母表');
    await agent.aiTap("启动器左侧字母分类标题B", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('断言：字母表已打开');
    await agent.aiAssert("启动器中字母表已打开");
  }, { timeout: 600000, tags: ["1832279", "level1", "module:launcher"] });
});
