/**
 * 用例 PMSID: 1581131
 * 用例标题: 记住高亮规则
 * 生成时间: 2026-05-12
 * 用例编写人: UT006252(杨通)
 */

describe('1581131-记住高亮规则', () => {
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

  test('1581131-记住高亮规则', async ({ device, agent, uos }) => {
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

    // 步骤1: 选中文本并添加红色高亮
    console.log('步骤1: 选中文本并添加红色高亮');
    await agent.aiDrag('测试', '第一行', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiRightClick('选中的文字');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor('高亮');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('红色图标');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('所选文本成功添加红色高亮效果，高亮显示清晰可见');

    // 步骤2: 右键已高亮文本，验证红色颜色处于选中状态
    console.log('步骤2: 右键已高亮文本，验证红色颜色处于选中状态');
    await agent.aiRightClick('已高亮的文字');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor('高亮');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('红色图标处于选中状态，直观显示当前使用的高亮颜色');

    // 关闭右键菜单
    await agent.aiTap('页面空白处');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤3: 选择另一段文本并验证高亮颜色记忆功能
    console.log('步骤3: 选择另一段文本并验证高亮颜色记忆功能');
    await agent.aiDrag('第三行', '第四行', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiRightClick('第四');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor('高亮');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('红色图标仍保持选中状态');
    await agent.aiTap('高亮');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('所选文本成功添加红色高亮效果，高亮颜色设置的记忆功能正常工作');

  }, { timeout: 1200000, tags: ['1581131', 'level1', 'smoke', 'DITT', 'yangtong'] });

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
