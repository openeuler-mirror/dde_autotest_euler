/**
 * 用例 PMSID: 2001827
 * 用例标题: 【全局搜索-图片文本内容搜索】新增"图片中找到的文字"类目
 * 生成时间: 2026-08-26
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const desktopDir = '~/Desktop';
const documentsDir = '~/Documents';

describe('2001827-【全局搜索-图片文本内容搜索】新增"图片中找到的文字"类目', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 前置条件 - 复制石鼓寺.bmp到桌面和文档目录，更新图片文本内容索引后关闭文管');

    const { clearEnvironment, closeFileManager, updateImageTextSearchIndex } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    await closeFileManager(system);
    await clearEnvironment(system);

    // 复制 BA.bmp（含 OCR 文本"石鼓寺"）到桌面，并重命名为"石鼓寺.bmp"
    console.log('准备步骤: 复制 BA.bmp 到桌面并重命名为石鼓寺.bmp');
    await system.exec(`cp -f ${caseDir}midscene_dde_file_manager/resources/2000319/BA.bmp ${desktopDir}/石鼓寺.bmp`, 500);

    // 复制一份石鼓寺.bmp 到文档目录
    console.log('准备步骤: 复制石鼓寺.bmp 到文档目录');
    await system.exec(`cp -f ${desktopDir}/石鼓寺.bmp ${documentsDir}/石鼓寺.bmp`, 500);

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

  test('2001827-【全局搜索-图片文本内容搜索】新增"图片中找到的文字"类目', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：Shift+Space 打开全局搜索，搜索"石鼓寺"，检查是否新增"图片中找到的文字"类目且在"图片"类目上方
    // ============================================================
    console.log('===== 步骤1：Shift+Space 打开全局搜索，搜索"石鼓寺"，检查新增"图片中找到的文字"类目 =====');

    // Shift+Space 打开全局搜索
    console.log('操作步骤: 按 Shift+Space 打开全局搜索');
    await device.pressKey('Shift', 'Space');
    await agent.aiWaitFor('全局搜索框已打开', { timeoutMs: 5000 });

    // 输入搜索内容（全局搜索自动出结果，无需回车）
    console.log('操作步骤: 输入搜索内容"石鼓寺"');
    await device.typeText('石鼓寺');
    // 图片文本内容搜索耗时较长，等待搜索结果加载（最长10分钟）
    await agent.aiWaitFor('搜索结果已加载', { timeoutMs: 600000 });

    console.log('预期1：搜索结果列表中新增"图片中找到的文字"类目，且位于"图片"类目上方');
    await agent.aiAssert('搜索结果列表中含有"图片中找到的文字"类目');

    // ============================================================
    // 步骤2：检查"最佳匹配"、"图片中找到的文字"、"图片"类目中的石鼓寺.bmp结果数量
    // ============================================================
    console.log('===== 步骤2：检查三个类目中的石鼓寺.bmp结果数量 =====');

    console.log('预期2："最佳匹配"类目中都有两个石鼓寺.bmp的结果');
    await agent.aiAssert('“最佳匹配”中都有两个石鼓寺.bmp的结果');

    // 键盘输入下方向键6次，滚动到"图片"类目
    console.log('操作步骤: 按下方向键6次');
    for (let i = 0; i < 6; i++) {
      await device.pressKey('down');
    }
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log('预期2续："图片"类目下有两个石鼓寺.bmp的结果');
    await agent.aiAssert('“图片”类目下有两个石鼓寺.bmp的结果');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 1800000, tags: ['2001827', 'level3', 'image_content_search', 'DITT', 'yangtong'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 删除系统内新增的素材副本（桌面和文档目录的 石鼓寺.bmp），仓库 resources 下的素材不删除
    console.log('清理步骤: 删除桌面和文档目录的石鼓寺.bmp');
    await system.exec(`rm -f ${desktopDir}/石鼓寺.bmp ${documentsDir}/石鼓寺.bmp`, 500);

    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
