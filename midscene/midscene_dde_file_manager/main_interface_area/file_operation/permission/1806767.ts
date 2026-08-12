/**
 * 用例 PMSID: 1806767
 * 用例标题:  文件权限-在只读文件夹下对可读写文件夹进行操作_ 
 * 生成时间: 2025-12-16
 * 用例编写人: UT000054（叶飞）
 */

describe('1806767-文件权限-在只读文件夹下对可读写文件夹进行操作_ ', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');

    await uos.showDesktop();
    // 前置条件: 命令行在家目录下创建测试只读文件夹以及 可读写子文件夹
    await system.exec("mkdir -p ~/readonly/RDFD");
    await system.exec("chmod 555 ~/readonly");

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
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });
  test('1806767-文件权限-在只读文件夹下对可读写文件夹进行操作_', async ({ device, agent, uos, system }) => {

    console.log('创建只读文件夹以及可读写文件夹');



    // 步骤1： 复制只读文件夹
    await uos.openApp("文件管理器", { maximizeWindow: true });
    await agent.aiTap("左侧导航栏的主目录");
    await agent.aiTap("readonly");
    await device.pressKey("Ctrl+C");
    await device.pressKey("Ctrl+V");
    await agent.aiWaitFor("复制成功，目录存在‘readonly（副本）’ 文件夹");
    //进入只读文件夹，进行复制
    await agent.aiDoubleClick("readonly");
    await agent.aiWaitFor("进入readonly目录");
    await device.pressKey("Ctrl+V");
    await agent.aiWaitFor("提示框：您没有权限操作文件/文件夹！");
    await agent.aiTap("确定"); //关闭提示

    //步骤2：剪切只读文件夹
    await agent.aiTap("左侧导航栏的主目录");
    await device.pressKey("Ctrl+X");
    await agent.aiTap("左侧导航栏的桌面");
    await device.pressKey("Ctrl+V");
    await agent.aiWaitFor("弹出对话框：权限错误");
    await agent.aiTap("对话框的x按钮"); //关闭对话框


    // 步骤3：右键菜单删除只读文件
    await agent.aiTap("左侧导航栏的主目录");
    await agent.aiRightClick("readonly");
    await agent.aiWaitFor("右键菜单显示： 删除菜单字体显示浅色，比反选颜色浅");

    //步骤4： 重命名只读文件夹
    await agent.aiAssert("右键菜单显示：重命名");
    await agent.aiTap("重命名");
    await device.typeText("readyf");
    await agent.aiTap("当前目录空白处");
    await agent.aiAssert("存在文件名为：readyf");

    //步骤5：在可读写文件夹下，创建文件、重命名、删除文件
    await agent.aiTap("空白处");
    await agent.aiDoubleClick("readyf");
    await agent.aiWaitFor("进入readyf目录");
    await agent.aiDoubleClick("RDFD");
    await agent.aiWaitFor("进入RDFD目录");
    await agent.aiRightClick("当前目录空白处");
    await agent.aiWaitFor("右键菜单显示：新建文件夹、新建文档等菜单");
    await agent.aiTap("新建文件夹");
    await agent.aiWaitFor("目录下出现新建文件夹");
    await device.typeText("test");
    await agent.aiTap("当前目录空白处");
    await agent.aiWaitFor("当前目录下存在test的文件夹");
    await device.pressKey("Delete");
    await agent.aiWaitFor("目录下test文件夹不存在");

  }, { timeout: 600000, tags: ["1806767", "level4", "permission", "yefei"] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`echo '${env.testPassword}' | sudo -S rm -rf /home/'${env.testUsername}'/readonly*`);
    await system.exec(`echo '${env.testPassword}' | sudo -S rm -rf /home/'${env.testUsername}'/readyf*`);
    await system.exec(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    await system.exec("killall deepin-terminal");
    await system.exec("killall dde-file-manager");
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
