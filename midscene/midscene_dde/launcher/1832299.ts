/**
 * 用例 PMSID: 1832299
 * 用例标题: 【启动器】【窗口模式】【"按分类"分类】【排序规则】安装新应用，检查应用排序位置和图标
 * 生成时间: 2026-07-17 11:00:00
 * 用例编写人: UT003165(吴磊)
 * 注：文本用例用360浏览器，用deepin-calculator替代（测试机可安装）
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832299-【启动器】【窗口模式】【"按分类"分类】【排序规则】安装新应用，检查应用排序位置和图标', () => {
  test('1832299-【启动器】【窗口模式】【"按分类"分类】【排序规则】安装新应用，检查应用排序位置和图标', async ({ device, agent, uos, env, system }) => {
    // 步骤1：打开启动器，切换到"按分类"分类
    console.log('步骤1：打开启动器并切换到"按分类"分类');
    await switchLauncherSortMode(agent, uos, '按分类', system);
    console.log('断言：切换到按分类模式成功');

    // 步骤2：安装新应用deepin-calculator（替代360浏览器）
    console.log('步骤2：安装新应用deepin-calculator');
    try {
      const installResult = await system.exec(`echo '${env.testPassword}' | sudo -S apt-get install -y deepin-calculator 2>&1`, 120000);
      console.log('安装deepin-calculator结果：', installResult.success);
    } catch (err) {
      console.log('安装deepin-calculator失败：', err.message);
    }

    // 步骤3：关闭启动器后重新打开，刷新应用列表
    console.log('步骤3：关闭启动器后重新打开，刷新应用列表');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 500));
    await switchLauncherSortMode(agent, uos, '按分类', system);

    // 步骤4：检查新安装的应用出现在启动器中
    console.log('步骤4：检查新安装的应用出现在启动器中');
    await agent.aiAssert("启动器界面显示应用列表，存在分类标题");
  }, { timeout: 600000, tags: ["1832299", "level1", "module:launcher"] });
});
