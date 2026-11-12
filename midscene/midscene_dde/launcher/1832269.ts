/**
 * 用例 PMSID: 1832269
 * 用例标题: 【启动器】【窗口模式】【"按名称"分类】【字母表鼠标操作】鼠标左键点击字母列表的空白处，无响应
 * 生成时间: 2026-07-16 21:00:00
 * 用例编写人: UT003165(吴磊)
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832269-【启动器】【窗口模式】【"按名称"分类】【字母表鼠标操作】鼠标左键点击字母列表的空白处，无响应', () => {
  test('1832269-【启动器】【窗口模式】【"按名称"分类】【字母表鼠标操作】鼠标左键点击字母列表的空白处，无响应', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器，切换到"按名称"分类
    console.log('步骤1：打开启动器并切换到"按名称"分类');
    await switchLauncherSortMode(agent, uos, '按名称', system);
    console.log('断言：切换到按名称分类成功');

    // 步骤2：点击字母B打开字母表（不能用A，A在启动器中有两个，AI易误点排序菜单中的"按名称-A"标识）
    console.log('步骤2：点击字母B打开字母表');
    await agent.aiTap("启动器左侧字母分类标题B", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('断言：字母表已打开');
    await agent.aiAssert("启动器中字母表已打开");

    // 步骤3：鼠标左键点击字母列表的空白处，预期无响应（字母表不关闭）
    console.log('步骤3：点击字母列表的空白处');
    await agent.aiTap("字母列表中没有字母的空白区域", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('断言：点击空白处无响应，字母表仍然打开');
    // 注：直接断言当前截图状态即可（截图即点击后的最终状态），避免"点击后/仍然"这类时序因果描述让AI无法判断
    await agent.aiAssert("查看当前截图：启动器处于按名称分类模式，左侧字母表弹窗完整可见且处于打开状态，弹窗内显示A、B、C等字母列表，应用网格区域没有被关闭");
  }, { timeout: 600000, tags: ["1832269", "level1", "module:launcher"] });
});
