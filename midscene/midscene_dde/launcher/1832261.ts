/**
 * 用例 PMSID: 1832261
 * 用例标题: 【启动器】【窗口模式】【"按名称"分类】【字母标题鼠标操作】不存在某个字母应用，字母列表不展示该类
 * 生成时间: 2026-07-16 21:00:00
 * 用例编写人: UT003165(吴磊)
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832261-【启动器】【窗口模式】【"按名称"分类】【字母标题鼠标操作】不存在某个字母应用，字母列表不展示该类', () => {
  test('1832261-【启动器】【窗口模式】【"按名称"分类】【字母标题鼠标操作】不存在某个字母应用，字母列表不展示该类', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器，切换到"按名称"分类
    console.log('步骤1：打开启动器并切换到"按名称"分类');
    await switchLauncherSortMode(agent, uos, '按名称', system);
    console.log('断言：切换到按名称分类成功');

    // 步骤2：点击字母B打开字母表，检查不存在的字母E是否展示
    // 注：文本用例说"如无W开头的应用"，但测试机有W应用（WPS、Web Browser等），所以用E替代验证
    console.log('步骤2：点击字母B打开字母表');
    await agent.aiTap("启动器左侧字母分类标题B", { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤3：检查字母表中不存在字母E（测试机无E开头的应用）
    console.log('步骤3：检查字母表中不存在字母E');
    await agent.aiAssert("启动器按名称分类的字母表中，不存在字母E分类");
  }, { timeout: 600000, tags: ["1832261", "level1", "module:launcher"] });
});
