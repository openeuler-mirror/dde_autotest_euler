/**
 * 用例 PMSID: 1959067
 * 用例标题: 显示uab包预览
 * 生成时间: 2025-12-22 15:47:26
 * 用例编写人: UT000054（叶飞）
 */

describe('1959067-显示uab包预览', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
    //打开预览
    await system.exec("killall dde-file-manager");
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.displaypreview.visible -v true");
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1959067-显示uab包预览', async ({ device, agent, uos, system }) => {

    console.log('步骤1: 拷贝测试文件到文档目录下面');
    const caseDir = process.env.TESTCASE_DIR;
    const sourcePath = `${caseDir}midscene_dde_file_manager/resources/1959067`;
    //预览图标定位
    const imgRelativePath = `${caseDir}midscene_dde_file_manager/picture/文件管理器预览图标.png`;

    // 使用系统命令复制文件
    await system.exec(`cp -r "${sourcePath}" ~/Documents`);
    console.log(`文件已复制到: 文档目录`);


    //步骤2： 打开文管，进入主目录/1959067 设置显示预览

    // 打开文件管理器
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的文档");
    await agent.aiDoubleClick("1959067");

    //步骤3： 分别选择2个uab包，检查图标与右侧预览图标一致
    await agent.aiTap("test.uab");
    await agent.aiAssert("test.uab的图标与窗口最右侧预览图标显示一致");
    await agent.aiTap("test2.uab");
    await agent.aiAssert("test2.uab的图标与窗口最右侧预览图标显示一致");

  }, { timeout: 600000, tags: ["1959067", "level3", "preview", "yefei"] });
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("rm -rf ~/Documents/1959067*");
    //恢复默认设置
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec("killall dde-file-manager");
    await system.exec("dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.displaypreview.visible -v false");
    await system.cleanupFileManager();
    await device.pressKey('Esc');

  });
});
