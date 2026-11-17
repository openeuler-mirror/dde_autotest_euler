/**
 * 用例 PMSID: 2000359
 * 用例标题: 【全局搜索-图片文本内容搜索】预览搜索结果
 * 生成时间: 2026-08-27
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const desktopDir = '~/Desktop';

describe('2000359-【全局搜索-图片文本内容搜索】预览搜索结果', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 前置条件 - 复制素材到桌面，更新图片文本内容索引后关闭文管');

    const { clearEnvironment, closeFileManager, updateImageTextSearchIndex } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    await closeFileManager(system);
    await clearEnvironment(system);

    // 复制 cat.jpg（含 OCR 文本"等到你啦"）到桌面
    console.log('准备步骤: 复制 cat.jpg 到桌面');
    await system.exec(`cp -f ${caseDir}midscene_dde_file_manager/resources/2000319/cat.jpg ${desktopDir}/等到你啦.jpg`, 500);

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

  test('2000359-【全局搜索-图片文本内容搜索】预览搜索结果', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：Shift+Space 打开全局搜索，输入"等到你啦"，检查"图片中找到的文字"类目多结果
    // ============================================================
    console.log('===== 步骤1：Shift+Space 打开全局搜索，搜索"等到你啦"，检查类目多结果 =====');

    // Shift+Space 打开全局搜索
    console.log('操作步骤: 按 Shift+Space 打开全局搜索');
    await device.pressKey('Shift', 'Space');
    await agent.aiWaitFor('全局搜索框已打开', { timeoutMs: 5000 });

    // 输入搜索内容（全局搜索自动出结果，无需回车）
    console.log('操作步骤: 输入搜索内容"等到你啦"');
    await device.typeText('等到');
    // 图片文本内容搜索耗时较长，等待搜索结果加载（最长10分钟）
    await agent.aiWaitFor('搜索结果已加载', { timeoutMs: 600000 });

    console.log('预期1："图片中找到的文字"类目有多个结果');
    await agent.aiAssert('“图片中找到的文字”类目中有搜索结果');

    // ============================================================
    // 步骤2：检查所有搜索结果中的图片文件是否是缩略图
    // ============================================================
    console.log('===== 步骤2：检查搜索结果中的图片文件是否为缩略图 =====');

    console.log('预期2：搜索结果列表中的所有图片文件图标都是缩略图');
    await agent.aiAssert('搜索结果列表中的所有图片文件图标都是缩略图', { deepThink: true });

    // ============================================================
    // 步骤3：点击"图片中找到的文字"类目任一搜索结果，观察右侧预览区内容显示
    // ============================================================
    console.log('===== 步骤3：点击"图片中找到的文字"结果，检查预览区内容 =====');

    console.log('操作步骤: 点击"图片中找到的文字"类目中的搜索结果');
    await agent.aiTap('“图片中找到的文字”类目中的cat.jpg搜索结果', { deepThink: true });
    await agent.aiWaitFor('右侧预览区已显示', { timeoutMs: 5000 });

    console.log('预期3：文件名称正常显示，下方有含关键词的OCR文本摘要，且关键词加粗高亮');
    await agent.aiAssert('预览区中图片略缩图下方的文字包含搜索关键词"等到你啦"');

    // ============================================================
    // 步骤4：检查预览区中的属性、操作、大小等是否都正常显示
    // ============================================================
    console.log('===== 步骤4：检查预览区属性、操作、大小等正常显示 =====');

    console.log('预期4：预览区中的类型、尺寸、大小等信息都正常显示');
    await agent.aiAssert('预览区中的类型、尺寸、大小等信息都正常显示');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 1800000, tags: ['2000359', 'level3', 'image_content_search', 'DITT', 'yangtong'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 删除系统内新增的素材副本（桌面cat.jpg），仓库 resources 下的素材不删除
    console.log('清理步骤: 删除桌面cat.jpg');
    await system.exec(`rm -f ${desktopDir}/cat.jpg`, 500);

    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});