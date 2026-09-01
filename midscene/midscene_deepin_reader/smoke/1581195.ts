/**
 * 用例 PMSID: 1581195
 * 用例标题: [013]手动输入关键字进行搜索
 * 生成时间: 2026-05-12
 * 用例编写人: UT006252(杨通)
 */

describe('1581195-[013]手动输入关键字进行搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    //输入f5刷新页面
    await device.pressKey('f5');
    const caseDir = process.env.TESTCASE_DIR;
    // 清理文档查看器的缓存数据，保证测试环境干净
    const { clearReader } = await import(`${caseDir}midscene_deepin_reader/common/common.ts`);
    await clearReader(system);
    const TEST_USERNAME = process.env.TEST_USERNAME;
    console.log('文件准备：将测试素材复制到目标目录');
    //清除文档目录下的所有文件
    await system.exec(`rm -rf /home/${TEST_USERNAME}/Documents/*`);
    await system.exec(`cp -r "${caseDir}midscene_deepin_reader/resources/readertest.pdf" /home/${TEST_USERNAME}/Documents`);
  });

  beforeEach(async ({ device, agent, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1581195-[013]手动输入关键字进行搜索', async ({ device, agent, uos, system }) => {
    const TEST_USERNAME = process.env.TEST_USERNAME;

    // 打开文档查看器应用程序
    console.log('打开文档查看器应用程序');
    await uos.openApp('文档查看器');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('全屏显示文档查看器');
    await uos.maximizeWindow();

    // 打开指定PDF文档
    console.log('打开readertest.pdf文件');
    await agent.aiTap('选择文件按钮');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('左侧栏中的文档');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiDoubleClick('readertest.pdf');
    await agent.aiWaitFor('测试文件第一行文字', {
      timeoutMs: 30000,
      checkIntervalMs: 5000,
    });

    // 步骤1：点击搜索框，手动输入关键字，按下键盘Enter键执行搜索，查看搜索结果显示
    console.log('步骤1: 手动输入关键字进行搜索');
    await agent.aiRightClick('测试文件第一行文字');
    await agent.aiWaitFor('添加注释');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('搜索');
    await device.typeText('测试文件', true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('搜索结果正常显示');

    // 步骤2：点击"上一个"按钮，验证系统正常切换到上一个关键字位置，选中的关键字自动添加绿色高亮效果
    console.log('步骤2: 点击上一个按钮');
    await agent.aiTap('上一个按钮');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('选中的关键字添加了绿色高亮效果');

    // 步骤3：点击"下一个"按钮，验证系统正常切换到下一个关键字位置，选中的关键字自动添加绿色高亮效果
    console.log('步骤3: 点击下一个按钮');
    await agent.aiTap('下一个按钮');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('选中的关键字添加了绿色高亮效果');

  }, { timeout: 1200000, tags: ['1581195', 'level1', 'smoke', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const caseDir = process.env.TESTCASE_DIR;
    // 清理文档查看器的缓存数据，保证测试环境干净
    const { clearReader } = await import(`${caseDir}midscene_deepin_reader/common/common.ts`);
    await clearReader(system);
    const TEST_USERNAME = process.env.TEST_USERNAME;
    await system.exec(`rm -f /home/${TEST_USERNAME}/Documents/readertest.pdf`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow().catch(() => {});
    await system.exec('killall deepin-reader');
    await uos.showDesktop();
  });
});