/**
 * 用例 PMSID: 1811191
 * 用例标题: 忘记密码-密钥验证失败后重新选择密钥文件解锁
 * 生成时间: 2026-2-26 16:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811191-忘记密码-密钥验证失败后重新选择密钥文件解锁', () => {
    beforeAll(async ({ device, uos, agent, system }) => {
      console.log('1. beforeAll: 初始化测试套件');
      await uos.showDesktop();
    });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { rmVault, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await rmVault(system);
    await system.exec("rm -rf ~/Desktop/*.txt");
  });
  
  test('1811191-忘记密码-密钥验证失败后重新选择密钥文件解锁', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");
    //前置条件：调用公共方法创建保险箱
    const { rmVault, vaultPassword, createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);
    
    await system.exec(`cp ${caseDir}midscene_dde_file_manager/resources/1811191/pubKey-error.key ~/Desktop/`, 500);

    //前置条件1：主入口为文件选择对话框的保险箱/文件管理器的保险箱
    //给保险箱上锁
    await agent.aiRightClick("文件管理器左侧栏的保险箱");
    await agent.aiTap("立即上锁");
    //前置条件3：已tips提示密钥验证失败（通过错误的密钥文件解锁模拟）
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiTap("解锁");
    await agent.aiTap("忘记密码");
    await agent.aiTap("含有...的按钮");
    await agent.aiTap("文件选择对话框左侧栏的桌面");
    await agent.aiTap("pubKey-error.key文件");
    await agent.aiTap("打开");
    await agent.aiTap("密钥解锁按钮");
    await agent.aiAssert("有密钥验证失败错误提示");
   
    //步骤1：在密钥解锁保险箱对话框中，再次点击...按钮
    await agent.aiTap("含有...的按钮");
    await agent.aiTap("文件选择对话框左侧栏的主目录");

    //步骤2：选择正确的密钥文件后，点击“打开”按钮
    await agent.aiTap("recoveryKey.key文件");
    await agent.aiTap("打开");
   
    //步骤3：点击“密钥解锁”按钮
    await agent.aiTap("密钥解锁按钮");

    await agent.aiWaitFor("成功进入保险箱",
      {
        timeoutMs: 60000,
        checkIntervalMs: 5000
      }
    );

  }, { timeout: 1300000, tags: ['1811191','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

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