/**
 * 用例 PMSID: 1807265
 * 用例标题: 预览开关-文管打开多个标签关闭开启预览
 * 生成时间: 2025-12-18
 * 用例编写人: UT000054（叶飞）
 */

describe('1807265-预览开关-文管打开多个标签关闭开启预览', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1807265-预览开关-文管打开多个标签关闭开启预览', async ({ device, agent, uos, system }) => {

    console.log('步骤1: 将测试拷贝至主目录');
    const caseDir = process.env.TESTCASE_DIR
    const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1807255.zip`;

    // 使用系统命令复制文件
    await system.exec(`cp -r "${sourcePath}" ~`);
    console.log(`文件已复制到: 家目录`);

    await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒
    //解压测试文件夹
    await system.exec("unzip -o ~/1807255.zip -d ~");
    await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒
    await system.exec("rm -rf ~/1807255.zip");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    // 步骤1： 打开文管进入主目录下的1807255目录
    console.log('步骤2: 打开文件管理器并进入测试目录');
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的主目录");
    await agent.aiDoubleClick("1807255");
    await agent.aiWaitFor("进入1807255目录");
    //for 循环按+ 3次
    for (let i = 1; i <= 2; i++) {
      await agent.aiTap("+");
      await new Promise(resolve => setTimeout(resolve, 1000)); //等待1秒

    }
    await agent.aiWaitFor("文件管理器顶部有3个1807255的标签");
    //命令行关闭预览
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k previewEnable -v false");
    // 步骤2：验证第一个标签页面视频预览（预览已关闭，应该无响应）
    await agent.aiTap("文件管理器窗口顶部第一个1807255标签");
    await new Promise(resolve => setTimeout(resolve, 3000)); //等待3秒
    await agent.aiTap("~!@#$%^&()_+{}～！@#￥%……&（）——+{}：“《》？.mp4");
    await new Promise(resolve => setTimeout(resolve, 2000)); //等待2秒
    await device.pressKey("Space");
    await agent.aiWaitFor("界面中间未弹出新的窗口", { timeoutMs: 5000 });
    //命令行打开预览
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k previewEnable -v true");
    await device.pressKey("Space");
    await agent.aiWaitFor("弹出窗口", { timeoutMs: 5000 });
    await agent.aiAssert("播放mp4文件，显示播放进度条");
    await device.pressKey("Esc");//关闭预览窗口
    // 步骤3：验证第二个标签页面音频预览（预览已关闭，应该无响应）
    await agent.aiTap("文件管理器窗口顶部第二个1807255标签");
    await new Promise(resolve => setTimeout(resolve, 3000)); //等待3秒
    await agent.aiTap("~!@#$%^&()_+{}～！@#￥%……&（）——+{}：“《》？.mp3");
    await device.pressKey("Space");
    await agent.aiWaitFor("弹出窗口", { timeoutMs: 5000 });
    await agent.aiAssert("正在播放mp3文件，显示播放进度条");
    await device.pressKey("Esc");//关闭预览窗口
    //命令行关闭预览
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k previewEnable -v false");
    await device.pressKey("Space");
    await agent.aiWaitFor("界面中间未弹出新的窗口", { timeoutMs: 5000 });


    // 步骤4：验证第三个标签页面图片预览（预览已关闭，应该无响应）
    await agent.aiTap("文件管理器窗口顶部第三个1807255标签");
    await new Promise(resolve => setTimeout(resolve, 3000)); //等待3秒
    await agent.aiTap("~!@#$%^&()_+{}～！@#￥%……&（）——+{}：“《》？.png");
    await device.pressKey("Space");
    await agent.aiWaitFor("界面中间未弹出新的窗口", { timeoutMs: 5000 });
    //命令行打开预览
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k previewEnable -v true");
    await device.pressKey("Space");
    await agent.aiWaitFor("弹出窗口", { timeoutMs: 5000 });
    await agent.aiAssert("可以正常显示png格式图片文件预览");
    await device.pressKey("Esc");//关闭预览窗口

  }, { timeout: 600000, tags: ["1807265", "level3", "preview", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("rm -rf ~/1807255");
    await system.exec("rm -rf ~/1807255.zip");
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec("killall dde-file-manager");
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k previewEnable -v true");
    await system.exec("killall deepin-movie");
    await system.exec("killall deepin-music");
    await system.exec("killall deepin-image-viewer");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
