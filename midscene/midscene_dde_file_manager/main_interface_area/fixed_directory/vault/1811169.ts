/**
 * 用例 PMSID: 1811169
 * 用例标题: 忘记密码-删除已选择密钥后重新选择密钥
 * 生成时间: 2026-2-26 16:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811169-忘记密码-删除已选择密钥后重新选择密钥', () => {
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
  
  test('1811169-忘记密码-删除已选择密钥后重新选择密钥', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");

    //前置条件：调用公共方法创建保险箱
    const { rmVault, vaultPassword, createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);
    
    await system.exec(`cp ${caseDir}midscene_dde_file_manager/resources/1811191/pubKey-error.key ~/Desktop/`, 500);

    //前置条件3：给保险箱上锁
    await agent.aiRightClick("文件管理器左侧栏的保险箱");
    await agent.aiTap("立即上锁");

    //步骤1：右键保险箱，点击“解锁”，在密钥解锁保险箱对话框中，点击...按钮
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiTap("解锁");
    await agent.aiTap("忘记密码");
    await agent.aiTap("含有...的按钮");
    await agent.aiTap("文件选择对话框左侧栏的桌面");

    //步骤2：选择错误的密钥文件后，点击“打开”按钮
    await agent.aiTap("pubKey-error.key文件");
    await agent.aiTap("打开");
    await agent.aiAssert("输入框显示pubKey-error.key文件的路径，且输入框边框高亮为蓝色");

    //步骤3：单击密钥输入框旁边的X
    await agent.aiTap("密钥解锁保险箱对话框输入框中的x按钮");
    
    //步骤4：点击【…】按钮-选择正确密钥
    await agent.aiTap("含有...的按钮");
    await agent.aiTap("文件选择对话框左侧栏的主目录");
    await agent.aiTap("recoveryKey.key文件");
    await agent.aiTap("打开");

    //步骤5：点击“密钥解锁”按钮
    await agent.aiTap("密钥解锁按钮");

    await agent.aiWaitFor("成功进入保险箱",
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );


  }, { timeout: 1300000, tags: ['1811169','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await rmVault(system);
      await system.exec("rm -rf ~/Desktop/pubKey-error.key");
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
    });
  });