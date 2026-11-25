
/**
 * 用例 PMSID: 1806421
 * 用例标题: 文管选择窗-影院调用
 * 生成时间: 2026-07-29 09:33:01
 * 用例编写人: UT002411（胡戬）
 */

require("dotenv/config");

const videoDir = '~/Videos';

async function clearEnv(system) {
  try {
    await system.exec('killall deepin-movie || true', 500);
    await system.exec('killall dde-file-dialog || true', 500);
    await system.exec(`rm -rf ${videoDir}/1806421`, 500);
    await system.exec(`rm -f ${videoDir}/*.mp4 ${videoDir}/*.mov ${videoDir}/kong -r`, 500);
    console.log('影院环境清理完成');
  } catch (err) {
    console.error('清理环境失败:', err);
  }
}

describe('1806421-文管选择窗-影院调用', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await clearEnv(system);
    await uos.showDesktop();
    // 前置条件：下载网络测试文件到视频目录并解压
    await system.exec(`cd ${videoDir} && wget -O 1806421.zip http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/1806421.zip && unzip -o 1806421.zip && rm -f 1806421.zip`, 60000);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806421-文管选择窗-影院调用', async ({ device, agent, uos, system }) => {
    // 步骤1：打开影院，在主界面空白处右键唤出菜单，点击打开文件
    console.log('步骤1：打开影院，右键空白处，点击打开文件');
    await uos.openApp("影院");
    await agent.aiRightClick("影院主界面中心处");
    await agent.aiTap("右键菜单中的打开文件");
    // 断言1：打开文件选择对话框
    await agent.aiAssert("文件选择对话框已打开");
    console.log('断言1：打开文件选择对话框');

    // 步骤2：在文件选择对话框中点击视频，点击下方格式右侧的选项框，点击所有
    console.log('步骤2：点击视频，点击格式选项框，点击所有');
    await agent.aiTap("文件选择窗口左侧边栏的视频");
    await agent.aiTap("文件选择窗口下方格式右侧的选项框");
    await agent.aiTap("下拉菜单中的所有");
    // 断言2：可以看到视频目录下的所有文件
    await agent.aiAssert("文件选择窗口中显示视频目录下的所有文件");
    console.log('断言2：可以看到视频目录下的所有文件');

    // 步骤3：点击视频目录中的movie2.mp4，点击打开
    console.log('步骤3：点击movie2.mp4，点击打开');
    await agent.aiTap("文件选择窗口中的movie2.mp4");
    await agent.aiTap("文件选择窗口的打开按钮");
    // 等待3秒让视频加载
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 断言3：视频加载到影院播放
    await agent.aiAssert("播放器中有视频画面");
    console.log('断言3：视频加载到影院播放');

    // 步骤4：结束影院进程
    console.log('步骤4：结束影院进程');
    await system.exec('killall deepin-movie || true', 500);
    await uos.showDesktop();

    // 步骤5：打开影院，右键空白处，点击打开文件夹，点击侧边栏视频，点击打开
    console.log('步骤5：打开影院，右键空白处，点击打开文件夹，点击侧边栏视频，点击打开');
    await uos.openApp("影院");
    await agent.aiRightClick("影院主界面中心处");
    await agent.aiTap("右键菜单中的打开文件夹");
    await agent.aiTap("文件选择窗口左侧边栏的视频");
    await agent.aiTap("文件选择窗口的打开按钮");
    // 等待3秒让视频加载
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 断言4：视频加载到影院播放
    await agent.aiAssert("播放器中有视频画面");
    console.log('断言4：视频加载到影院播放');

    // 步骤6：结束影院进程
    console.log('步骤6：结束影院进程');
    await system.exec('killall deepin-movie || true', 500);
    await uos.showDesktop();

    // 步骤7：打开影院，右键空白处，点击打开文件夹，点击侧边栏视频，点击文件夹kong，点击打开
    console.log('步骤7：打开影院，右键空白处，点击打开文件夹，点击侧边栏视频，点击文件夹kong，点击打开');
    await uos.openApp("影院");
    await agent.aiRightClick("影院主界面中心处");
    await agent.aiTap("右键菜单中的打开文件夹");
    await agent.aiTap("文件选择窗口左侧边栏的视频");
    await agent.aiTap("文件选择窗口中的kong文件夹");
    await agent.aiTap("文件选择窗口的打开按钮");
    // 等待3秒确认是否有视频播放
    await new Promise(resolve => setTimeout(resolve, 3000));
    // 断言5：影院没有播放视频
    await agent.aiAssert("播放器中没有视频画面");
    console.log('断言5：影院没有播放视频');

  }, { timeout: 600000, tags: ['1806421', 'level3', 'file_selection_dialog', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 后置步骤：清理环境（killall deepin-movie & killall dde-file-dialog）
    await clearEnv(system);
    await uos.showDesktop();
  });
});
