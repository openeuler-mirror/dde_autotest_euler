/**
 * 用例 PMSID: 1832273
 * 用例标题: 【启动器】【窗口模式】【"按名称"分类】【字母表鼠标操作】鼠标左键点击启动器外区域，关闭字母表
 * 生成时间: 2026-07-16 21:00:00
 * 用例编写人: UT003165(吴磊)
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832273-【启动器】【窗口模式】【"按名称"分类】【字母表鼠标操作】鼠标左键点击启动器外区域，关闭字母表', () => {
  test('1832273-【启动器】【窗口模式】【"按名称"分类】【字母表鼠标操作】鼠标左键点击启动器外区域，关闭字母表', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器，切换到"按名称"分类
    console.log('步骤1：打开启动器并切换到"按名称"分类');
    await switchLauncherSortMode(agent, uos, '按名称', system);
    console.log('断言：切换到按名称分类成功');

    // 步骤2：点击字母B打开字母表（不能用A：A在启动器中有两个——排序菜单"按名称"旁也有字母A标识，AI会误点，改用B）
    console.log('步骤2：点击字母B打开字母表');
    await agent.aiTap("启动器左侧字母导航栏中的字母分类标题B", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('断言：字母表已打开');
    await agent.aiAssert("启动器中字母表已打开");

    // 步骤3：鼠标左键点击启动器窗口外的桌面区域（靠近屏幕右上角位置）
    console.log('步骤3：点击启动器窗口外的桌面区域');
    await agent.aiTap("启动器窗口右侧的桌面空白区域，靠近屏幕右上角位置", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('断言：字母表已关闭');
    await agent.aiAssert("字母表已关闭");
  }, { timeout: 600000, tags: ["1832273", "level1", "module:launcher"] });
});
