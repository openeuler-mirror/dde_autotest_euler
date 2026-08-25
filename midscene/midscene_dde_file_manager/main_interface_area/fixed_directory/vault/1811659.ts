/**
 * 用例 PMSID: 1811659
 * 用例标题: 保存密钥-保存密钥至不同权限的路径
 * 生成时间: 2026-2-5 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811659-保存密钥-保存密钥至不同权限的路径', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { rmVault, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await rmVault(system);
  });
  
  test('1811659-保存密钥-保存密钥至不同权限的路径', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");

    // 创建测试所需的文件夹并设置权限
    await system.exec('mkdir -p /home/$USER/Documents/333');
    await system.exec('mkdir -p /home/$USER/Documents/444');
    await system.exec('chmod 333 /home/$USER/Documents/333');
    await system.exec('chmod 444 /home/$USER/Documents/444');

    //前置条件：创建保险箱到保存密钥步骤
    await system.exec('rm /home/$USER/recoveryKey.key');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiTap("开启按钮");
    await agent.aiTap("含有至少8位文字的输入框");
    await agent.aiInput("Uos123!!","含有至少8位文字的输入框");
    await agent.aiTap("含有再次输入密码文字的输入框");
    await agent.aiInput("Uos123!!","含有再次输入密码文字的输入框");
    await agent.aiTap("下一步");

    //步骤1：点击【…】按钮调起文件选择对话框
    await agent.aiTap("含有三个点的蓝色图标");
    await agent.aiTap("文件选择对话框左侧栏的文档文字");
    //步骤2：选择333权限的文件夹点击确定
    await agent.aiDoubleClick("名称为333的文件夹");    
    await agent.aiTap("带有保存文字的蓝色按钮");
    await agent.aiAssert("当前窗口没有红色字体提示信息");
    //点击【…】按钮调起文件选择对话框
    await agent.aiTap("含有三个点的蓝色图标");
    await agent.aiTap("文件选择对话框左侧栏的文档文字");
    //步骤3：选择444权限的文件夹点击确定
    await agent.aiDoubleClick("名称为444的文件夹");    
    await agent.aiTap("带有保存文字的蓝色按钮");
    await agent.aiAssert("看到如下提示：权限不够，请重新选择");

    //点击【…】按钮调起文件选择对话框
    await agent.aiTap("含有三个点的蓝色图标");
    //步骤4：保存至系统盘
    await agent.aiScroll('文件选择对话框左侧栏的主目录', { direction: 'down', distance: 1 });
    await agent.aiTap("文件选择对话框左侧栏从上到下垂直方向第一个系统盘文字"); 
    await agent.aiTap("带有保存文字的蓝色按钮");
    await agent.aiAssert("看到如下提示：权限不够，请重新选择");
    //点击【…】按钮调起文件选择对话框
    await agent.aiTap("含有三个点的蓝色图标");
    //步骤5：保存至数据盘主目录，默认就是选择主目录
    //先判断是否看到替换按钮，看到直接点击替换按钮，没看到就点击保存按钮
    try {
      await agent.aiWaitFor("替换按钮", { timeout: 2000 });
      await agent.aiTap("替换按钮");
    } catch {
      await agent.aiTap("带有保存文字的蓝色按钮");
    }
    await agent.aiTap("下一步");
    //能看到下一步的窗口，说明保存成功
    await agent.aiAssert("有加密保险箱文字的蓝色按钮");

  }, { timeout: 1200000, tags: ['1811659','level4','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      //删除333和444文件夹
      await system.exec("rm -rf /home/$USER/Documents/333");
      await system.exec("chmod 777 /home/$USER/Documents/444");
      await system.exec("rm -rf /home/$USER/Documents/444");
      await system.exec("chmod 777 /home/$USER/Documents/444");
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
  });
