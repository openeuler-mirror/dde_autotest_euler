/**
 * 用例 PMSID: 1581115
 * 用例标题: 删除书签
 * 生成时间: 2026-05-12
 * 用例编写人: UT006252(杨通)
 */

describe('1581115-删除书签', () => {
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

  test('1581115-删除书签', async ({ device, agent, uos }) => {
    // ===== 前置条件：打开文档查看器并打开PDF文件 =====
    console.log('前置条件：打开文档查看器并打开PDF文件');
    await uos.openApp('文档查看器');
    await new Promise(resolve => setTimeout(resolve, 3000));
    console.log('全屏显示文档查看器');
    await uos.maximizeWindow();
    await agent.aiTap('选择文件按钮');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('左侧栏中的文档');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiDoubleClick('readertest.pdf');
    await agent.aiWaitFor('测试文件第一行文字', {
      timeoutMs: 30000,
      checkIntervalMs: 5000,
    });

    // ===== 前置条件：设置双页显示模式 =====
    console.log('前置条件：设置双页显示模式');
    await agent.aiTap('页面顶部缩放比例控件右侧的下拉栏按钮');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('双页显示');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // ===== 前置条件：创建书签（供测试用例1使用） =====
    console.log('前置条件：创建书签（供测试用例1使用）');
    await agent.aiRightClick('测试文件第一行文字');
    await agent.aiWaitFor('添加书签');
    await agent.aiTap('添加书签');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('左侧页面右上角出现书签标志');

    // ===== 测试用例1：点击书签图标删除书签 =====
    console.log('测试用例1：点击书签图标删除书签');
    await agent.aiTap('左侧页面右上角已显示的书签标志');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('书签图标变为空心实线样式且无填充色，表示书签已成功删除');

    // ===== 前置条件：重新创建书签（供测试用例2使用） =====
    console.log('前置条件：重新创建书签（供测试用例2使用）');
    await agent.aiRightClick('测试文件第一行文字');
    await agent.aiWaitFor('添加书签');
    await agent.aiTap('添加书签');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('左侧页面右上角出现书签标志');

    // ===== 测试用例2：右键菜单删除书签 =====
    console.log('测试用例2：右键菜单删除书签');
    await agent.aiRightClick('左侧页面右上角的书签图标');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiWaitFor('删除书签');
    await agent.aiTap('删除书签');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('书签图标从页面中消失，表示书签已成功删除');

    // ===== 前置条件：重新创建书签（供测试用例3使用） =====
    console.log('前置条件：重新创建书签（供测试用例3使用）');
    await agent.aiRightClick('测试文件第一行文字');
    await agent.aiWaitFor('添加书签');
    await agent.aiTap('添加书签');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('左侧页面右上角出现书签标志');

    // ===== 测试用例3：通过书签管理面板删除书签 =====
    console.log('测试用例3：通过书签管理面板删除书签');
    await agent.aiTap('窗口左上角减号按钮旁边的缩略图图标');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiTap('左下角应用菜单栏中的第三个书签图标');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('书签列表中第一页对应的书签项');
    await new Promise(resolve => setTimeout(resolve, 500));
    await device.pressKey('Delete');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiAssert('选中的书签缩略图从列表中消失，表示书签已成功删除');

  }, { timeout: 1200000, tags: ['1581115', 'level1', 'smoke', 'DITT', 'yangtong'] });

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
