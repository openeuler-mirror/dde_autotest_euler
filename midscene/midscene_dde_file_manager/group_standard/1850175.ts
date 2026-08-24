/**
 * 用例 PMSID: 1850175
 * 用例标题:  透明加解密保险箱
 * 生成时间: 2026-04-29 16:30:00
 * 用例编写人: UT000159(游伟)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1850175-透明加解密保险箱', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { rmVault, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 准备步骤: 恢复部分文管设置到默认值
    console.log('准备步骤: 恢复部分文管设置到默认值');
    await clearEnvironment(system);

    // 准备步骤: 删除保险箱
    console.log('准备步骤: 删除保险箱');
    await rmVault(system);
  });

    afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });
  
  afterAll(async ({ uos, agent, device, env, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理步骤: 按Esc关闭可能未关闭的右击菜单
    console.log('清理步骤: 按Esc关闭可能未关闭的右击菜单');
    await device.pressKey('Esc');

    // 清理步骤: 删除保险箱
    console.log('清理步骤: 删除保险箱');
    const { rmVault, closeAllWindows } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    // 删除保险箱
    await rmVault(system);

    // 清理步骤: 关闭所有文件管理器窗口
    console.log('清理步骤: 关闭所有文件管理器窗口');
    await system.exec('killall dde-file-manager');
  });
  
  test('1850175-透明加解密保险箱', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");

    const { createNoPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 步骤 1: 创建透明加密保险箱
    console.log('步骤 1: 创建透明加密保险箱');
    await createNoPasswordVault(uos, env, agent, device, system);
    await system.exec('killall dde-file-manager');
   
    // 步骤 2: 打开透明加密保险箱
    console.log('步骤 2: 打开透明加密保险箱');
    await system.exec(`dde-file-manager`);
    await device.pressKey('Super', 'Down');
    await device.pressKey('Super', 'Up');
    await agent.aiTap('左侧边栏中的保险箱');

    // 预期 2: 当前目录是保险箱
    console.log('预期 2: 当前目录是保险箱');
    await agent.aiAssert('左侧边栏显示当前目录为保险箱');

    // 步骤 3: 右击侧边栏保险箱
    console.log('步骤 3: 右击侧边栏保险箱');
    await agent.aiRightClick('侧边栏保险箱');
    await agent.aiWaitFor("出现右击菜单");

    // 预期 3: 右键菜单中没有立即上锁或者解锁选项
    console.log('预期 3: 右键菜单中没有立即上锁或者解锁选项');
    await agent.aiAssert('右键菜单中没有立即上锁或者解锁选项');
    await device.pressKey('Esc');

  }, { timeout: 1200000, tags: ['1850175','level2', 'group standard', 'DITT', 'youwei', 'file-manager', 'vault', 'transparency'] });
});