/**
 * 用例 PMSID: 1832293
 * 用例标题: 【启动器】【窗口模式】【"按名称"分类】【应用列表鼠标操作】鼠标hover到应用有hover效果
 * 生成时间: 2026-07-16 23:30:00
 * 用例编写人: UT003165(吴磊)
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832293-【启动器】【窗口模式】【"按名称"分类】【应用列表鼠标操作】鼠标hover到应用有hover效果', () => {
  test('1832293-【启动器】【窗口模式】【"按名称"分类】【应用列表鼠标操作】鼠标hover到应用有hover效果', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器，切换到"按名称"分类
    console.log('步骤1：打开启动器并切换到"按名称"分类');
    await switchLauncherSortMode(agent, uos, '按名称', system);
    console.log('断言：切换到按名称分类成功');

    // 步骤2：鼠标hover到启动器中的应用图标上
    console.log('步骤2：鼠标hover到启动器中的应用图标上');
    await agent.aiHover("启动器应用列表中的任意一个应用图标", { deepThink: true });
    // 检查：应用图标有hover效果
    console.log('断言：应用图标有hover效果');
    await agent.aiAssert("启动器中的应用图标有hover效果，显示高亮或背景变色");
  }, { timeout: 600000, tags: ["1832293", "level1", "module:launcher"] });
});
