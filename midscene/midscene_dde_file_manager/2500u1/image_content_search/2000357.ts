/**
 * 用例 PMSID: 2000357
 * 用例标题: 【全局搜索-图片文本内容搜索】全局搜索进行图片文件内容搜索
 * 生成时间: 2026-08-26
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;

describe('2000357-【全局搜索-图片文本内容搜索】全局搜索进行图片文件内容搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 前置条件 - 更新图片文本内容索引后关闭文管');

    const { clearEnvironment, closeFileManager, updateImageTextSearchIndex } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    await closeFileManager(system);
    await clearEnvironment(system);

    // 打开文件管理器（一次）
    console.log('准备步骤: 打开文件管理器并全屏');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');

    // 前置条件：调用公共方法更新图片文本内容索引（内部含最长10分钟等待"索引更新完成"）
    console.log('前置条件: 调用公共方法更新图片文本内容索引');
    await updateImageTextSearchIndex(device, agent, system);

    // 关闭设置窗口
    console.log('准备步骤: 关闭设置窗口');
    await device.pressKey('Alt+F4');
    await agent.aiWaitFor('设置窗口已关闭', { timeoutMs: 3000 });

    // 关闭文管（全局搜索为系统级弹层，需干净桌面状态）
    console.log('准备步骤: 关闭文管');
    await closeFileManager(system);
  });

  test('2000357-【全局搜索-图片文本内容搜索】全局搜索进行图片文件内容搜索', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：Shift+Space 打开全局搜索，输入"石鼓寺"，检查结果列表里的所有文件图标是否是缩略图
    // ============================================================
    console.log('===== 步骤1：Shift+Space 打开全局搜索，搜索"石鼓寺"，检查结果图标是否为缩略图 =====');

    // Shift+Space 打开全局搜索
    console.log('操作步骤: 按 Shift+Space 打开全局搜索');
    await device.pressKey('Shift', 'Space');
    await agent.aiWaitFor('全局搜索框已打开', { timeoutMs: 5000 });

    // 输入搜索内容
    console.log('操作步骤: 输入搜索内容"石鼓寺"');
    await device.typeText('石鼓寺');
    // 图片文本内容搜索耗时较长，等待搜索结果加载（最长10分钟）
    await agent.aiWaitFor('搜索结果已加载', { timeoutMs: 600000 });

    console.log('预期1：搜索成功，搜索结果列表里的所有文件图标都是缩略图');
    await agent.aiAssert('搜索结果列表里的BA.bmp文件图标是缩略图', { deepThink: true });

    // ============================================================
    // 步骤2：检查"图片中找到的文字"类目中的BA.bmp下方是否有包含搜索关键词的OCR文本摘要，且关键词加粗高亮
    // ============================================================
    console.log('===== 步骤2：检查"图片中找到的文字"类目中BA.bmp的OCR文本摘要与关键词高亮 =====');

    console.log('预期2：BA.bmp右下方有包含搜索关键词"石鼓寺"的OCR文本摘要，且关键词加粗高亮');
    await agent.aiAssert('“图片中找到的文字”类目中BA.bmp右下方有"石鼓寺"文本', { deepThink: true });


    // ============================================================
    // 步骤3：检查匹配结果中"石鼓寺"关键词是否加粗高亮
    // ============================================================
    console.log('===== 步骤3：检查匹配结果中"石鼓寺"关键词是否加粗高亮 =====');

    // 注：仓库暂无"石鼓寺.png"素材（用户确认仅用现有素材），
    // 步骤3验证范围调整为当前唯一匹配结果 BA.bmp 上的"石鼓寺"关键词加粗高亮
    console.log('预期3：搜索结果中匹配图片BA.bmp显示的"石鼓寺"关键词加粗高亮显示');
    const keywordHighlighted = await agent.aiBoolean(
      "搜索结果中匹配图片BA.bmp右下角关键词'石鼓寺'与左侧时间信息相比为加粗高亮显示",
      { deepThink: true }
    );
    if (!keywordHighlighted) {
      throw new Error('搜索结果中关键词加粗高亮显示失败');
    }

    console.log('===== 测试全部通过 =====');
  }, { timeout: 1800000, tags: ['2000357', 'level3', 'image_content_search', 'DITT', 'yangtong'] });

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
