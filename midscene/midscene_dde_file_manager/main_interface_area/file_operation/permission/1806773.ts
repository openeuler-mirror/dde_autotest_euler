/**
 * 用例 PMSID: 1806773
 * 用例标题:  文件权限-在可读写文件夹下对只读文件夹/文件进行操作_
 * 生成时间: 2025-12-17
 * 用例编写人: UT000054（叶飞）
 */

describe('1806773-文件权限-在可读写文件夹下对可读写文件/文件夹进行操作_', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1806773-文件权限-在可读写文件夹下对可读写文件/文件夹进行操作_', async ({ device, agent, uos, system }) => {

    console.log('创建可读写文件夹以及文件');

    // 前置条件: 创建测试可读写文件夹目录下创建可读写文件和可读写文件夹
    await system.exec("mkdir -p ~/normal_folder/test_folder");
    await system.exec("echo 'this is a normal testfile' >~/normal_folder/testfi.txt");

    //设置文件管理器--默认为图标视图
    //设置图标定位
    const caseDir = process.env.TESTCASE_DIR;
    const imgRelativePath = `${caseDir}midscene_dde_file_manager/picture/文件管理器设置图标.png`;

    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap({
      prompt: '文件管理器-设置图标',
      images: [
        {
          name: '设置图标',
          url: imgRelativePath,
        },
      ],
    });
    await agent.aiWaitFor("设置");
    await agent.aiTap("设置");
    await agent.aiWaitFor("基础设置");
    await agent.aiTap("视图");
    await agent.aiWaitFor("默认视图");
    await agent.aiTap("默认视图右侧后面的向下箭头");
    await agent.aiWaitFor("菜单弹出");
    await agent.aiTap("图标视图");
    await agent.aiTap("恢复默认视图");
    await device.pressKey("ESC");
    await system.exec("killall dde-file-manager");
    //步骤1： 复制可读写文件夹
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的主目录");
    await agent.aiDoubleClick("normal_folder");
    await agent.aiWaitFor("test_folder、testfi.txt 显示出来");
    await device.pressKey("Ctrl+A");
    await device.pressKey("Ctrl+C");
    await device.pressKey("Ctrl+V");
    await agent.aiWaitFor("复制成功目录出现：test_folder（副本）、testfi（副本）.txt");

    //步骤2： 剪切可读写文件夹、文件
    await device.pressKey("Ctrl+A");
    await device.pressKey("Ctrl+X");
    await agent.aiTap("左侧导航栏的下载");
    await device.pressKey("Ctrl+V");
    await agent.aiWaitFor("文件粘贴成功，当前目录存在：test_folder、testfi.txt、test_folder（副本）、'testfi（副本）.txt");

    //步骤3：重命名可读写文件夹、文件
    //设置下载目录为图标视图

    await agent.aiTap("当前目录空白处");
    const imgRelativePath2 = `${caseDir}midscene_dde_file_manager/picture/文件管理器图标视图.png`;

    await agent.aiTap({
      prompt: '文件管理器-图标视图',
      images: [
        {
          name: '文件管理器图标视图',
          url: imgRelativePath2,
        },
      ],
    });
    await agent.aiRightClick("test_folder的图标");
    await agent.aiWaitFor("右键菜单显示：重命名");
    await agent.aiTap("重命名");
    await device.typeText("testhello");
    await agent.aiTap("当前目录空白处");
    await agent.aiAssert("存在testhello文件");
    await agent.aiRightClick("testfi.txt");
    await agent.aiWaitFor("右键菜单显示：重命名");
    await agent.aiTap("重命名");
    await device.typeText("testnew");
    await agent.aiTap("当前目录空白处");
    await agent.aiAssert("存在testnew.txt的文件");

    //步骤4：删除
    await device.pressKey("Delete");
    await agent.aiTap("testhello");
    await device.pressKey("Delete");
    await agent.aiAssert("testnew.txt、testhello 文件都不存在");

  }, { timeout: 600000, tags: ["1806773", "level4", "permission", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec("rm -rf ~/normal_folder* && rm -rf ~/Downloads/test*");
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    await agent.aiTap("窗口右上角关闭按钮:X");
    await system.exec("killall dde-file-manager");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
