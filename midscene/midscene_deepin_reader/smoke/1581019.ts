/**
 * 用例 PMSID: 1581019
 * 用例标题: 缩略图标
 * 生成时间: 2026-05-12
 * 用例编写人: UT006252(杨通)
 */

describe('1581019-缩略图标', () => {
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
  });

  test('1581019-缩略图标', async ({ device, agent, uos }) => {
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

    // 步骤1: 点击左上角减号图标左侧缩略图标，查看界面显示
    console.log('步骤1: 点击缩略图标，查看左边栏');
    await agent.aiTap('左上角减号图标左侧缩略图标');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('左边栏底部显示四个图标');

    // 步骤2: 点击目录图标（左下角从左到右第二个），查看界面显示
    console.log('步骤2: 点击目录图标');
    await agent.aiTap('左下角从左到右第二个的目录图标');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('左侧栏空白无内容显示');

    // 步骤3: 点击书签图标（左下角从左到右第三个），查看界面显示
    console.log('步骤3: 点击书签图标');
    await agent.aiTap('左下角从左到右第三个的书签图标');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('左侧栏底部出现添加书签按钮');

    // 步骤4: 点击注释图标（左下角从左到右第四个），查看界面显示
    console.log('步骤4: 点击注释图标');
    await agent.aiTap('左下角从左到右第四个的注释图标');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('左侧栏底部出现添加注释按钮');

    // 步骤5: 再次点击左上角减号图标左侧缩略图标，查看界面显示
    console.log('步骤5: 再次点击缩略图标');
    await agent.aiTap('左上角减号图标左侧缩略图标');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('左侧消失');

  }, { timeout: 1200000, tags: ['1581019', 'level1', 'smoke', 'DITT', 'yangtong'] });

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
