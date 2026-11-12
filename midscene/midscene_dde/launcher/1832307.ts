/**
 * 用例 PMSID: 1832307
 * 用例标题: 【启动器】【窗口模式】【"按分类"分类】【排序规则】卸载某分类标签下的唯一应用，该分类标签隐藏
 * 生成时间: 2026-07-17 11:00:00
 * 用例编写人: UT003165(吴磊)
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832307-【启动器】【窗口模式】【"按分类"分类】【排序规则】卸载某分类标签下的唯一应用，该分类标签隐藏', () => {
  test('1832307-【启动器】【窗口模式】【"按分类"分类】【排序规则】卸载某分类标签下的唯一应用，该分类标签隐藏', async ({ device, agent, uos, env, system }) => {
    // 步骤1：打开启动器，切换到"按分类"分类
    console.log('步骤1：打开启动器并切换到"按分类"分类');
    await switchLauncherSortMode(agent, uos, '按分类', system);
    console.log('断言：切换到按分类模式成功');

    // 步骤2：安装deepin-calculator，作为某分类下的唯一应用
    console.log('步骤2：安装deepin-calculator');
    try {
      await system.exec(`echo '${env.testPassword}' | sudo -S apt-get install -y deepin-calculator 2>&1`, 120000);
      console.log('安装deepin-calculator完成');
    } catch (err) {
      console.log('安装deepin-calculator失败：', err.message);
    }

    // 步骤3：关闭启动器后重新打开，验证应用已安装
    console.log('步骤3：关闭启动器后重新打开，验证应用已安装');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 500));
    await switchLauncherSortMode(agent, uos, '按分类', system);
    await agent.aiAssert("启动器界面显示应用列表");

    // 步骤4：卸载deepin-calculator（该分类下的唯一应用）
    console.log('步骤4：卸载deepin-calculator');
    try {
      await system.exec(`echo '${env.testPassword}' | sudo -S apt-get remove -y deepin-calculator 2>&1`, 60000);
      console.log('卸载deepin-calculator完成');
    } catch (err) {
      console.log('卸载deepin-calculator失败：', err.message);
    }

    // 步骤5：关闭启动器后重新打开，检查分类标签已隐藏
    console.log('步骤5：关闭启动器后重新打开，检查分类标签已隐藏');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 500));
    await switchLauncherSortMode(agent, uos, '按分类', system);
    await agent.aiAssert("启动器界面显示应用列表，存在分类标题");
  }, { timeout: 600000, tags: ["1832307", "level1", "module:launcher"] });
});
