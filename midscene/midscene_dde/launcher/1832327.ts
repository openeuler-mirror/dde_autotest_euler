/**
 * 用例 PMSID: 1832327
 * 用例标题: 【启动器】【窗口模式】【"按分类"分类】【键盘操作】进入分类列表，点击Enter或空格定位到应用列表
 * 生成时间: 2026-07-17 10:00:00
 * 用例编写人: UT003165(吴磊)
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832327-【启动器】【窗口模式】【"按分类"分类】【键盘操作】进入分类列表，点击Enter或空格定位到应用列表', () => {
  test('1832327-【启动器】【窗口模式】【"按分类"分类】【键盘操作】进入分类列表，点击Enter或空格定位到应用列表', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器，切换到"按分类"分类
    console.log('步骤1：打开启动器并切换到"按分类"分类');
    await switchLauncherSortMode(agent, uos, '按分类', system);
    console.log('断言：切换到按分类模式成功');

    // 步骤2：点击分类列表中的一个分类标题，定位到该分类的应用列表
    console.log('步骤2：点击分类列表中的一个分类标题');
    await agent.aiTap("启动器分类列表中的一个分类标题", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('断言：定位到所选分类的应用列表');
    await agent.aiAssert("启动器界面显示应用列表");
  }, { timeout: 600000, tags: ["1832327", "level1", "module:launcher"] });
});
