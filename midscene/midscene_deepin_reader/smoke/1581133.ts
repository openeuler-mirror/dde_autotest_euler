/**
 * 用例 PMSID: 1581133
 * 用例标题: [015]取消高亮
 * 生成时间: 2026-05-12
 * 用例编写人: UT006252(杨通)
 */

describe('1581133-[015]取消高亮', () => {
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
    await system.exec(`cp -r "${caseDir}midscene_deepin_reader/resources/readertest.docx" /home/${TEST_USERNAME}/Documents`);
  });

  beforeEach(async ({ device, agent, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await uos.showDesktop();
  });

  test('1581133-[015]取消高亮', async ({ device, agent, uos }) => {
    // 打开文档查看器应用程序
    console.log('打开文档查看器应用程序');
    await uos.openApp('文档查看器');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('全屏显示文档查看器');
    await uos.maximizeWindow();

    // 打开指定DOCX文档
    console.log('打开readertest.docx文件');
    await agent.aiTap('选择文件按钮');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('左侧栏中的文档');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiDoubleClick('readertest.docx');
    await agent.aiWaitFor('测试文件第一行文字', {
      timeoutMs: 30000,
      checkIntervalMs: 5000,
    });

    // 鼠标拖拽选中一段文本内容
    console.log('拖拽选中一段文本内容');
    await agent.aiDrag('测试', '文字', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 通过右键菜单为选中文本添加高亮标记
    console.log('通过右键菜单添加高亮标记');
    await agent.aiRightClick('选中的文字');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor('高亮');
    await agent.aiTap('高亮');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 验证高亮已添加
    await agent.aiAssert('选中的文本背景变为预设的高亮颜色');

    // 右键点击已添加高亮的文本区域，选择取消高亮
    console.log('右键点击高亮文本区域，选择取消高亮');
    await agent.aiRightClick('高亮的文字');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor('取消高亮');
    await agent.aiTap('取消高亮');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 验证高亮标记已成功移除，文本恢复为正常显示状态
    await agent.aiAssert('选中的文本高亮标记已成功移除，文本恢复为正常显示状态，无残留高亮效果');

  }, { timeout: 1200000, tags: ['1581133', 'level1', 'smoke', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const caseDir = process.env.TESTCASE_DIR;
    const { clearReader } = await import(`${caseDir}midscene_deepin_reader/common/common.ts`);
    await clearReader(system);
    const TEST_USERNAME = process.env.TEST_USERNAME;
    await system.exec(`rm -f /home/${TEST_USERNAME}/Documents/readertest.docx`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });
});
