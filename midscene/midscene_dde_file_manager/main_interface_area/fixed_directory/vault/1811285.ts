/**
 * 用例 PMSID: 1811285
 * 用例标题: 透明加解密 - 非当前用户终端访问
 * 生成时间: 2026-2-26 11:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811285-透明加解密 - 非当前用户终端访问', () => {
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
  
  test('1811285-透明加解密 - 非当前用户终端访问', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");    

    //前置条件1：【加密方式】选择"透明加密"，保险箱创建完成
    const { createNoPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createNoPasswordVault(uos, env, agent, device, system);
     
    //前置条件2：通过如下命令创建一个test-1811285的用户，并设置密码
    await device.pressKey("Ctrl+Alt+T");
    await agent.aiTap("终端的中间"); 
    await agent.aiInput("sudo useradd -m -s /bin/bash test-1811285", "终端");
    await device.pressKey('Enter');
    await agent.aiInput(process.env.TEST_PASSWORD, "终端");
    await device.pressKey('Enter');
    await agent.aiInput("sudo passwd test-1811285", "终端");
    await device.pressKey('Enter');
    await agent.aiInput(process.env.TEST_PASSWORD, "终端");
    await device.pressKey('Enter');
    await agent.aiInput(process.env.TEST_PASSWORD, "终端");
    await device.pressKey('Enter');

    const result = await system.exec('echo $USER');
    const currentUser = result.stdout.trim();

    //步骤1：切换到test-1811285用户，打开终端，访问uos用户home目录下/home/uos/.config/Vault/vault_unlocked文件夹    
    //切换到test-1811285用户
    await agent.aiInput("su test-1811285", "终端");
    await device.pressKey('Enter');
    await agent.aiInput(process.env.TEST_PASSWORD, "终端");
    await device.pressKey('Enter');
    
    //访问uos用户的保险箱目录
    await agent.aiInput(`ls -l /home/${currentUser}/.config/Vault/vault_unlocked`, "终端");
    await device.pressKey('Enter');
     
    //步骤1预期结果：不能访问，提示权限不够
    await agent.aiAssert("终端中看到权限不够或Permission denied文字");
    
    //删除test-1811285用户
    await agent.aiInput('exit', "终端");
    await device.pressKey('Enter');
    await agent.aiInput('sudo userdel -r test-1811285', "终端");
    await device.pressKey('Enter');

  }, { timeout: 1200000, tags: ['1811285','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

  afterEach(async ({ device, agent, uos, system }) => {
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