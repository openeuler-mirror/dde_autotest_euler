/**
 * 用例 PMSID: 1807263
 * 用例标题:  预览开关-文管打开多个窗口关闭开启预览
 * 生成时间: 2025-12-18
 * 用例编写人: UT000054（叶飞）
 */

describe('1807263-预览开关-文管打开多个窗口关闭开启预览', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
    await system.exec("killall dde-file-manager");
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.displaypreview.visible -v false");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1807263-预览开关-文管打开多个窗口关闭开启预览', async ({ device, agent, uos, system }) => {

    console.log('步骤1: 将测试拷贝至主目录');
    const caseDir = process.env.TESTCASE_DIR;
    const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1807255.zip`;
    //预览图标定位
    const imgRelativePath = 'midscene_dde_file_manager/picture/文件管理器预览图标.png';

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

    //命令行关闭预览
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k previewEnable -v false");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    // 步骤2：验证文件夹预览（预览已关闭，应该无响应）
    await agent.aiTap("1807255");
    await device.pressKey("Space");
    await agent.aiWaitFor("未弹出预览窗口", { timeoutMs: 5000 });
    //命令行打开预览
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k previewEnable -v true");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await device.pressKey("Space");
    await agent.aiWaitFor("弹出窗口", { timeoutMs: 5000 });
    await agent.aiAssert("窗口显示：文件夹图标，大小、文件数量");
    await device.pressKey("Esc");//关闭预览窗口

    // 步骤3：验证视频文件预览
    //命令行关闭预览
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k previewEnable -v false");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await agent.aiRightClick("1807255");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("在新窗口打开");
    await agent.aiWaitFor("新窗口打开，进入1807255目录");
    console.log('步骤3: 预览特殊字符文件名的mp4文件');
    await agent.aiTap("~!@#$%^&()_+{}～！@#￥%……&（）——+{}：“《》？.mp4");
    await device.pressKey("Space");
    await agent.aiWaitFor("未弹出预览窗口", { timeoutMs: 5000 });
    //命令行打开预览
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k previewEnable -v true");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
    await device.pressKey("Space");
    await agent.aiWaitFor("弹出窗口", { timeoutMs: 5000 });
    await agent.aiAssert("播放mp4文件，显示播放进度条");
    await device.pressKey("Esc");//关闭预览窗口

    //步骤4：验证文管打开对话框预览（预览已关闭，应该无响应）
    //命令行关闭预览
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k previewEnable -v false");
    await uos.openApp("音乐");
    await agent.aiTap("窗口右上角: + 按钮");
    await agent.aiWaitFor("文件管理器对话框窗口打开");
    await agent.aiTap("bensound-sunny.mp3");
    await device.pressKey("Space");
    await agent.aiWaitFor("未弹出预览窗口", { timeoutMs: 5000 });

    //命令行打开预览
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k previewEnable -v true");
    await device.pressKey("Space");
    await agent.aiWaitFor("弹出窗口", { timeoutMs: 5000 });
    await agent.aiAssert("播放mp3文件，显示播放进度条");
    await device.pressKey("Esc");//关闭预览窗口
    await device.pressKey("Esc");//关闭文管对话框

  }, { timeout: 600000, tags: ["1807263", "level3", "preview", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("rm -rf ~/1807255");
    await system.exec("rm -rf ~/1807255.zip");
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k previewEnable -v true");
    await system.exec("killall dde-file-manager");
    await system.exec("killall deepin-music");
    await system.exec("killall deepin-movie");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
