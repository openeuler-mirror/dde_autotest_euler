/**
 * 用例 PMSID: 1581043
 * 用例标题: [021]点击百分比图标中+、-按钮
 * 生成时间: 2026-05-12
 * 用例编写人: UT006252(杨通)
 */

describe('1581043-[021]点击百分比图标中+、-按钮', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    await device.pressKey('f5');
    const caseDir = process.env.TESTCASE_DIR;
    const { clearReader } = await import(`${caseDir}midscene_deepin_reader/common/common.ts`);
    await clearReader(system);
    const TEST_USERNAME = process.env.TEST_USERNAME;
    console.log('文件准备：将测试素材复制到目标目录');
    await system.exec(`rm -rf /home/${TEST_USERNAME}/Documents/*`);
    await system.exec(`cp -r "${caseDir}midscene_deepin_reader/resources/readertest.pdf" /home/${TEST_USERNAME}/Documents`);
  });

  beforeEach(async ({ device, agent, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
  });

  test('1581043-[021]点击百分比图标中+、-按钮', async ({ device, agent, uos }) => {
    // 步骤a: 打开文档查看器应用程序并最大化窗口
    console.log('步骤a: 打开文档查看器应用程序并最大化窗口');
    await uos.openApp('文档查看器');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('全屏显示文档查看器');
    await uos.maximizeWindow();

    // 步骤b: 选择并打开readertest.pdf文件
    console.log('步骤b: 选择并打开readertest.pdf文件');
    await agent.aiTap('选择文件按钮');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('左侧栏中的文档');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiDoubleClick('readertest.pdf');
    await agent.aiWaitFor('测试文件第一行文字', {
      timeoutMs: 30000,
      checkIntervalMs: 5000,
    });

    // 步骤c: 点击百分比图标中的加号按钮，验证比例变为300%
    console.log('步骤c: 点击加号按钮并验证比例变为300%');
    await agent.aiTap('界面左上角比例区域旁边的加号按钮');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('左上角比例区域显示的比例值为300%');

    // 步骤d: 点击百分比图标中的减号按钮，验证比例变为200%
    console.log('步骤d: 点击减号按钮并验证比例变为200%');
    await agent.aiTap('界面左上角比例区域旁边的减号按钮');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('左上角比例区域显示的比例值为200%');

  }, { timeout: 1200000, tags: ['1581043', 'level1', 'smoke', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const caseDir = process.env.TESTCASE_DIR;
    const { clearReader } = await import(`${caseDir}midscene_deepin_reader/common/common.ts`);
    await clearReader(system);
    const TEST_USERNAME = process.env.TEST_USERNAME;
    await system.exec(`rm -f /home/${TEST_USERNAME}/Documents/readertest.pdf`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
