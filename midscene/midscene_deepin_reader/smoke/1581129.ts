/**
 * 用例 PMSID: 1581129
 * 用例标题: 切换高亮颜色
 * 生成时间: 2026-05-12
 * 用例编写人: UT006252(杨通)
 */

describe('1581129-切换高亮颜色', () => {
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

  test('1581129-切换高亮颜色', async ({ device, agent, uos }) => {
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

    // 步骤1: 对第一行文字先添加蓝色高亮，再添加黄色高亮，验证叠加后变为绿色
    console.log('步骤1: 对第一行文字先添加蓝色高亮，再添加黄色高亮');
    // 选中第一行文字并添加蓝色高亮
    await agent.aiDrag('第一行文字中的"测"文本', '第一行文字中的"字"文本', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiRightClick('选中的文字');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('蓝色的选项按钮');
    await new Promise(resolve => setTimeout(resolve, 2000));
    // 再次选中相同的第一行文字并添加黄色高亮
    await agent.aiTap('页面空白处');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiDrag('第一行文字中的"测"文本', '第一行文字中的"字"文本', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiRightClick('选中的文字');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('黄色的选项按钮');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('测试文件第一行文字背景色变为绿色');

    // 步骤2: 在第一行文字的绿色高亮上切换为红色高亮
    console.log('步骤2: 在第一行文字上切换为红色高亮');
    await agent.aiTap('页面空白处');
    await agent.aiRightClick('测试文件第一行文字高亮区域');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('红色的选项按钮');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('测试文件第一行文字中高亮文本的背景色变为深紫色');

    // 步骤3: 对第二行文字添加蓝色高亮
    console.log('步骤3: 对第二行文字添加蓝色高亮');
    await agent.aiTap('页面空白处');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiDrag('第二行文字中的"测"文本', '第二行文字中的"字"文本', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiRightClick('测试文件第二行文字');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('蓝色的选项按钮');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('测试文件第二行文字已添加背景为蓝色的高亮效果');

    // 步骤4: 将第二行文字的高亮颜色从蓝色切换为黄色
    console.log('步骤4: 将第二行文字的高亮颜色从蓝色切换为黄色');
    await agent.aiTap('页面空白处');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiRightClick('测试文件第二行文字高亮区域');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('黄色的选项按钮', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('测试文件第二行文字的高亮背景色从蓝色切换为黄色');

  }, { timeout: 1200000, tags: ['1581129', 'level1', 'smoke', 'DITT', 'yangtong'] });

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
