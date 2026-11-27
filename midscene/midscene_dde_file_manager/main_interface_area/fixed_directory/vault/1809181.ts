// @ts-nocheck

/**
 * 用例 PMSID: 1809181
 * 用例标题: 检查保险箱默认加密算法 - 国密算法
 * 生成时间: 2026-2-5 08:12:20
 * 用例编写人: UT000686(李双双)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1809181-检查保险箱默认加密算法 - 国密算法', () => {
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
  
  test('1809181-检查保险箱默认加密算法 - 国密算法', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");
    const { createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);

    // 断言保险箱默认加密算法
    const vaultConfig = await system.exec('cat ~/.config/Vault/vaultConfig.ini');
    console.log('vaultConfig.ini 内容:', vaultConfig.stdout);
    if (!vaultConfig.stdout.includes('algoName=sm4-128-ecb')) {
      throw new Error('保险箱默认加密算法不是 sm4-128-ecb');
    }

    // 在保险箱内创建文件夹
    await agent.aiRightClick("保险箱中间页面空白区域");
    await agent.aiTap("新建文件夹");
    await agent.aiAssert("看到新建文件夹正常显示");

    // 重命名文件夹为"181rename"
    await agent.aiTap('保险箱页面空白处')
    await agent.aiRightClick("新建文件夹", { deepThink: true });
    await agent.aiTap("重命名");
    await device.typeText("181rename");
    await device.pressKey("Enter");
    await agent.aiAssert("看到181rename文件夹正常显示");

    // 删除文件夹
    await agent.aiRightClick("181rename文件夹");
    await agent.aiTap("删除");
    await agent.aiTap("删除按钮"); // 确认删除
    await agent.aiAssert("保险箱内无181rename文件夹");

  }, { timeout: 1800000, tags: ['1809181','level3','main_interface_area','fixed_directory','vault','DITT','lishuangshuang'] });
  
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