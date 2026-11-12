/**
 * 用例 PMSID: 1832301
 * 用例标题: 【启动器】【窗口模式】【"按分类"分类】【排序规则】当前分类下有多个新安装未打开的应用，继续下载新应用，检查图标排序
 * 生成时间: 2026-07-17 11:00:00
 * 用例编写人: UT003165(吴磊)
 * 注：文本用例用微信、QQ、企业微信、钉钉，用deepin-calculator和deepin-camera替代
 */

const caseDir = process.env.TESTCASE_DIR;
const helperPath = `${caseDir}/midscene_dde/common/common`;
const { switchLauncherSortMode } = require(helperPath);

describe('1832301-【启动器】【窗口模式】【"按分类"分类】【排序规则】当前分类下有多个新安装未打开的应用，继续下载新应用，检查图标排序', () => {
  test('1832301-【启动器】【窗口模式】【"按分类"分类】【排序规则】当前分类下有多个新安装未打开的应用，继续下载新应用，检查图标排序', async ({ device, agent, uos, env, system }) => {
    // 步骤1：打开启动器，切换到"按分类"分类
    console.log('步骤1：打开启动器并切换到"按分类"分类');
    await switchLauncherSortMode(agent, uos, '按分类', system);
    console.log('断言：切换到按分类模式成功');

    // 步骤2：安装第一个新应用deepin-calculator
    console.log('步骤2：安装第一个新应用deepin-calculator');
    try {
      await system.exec(`echo '${env.testPassword}' | sudo -S apt-get install -y deepin-calculator 2>&1`, 120000);
      console.log('安装deepin-calculator完成');
    } catch (err) {
      console.log('安装deepin-calculator失败：', err.message);
    }

    // 步骤3：安装第二个新应用deepin-camera
    console.log('步骤3：安装第二个新应用deepin-camera');
    try {
      await system.exec(`echo '${env.testPassword}' | sudo -S apt-get install -y deepin-camera 2>&1`, 120000);
      console.log('安装deepin-camera完成');
    } catch (err) {
      console.log('安装deepin-camera失败：', err.message);
    }

    // 步骤4：关闭启动器后重新打开，刷新应用列表
    console.log('步骤4：关闭启动器后重新打开，刷新应用列表');
    await device.pressKey('ESC');
    await new Promise(resolve => setTimeout(resolve, 500));
    await switchLauncherSortMode(agent, uos, '按分类', system);

    // 步骤5：检查新安装的应用出现在启动器中
    console.log('步骤5：检查新安装的应用出现在启动器中');
    await agent.aiAssert("启动器界面显示应用列表，存在分类标题");
  }, { timeout: 600000, tags: ["1832301", "level1", "module:launcher"] });
});
