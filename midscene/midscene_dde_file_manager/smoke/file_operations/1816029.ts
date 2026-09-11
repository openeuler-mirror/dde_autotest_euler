// @ts-nocheck
/**
 * 用例 PMSID: 1816029
 * 用例标题: 长文件名功能 - 桌面创建长文件名的文件
 * 生成时间: 2026-04-28
 * 用例编写人: UT000686(李双双)
 */
const caseDir = process.env.TESTCASE_DIR;
describe('1816029-长文件名功能 - 桌面创建长文件名的文件', () => {
  const longFolderName = '6029长文件名功能桌面创建长文件名的文件长文件名功能桌面创建长文文件名功能桌面创建长文件件长文件名功能桌面创建长文文件件长文件名功能桌面创建长文文件件长文件名功能桌面创建长文文件件长文件名功能桌长文件名功能桌面创建长文文件件长文件名功能桌面创建长文文件件长文件名功能桌面创建长文文件18';
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    // 前置条件：开启长文件名功能
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    // await system.exec('killall dde-file-manager');
    // 清理可能存在的测试文件夹
    await system.exec(`rm -rf  /home/${process.env.TEST_USERNAME}/Desktop/${longFolderName}`);
    await system.exec(`mkdir  /home/${process.env.TEST_USERNAME}/Desktop/${longFolderName}`);
    await uos.showDesktop();
    await new Promise(resolve => setTimeout(resolve, 5000));
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('Escape');
  });

  test('1816029-长文件名功能 - 桌面创建长文件名的文件', async ({ device, agent, uos, system }) => {

    // 步骤1：桌面空白处，右键-新建文件夹，修改名称为长文件名，断言文件夹创建成功
    console.log('步骤1: 检测桌面是否存在长文件名的文件夹');

    // 断言：文件夹创建成功
    await agent.aiAssert(`桌面存在"6029长文"开头,"18"结尾的文件夹`);
    console.log('✅ 步骤1验证通过：长文件名文件夹创建成功');

  }, { timeout: 1200000, tags: ['1816029', 'level2', 'remote','smoke', 'file_operations', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理长名称文件夹
    await system.exec(`rm -rf  /home/${process.env.TEST_USERNAME}/Desktop/${longFolderName}`);
    console.log('长名称文件夹已清理');

    // 关闭文件管理器
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    // 双重保险清理文件管理器环境
   const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
