/**
 * 用例 PMSID: 1811287
 * 用例标题: 透明加解密 - ssh访问未上锁的保险箱
 * 生成时间: 2026-2-12 11:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811287-透明加解密 - ssh访问未上锁的保险箱', () => {
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
  
  test('1811287-透明加解密 - ssh访问未上锁的保险箱', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");    

    //前置条件1：远程机【加密方式】选择“透明加密”，保险箱创建完成
    //前置条件2：远程机保险箱未上锁（也就是没有锁屏）
    const { createNoPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createNoPasswordVault(uos, env, agent, device, system);
     
    //获取本机IP
    const ipResult = await system.exec(`hostname -I | awk '{print $1}'`);
    const ip = ipResult.stdout.trim();
    const USER = process.env.TEST_USERNAME

    //步骤1：ssh访问远程机的保险箱目录文件（/home/<用户>/.config/Vault/vault_unlocked/）
    await device.pressKey("Ctrl+Alt+T");
    await agent.aiTap("终端的中间");    
    
    await agent.aiInput(`ssh ${USER}@${ip}`, "终端");
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 1000));
    // 尝试断言是否出现yes/no提示
    let isYesNoPrompt = false;
    try {
        await agent.aiAssert("终端中显示yes/no");
        isYesNoPrompt = true;
    } catch (error) {
        console.log("未检测到yes/no提示，跳过yes输入步骤");
    }    
    if (isYesNoPrompt) {
        await agent.aiInput("yes", "终端");
        await device.pressKey('Enter');
    }    
    await agent.aiInput(env.testPassword,"终端");
    await device.pressKey('Enter');
    
    //执行命令：（/home/<用户>/.config/Vault/vault_unlocked/）
    await agent.aiInput("ls -l ~/.config/Vault/vault_unlocked","终端");
    await device.pressKey('Enter');
     
    //看到保险箱内文件说明访问成功
    await agent.aiAssert("终端看到总计文字");

  }, { timeout: 1200000, tags: ['1811287','level4','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, env, system }) => {
      console.log('5. afterAll: 清理测试套件');
      const { UiRmNoPasswordVault, closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      // 删除保险箱
      await UiRmNoPasswordVault(device, agent, uos, env, system);
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
      await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9");
    });
  });