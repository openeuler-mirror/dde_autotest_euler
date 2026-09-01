/**
 * 用例 PMSID: 1581141
 * 用例标题: 添加图标注释方式（显示注释小图标，无高亮显示）
 * 生成时间: 2026-05-12
 * 用例编写人: UT006252(杨通)
 */

describe('1581141-添加图标注释方式（显示注释小图标，无高亮显示）', () => {
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

  test('1581141-添加图标注释方式（显示注释小图标，无高亮显示）', async ({ device, agent, uos }) => {
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

    // 步骤1: 打开侧边栏，切换到注释页面，点击添加注释按钮，在PDF页面区域点击
    console.log('步骤1: 打开侧边栏，切换到注释页面，点击添加注释按钮');
    await agent.aiTap('左上角减号图标左侧缩略图标');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('左下角从左到右第四个的注释图标');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('添加注释按钮');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('PDF页面区域');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('成功弹出图标注释窗口，窗口包含文本输入区域及相关控制元素');

    // 步骤2: 在图标注释窗口中输入测试注释内容，点击窗口外区域关闭
    console.log('步骤2: 输入注释内容并关闭窗口');
    await device.typeText('测试注释内容', true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('窗口外的页面区域');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('图标注释窗口正常关闭，在PDF页面点击位置显示图标注释标记，图标注释添加成功且可见');

    // 步骤3: 在未选中文本的空白区域右键选择添加注释，验证弹出窗口
    console.log('步骤3: 右键空白区域选择添加注释');
    await agent.aiRightClick('测试文件第一行文字');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor('添加注释');
    await agent.aiTap('添加注释');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('成功弹出图标注释窗口，窗口包含文本输入区域及相关控制元素');

    // 步骤4: 在图标注释窗口中输入测试注释内容，点击窗口外区域关闭
    console.log('步骤4: 输入注释内容并关闭窗口');
    await device.typeText('右键添加的注释内容', true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('最右侧的页面空白处');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('图标注释窗口正常关闭，在PDF页面右键点击位置显示图标注释标记，图标注释添加成功且可见');

  }, { timeout: 1200000, tags: ['1581141', 'level1', 'smoke', 'DITT', 'yangtong'] });

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
