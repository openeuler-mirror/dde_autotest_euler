/**
 * 用例 PMSID: 1832255
 * 用例标题: 【启动器】【窗口模式】【"按名称"分类】【字母排序规则】应用名称首位字符相同，同分类下的数字排列在英文之上
 * 生成时间: 2026-07-17 00:00:00
 * 用例编写人: UT003165(吴磊)
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { createTestApp, cleanupTestApps, switchLauncherSortMode, navigateToLetterCategory } = require(helperPath);

describe('1832255-【启动器】【窗口模式】【"按名称"分类】【字母排序规则】应用名称首位字符相同，同分类下的数字排列在英文之上', () => {
  test('1832255-【启动器】【窗口模式】【"按名称"分类】【字母排序规则】应用名称首位字符相同，同分类下的数字排列在英文之上', async ({ device, agent, uos, system }) => {
    // 步骤1：创建测试应用W3Cschool和WPS文字（通过.desktop文件，支持AMD和ARM架构）
    console.log('步骤1：创建测试应用W3Cschool和WPS文字');
    await createTestApp(system, 'W3Cschool', null, 'deepin-editor', 'deepin-editor', 'Development;');
    await createTestApp(system, 'WPS文字', null, 'deepin-editor', 'deepin-editor', 'Office;');
    console.log('测试应用W3Cschool和WPS文字已创建');

    // 步骤2：打开启动器
    console.log('步骤2：打开启动器');
    await uos.openLauncher();

    // 步骤2.5：验证W3Cschool在自由排序模式下可见
    console.log('步骤2.5：验证W3Cschool在自由排序模式下可见');
    await agent.aiAssert("启动器界面显示了W3Cschool应用");
    console.log('断言：W3Cschool在自由排序模式下可见');

    // 步骤3-4：切换到"按名称"分类
    console.log('步骤3-4：切换到"按名称"分类');
    await switchLauncherSortMode(agent, uos, '按名称', system);
    console.log('断言：切换到按名称分类成功');

    // 步骤5：导航到W分类
    console.log('步骤5：导航到W分类');
    await navigateToLetterCategory(agent, 'W');

    // 步骤6：检查W3Cschool是否出现在W分类中
    console.log('步骤6：检查W3Cschool是否出现在W分类中');
    await agent.aiAssert("启动器W分类下显示了W3Cschool应用");

    // 步骤7：检查W3Cschool排列在W分类首位（数字3应排列在字母和中文字符之前）
    console.log('步骤7：检查W3Cschool排列在W分类首位');
    await agent.aiAssert("W3Cschool排列在W分类的首位");

    // 步骤8：清理测试应用
    console.log('步骤8：清理测试应用W3Cschool和WPS文字');
    await cleanupTestApps(system, ['W3Cschool', 'WPS文字']);
    console.log('测试应用已清理');
  }, { timeout: 600000, tags: ["1832255", "level1", "module:launcher"] });
});
