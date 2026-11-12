/**
 * 用例 PMSID: 1832263
 * 用例标题: 【启动器】【窗口模式】【"按名称"分类】【字母标题鼠标操作】单击字母分类标题，打开字母表
 * 生成时间: 2026-07-16 21:00:00
 * 用例编写人: UT003165(吴磊)
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832263-【启动器】【窗口模式】【"按名称"分类】【字母标题鼠标操作】单击字母分类标题，打开字母表', () => {
  test('1832263-【启动器】【窗口模式】【"按名称"分类】【字母标题鼠标操作】单击字母分类标题，打开字母表', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器，切换到"按名称"分类
    console.log('步骤1：打开启动器并切换到"按名称"分类');
    await switchLauncherSortMode(agent, uos, '按名称', system);
    console.log('断言：切换到按名称分类成功');

    // 步骤2：鼠标左键点击首位字母分类标题"B"，打开字母表（不能用A，A在启动器中有两个，AI易误点）
    console.log('步骤2：点击首位字母分类标题"B"，打开字母表');
    await agent.aiTap("启动器左侧字母分类标题B", { deepThink: true });
    console.log('断言：字母表已打开');
    await agent.aiAssert("启动器中字母表已打开，显示字母列表");

    // 步骤3：按ESC关闭字母表
    console.log('步骤3：按ESC关闭字母表');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤4：鼠标左键点击居中位字母分类标题"D"，打开字母表
    console.log('步骤4：点击居中位字母分类标题"D"，打开字母表');
    await agent.aiTap("启动器左侧字母分类标题D", { deepThink: true });
    console.log('断言：字母表已打开');
    await agent.aiAssert("启动器中字母表已打开，显示字母列表");

    // 步骤5：按ESC关闭字母表
    console.log('步骤5：按ESC关闭字母表');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤6：鼠标左键点击末尾字母分类标题，打开字母表
    console.log('步骤6：点击末尾字母分类标题，打开字母表');
    await agent.aiTap("字母分类中排在最后面的字母标题", { deepThink: true });
    console.log('断言：字母表已打开');
    await agent.aiAssert("启动器中字母表已打开");
  }, { timeout: 600000, tags: ["1832263", "level1", "module:launcher"] });
});
