/**
 * 用例 PMSID: 1581267
 * 用例标题: [007]保存
 * 生成时间: 2026-05-12
 * 用例编写人: UT006252(杨通)
 */

describe('1581267-[007]保存', () => {
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
    await uos.showDesktop();
  });

  test('1581267-[007]保存', async ({ device, agent, uos, system }) => {
    const TEST_USERNAME = process.env.TEST_USERNAME;

    // 步骤a: 打开文档查看器应用程序
    console.log('步骤a: 打开文档查看器应用程序');
    await uos.openApp('文档查看器');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('全屏显示文档查看器');
    await uos.maximizeWindow();

    // 步骤b: 点击"选择文件"按钮，导航至"文档"目录，选择并打开readertest.pdf文件
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

    // 步骤c: 在文档中右键点击"测试文件第一行文字"，选择"添加书签"选项，验证书签添加成功
    console.log('步骤c: 添加书签并验证');
    await agent.aiRightClick('测试文件第一行文字');
    await agent.aiWaitFor('添加书签');
    await agent.aiTap('添加书签');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤d: 点击应用程序主菜单，查看"保存"选项是否处于高亮显示状态
    console.log('步骤d: 检查保存选项高亮状态');
    await agent.aiTap('右上角的主菜单按钮');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('保存选项处于高亮显示状态');

    // 步骤e: 按下键盘组合键Ctrl+S，验证文档保存成功
    console.log('步骤e: 使用Ctrl+S保存文档');
    await agent.aiTap('文档内容区域');
    await device.pressKey('Ctrl+S');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤f: 关闭文档查看器应用程序
    console.log('步骤f: 关闭文档查看器应用程序');
    await uos.closeCurrentWindow();
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 步骤g: 重新打开readertest.pdf文件
    console.log('步骤g: 重新打开readertest.pdf文件');
    await uos.showDesktop();
    await uos.openApp('文档查看器');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('全屏显示文档查看器');
    await uos.maximizeWindow();
    await agent.aiTap('文件按钮');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('左侧栏中的文档');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiDoubleClick('readertest.pdf');
    await agent.aiWaitFor('测试文件第一行文字', {
      timeoutMs: 30000,
      checkIntervalMs: 5000,
    });

    // 步骤h: 右键点击"测试文件第一行文字"，验证"添加书签"选项已置灰不可用
    console.log('步骤h: 验证添加书签选项已置灰');
    await agent.aiRightClick('测试文件第一行文字');
    await agent.aiWaitFor('添加注释');
    await agent.aiAssert('出现删除书签选项');

  }, { timeout: 1200000, tags: ['1581267', 'level1', 'smoke', 'DITT', 'yangtong'] });

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