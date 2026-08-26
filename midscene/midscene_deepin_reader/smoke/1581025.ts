/**
 * 用例 PMSID: 1581025
 * 用例标题: 视图调整菜单
 * 生成时间: 2026-05-12
 * 用例编写人: UT006252(杨通)
 */

describe('1581025-视图调整菜单', () => {
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

  test('1581025-视图调整菜单', async ({ device, agent, uos }) => {
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

    // 步骤1: 查看文档默认显示效果，验证单页显示和适合宽度
    console.log('步骤1: 验证文档默认显示效果');
    await agent.aiAssert('文档为单页显示模式');
    await agent.aiTap('页面顶部缩放比例控件右侧的下拉栏按钮');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('适应宽度选项被勾选');
    await agent.aiTap('页面顶部缩放比例控件右侧的下拉栏按钮');
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤2: 切换至双页显示模式
    console.log('步骤2: 切换至双页显示模式');
    await agent.aiTap('页面顶部缩放比例控件右侧的下拉栏按钮');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('双页显示');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('文档成功切换至双页显示模式，界面布局正确');

    // 步骤3: 切换至适合高度显示模式
    console.log('步骤3: 切换至适合高度显示模式');
    await agent.aiTap('页面顶部缩放比例控件右侧的下拉栏按钮');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('适合高度');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('左侧页面的最下面一行文字显示为测试文件第十一行文字');

    // 步骤4: 点击左旋转按钮
    console.log('步骤4: 点击左旋转按钮');
    await agent.aiRightClick('测试文件第五行文字');
    await agent.aiTap('左旋转选项');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('当前页面完成左旋转，左边栏和工具栏保持原有方向');

    // 步骤5: 点击右旋转按钮
    console.log('步骤5: 点击右旋转按钮');
    await agent.aiRightClick('测试文件第五行文字');
    await agent.aiTap('右旋转选项');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('当前页面正常显示，未左旋转');

  }, { timeout: 1200000, tags: ['1581025', 'level1', 'smoke', 'DITT', 'yangtong'] });

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
