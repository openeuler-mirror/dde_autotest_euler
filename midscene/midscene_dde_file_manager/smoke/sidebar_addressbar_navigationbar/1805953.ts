/**
 * 用例 PMSID: 1805953
 * 用例标题: 勾选【显示隐藏文件】-在桌面以"."开头新建/重命名文件-不弹窗提示
 * 生成时间: 2026-02-27
 * 用例编写人: UT000211(陈依)
 */

async function clearEnvironment(system) {
  //测试前还原文管配置到默认值
  //清理桌面配置目录，影响桌面布局和桌面整理布局
  await system.exec("rm -rf ~/.config/deepin/dde-desktop");
  //清理文管配置文件
  await system.exec("rm -rf ~/.config/deepin/dde-file-manager.json");
  await system.exec("rm -rf ~/.config/deepin/dde-file-manager.obtusely.json");
  await system.exec("rm -rf ~/.config/deepin/dde-file-manager/*.json");
  await system.exec("systemctl --user restart deepin-service-plugin@org.deepin.Filemanager.TextIndex.service");
  await system.exec("systemctl --user restart deepin-anything-daemon.service");
  await system.exec("systemctl --user restart dde-shell-plugin@org.deepin.ds.desktop.service");
  await system.exec("systemctl --user restart dde-file-manager.service");
  await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
  //清楚文本编辑器
  await system.exec("rm -rf ~/Desktop/*.txt");
  await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9");
}

describe('1805953-[024][core]我的目录-目录默认顺序检查', () => {
  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('beforeEach: 每个测试前的准备');
    await clearEnvironment(system);
    await uos.openApp('文件管理器');
    await agent.aiWaitFor('文件管理器界面已显示');
  });

  test('1805953-[024][core]我的目录-目录默认顺序检查', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器，预期进入到计算机页面
    console.log('步骤 1: 打开文件管理器，预期进入到计算机页面');
    await agent.aiWaitFor('文件管理器已打开并显示计算机页面');

    // 步骤 2: 计算机右侧我的目录下方视频，图片，文档，下载，音乐，桌面文件夹从左到右依次排列
    console.log('步骤 2: 验证我的目录中文件夹顺序');
    await agent.aiAssert("我的目录中的桌面, 视频, 音乐, 图片, 文档, 下载文件夹从左到右依次排列", { deepThink: true });

  }, { timeout: 600000, tags: ['1805953', 'level1', 'smoke', 'DITT', 'chenyi'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('afterEach: 每个测试后的清理');
    await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    await system.exec("ps -ef | grep deepin-editor | grep -v grep | awk '{print $2}' | xargs kill -9");
  });
});
