
/**
 * 用例 PMSID: 1806417
 * 用例标题: 文管选择窗-音乐调用
 * 生成时间: 2026-07-27 10:00:00
 * 用例编写人：UT002411（胡戬）
 */

require("dotenv/config");

// 功能函数：清空音乐播放列表
async function clearMusicList(agent, device) {
  const isEmpty = await agent.aiBoolean("音乐播放列表为空，没有歌曲");
  if (isEmpty) {
    console.log('音乐播放列表已为空，无需清理');
    return;
  }
  console.log('音乐播放列表不为空，开始清空');
  await agent.aiTap("音乐播放列表区域");
  await device.pressKey('Ctrl', 'a');
  await device.pressKey('Delete');
  await agent.aiTap("删除确认弹窗中的移除按钮");
  await agent.aiAssert("音乐播放列表已清空");
  console.log('音乐播放列表已清空');
}

describe('1806417-文管选择窗-音乐调用', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall deepin-music & killall dde-file-dialog', 500);
    await uos.showDesktop();
    // 前置条件：下载网络测试文件到音乐目录并解压
    await system.exec(`cd ~/Music && rm -f 1806417.zip && wget -O 1806417.zip http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/1806417.zip`, 30000);
    await system.exec(`cd ~/Music && unzip -o 1806417.zip && rm -f 1806417.zip`, 10000);
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1806417-文管选择窗-音乐调用', async ({ device, agent, uos, system }) => {
    // 步骤1：打开音乐，清空音乐列表
    console.log('步骤1：打开音乐，清空音乐列表');
    await uos.openApp("音乐");
    await clearMusicList(agent, device);

    // 步骤2：在音乐窗口主界面，点击"添加歌曲"，打开文件选择窗口
    console.log('步骤2：点击"添加歌曲"，打开文件选择窗口');
    await agent.aiTap("音乐窗口中的添加歌曲按钮");
    // 断言：文件选择窗口已打开
    await agent.aiAssert("文件选择窗口已打开");
    console.log('断言：文件选择窗口已打开');

    // 步骤3：文件选择窗口中点击侧边栏音乐目录，双击文件夹1806417，点击music1.mp3，点击打开按钮
    console.log('步骤3：点击侧边栏音乐目录，双击1806417文件夹，点击music1.mp3，点击打开');
    await agent.aiTap("文件选择窗口左侧边栏的音乐");
    await agent.aiDoubleClick("文件选择窗口中的1806417文件夹");
    await agent.aiTap("文件选择窗口中的music1.mp3文件");
    await agent.aiTap("文件选择窗口的打开按钮");
    // 断言1：一首音乐被添加到播放列表
    await agent.aiAssert("一首音乐被添加到播放列表");
    console.log('断言1：一首音乐被添加到播放列表');

    // 步骤4：清空音乐列表
    console.log('步骤4：清空音乐列表');
    await clearMusicList(agent, device);

    // 步骤5：在音乐窗口主界面，点击"添加歌曲目录"，打开文件选择窗口
    console.log('步骤5：点击"添加歌曲目录"，打开文件选择窗口');
    await agent.aiTap("音乐窗口中的添加歌曲目录按钮");
    await agent.aiAssert("文件选择窗口已打开");
    console.log('断言：文件选择窗口已打开');

    // 步骤6：文件选择窗口中点击侧边栏音乐目录，双击文件夹1806417，点击音乐文件夹，点击打开按钮
    console.log('步骤6：点击侧边栏音乐目录，双击1806417文件夹，点击音乐文件夹，点击打开');
    await agent.aiTap("文件选择窗口左侧边栏的音乐");
    await agent.aiDoubleClick("文件选择窗口中的1806417文件夹");
    await agent.aiTap("文件选择窗口中的音乐文件夹");
    await agent.aiTap("文件选择窗口的打开按钮");
    // 断言2：一首音乐被添加到播放列表
    await agent.aiAssert("一首音乐被添加到播放列表");
    console.log('断言2：一首音乐被添加到播放列表');

    // 步骤7：清空音乐列表
    console.log('步骤7：清空音乐列表');
    await clearMusicList(agent, device);

    // 步骤8：在音乐窗口主界面，点击"添加歌曲目录"，打开文件选择窗口
    console.log('步骤8：点击"添加歌曲目录"，打开文件选择窗口');
    await agent.aiTap("音乐窗口中的添加歌曲目录按钮");
    await agent.aiAssert("文件选择窗口已打开");
    console.log('断言：文件选择窗口已打开');

    // 步骤9：文件选择窗口中点击侧边栏音乐目录，双击文件夹1806417，点击音乐子文件夹，点击打开按钮
    console.log('步骤9：点击侧边栏音乐目录，双击1806417文件夹，点击音乐子文件夹，点击打开');
    await agent.aiTap("文件选择窗口左侧边栏的音乐");
    await agent.aiDoubleClick("文件选择窗口中的1806417文件夹");
    await agent.aiTap("文件选择窗口中的音乐子文件夹");
    await agent.aiTap("文件选择窗口的打开按钮");
    // 断言3：一首音乐被添加到播放列表
    await agent.aiAssert("一首音乐被添加到播放列表");
    console.log('断言3：一首音乐被添加到播放列表');

  }, { timeout: 600000, tags: ['1806417', 'level3', 'file_selection_dialog', 'hujian'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 后置步骤：清理环境，关闭应用，删除创建的测试文件夹
    await system.exec('killall deepin-music & killall dde-file-dialog', 500);
    await system.exec(`rm -rf ~/Music/1806417`, 500);
    await uos.showDesktop();
  });
});
