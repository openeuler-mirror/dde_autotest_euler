/**
 * 用例 PMSID: 1959173
 * 用例标题: 【home目录支持长文件名】在保险箱中创建并打开长文件名文件
 * 生成时间: 2026-07-15
 * 用例编写人：UT000686(李双双)
 */
// @ts-nocheck
require("dotenv/config");
const caseDir = process.env.TESTCASE_DIR;
const longFileName = "173在保险箱中创建并打开长文件名文件在保险箱中创建并打开长文件名文件在保险箱中创建并打开长文件名文件在保险箱中创建并打开长文件名文件在保险箱中创建并打开长文件名文件在保险箱中创建并打开长文件名文件在保险箱中创建并打开长文件名文件在保险箱中创建并打开长文件名文件在保险箱中创建并打开长文件名文件在保险箱中创建并打开长文件名文件";
const vaultPassword = "Uos123!!";

describe('1959173-【home目录支持长文件名】在保险箱中创建并打开长文件名文件', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // await uos.closeCurrentWindow();
    await system.cleanupFileManager();
    await uos.showDesktop();
    
    const { enableLongFileName, rmVault, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    console.log('长文件名功能已开启');
    await clearEnvironment(system);
    await rmVault(system);
    console.log('保险箱环境已清理');
  });

  beforeEach(async ({ device, agent, uos, env, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    
    const { createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);
    console.log('保险箱已创建');
    
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Desktop/"${longFileName}"`, 500);
    console.log(`前置条件：创建长文件名文件夹 ${longFileName}`);
    
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    await uos.showDesktop();
  });

  test('1959173-【home目录支持长文件名】在保险箱中创建并打开长文件名文件', async ({ device, agent, uos, system, env }) => {
    console.log('步骤1：打开文件管理器，最大化窗口');
    await uos.openApp('文件管理器', 2000, 100000);
    const isMaximized = await agent.aiBoolean('文管窗口是最大化状态');
    if (!isMaximized) {
      await agent.aiTap('文管窗口右上角最大化', { deepThink: true });
    }
    console.log('步骤1：点击左侧栏的保险箱');
    await agent.aiTap('左侧栏的桌面');
    console.log('步骤1：进入桌面，选中长文件名文件夹，右键点击复制');
    await agent.aiRightClick(`以173在保开头的文件夹`);
    await agent.aiTap('复制');
        
    
    
    console.log('步骤1：点击左侧栏的保险箱');
    await agent.aiTap('左侧栏的保险箱');
    
    const needUnlock = await agent.aiBoolean('出现保险箱解锁密码输入框');
    if (needUnlock) {
      console.log('需要解锁保险箱，输入密码');
      await agent.aiTap('密码输入框');
      await device.typeText(vaultPassword, true);
      await agent.aiTap('解锁');
    }
    
    await agent.aiWaitFor('保险箱目录已打开');
    
    console.log('步骤1：粘贴文件到保险箱');
    await agent.aiRightClick('保险箱空白区域');
    await agent.aiTap('粘贴');
    await system.exec('sleep 2');
    
    await agent.aiAssert(`保险箱内存在以173在保开头的文件夹`);
    console.log('断言通过：保险箱内存在长文件名文件夹');
    await agent.aiTap("保险箱空白处");

    console.log('步骤2：双击长文件名文件夹');
    await agent.aiDoubleClick(`以173在保开头的文件夹的图标`);
    
    await agent.aiAssert('文件夹可正常打开');
    console.log('断言通过：文件夹可正常打开');

    console.log('测试完成');

  }, { timeout: 600000, tags: ['1959173', 'level3', 'remote', 'longfilename', 'vault', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device, agent, uos, env, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec("kill -TERM $(pidof dde-file-manager)");
    
    const { rmVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await rmVault(system);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Desktop/"${longFileName}"`, 500);
    await system.cleanupFileManager();
    await uos.closeCurrentWindow();
    await device.pressKey('Esc');
  });
});