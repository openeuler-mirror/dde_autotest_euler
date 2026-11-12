/**
 * 用例 PMSID: 1832315
 * 用例标题: 【启动器】【窗口模式】【"按分类"分类】【鼠标操作】鼠标左键点击分类列表内的空白区域，无响应
 * 生成时间: 2026-07-17 10:30:00
 * 用例编写人: UT003165(吴磊)
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832315-【启动器】【窗口模式】【"按分类"分类】【鼠标操作】鼠标左键点击分类列表内的空白区域，无响应', () => {
  test('1832315-【启动器】【窗口模式】【"按分类"分类】【鼠标操作】鼠标左键点击分类列表内的空白区域，无响应', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器，切换到"按分类"分类
    console.log('步骤1：打开启动器并切换到"按分类"分类');
    await switchLauncherSortMode(agent, uos, '按分类', system);
    console.log('断言：切换到按分类模式成功');

    // 步骤2：点击分类列表中的一个分类标题，展开分类列表
    console.log('步骤2：点击分类列表中的一个分类标题，展开分类列表');
    await agent.aiTap("启动器分类列表中的一个分类标题", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('断言：分类列表已展开');
    await agent.aiAssert("启动器界面显示分类列表");

    // 步骤3：鼠标左键点击分类列表内的空白区域
    console.log('步骤3：点击分类列表内的空白区域');
    await agent.aiTap("分类列表内的空白区域", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    // 检查：无响应，分类列表仍然显示
    console.log('断言：无响应，分类列表仍然显示');
    await agent.aiAssert("启动器界面仍然显示分类列表");
  }, { timeout: 600000, tags: ["1832315", "level1", "module:launcher"] });
});
