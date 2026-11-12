/**
 * 用例 PMSID: 1832257
 * 用例标题: 【启动器】【窗口模式】【"按名称"分类】【字母排序规则】应用名称首位字符相同，同分类下的空格排列在中文之上
 * 生成时间: 2026-07-17 00:00:00
 * 用例编写人: UT003165(吴磊)
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { createTestApp, cleanupTestApps, switchLauncherSortMode, navigateToLetterCategory } = require(helperPath);

describe('1832257-【启动器】【窗口模式】【"按名称"分类】【字母排序规则】应用名称首位字符相同，同分类下的空格排列在中文之上', () => {
  test('1832257-【启动器】【窗口模式】【"按名称"分类】【字母排序规则】应用名称首位字符相同，同分类下的空格排列在中文之上', async ({ device, agent, uos, system }) => {
    // 步骤1：创建测试应用WPS 专业版（有空格）和WPS便签（无空格）
    console.log('步骤1：创建测试应用WPS 专业版和WPS便签');
    await createTestApp(system, 'WPS 专业版', 'WPS-Professional', 'deepin-editor', 'deepin-editor', 'Office;');
    await createTestApp(system, 'WPS便签', 'WPS-Bianqian', 'deepin-editor', 'deepin-editor', 'Office;');
    console.log('测试应用WPS 专业版和WPS便签已创建');

    // 步骤2：打开启动器
    console.log('步骤2：打开启动器');
    await uos.openLauncher();

    // 步骤3：切换到"按名称"分类
    console.log('步骤3：切换到"按名称"分类');
    await switchLauncherSortMode(agent, uos, '按名称', system);
    console.log('断言：切换到按名称分类成功');

    // 步骤4：导航到W分类
    console.log('步骤4：导航到W分类');
    await navigateToLetterCategory(agent, 'W');

    // 步骤5：检查WPS 专业版（有空格）排列在W分类首位（空格排序在中文之前）
    // 排序规则：空格 > 中文字符，所以"WPS 专业版"应该排在最前面
    console.log('步骤5：检查WPS 专业版排列在W分类首位');
    await agent.aiAssert("WPS 专业版排列在W分类的首位");

    // 步骤6：清理测试应用
    console.log('步骤6：清理测试应用WPS 专业版和WPS便签');
    await cleanupTestApps(system, ['WPS 专业版', 'WPS便签']);
    console.log('测试应用已清理');
  }, { timeout: 600000, tags: ["1832257", "level1", "module:launcher"] });
});
