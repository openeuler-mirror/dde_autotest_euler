/**
 * 用例 PMSID: 2000451
 * 用例标题: 【全局搜索-图片文本内容搜索】对搜索结果进行操作
 * 生成时间: 2026-09-04
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const desktopDir = '~/Desktop';
const keyword = '等到你啦';        // cat.jpg 的 OCR 文本
const srcImg = 'cat.jpg';           // 仓库资源
const renameName = '等到';          // 复制到桌面后重命名的文件名主体

describe('2000451-【全局搜索-图片文本内容搜索】对搜索结果进行操作', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 前置条件 - 复制素材到桌面并重命名，更新图片文本内容索引后关闭文管');

    const { clearEnvironment, closeFileManager, updateImageTextSearchIndex } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    await closeFileManager(system);
    await clearEnvironment(system);

    // 复制 cat.jpg（含 OCR 文本"等到你啦"）到桌面，并重命名为"等到.jpg"
    console.log('准备步骤: 复制 cat.jpg 到桌面并重命名为等到.jpg');
    await system.exec(`cp -f ${caseDir}midscene_dde_file_manager/resources/2000319/${srcImg} ${desktopDir}/${renameName}.jpg`, 500);

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

  test('2000451-【全局搜索-图片文本内容搜索】对搜索结果进行操作', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：Shift+Space 打开全局搜索，输入"等到你啦"，检查"最佳匹配"类目能否搜索出
    // ============================================================
    console.log('===== 步骤1：Shift+Space 打开全局搜索，输入"等到你啦"，检查最佳匹配能否搜索出 =====');

    // Shift+Space 打开全局搜索
    console.log('操作步骤: 按 Shift+Space 打开全局搜索');
    await device.pressKey('Shift', 'Space');
    await agent.aiWaitFor('全局搜索框已打开', { timeoutMs: 5000 });

    // 输入搜索内容（全局搜索自动出结果，无需回车）
    console.log('操作步骤: 输入搜索内容"等到你啦"');
    await device.typeText(keyword);
    // 图片文本内容搜索耗时较长，等待搜索结果加载（最长10分钟）
    await agent.aiWaitFor('搜索结果已加载', { timeoutMs: 600000 });

    console.log('预期1："最佳匹配"类目中能搜索出等到.jpg图片');
    await agent.aiAssert('“最佳匹配”类目中能搜索出等到.jpg图片');

    // ============================================================
    // 步骤2：鼠标左键点击"最佳匹配"类目搜索结果中的图片，检查能否正常打开
    // ============================================================
    console.log('===== 步骤2：鼠标左键点击最佳匹配类目搜索结果中的图片，检查能否正常打开 =====');

    console.log('操作步骤: 鼠标左键点击"最佳匹配"类目中的等到.jpg搜索结果');
    await agent.aiTap('“最佳匹配”类目中的等到.jpg搜索结果', { deepThink: true });
    await agent.aiWaitFor('文件已打开', { timeoutMs: 10000 });

    console.log('预期2：图片能够正常打开');
    await agent.aiAssert('图片能够正常打开');

    // 关闭打开的图片查看器，回到干净桌面，为步骤3做准备
    console.log('操作步骤: 关闭图片查看器');
    await device.pressKey('Alt+F4');
    await agent.aiWaitFor('图片查看器已关闭', { timeoutMs: 5000 });

    // ============================================================
    // 步骤3：鼠标双击"图片中找到的文字"类目搜索结果中的图片，检查能否正常打开
    // ============================================================
    console.log('===== 步骤3：鼠标双击"图片中找到的文字"类目搜索结果中的图片，检查能否正常打开 =====');

    // 重新打开全局搜索并输入关键词
    console.log('操作步骤: 按 Shift+Space 重新打开全局搜索');
    await device.pressKey('Shift', 'Space');
    await agent.aiWaitFor('全局搜索框已打开', { timeoutMs: 5000 });

    console.log('操作步骤: 输入搜索内容"等到你啦"');
    await device.typeText(keyword);
    // 图片文本内容搜索耗时较长，等待搜索结果加载（最长10分钟）
    await agent.aiWaitFor('搜索结果已加载', { timeoutMs: 600000 });

    console.log('操作步骤: 鼠标双击"图片中找到的文字"类目中的等到.jpg搜索结果');
    await agent.aiTap('“图片中找到的文字”类目中的等到.jpg的搜索结果');
    await agent.aiDoubleClick('“图片中找到的文字”类目中的等到.jpg的搜索结果');
    await agent.aiWaitFor('文件已打开', { timeoutMs: 10000 });

    console.log('预期3：图片能够正常打开');
    await agent.aiAssert('图片能够正常打开');


    console.log('===== 测试全部通过 =====');
  }, { timeout: 1800000, tags: ['2000451', 'level3', 'image_content_search', 'DITT', 'yangtong'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Alt+F4');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 删除系统内新增的素材副本（桌面等到.jpg），仓库 resources 下的素材不删除
    console.log('清理步骤: 删除桌面等到.jpg');
    await system.exec(`rm -f ${desktopDir}/${renameName}.jpg`, 500);

    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
