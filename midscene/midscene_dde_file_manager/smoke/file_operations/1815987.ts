// @ts-nocheck
/**
 * 用例 PMSID: 1815987
 * 用例标题: 长文件名功能 - 新建文档
 * 生成时间: 2026-05-20
 * 用例编写人: UT000686（李双双）
 */
const caseDir = process.env.TESTCASE_DIR;
describe('1815987-长文件名功能 - 新建文档', () => {
  const longFileName = '5987建文档新建文档新建文档新建文档文档新建文档新建文档新建文档新建文档新建文档新建文档新建文档新建文档新建文档新建文档新建文档新文档新建文档新建文档新建文档新建文档新建文档新建文档新建文档新建文档新建文档新建文建文档18';
  const videoFolderName = '1815987';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    
    // 清理文件管理器进程
    await system.exec('killall dde-file-manager');
    
    // 前置条件：开启长文件名功能
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);

    // 清理可能存在的测试文件
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/${longFileName}`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Videos/${videoFolderName}`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Desktop/${longFileName}`);
    // 在视频目录创建一个"1815987"的文件夹
    await system.exec(`mkdir -p /home/${process.env.TEST_USERNAME}/Videos/${videoFolderName}`);
    console.log('视频目录测试文件夹已创建');

    // 显示桌面并打开文件管理器
    await uos.showDesktop();
    await device.pressKey('Super+E');
    await uos.maximizeWindow();
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('Escape');
  });

  test('1815987-长文件名功能 - 新建文档', async ({ device, agent, uos, system }) => {

    // 步骤1：打开文件管理器，点击左侧栏的文档，空白处右键点击新建文件夹，重命名为长文件名
    console.log('=== 步骤1: 在文档目录新建长文件名文件夹 ===');
    await agent.aiTap('文件管理器左侧栏的文档');
    await agent.aiWaitFor('文档目录已加载');
    await agent.aiRightClick('文档目录空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('新建文件夹');
    await device.typeText(longFileName, true);
    await agent.aiAssert(`文档目录存在"5987建文"开头,"18"结尾的文件夹`);
    await agent.aiRightClick('文档目录空白处');
    console.log('✅ 步骤1验证通过：文档目录长文件名文件夹创建成功');

    // 步骤2：选择"建文档"开头的文件，右键点击"删除"，断言文档目录没有"建文档"开头的文件
    console.log('=== 步骤2: 删除文档目录中的长文件名文件夹 ===');
    await agent.aiRightClick(`"建文档新建文档"开头的文件的图标`);
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('删除');
    await agent.aiAssert(`文档目录不存在"建文档新建文档"开头的文件的图标`);
    console.log('✅ 步骤2验证通过：文档目录长文件名文件夹删除成功');

    // 步骤3：点击文件管理器的左侧栏的"视频"，双击"1815987"文件夹，空白处右键点击新建文件夹，重命名为长文件名
    console.log('=== 步骤3: 在视频目录1815987文件夹内新建长文件名文件夹 ===');
    await agent.aiTap('文件管理器左侧栏的视频');
    await agent.aiWaitFor('视频目录已加载');
    await agent.aiDoubleClick(`视频目录中的${videoFolderName}文件夹`);
    await agent.aiWaitFor('1815987文件夹已打开');
    await agent.aiRightClick('1815987文件夹空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('新建文件夹');
    await device.typeText(longFileName, true);
    await agent.aiAssert(`1815987文件夹内存在"5987建文"开头,"18"结尾的文件夹`);
    console.log('✅ 步骤3验证通过：视频目录1815987文件夹内长文件名文件夹创建成功');

    // 步骤4：点击文件管理的左侧栏的"桌面"，空白处右键点击新建文件夹，重命名为长文件名
    console.log('=== 步骤4: 在桌面目录新建长文件名文件夹 ===');
    await agent.aiTap('文件管理器左侧栏的桌面');
    await agent.aiWaitFor('桌面目录已加载');
    await agent.aiRightClick('桌面目录空白处');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('新建文件夹');
    await device.typeText(longFileName, true);
    await agent.aiAssert(`桌面目录存在"5987建文"开头,"18"结尾的文件夹`);
    console.log('✅ 步骤4验证通过：桌面目录长文件名文件夹创建成功');

    console.log('=== 1815987-长文件名功能 - 新建文档，执行成功 ===');

  }, { timeout: 1800000, tags: ['1815987', 'level2','remote', 'smoke', 'file_operations', 'long_filename', 'DITT'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 清理测试创建的文件
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/${longFileName}`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Videos/${videoFolderName}`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Desktop/${longFileName}`);

      // 关闭文件管理器
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    
    // 双重保险清理文件管理器环境
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});