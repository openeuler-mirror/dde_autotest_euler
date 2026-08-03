/**
 * 用例 PMSID: 1806787
 * 用例标题: 快捷访问-保险箱内文件夹右键无添加快捷访问
 * 生成时间: 2025-12-23 10:24:47
 * 用例编写人: UT000193（郑豪）
 */
const casedir = process.env.TESTCASE_DIR;
describe('1806787-快捷访问-保险箱内文件夹右键无添加快捷访问', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    const { rmVault, clearEnvironment } = await import(`${casedir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await rmVault(system);
  });

  test('1806787-快捷访问-保险箱内文件夹右键无添加快捷访问', async ({ device, agent, uos ,env,system}) => {
    // 创建密码保险箱
    const { rmVault, vaultPassword, createPasswordVault } = await import(`${casedir}midscene_dde_file_manager/common/common.ts`);
    await createPasswordVault(uos, env, agent, device, system);

    // 新建测试文件夹test
    await agent.aiRightClick("当前目录的空白区域");
    await agent.aiTap("新建文件夹");
    await device.typeText('test');
    await device.pressKey('Enter');
    await agent.aiWaitFor('test文件夹已创建')

    // 步骤1：打开右键菜单
    await agent.aiRightClick('test');

    // 断言1: 验证右键菜单无添加快捷访问选项
    await agent.aiAssert("右键菜单中无'添加到快捷访问'选项");
  }, { timeout: 600000, tags: ['1806787', 'level4', 'bookmark', 'zhenghao'] });

  afterEach(async ({ device, agent, system, env, uos}) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 删除保险箱
    const { UiRmVault, closeAllWindows } = await import(`${casedir}midscene_dde_file_manager/common/common.ts`);
    await UiRmVault(device, agent, uos, env, system);

  });

  afterAll(async ({ uos, agent, device, system,env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await system.exec(`echo ${env.testPassword} | sudo -S killall -15 dde-file-manager`);
    await system.exec(' rm -f ~/recoveryKey.key');
    await device.pressKey('Esc');

  });
});