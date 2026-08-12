/**
 * 用例 PMSID: 1806771
 * 用例标题: 文件权限-在可读写文件夹下对只读文件夹/文件进行操作_
 * 生成时间: 2025-12-17
 * 用例编写人: UT000054（叶飞）
 */

describe('1806771-文件权限-在可读写文件夹下对只读文件夹/文件进行操作_', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');

  });
  test('1806771-文件权限-在可读写文件夹下对只读文件夹/文件进行操作_', async ({ device, agent, uos, system, env }) => {

    console.log('创建可文件夹以及只读文件');

    // 前置条件: 创建测试可读写文件夹目录下创建只读文件和只读文件夹
    await system.exec("mkdir -p ~/readwrite_folder/onlyread_folder");
    await system.exec("echo 'this is a test file' > ~/readwrite_folder/onlyread_folder/testfile.txt");
    await system.exec("echo 'this is a test for readonly' > ~/readwrite_folder/onlyreadfile.txt");
    // 修改onlyread文件权限为只读：555
    await system.exec("cd ~/readwrite_folder/ && chmod 555 *");

    // 步骤1： 复制只读文件夹
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的主目录");
    await agent.aiDoubleClick("readwrite_folder");
    await agent.aiWaitFor("进入readwrite_folder目录");
    await device.pressKey("Ctrl+A");
    await device.pressKey("Ctrl+C");
    await device.pressKey("Ctrl+V");
    await device.pressKey("Ctrl+2");
    await agent.aiWaitFor("复制成功：目录有4个文件");
    await device.pressKey("Ctrl+1");
    await agent.aiAssert("目录下所有文件图标右下角带锁");
    await system.exec(`echo '${env.testPassword}' | sudo -S rm -rf /home/'${env.testUsername}'/readwrite_folder/*副本*`); // 删除副本文件

    // 步骤2： 剪切只读文件夹
    await agent.aiTap("onlyread_folder");
    await device.pressKey("Ctrl+X");
    await agent.aiTap("视频");
    await device.pressKey("Ctrl+V");
    await agent.aiWaitFor("对话框：权限错误");
    await agent.aiTap("对话框右上角的关闭按钮：X");//关闭当前窗口

    // 步骤3：重命名只读文件夹
    await agent.aiTap("侧边导航栏的主目录");
    await agent.aiDoubleClick("readwrite_folder");
    await agent.aiWaitFor("onlyread_folder");
    await agent.aiRightClick("onlyread_folder");
    await agent.aiWaitFor("右键菜单显示：重命名");
    await agent.aiTap("重命名");
    await device.typeText("testhaha");
    await agent.aiTap("当前目录空白处");
    await agent.aiWaitFor("testhaha文件可见");

    // 步骤4：删除
    //创建空的只读文件夹
    await system.exec("mkdir -p ~/readwrite_folder/test_folder");
    await system.exec("chmod 555 ~/readwrite_folder/test_folder");
    await new Promise(resolve => setTimeout(resolve, 3000)); // 等待3秒，文件创建和授权
    await agent.aiTap("test_folder");
    await device.pressKey("Delete");
    await agent.aiWaitFor("弹出确认框：无法将“test_folder”放到回收站，您要彻底删除吗？");
    await agent.aiTap("删除");
    await agent.aiWaitFor("不存在test_folder");
    await agent.aiTap("onlyreadfile.txt");
    await device.pressKey("Delete");
    await agent.aiWaitFor("不存在onlyreadfile.txt");

    // 步骤5：在只读文件夹下，新建文件、重命名、删除
    //新建
    await agent.aiDoubleClick("testhaha");
    await agent.aiWaitFor("进入testhaha目录，testfile.txt文件可见");
    await agent.aiRightClick("当前目录空白处");
    await agent.aiWaitFor("右键菜单显示：新建文件夹、新建文档字体颜色是浅色，比全选颜色浅");
    await agent.aiTap("新建文件夹");
    await agent.aiWaitFor("点击之后界面没有新增新建文件夹");
    //重命名、删除
    await agent.aiDoubleClick("搜索框左边的第一个图标");
    await agent.aiWaitFor("视图显示为图标视图", { timeoutMs: 3500 });
    await agent.aiRightClick("testfile.txt");
    await agent.aiWaitFor("右键菜单显示：重命名、删除菜单字体颜色显示浅色，比全选颜色浅");
    await device.pressKey("ESC");


  }, { timeout: 600000, tags: ["1806771", "level4", "permission", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await device.pressKey("ESC");
    await system.exec(`echo '${env.testPassword}' | sudo -S rm -rf /home/'${env.testUsername}'/readwrite_folder*`);
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    await system.exec("killall dde-file-manager");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
