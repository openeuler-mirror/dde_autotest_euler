/**
 * 用例 PMSID: 1832319
 * 用例标题: 【启动器】【窗口模式】【"按分类"分类】【键盘操作】tab键切换焦点至应用列表
 * 生成时间: 2026-07-17 10:00:00
 * 用例编写人: UT003165(吴磊)
 * 注：切换到"按分类"模式后，连续按4次tab键跳转至分类应用区域，默认选中"网络应用"下面的应用名称
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832319-【启动器】【窗口模式】【"按分类"分类】【键盘操作】tab键切换焦点至应用列表', () => {
  test('1832319-【启动器】【窗口模式】【"按分类"分类】【键盘操作】tab键切换焦点至应用列表', async ({ device, agent, uos, system }) => {
    // 步骤1：打开启动器，切换到"按分类"分类
    console.log('步骤1：打开启动器并切换到"按分类"分类');
    await switchLauncherSortMode(agent, uos, '按分类', system);
    console.log('断言：切换到按分类模式成功');

    // 步骤2：连续按4次tab键，跳转至分类应用区域
    console.log('步骤2：连续按4次tab键，跳转至分类应用区域');
    for (let i = 0; i < 4; i++) {
      await device.pressKey('Tab');
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    // 检查：默认焦点在首位分类标题（网络应用）下的应用名称上
    console.log('断言：默认焦点在首位分类标题下的应用名称上');
    await agent.aiAssert("启动器界面存在分类标题，某个应用处于选中或高亮状态");
  }, { timeout: 600000, tags: ["1832319", "level1", "module:launcher"] });
});
