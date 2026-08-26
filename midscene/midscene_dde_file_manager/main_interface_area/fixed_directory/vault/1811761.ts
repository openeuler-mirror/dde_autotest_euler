/**
 * 用例 PMSID: 1811761
 * 用例标题: 容量检查-已锁定时计算机页面保险箱容量检查
 * 生成时间: 2026-1-30 17:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811761-容量检查-已锁定时计算机页面保险箱容量检查', () => {
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
  
  test('1811761-容量检查-已锁定时计算机页面保险箱容量检查', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");
    await uos.openApp("文件管理器", 3000, 20000, true);
    const { createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);
    await agent.aiRightClick("文件管理器左侧栏的保险箱");
    await agent.aiTap("属性");
    await agent.aiAssert("大小右侧是0B");
    await device.pressKey("Alt+F4");

    //创建a.txt并写入内容
    await system.exec("echo 'this is a test file' >> ~/.config/Vault/vault_unlocked/a.txt");
    await agent.aiRightClick("文件管理器左侧栏的保险箱");
    await agent.aiTap("属性");
    await agent.aiAssert("大小右侧不是0B");
    await device.pressKey("Alt+F4");
    
  }, { timeout: 1200000, tags: ['1811761','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });
  
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
