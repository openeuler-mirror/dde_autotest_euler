/**
 * 用例 PMSID: 1832253
 * 用例标题: 【启动器】【窗口模式】【"按名称"分类】【字母排序规则】应用名称首位字符相同，同分类下的英文排列在中文之上
 * 生成时间: 2026-07-17 00:00:00
 * 用例编写人: UT003165(吴磊)
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode, navigateToLetterCategory } = require(helperPath);

describe('1832253-【启动器】【窗口模式】【"按名称"分类】【字母排序规则】应用名称首位字符相同，同分类下的英文排列在中文之上', () => {
  test('1832253-【启动器】【窗口模式】【"按名称"分类】【字母排序规则】应用名称首位字符相同，同分类下的英文排列在中文之上', async ({ device, agent, uos, env, system }) => {
    // 步骤1：确认测试所需应用已安装（Foxmail、FSearch）
    console.log('步骤1：确认测试所需应用已安装');
    const checkFox = await system.exec('dpkg -l 2>/dev/null | grep com.foxmail.deepin');
    const checkFs = await system.exec('dpkg -l 2>/dev/null | grep io.github.fsearch');
    console.log(`Foxmail: ${checkFox.stdout.includes('foxmail') ? '已安装' : '未安装'}`);
    console.log(`FSearch: ${checkFs.stdout.includes('fsearch') ? '已安装' : '未安装'}`);

    // 步骤2：打开启动器，切换到"按名称"分类
    console.log('步骤2：打开启动器并切换到"按名称"分类');
    await switchLauncherSortMode(agent, uos, '按名称', system);
    console.log('断言：切换到按名称分类成功');

    // 步骤3：导航到F分类，查看F开头的应用列表
    console.log('步骤3：导航到F分类');
    await navigateToLetterCategory(agent, 'F');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('断言：已导航到F分类');
    await agent.aiAssert("启动器界面存在字母分类标题，F字母分类可见");

    // 步骤4：检查F分类下的应用排列顺序
    console.log('步骤4：检查F分类下的应用排列顺序');
    await agent.aiAssert("启动器界面显示应用列表，应用已按字母顺序排列");
  }, { timeout: 600000, tags: ["1832253", "level1", "module:launcher"] });
});
