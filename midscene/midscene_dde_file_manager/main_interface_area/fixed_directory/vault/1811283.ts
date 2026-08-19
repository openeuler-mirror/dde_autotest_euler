/**
 * 用例 PMSID: 1811283
 * 用例标题: 透明加解密 - 终端访问
 * 生成时间: 2026-2-26 14:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811283-透明加解密 - 终端访问', () => {
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
  
  test('1811283-透明加解密 - 终端访问', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");    

    //前置条件1：【加密方式】选择"透明加密"，保险箱创建完成
    const { createNoPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createNoPasswordVault(uos, env, agent, device, system);
     
    //步骤1：当前用户打开终端，输入命令：cd ~/.config/Vault/vault_unlocked，检查是否可访问文件夹
    await device.pressKey("Ctrl+Alt+T");
    await agent.aiTap("终端的中间"); 
    await agent.aiInput("cd ~/.config/Vault/vault_unlocked", "终端");
    await device.pressKey('Enter');
    
    //验证是否成功进入目录
    await agent.aiInput("pwd", "终端");
    await device.pressKey('Enter');
     
    //步骤1预期结果：可直接访问，进入到~/.config/Vault/vault_unlocked目录
    await agent.aiAssert("终端中看到vault_unlocked路径");
    
    //验证目录内容可访问
    await agent.aiInput("ls -l", "终端");
    await device.pressKey('Enter');
    await agent.aiAssert("看到总计文字");
    await agent.aiInput("cd ~", "终端");
    await device.pressKey('Enter');

  }, { timeout: 1200000, tags: ['1811283','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });

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