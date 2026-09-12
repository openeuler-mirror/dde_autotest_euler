// @ts-nocheck
/**
 * 用例 PMSID: 1863157
 * 用例标题: 视频预览
 * 生成时间: 2026-04-20
 * 用例编写人: UT000686（李双双）
 */

describe('1863157- 视频预览', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
    await system.exec("killall dde-file-manager");
    await system.exec("killall deepin-movie");
    //释放所有按键
    await device.releaseAllKeys();
    // 开启预览
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k previewEnable -v true");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1863157-视频预览', async ({ device, agent, uos, system }) => {

    // 步骤1: 将1863157.wmv文件复制到桌面
    console.log('步骤1: 将1863157.wmv文件复制到桌面');
    const caseDir = process.env.TESTCASE_DIR;
    const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1863157.wmv`;
    await system.exec(`cp -r "${sourcePath}" ~/Desktop/`);
    console.log('文件已复制到桌面');
    await new Promise(resolve => setTimeout(resolve, 3000)); // 等待3秒

    // 步骤2: 在桌面上点击1863157.wmv文件，点击空格键，视频可正常预览，播放5s，无花屏和卡顿的现象
    console.log('步骤2: 在桌面上点击1863157.wmv文件，按空格键预览视频');
    await uos.showDesktop();
    await agent.aiWaitFor("桌面已存在1863157.wmv文件");
    await agent.aiTap("1863157.wmv");
    console.log('点击空格的快捷键播放视频');
    await device.pressKey("Space");
    // await agent.aiWaitFor("弹出视频播放窗口", { timeoutMs: 5000 });
    await new Promise(resolve => setTimeout(resolve, 5000)); // 播放5秒
    await agent.aiAssert("视频正在正常播放，无花屏和卡顿现象");

  }, { timeout: 600000, tags: ["1863157", "level3", "preview", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
     // 步骤3: 关闭弹框
    console.log('步骤3: 点击ALT+F4关闭预览弹框');
    await device.pressKey("Alt+F4");
    await agent.aiWaitFor("视频播放窗口已关闭", { timeoutMs: 5000 });
    //释放所有按键
    await device.releaseAllKeys();
    // 删除资源
    await system.exec("rm -rf ~/Desktop/1863157.wmv");
    await system.exec("killall dde-file-manager");
    await system.exec("killall deepin-movie");
    await system.exec("killall deepin-music");
    await system.exec("killall deepin-image-viewer");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
