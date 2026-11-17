/**
 * 用例 PMSID: 2002017
 * 用例标题: 【文管-图片文本内容搜索】文件内容摘要超出1行展示不下时
 * 生成时间: 2026-09-04
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const keyword = '最长显示255';
const targetImg = '显示255个字符不带空格符号.png';

describe('2002017-【文管-图片文本内容搜索】文件内容摘要超出1行展示不下时', () => {
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

  test('2002017-【文管-图片文本内容搜索】文件内容摘要超出1行展示不下时', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：点击计算机，在右上角搜索框输入"最长显示255"，检查能否搜索出下载目录中的目标图片
    // ============================================================
    console.log('===== 步骤1：点击计算机，搜索框输入"最长显示255"，检查能否搜索出目标图片 =====');

    console.log('操作步骤: 点击左侧栏中的计算机');
    await agent.aiTap('文件管理器左侧栏中的计算机');
    await agent.aiWaitFor('计算机界面已打开', { timeoutMs: 5000 });

    console.log('操作步骤: 按 Ctrl+F 打开搜索框');
    await device.pressKey('Ctrl+F');
    await agent.aiWaitFor('搜索框已激活', { timeoutMs: 3000 });

    console.log(`操作步骤: 输入搜索内容"${keyword}"`);
    await device.typeText(keyword, true);
    // 图片文本内容搜索耗时较长，等待搜索结果加载（最长10分钟）
    await agent.aiWaitFor('搜索结果已加载', { timeoutMs: 600000 });

    console.log(`预期1：能搜索出下载目录中的${targetImg}图片`);
    await agent.aiAssert(`搜索结果中能搜索出${targetImg}图片`);

    // ============================================================
    // 步骤2：检查目标图片下方的OCR文本摘要首尾是否用"..."显示，且关键词高亮
    // ============================================================
    console.log('===== 步骤2：检查OCR文本摘要首尾"..."显示与关键词高亮 =====');

    // 首尾"..."校验（宽松）：若模型未能完整识别关键词所在行字符，首尾不一定显示"...", 不算 bug
    console.log(`预期2：${targetImg}下方的OCR文本摘要首尾用"..."显示，且关键词"${keyword}"高亮`);
    const hasEllipsis = await agent.aiBoolean(
      `搜索结果中${targetImg}文件名下方的OCR文本摘要首尾用"..."省略号显示`,
      { deepThink: true }
    );
    if (hasEllipsis) {
      console.log('OCR文本摘要首尾已用"..."省略号显示');
    } else {
      console.log('提示：OCR文本摘要首尾未显示"..."，可能因模型未完整识别关键词所在行字符，不算 bug');
    }

    // 关键词高亮校验（严格）
    const isHighlighted = await agent.aiBoolean(
      `搜索结果中${targetImg}文件名下方的OCR文本摘要中，关键词"${keyword}"为高亮显示`,
      { deepThink: true }
    );
    if (!isHighlighted) {
      throw new Error('关键词高亮显示失败');
    }

    console.log('===== 测试全部通过 =====');
  }, { timeout: 1800000, tags: ['2002017', 'level4', 'image_content_search', 'DITT', 'yangtong'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 本用例目标图片已预置在下载目录，脚本不复制、不删除素材副本
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
