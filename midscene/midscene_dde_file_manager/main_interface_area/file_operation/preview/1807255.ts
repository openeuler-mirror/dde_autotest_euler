/**
 * 用例 PMSID: 1807255
 * 用例标题:  预览-预览文件名包含特殊字符的文件
 * 生成时间: 2025-12-18
 * 用例编写人: UT000054（叶飞）
 */

describe('1807255-预览-预览文件名包含特殊字符的文件', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
    //关闭视图的显示预览
    await system.exec("killall dde-file-manager");
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.displaypreview.visible -v false");
    await uos.openApp("文件管理器", { maximizeWindow: true });
    //恢复设置
    //设置图标定位
    const caseDir = process.env.TESTCASE_DIR;
    const imgRelativePath = `${caseDir}midscene_dde_file_manager/picture/文件管理器设置图标.png`;
    await agent.aiTap({
      prompt: '文件管理器-设置图标',
      images: [
        {
          name: '文件管理器设置图标',
          url: imgRelativePath,
        },
      ],
    });
    await agent.aiWaitFor("弹出菜单");
    await agent.aiTap("设置");
    await agent.aiWaitFor("基础设置");
    await agent.aiHover("窗口右侧的基础设置");
    await agent.aiScroll("基础设置", { direction: 'down' });
    await agent.aiWaitFor("文件粉碎可见");
    await agent.aiTap("文件粉碎");
    await agent.aiWaitFor("恢复默认可见");
    await agent.aiTap("恢复默认");
    await agent.aiTap("设置窗口的关闭按钮");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1807255-预览-预览文件名包含特殊字符的文件', async ({ device, agent, uos, system, env }) => {

    console.log('步骤1: 将测试拷贝至主目录');
    const caseDir = process.env.TESTCASE_DIR;
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
    //命令行开启预览
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.preview -k previewEnable -v true");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒

    // 步骤1： 打开文管进入主目录下的1807255目录
    console.log('步骤2: 打开文件管理器并进入测试目录');
    await agent.aiTap("左侧导航栏的主目录");
    await agent.aiDoubleClick("1807255");
    await agent.aiWaitFor("进入1807255目录");

    // 预览mp4文件 - 验证特殊字符文件名的mp4文件可以正常预览
    console.log('步骤3: 预览特殊字符文件名的mp4文件');
    await agent.aiTap("~!@#$%^&()_+{}～！@#￥%……&（）——+{}：“《》？.mp4");
    await device.pressKey("Space");
    await agent.aiWaitFor("弹出窗口", { timeoutMs: 5000 });
    await agent.aiAssert("播放mp4文件，显示播放进度条");
    await device.pressKey("ESC");

    // 预览mp3文件 - 验证特殊字符文件名的mp3文件可以正常预览
    console.log('步骤4: 预览特殊字符文件名的mp3文件');
    await agent.aiTap("~!@#$%^&()_+{}～！@#￥%……&（）——+{}：“《》？.mp3");
    await device.pressKey("Space");
    await agent.aiWaitFor("弹出窗口", { timeoutMs: 5000 });
    await agent.aiAssert("播放mp3文件,显示播放进度条");
    await device.pressKey("ESC");

    // 预览txt文件 - 验证特殊字符文件名的txt文件可以正常预览
    console.log('步骤5: 预览特殊字符文件名的txt文件');
    //await agent.aiTap("~!@#$%^&()_+{}～！@#￥%……&（）——+{}：“《》？.txt");
    await agent.aiTap("txt文件");
    await device.pressKey("Space");
    await agent.aiWaitFor("弹出窗口", { timeoutMs: 5000 });
    await agent.aiAssert("显示txt文件内容：这是一段测试内容等重复性文字");
    await device.pressKey("ESC");

    // 预览png文件 - 验证特殊字符文件名的png文件可以正常预览
    console.log('步骤6: 预览特殊字符文件名的png文件');
    //await agent.aiTap("~!@#$%^&()_+{}～！@#￥%……&（）——+{}：“《》？.png");
    await agent.aiTap("png图片文件");
    await device.pressKey("Space");
    await agent.aiWaitFor("弹出窗口", { timeoutMs: 5000 });
    await agent.aiAssert("可以正常显示png格式图片文件预览");
    await device.pressKey("ESC");

    // 预览zip文件 - 验证特殊字符文件名的zip文件可以正常预览
    console.log('步骤7: 预览特殊字符文件名的zip文件');
    await agent.aiTap("~!@#$%^&()_+{}～！@#￥%……&（）——+{}：“《》？.zip");
    await device.pressKey("Space");
    await agent.aiWaitFor("弹出窗口", { timeoutMs: 5000 });
    await agent.aiAssert("压缩文件预览窗口正常显示:显示带ZIP图标以及文件名字和文件类型以及大小");
    await device.pressKey("ESC");

  }, { timeout: 600000, tags: ["1807255", "level3", "preview", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("rm -rf ~/1807255");
    await system.exec("rm -rf ~/1807255.zip");
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
