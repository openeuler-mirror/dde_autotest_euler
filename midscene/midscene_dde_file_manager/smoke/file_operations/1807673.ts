// @ts-nocheck
/**
 * 用例 PMSID: 1807673
 * 用例标题: 文件/文件夹-右键-添加标记
 * 生成时间: 2026-04-23
 * 用例编写人: UT000686(李双双)
 */
const caseDir = process.env.TESTCASE_DIR;
describe('1807673-文件/文件夹-右键-添加标记', () => {
  

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager');
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/1807673_1`);
    await system.exec(`rm -rf /home/${process.env.TEST_USERNAME}/Documents/1807673_2`);
    await uos.showDesktop();
    // 前置条件：在文档目录创建1807673_1文件夹和1807673_2文件夹
    await system.exec(`mkdir /home/${process.env.TEST_USERNAME}/Documents/1807673_1`);
    await system.exec(`mkdir /home/${process.env.TEST_USERNAME}/Documents/1807673_2`);
    await new Promise(resolve => setTimeout(resolve, 5000));
    console.log('前置条件：1807673_1和1807673_2文件夹已创建');
    // 打开文件管理器并最大化
    await device.pressKey('Super+E');
    await uos.maximizeWindow();
    await agent.aiWaitFor('文件管理器最大化');
  });

  beforeEach(async ({ device, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await device.pressKey('Escape');
  });

  test('1807673-文件/文件夹-右键-添加标记', async ({ device, agent, uos, system }) => {

    // 导航到文档目录
    console.log('导航到文档目录');
    await agent.aiTap('文件管理器左侧栏的文档');
    await agent.aiWaitFor('文档目录已加载');

    // 步骤1：1807673_1右键点击"标记信息"下面的蓝色点点，断言标记蓝色
    console.log('步骤1: 右键点击"标记信息"下面的蓝色点点，断言标记蓝色');
    await agent.aiTap('1807673_1文件夹');
    await agent.aiWaitFor('1807673_1文件夹被选中');
    await agent.aiRightClick('1807673_1文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('标记信息文案下方的蓝色点点');
    await agent.aiTap('桌面空白区域');
    await agent.aiAssert('1807673_1文件夹名称旁边有显示蓝色标记');
    console.log('✅ 步骤1验证通过：蓝色标记添加成功');

    // 步骤2：右键1807673_1文件夹点击"标记信息"输入"标记1"，点击"enter"，输入"标记2"，点击"enter"，新增两个随机颜色的标记
    console.log('步骤2: 输入"标记1"和"标记2"，新增两个随机颜色标记');
    await agent.aiRightClick('1807673_1文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('标记信息');
    await device.typeText('标记1');
    await device.pressKey('Enter');
    await device.typeText('标记2');
    await device.pressKey('Enter');
    await agent.aiTap('桌面空白区域');
    await agent.aiAssert('1807673_1文件夹名称旁边有多个的标记');
    console.log('✅ 步骤2验证通过：标记1和标记2添加成功');

    // 步骤3：右键1807673_2文件夹点击"标记信息"输入"标记1"，点击"enter"，新增一个随机颜色的标记
    console.log('步骤3: 1807673_2输入"标记1"，新增随机颜色标记');
    await agent.aiRightClick('1807673_2文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('标记信息');
    await device.typeText('标记1');
    await device.pressKey('Enter');
    await agent.aiTap('桌面空白区域');
    await agent.aiAssert('1807673_2文件夹名称旁边有新增一个标记');
    console.log('✅ 步骤3验证通过：1807673_2标记1添加成功');

    // 步骤4：右键1807673_2文件夹点击"标记信息"输入"黄色"，点击"enter"，输入"绿色"，点击"enter"，新增两个标记色
    console.log('步骤4: 输入"黄色"和"绿色"，新增两个标记色');
    await agent.aiRightClick('1807673_2文件夹');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('标记信息');
    await device.typeText('黄色');
    await device.pressKey('Enter');
    await device.typeText('绿色');
    await device.pressKey('Enter');
    await agent.aiTap('桌面空白区域');
    await agent.aiAssert('1807673_2文件夹名称旁边有多个标记');
    console.log('✅ 步骤4验证通过：黄色和绿色标记添加成功');

  }, { timeout: 1200000, tags: ['1807673', 'level2', 'smoke', 'file_operations', 'DITT',  'lishuangshuang'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Escape');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 清理测试文件夹
    await device.pressKey('Super+E');
    await uos.maximizeWindow();
    await agent.aiTap('文件管理器左侧栏的文档');
    await agent.aiWaitFor('文档目录已加载');
    console.log('导航到文档目录');
    await device.pressKey('Ctrl+A');
    await device.pressKey('Delete');
    await system.exec('killall dde-file-manager');
    // 双重保险清理文件管理器环境
    const caseDir = process.env.TESTCASE_DIR;
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
