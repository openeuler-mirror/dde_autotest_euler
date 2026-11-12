/**
 * 用例 PMSID: 1832339
 * 用例标题: 【启动器】【窗口模式】【"自由排序"分类】【排序规则】检查自由排序模式下的应用排序
 * 生成时间: 2026-07-17 12:30:00
 * 用例编写人: UT003165(吴磊)
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832339-【启动器】【窗口模式】【"自由排序"分类】【排序规则】检查自由排序模式下的应用排序', () => {
  test('1832339-【启动器】【窗口模式】【"自由排序"分类】【排序规则】检查自由排序模式下的应用排序', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器，切换到"自由排序"分类
    console.log('步骤1：打开启动器并切换到"自由排序"分类');
    await switchLauncherSortMode(agent, uos, '自由排序', system);
    console.log('断言：切换到自由排序模式成功');

    // 步骤2：检查自由排序模式下的应用排序
    console.log('步骤2：检查自由排序模式下的应用排序');
    await agent.aiAssert("启动器应用列表按照从左到右、从上到下的顺序排列");
  }, { timeout: 600000, tags: ["1832339", "level1", "module:launcher"] });
});
