/**
 * 用例 PMSID: 1806765
 * 用例标题:  文件权限-在只读文件夹下对只读文件夹进行操作_ 
 * 生成时间: 2025-12-16
 * 用例编写人: UT000054（叶飞）
 */

describe('1806765-文件权限-在只读文件夹下对只读文件夹进行操作_ ', () => {
  beforeAll(async ({ device, uos, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1806765-文件权限-在只读文件夹下对只读文件夹进行操作_', async ({ device, agent, uos, system, env }) => {

    console.log('创建只读文件夹以及文件');

    // 步骤 1: 命令行在家目录下创建测试只读文件夹、文件

    await system.exec("mkdir -p ~/readonly_folder");
    await system.exec("chmod 555 ~/readonly_folder");

    // 步骤 2: 复制只读文件夹
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("主目录");
    await agent.aiTap("readonly_folder");
    await device.pressKey("Ctrl+C");
    await device.pressKey("Ctrl+V");
    await agent.aiWaitFor("复制成功，目录存在'readonly_folder (副本)'的文件夹");
    await agent.aiDoubleClick("readonly_folder");
    await device.pressKey("Ctrl+V");
    await agent.aiWaitFor("弹出提示框：您没有权限操作文件/文件夹！");
    await agent.aiTap("确定"); //关闭弹窗

    //步骤3： 剪切只读文件夹
    await agent.aiTap("主目录");
    await device.pressKey("Ctrl+X");
    await agent.aiTap("左侧导航栏的视频"); //进入桌面目录
    await agent.aiWaitFor("进入视频目录");
    await device.pressKey("Ctrl+V");
    await agent.aiWaitFor("弹出对话框：权限错误");
    await agent.aiTap("对话框的x按钮");//关闭对话框

    //步骤4： 修改只读文件夹
    await agent.aiTap("左侧导航栏的主目录");
    await agent.aiDoubleClick("readonly_folder");
    await agent.aiRightClick("当前目录空白处");
    await agent.aiWaitFor("右键菜单显示");
    await agent.aiWaitFor("右键菜单显示：新建文件夹、新建文档、粘贴 三个菜单字体颜色浅色，比全选颜色浅 ");
    //在右键菜单，分别点击 新建文件夹、新建文档、粘贴
    const menuItems = ["新建文件夹", "新建文档", "粘贴"];
    for (const item of menuItems) {
      await agent.aiTap(item);
      await agent.aiAssert("点击后，界面没有新增新文件");
    }
    await device.pressKey("Esc");  //关闭右键菜单

    //步骤5： 重命名只读文件夹
    await system.exec(`echo '${env.testPassword}' | sudo -S rm -rf /home/'${env.testUsername}'/readonly_folder（副本）`);//删除复制的文件夹,减小干扰
    await agent.aiTap("主目录");
    await agent.aiRightClick("readonly_folder");
    await agent.aiWaitFor("右键菜单显示：重命名");
    await agent.aiTap("重命名");
    await device.typeText("readonly");
    await agent.aiTap("目录空白处");
    await agent.aiWaitFor("文件夹名字被重命名为：readonly");

    //步骤6： 删除只读文件夹
    await device.pressKey("Delete");
    await agent.aiWaitFor('删除确认弹窗:无法将“readonly”放到回收站，您要彻底删除吗?此操作不可以恢复');
    await agent.aiTap("删除");
    await agent.aiAssert("readonly文件夹被删除，当前目录不存在该文件夹");

  }, { timeout: 600000, tags: ["1806765", "level4", "permission", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`echo '${env.testPassword}' | sudo -S rm -rf /home/'${env.testUsername}'/readonly*`);
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    await system.exec("killall dde-file-manager");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
