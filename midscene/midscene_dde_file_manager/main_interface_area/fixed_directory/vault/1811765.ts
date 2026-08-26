/**
 * 用例 PMSID: 1811765
 * 用例标题: 设置解锁方式弹窗-密码输入框-输入类型满足要求且小于8位字符
 * 生成时间: 2026-1-27 20:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811765-保险箱安全检查', () => {
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
  
  test('1811765-保险箱安全检查', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");
    await uos.openApp("文件管理器", 3000, 20000, true);
    const { createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system );
    await device.pressKey('Ctrl','Shift','N');
    await device.pressKey('Ctrl','Alt','T');
    await agent.aiTap("终端的中间");
    await agent.aiInput("ls -l ~/.config/Vault/vault_unlocked","终端");
    await device.pressKey('Enter');
    await agent.aiAssert("总计右侧不是数字0");
    await uos.openApp("文件管理器", 3000, 20000, true);
    await agent.aiRightClick("文件管理器左侧栏的保险箱");
    await agent.aiTap("立即上锁");
    await device.pressKey('Ctrl','Alt','T');
    await agent.aiTap("终端的中间");
    await agent.aiInput("ls -l ~/.config/Vault/vault_unlocked","终端");
    await device.pressKey('Enter');
    await agent.aiAssert("总计右侧是数字0");

  }, { timeout: 1200000, tags: ['1811765','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });
  
  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    });
  
    afterAll(async ({ uos, agent, device, system }) => {
      console.log('5. afterAll: 清理测试套件');
      const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
      await rmVault(system);
      await system.exec("ps aux |grep dde-file-manager | grep -v grep | awk '{print $2}' | xargs kill -15");
      await system.exec("ps -ef | grep deepin-terminal | grep -v grep | awk '{print $2}' | xargs kill -9");
    });
  });
