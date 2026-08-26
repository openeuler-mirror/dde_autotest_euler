/**
 * 用例 PMSID: 1581111
 * 用例标题: [035]点击菜单方式添加书签
 * 生成时间: 2026-05-12
 * 用例编写人: UT006252(杨通)
 */

describe('1581111-[035]点击菜单方式添加书签', () => {
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
    await system.exec(`cp -r "${caseDir}midscene_deepin_reader/resources/readertest.docx" /home/${TEST_USERNAME}/Documents`);
  });

  beforeEach(async ({ device, agent, uos }) => {
    console.log('2. beforeEach: 每个测试前的准备');
  });

  test('1581111-[035]点击菜单方式添加书签', async ({ device, agent, uos, system }) => {
    const TEST_USERNAME = process.env.TEST_USERNAME;

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

    // ==================== 功能1：选中文本场景下的书签添加 ====================
    console.log('功能1: 选中文本后通过右键菜单添加书签');

    // 拖拽选中文本
    await agent.aiDrag('测试', '文字', { deepThink: true });
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 右键点击选中文本，选择"添加书签"
    await agent.aiRightClick('页面空白处');
    await agent.aiWaitFor('添加书签');
    await agent.aiTap('添加书签');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 验证：文档右上角显示蓝色填充色的书签图标
    await agent.aiAssert('文档右上角显示蓝色填充色的书签图标');

    // 验证：右键菜单中的"添加书签"选项动态切换为"删除书签"
    await agent.aiTap('文档内容区域');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiRightClick('测试文件第一行文字');
    await agent.aiWaitFor('删除书签');
    await agent.aiAssert('出现删除书签选项');
    // 关闭右键菜单
    await agent.aiTap('文档内容区域');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // ==================== 功能3：书签删除 ====================
    console.log('功能3: 删除已添加的书签');

    // 右键点击，选择"删除书签"
    await agent.aiRightClick('测试文件第一行文字');
    await agent.aiWaitFor('删除书签');
    await agent.aiTap('删除书签');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 验证：右键菜单中的"删除书签"选项切换回"添加书签"
    await agent.aiRightClick('测试文件第一行文字');
    await agent.aiWaitFor('添加书签');
    await agent.aiAssert('出现添加书签选项');
    await agent.aiTap('文档内容区域');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 验证：文档右上角的蓝色书签图标已移除
    await agent.aiAssert('文档右上角不显示蓝色书签图标');

    // ==================== 功能2：未选中文本场景下的书签添加 ====================
    console.log('功能2: 未选中文本时通过右键菜单添加书签');

    // 在未选中文本状态下，右键点击并选择"添加书签"
    await agent.aiTap('文档内容区域');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiRightClick('文档内容区域');
    await agent.aiWaitFor('添加书签');
    await agent.aiTap('添加书签');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 验证：文档右上角显示蓝色填充色的书签图标
    await agent.aiAssert('文档右上角显示蓝色填充色的书签图标');

  }, { timeout: 1200000, tags: ['1581111', 'level1', 'smoke', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    const caseDir = process.env.TESTCASE_DIR;
    // 清理文档查看器的缓存数据，保证测试环境干净
    const { clearReader } = await import(`${caseDir}midscene_deepin_reader/common/common.ts`);
    await clearReader(system);
    const TEST_USERNAME = process.env.TEST_USERNAME;
    await system.exec(`rm -f /home/${TEST_USERNAME}/Documents/readertest.docx`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await uos.closeCurrentWindow().catch(() => {});
    await system.exec('killall deepin-reader');
    await uos.showDesktop();
  });
});