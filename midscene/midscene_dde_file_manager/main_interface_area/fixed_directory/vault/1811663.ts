/**
 * 用例 PMSID: 1811663
 * 用例标题: 保存密钥-保存密钥至超长路径
 * 生成时间: 2026-2-5 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811663-保存密钥-保存密钥至超长路径', () => {
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
  
  test('1811663-保存密钥-保存密钥至超长路径', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示"); 
    //在文档目录创建一个10层级目录，每层级目录名称为：saveRecoveryKey-dir$i
    //创建10层级目录
    let dirPath = '/home/$USER/Documents';
    for (let i = 1; i <= 10; i++) {
      dirPath = `${dirPath}/saveRecoveryKey-dir${i}`;
      await system.exec(`mkdir -p ${dirPath}`);
    }
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
    //步骤2：点击【…】按钮调起文件选择对话框
    await agent.aiTap("含有三个点的蓝色图标");
    await agent.aiTap("文件选择对话框左侧栏的文档文字");
    //选择文档目录中的10层级目录
    //依次进入前9个层级目录
    for (let i = 1; i <= 9; i++) {
      await agent.aiDoubleClick(`saveRecoveryKey-dir${i}`);
    }
    //点击第10个层级目录
    await agent.aiTap(`saveRecoveryKey-dir10`);    
    await agent.aiTap("带有保存文字的蓝色按钮");
    await agent.aiTap("下一步");
    //能看到下一步的窗口，说明保存成功
    await agent.aiAssert("有加密保险箱文字的蓝色按钮");

  }, { timeout: 1200000, tags: ['1811663','level4','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      //删除创建的10层级目录
      await system.exec("rm -rf /home/$USER/Documents/saveRecoveryKey-dir1");
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
  });
