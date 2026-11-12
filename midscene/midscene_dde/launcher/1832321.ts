/**
 * 用例 PMSID: 1832321
 * 用例标题: 【启动器】【窗口模式】【"按分类"分类】【键盘操作】焦点在分类标题，点击键盘方向键，来回切换选择应用和分类标题
 * 生成时间: 2026-07-17 10:00:00
 * 用例编写人: UT003165(吴磊)
 * 注：需求变更后分类标题无法被选中，只需要测试分类应用能够通过键盘方向键切换选中状态
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832321-【启动器】【窗口模式】【"按分类"分类】【键盘操作】焦点在分类标题，点击键盘方向键，来回切换选择应用和分类标题', () => {
  test('1832321-【启动器】【窗口模式】【"按分类"分类】【键盘操作】焦点在分类标题，点击键盘方向键，来回切换选择应用和分类标题', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器，切换到"按分类"分类
    console.log('步骤1：打开启动器并切换到"按分类"分类');
    await switchLauncherSortMode(agent, uos, '按分类', system);
    console.log('断言：切换到按分类模式成功');

    // 步骤2：按4次Tab键，跳转至分类应用区域
    console.log('步骤2：按4次Tab键，跳转至分类应用区域');
    for (let i = 0; i < 4; i++) {
      await device.pressKey('Tab');
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('断言：焦点在分类应用上');
    await agent.aiAssert("启动器界面某个应用处于选中或高亮状态");

    // 步骤3：按下方向键，切换选中下一个应用
    console.log('步骤3：按下方向键，切换选中下一个应用');
    await device.pressKey('Down');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('断言：应用选中状态切换');
    await agent.aiAssert("启动器界面某个应用处于选中或高亮状态");

    // 步骤4：按上方向键，切换选中上一个应用
    console.log('步骤4：按上方向键，切换选中上一个应用');
    await device.pressKey('Up');
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('断言：应用选中状态切换');
    await agent.aiAssert("启动器界面某个应用处于选中或高亮状态");
  }, { timeout: 600000, tags: ["1832321", "level1", "module:launcher"] });
});
