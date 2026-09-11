// @ts-nocheck
/**
 * 用例 PMSID: 1815989
 * 用例标题: 长文件名功能 - 新建文件夹
 * 生成时间: 2026-04-28
 * 用例编写人: UT000686(李双双)
 */

describe('1815989-长文件名功能 - 新建文件夹', () => {
  const caseDir = process.env.TESTCASE_DIR;
  const longFolderName = '5989长文件名桌面深目录U盘新建文件建文件夹长文件名桌文件名桌面深目录U盘新建文件新建文件夹长文件名桌面深目录U盘新建文件夹长文件名桌面深目录U盘新建文件夹长文件名桌面深目录U盘新建文件夹长文件名桌面深目录U盘新建文件夹长文件名桌面深目录U盘新建文件夹长文件名桌面深目录U盘新建文件夹长文件名桌面深目录U盘新建文件夹深目录目录新建文件夹目18';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
     // 前置条件：开启长文件名功能
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);
    await system.exec('killall dde-file-manager');
    // 前置条件：在文档目录创建1815989-1文件夹
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/1815989-1`);
    await system.exec(`mkdir /home/${process.env.TEST_USERNAME}/Documents/1815989-1`);
    console.log('1815989-1文件夹已创建');

    // 清理可能存在的测试文件夹
    await system.exec(`rm -rf  /home/${process.env.TEST_USERNAME}/Music/${longFolderName}`);
    await system.exec(`rm -rf  /home/${process.env.TEST_USERNAME}/Documents/1815989-1/${longFolderName}`);
    await system.exec(`rm -rf  /home/${process.env.TEST_USERNAME}/Desktop/${longFolderName}`);

    await system.exec(`mkdir  /home/${process.env.TEST_USERNAME}/Music/${longFolderName}`);
    await system.exec(`mkdir  /home/${process.env.TEST_USERNAME}/Documents/1815989-1/${longFolderName}`);
    await system.exec(`mkdir  /home/${process.env.TEST_USERNAME}/Desktop/${longFolderName}`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    await uos.showDesktop();
    // 打开文件管理器并最大化
    await device.pressKey('Super+E');
    await uos.maximizeWindow();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('Escape');
  });

  test('1815989-长文件名功能 - 新建文件夹', async ({ device, agent, uos, system }) => {

    // 步骤1：打开文件管理器，打开音乐目录，创建长文件名文件夹，断言文件夹创建成功
    console.log('步骤1: 检测音乐目录是否存在“5989长文”开头,“18”结尾的文件夹');

    // 导航到音乐目录
    await agent.aiTap('文件管理器左侧栏的音乐');
    await agent.aiWaitFor('音乐目录已加载');

    // 断言：文件夹创建成功
    await agent.aiAssert(`音乐目录存在"5989长文"开头,"18"结尾的文件夹`);
    console.log('✅ 步骤1验证通过：音乐目录长文件名文件夹创建成功');

    // 步骤2：点击文档，双击1815989-1文件夹，创建长文件名文件夹，断言文件夹创建成功
    console.log('步骤2: 1815989-1文件夹内创建长文件名文件夹');

    // 导航到文档目录
    await agent.aiTap('文件管理器左侧栏的文档');
    await agent.aiWaitFor('文档目录已加载');

    // 双击进入1815989-1文件夹
    await agent.aiDoubleClick('1815989-1文件夹');
    await agent.aiWaitFor('1815989-1目录已加载');

    // 断言：文件夹创建成功
    await agent.aiAssert(`1815989-1目录内存在“5989长文”开头,“18”结尾的文件夹`);
    console.log('✅ 步骤2验证通过：1815989-1目录内长文件名文件夹创建成功');

    // 导航到桌面
    await agent.aiTap('文件管理器左侧栏的桌面');
    await agent.aiWaitFor('桌面目录已加载');
    // 断言：文件夹创建成功
    await agent.aiAssert(`桌面存在“5989长文”开头,“18”结尾的文件夹`);
    console.log('✅ 步骤4验证通过：桌面长文件名文件夹创建成功');

  }, { timeout: 1200000, tags: ['1815989', 'level2', 'smoke', 'file_operations', 'DITT','remote', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理所有测试文件夹
    await system.exec(`rm -rf  /home/${process.env.TEST_USERNAME}/Music/${longFolderName}`);
    await system.exec(`rm -rf  /home/${process.env.TEST_USERNAME}/Documents/1815989-1/${longFolderName}`);
    await system.exec(`rm -rf  /home/${process.env.TEST_USERNAME}/Documents/1815989-1`);
    await system.exec(`rm -rf /media/${process.env.TEST_USERNAME}/${process.env.USB_FLASH}/${longFolderName}`);
    await system.exec(`rm -rf  /home/${process.env.TEST_USERNAME}/Desktop/${longFolderName}`);
    console.log('所有测试文件夹已清理');

    // 关闭文件管理器
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    // 双重保险清理文件管理器环境
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
