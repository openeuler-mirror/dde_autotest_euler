/**
 * 用例 PMSID: 2000319
 * 用例标题: 【文管-图片文本内容搜索】功能开启后进行图片文件内容搜索
 * 生成时间: 2026-08-26
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;

describe('2000319-【文管-图片文本内容搜索】功能开启后进行图片文件内容搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 前置条件 - 打开文管并更新图片文本内容索引');

    const { clearEnvironment, closeFileManager, updateImageTextSearchIndex } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    await closeFileManager(system);
    await clearEnvironment(system);

    // 只打开一次文件管理器并全屏
    console.log('准备步骤: 打开文件管理器并全屏');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');

    // 前置条件：调用公共方法更新图片文本内容索引（内部含最长10分钟等待"索引更新完成"）
    console.log('前置条件: 调用公共方法更新图片文本内容索引');
    await updateImageTextSearchIndex(device, agent, system);

    // 更新索引后关闭设置窗口，回到文管界面继续操作
    console.log('准备步骤: 关闭设置窗口');
    await device.pressKey('Alt+F4');
    await agent.aiWaitFor('设置窗口已关闭', { timeoutMs: 3000 });
  });

  test('2000319-【文管-图片文本内容搜索】功能开启后进行图片文件内容搜索', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：用默认打开的界面，Ctrl+F 打开搜索框，输入"图片手动添加文本"，检查能否搜索出 picture.bmp
    // ============================================================
    console.log('===== 步骤1：搜索图片OCR文本"图片手动添加文本"，检查能否搜索出picture.bmp =====');

    // 不导航到素材文件夹，直接使用默认打开的界面（素材使用仓库 resources，基于索引进行内容搜索）

    // 先按 Ctrl+F 打开搜索框
    console.log('操作步骤: 按 Ctrl+F 打开搜索框');
    await device.pressKey('Ctrl+F');
    await agent.aiWaitFor('搜索框已激活', { timeoutMs: 3000 });

    // 在搜索框中输入搜索内容
    console.log('操作步骤: 输入搜索内容"图片手动添加文本"');
    await device.typeText('图片手动添加文本', true);
    // 图片文本内容搜索耗时较长，等待搜索结果加载（最长10分钟）
    await agent.aiWaitFor('搜索结果已加载', { timeoutMs: 600000 });

    console.log('预期1：能够搜索出 picture.bmp 图片');
    await agent.aiAssert('搜索结果中能搜索出picture.bmp图片');

    // ============================================================
    // 步骤2：检查图片文件图标是否为缩略图
    // ============================================================
    console.log('===== 步骤2：检查图片文件图标是否为缩略图 =====');
    console.log('预期2：图片文件图标为缩略图');
    await agent.aiAssert('搜索结果中picture.bmp的文件图标是缩略图', { deepThink: true });

    // ============================================================
    // 步骤3：检查文件名下方是否有一行包含搜索关键词的OCR文本摘要，且关键词高亮
    // ============================================================
    console.log('===== 步骤3：检查OCR文本摘要与关键词高亮 =====');

    console.log('预期3：picture.bmp文件名下方有一行包含关键词的OCR文本摘要，且关键词高亮');
    await agent.aiAssert('搜索结果中picture.bmp文件名下方显示一行包含搜索关键词"图片手动添加文本"的OCR文本摘要');

    // 用 aiBoolean + deepThink 单独验证关键词蓝色高亮
    const isHighlighted = await agent.aiBoolean(
      "搜索结果中picture.bmp文件名下方的OCR文本摘要中，关键词'图片手动添加文本'为蓝色高亮显示",
      { deepThink: true }
    );
    if (!isHighlighted) {
      throw new Error('关键词高亮显示失败');
    }

    console.log('===== 测试全部通过 =====');
  }, { timeout: 1800000, tags: ['2000319', 'level3', 'image_content_search', 'DITT', 'yangtong'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
