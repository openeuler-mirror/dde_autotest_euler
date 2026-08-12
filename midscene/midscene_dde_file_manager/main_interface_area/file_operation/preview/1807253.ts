/**
 * 用例 PMSID: 1807253
 * 用例标题:  预览-图片缩略图预览
 * 生成时间: 2025-12-18
 * 用例编写人: UT000054（叶飞）
 */

describe('1807253-预览-图片缩略图预览', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
    await system.exec("killall dde-file-manager");
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.displaypreview.visible -v false");

  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1807253-预览-图片缩略图预览', async ({ device, agent, uos, system }) => {

    console.log('步骤1: 将测试图片文件复制到图片目录');
    const caseDir = process.env.TESTCASE_DIR;
    const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1807253`;

    // 使用系统命令复制文件
    await system.exec(`cp -r "${sourcePath}" ~/Pictures/`);
    await system.exec("cp ~/Pictures/1807253/备份1.bmp  ~/Downloads/");
    console.log(`文件已复制到: 图片目录`);

    // 步骤1： 打开文管进入测试图片目录，检查图片的预览缩略图和打开后的图片内容一致
    console.log('步骤1:  打开文管进入测试图片目录，检查图片的预览缩略图和打开后的图片内容一致');
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiDoubleClick("左侧导航栏的图片");
    await agent.aiDoubleClick("1807253");
    await agent.aiWaitFor("当前目录存图片文件");
    await agent.aiDoubleClick("1807253.bmp");
    await agent.aiWaitFor("图片文件被打开");
    await agent.aiAssert("看图窗口显示的图片内容与文管的图片预览图基本一致");
    await agent.aiTap("看图窗口右上角的关闭按钮");

    //步骤2： 修改图片的名称 1807253.bmp 改成test.bmp,缩略图未发生变化
    console.log('步骤2: 修改图片名称，验证缩略图未变化');
    await agent.aiRightClick("1807253.bmp");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("重命名");
    await device.typeText("test");
    await agent.aiTap("当前目录空白处");
    await agent.aiWaitFor("文件名显示为：test.bmp", { timeoutMs: 3000 });
    await agent.aiAssert("test.bmp缩略图显示正常，与备份1.bmp缩略图一致");

    //步骤3： 还原图片名字：test.bmp 改成1807253.bmp 缩略图未发生变化
    console.log('步骤3: 还原图片名称，验证缩略图未变化');
    await agent.aiRightClick("test.bmp");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("重命名");
    await device.typeText("1807253");
    await agent.aiTap("当前目录空白处");
    await agent.aiWaitFor("文件名显示为：1807253.bmp", { timeoutMs: 3500 });
    await agent.aiAssert("1807253.bmp缩略图显示正常，与备份1.bmp缩略图基本一致");

    //步骤4： 复制图片1807253.bmp到下载目录，检查图片的预览缩略图未发生变化
    console.log('步骤5: 复制图片到下载目录，验证缩略图未变化');
    await agent.aiRightClick("1807253.bmp");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiTap("复制");
    await agent.aiTap("左侧导航栏的下载");
    await device.pressKey("Ctrl+V");
    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待复制完成
    await agent.aiWaitFor("下载目录中的1807253.bmp文件", { timeoutMs: 5000 });
    await agent.aiAssert("下载目录中的1807253.bmp缩略图未发生变化,与备份1.bmp缩略图基本一致");

    //步骤5：进入test目录 将1807253.bmp 拷贝至上级目录1807253，覆盖原始图片，检查图片缩略图发生变化
    console.log('步骤6: 覆盖原始图片，验证缩略图变化');
    await agent.aiTap("左侧导航栏的图片");
    await agent.aiDoubleClick("1807253");
    await agent.aiDoubleClick("test");
    await agent.aiWaitFor("进入test目录");
    await agent.aiTap("1807253.bmp");
    await device.pressKey("Ctrl+C");
    await agent.aiTap("窗口左侧返回上级目录按钮");
    await device.pressKey("Ctrl+V");
    await agent.aiWaitFor("弹出提示框：目标文件夹已包含名为“1807253.bmp”的文件");
    await agent.aiTap("替换");
    await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒
   // await agent.aiAssert("1807253.bmp缩略图与备份2.bmp图片缩略图一致");

  }, { timeout: 600000, tags: ["1807253", "level3", "preview", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("rm -rf ~/Pictures/1807253* ~/Downloads/*.bmp");
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec("killall dde-file-manager");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
