// @ts-nocheck
/**
 * 用例 PMSID: 1816105
 * 用例标题: 长文件名功能 - 添加快捷访问
 * 生成时间: 2026-04-28
 * 用例编写人: UT000686(李双双)
 */
const caseDir = process.env.TESTCASE_DIR;
describe('1816105-长文件名功能 - 添加快捷访问', () => {
  const longFileName = '105长文件名功能添加快捷访问长文件名功能添加快捷访问长文件名功能添加长文件名功能添加快捷访问长文件名功长文件名功能添加快捷访问长文件名功能添加快捷访问长文件名功能添加快捷访问长文件名功能添加快捷访问长文件名功能添加快捷访问长文件名功能添加快捷访问长文件名功能添加快捷访问长文件名功能添加快捷访问长文件名功能添加快捷访问长文件名功能添加快捷访问长文件名功能添加快捷访问长文件名功能添加快捷访问18';

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager');
     // 前置条件：开启长文件名功能
    const { enableLongFileName } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await enableLongFileName(device, agent, system);

    // 清理可能存在的测试文件
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/${longFileName}`);

    // 利用命令在文档创建一个长名称的文件
    await system.exec(`mkdir /home/${process.env.TEST_USERNAME}/Documents/${longFileName}`);
    console.log('长名称文件已创建');
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

  test('1816105-长文件名功能 - 添加快捷访问', async ({ device, agent, uos, system }) => {

    // 步骤1：打开文件管理器，点击文档，点击长文件名文件，右键点击"添加到快捷访问"
    console.log('步骤1: 文档目录长文件名文件添加到快捷访问');

    // 导航到文档目录
    await agent.aiTap('文件管理器左侧栏的文档');
    await agent.aiWaitFor('文档目录已加载');


    // 右键点击"添加到快捷访问"
    await agent.aiRightClick(`"105长文"开头,"18"结尾的文件夹`);
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('添加到快捷访问');

    // 断言：侧边栏显示该长文件名文件的快捷访问
    await agent.aiAssert(`文件管理器侧边栏存"105长文"开头的目录`);
    console.log('✅ 步骤1验证通过：长文件名文件快捷访问添加成功');

    // 步骤2：点击长文件名快捷访问目录，跳转到对应的文件夹内
    console.log('步骤2: 点击快捷访问目录，验证跳转');
    await agent.aiTap("文档目录空白处")

    // 点击侧边栏的长文件名快捷访问
    await agent.aiTap(`文件管理器页面左侧边栏"105长文"开头目录`);
    await agent.aiWaitFor('目录跳转完成');

    // 断言：成功跳转到对应的文件夹内，地址栏显示正确的路径
    await agent.aiAssert(`跳转到"105长文"开头的文件夹内`);
    console.log('✅ 步骤2验证通过：点击快捷访问成功跳转到对应目录');

  }, { timeout: 1200000, tags: ['1816105', 'level2', 'remote','smoke', 'file_operations', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 从快捷访问移除
    try {
      await agent.aiRightClick(`文件管理器侧边栏快捷"105长文"开头目录`);
      await agent.aiTap('从快捷访问移除');
      console.log('快捷访问已移除');
    } catch (error) {
      console.log('快捷访问移除失败或不存在');
    }

    // 清理长名称文件
    await system.exec(`rm -rf  /home/${process.env.TEST_USERNAME}/Documents/${longFileName}`);
    console.log('长名称文件已清理');

    // 关闭文件管理器
    await uos.closeCurrentWindow();
    await uos.showDesktop();
    // 双重保险清理文件管理器环境
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
