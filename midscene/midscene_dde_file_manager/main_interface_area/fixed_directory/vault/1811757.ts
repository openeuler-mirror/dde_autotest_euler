/**
 * 用例 PMSID: 1811757
 * 用例标题: 保险箱-未解锁保险箱入口检查
 * 生成时间: 2026-2-2 19:00:00
 * 用例编写人: UT005160(蓝雁玲)
 */

const caseDir = process.env.TESTCASE_DIR;

describe('1811757-保险箱-未解锁保险箱入口检查', () => {
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
  
  test('1811757-保险箱-未解锁保险箱入口检查', async ({ device, agent, uos, env, system }) => {    
    await agent.aiWaitFor("桌面已显示");
    await uos.openApp("文件管理器", 3000, 20000, true);
    const { createPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);
    await agent.aiRightClick("文件管理器左侧栏的保险箱");
    await agent.aiTap("立即上锁");
    await agent.aiTap("文件管理器左侧栏的保险箱");
    await agent.aiAssert("弹出解锁保险箱对话框，看到解锁保险箱文字");
    await agent.aiTap("取消按钮");
    await agent.aiTap("文件管理器左侧栏的计算机");
    await agent.aiDoubleClick("文件管理器左侧栏右侧的保险箱图标");
    await agent.aiAssert("弹出解锁保险箱对话框，看到解锁保险箱文字");
    await agent.aiTap("取消按钮");
    await agent.aiRightClick("文件管理器左侧栏的保险箱");
    await agent.aiTap("解锁");
    await agent.aiAssert("弹出解锁保险箱对话框，看到解锁保险箱文字");
    await agent.aiTap("取消按钮");
    await agent.aiRightClick("文件管理器左侧栏右侧的保险箱图标");
    await agent.aiTap("解锁");
    await agent.aiAssert("弹出解锁保险箱对话框，看到解锁保险箱文字");
    await agent.aiTap("取消按钮");
    //await agent.aiTap("文件管理器左上角>图标水平方向右侧200像素的地方");
    await device.pressKey("Ctrl+L");
    await device.pressKey("Ctrl+A");
    await device.pressKey("Delete");
    await device.typeText("dfmvault:///");
    await device.pressKey("Enter");
    await agent.aiAssert("弹出解锁保险箱对话框，看到解锁保险箱文字");
    await agent.aiTap("取消按钮");
 
  }, { timeout: 1200000, tags: ['1811757','level3','main_interface_area','fixed_directory','vault','DITT','lanyanling'] });
  
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
