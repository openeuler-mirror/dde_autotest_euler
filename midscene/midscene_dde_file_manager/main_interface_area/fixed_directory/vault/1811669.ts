/**
 * 用例 PMSID: 1811669
 * 用例标题: 保存密钥-选择路径后删除选择的路径
 * 生成时间: 2026-2-3 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811669-保存密钥-选择路径后删除选择的路径', () => {
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
  
  test('1811669-保存密钥-选择路径后删除选择的路径', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");    
    //步骤1：创建保险箱，加密方式选择：密钥加密，输入正确的密码，点击下一步
    const USER = process.env.TEST_USERNAME
    await system.exec('rm /home/$USER/recoveryKey.key');
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiTap("开启按钮");
    await agent.aiTap("含有至少8位文字的输入框");
    await agent.aiInput("Uos123!!","含有至少8位文字的输入框");
    await agent.aiTap("含有再次输入密码文字的输入框");
    await agent.aiInput("Uos123!!","含有再次输入密码文字的输入框");
    await agent.aiTap("下一步");
    //步骤2：点击【…】按钮调起文件选择对话框-选择路径-点击确定
    await agent.aiTap("含有...的蓝色图标");
    await agent.aiTap("文件选择对话框左侧栏的文档文字");
    await agent.aiTap("带有保存文字的蓝色按钮");
    await agent.aiAssert(`含有...的蓝色图标右侧输入框含有如下内容：/home/${USER}/Documents/recoveryKey.key`);
    //步骤3：选中路径文本框，检查是否可以手动删除路径
    await agent.aiTap("含有...的蓝色图标右侧输入框");
    await device.pressKey("Ctrl+A");
    await device.pressKey("Delete");
    await agent.aiAssert(`含有...的蓝色图标右侧输入框内容还是：/home/${USER}/Documents/recoveryKey.key`);
    await device.pressKey("Alt+F4");

  }, { timeout: 1200000, tags: ['1811669','level4','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await rmVault(system);
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
  });
