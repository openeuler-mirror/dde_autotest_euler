/**
 * 用例 PMSID: 2000363
 * 用例标题: 【图片文本内容搜索】支持搜索文本内容的图片类型
 * 生成时间: 2026-08-26
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;

// 6 种图片类型：关键词 → 对应图片文件
const imageTypeCases = [
  { keyword: '公共数据', image: 'ABC.heic',  type: '.heic' },
  { keyword: '石鼓寺',   image: 'BA.bmp',   type: '.bmp'  },
  { keyword: '等到你啦', image: 'cat.jpg',  type: '.jpg'  },
  { keyword: '喜欢的人', image: 'like.webp',type: '.webp' },
  { keyword: '功能说明', image: 'tool.png', type: '.png'  },
  { keyword: '血小板',   image: 'XE.jpeg',  type: '.jpeg' },
];

describe('2000363-【图片文本内容搜索】支持搜索文本内容的图片类型', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 前置条件 - 打开文管并更新图片文本内容索引');

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

    // 关闭设置窗口，回到文管界面（保留文管打开供步骤1使用）
    console.log('准备步骤: 关闭设置窗口');
    await device.pressKey('Alt+F4');
    await agent.aiWaitFor('设置窗口已关闭', { timeoutMs: 3000 });
  });

  test('2000363-【图片文本内容搜索】支持搜索文本内容的图片类型', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：文管窗口内搜索 6 种图片类型
    // ============================================================
    console.log('===== 步骤1：打开文管，点击桌面目录，窗口内搜索6种图片类型 =====');

    // Ctrl+F 打开窗口内搜索框
    console.log('操作步骤: 按 Ctrl+F 打开搜索框');
    await device.pressKey('Ctrl+F');
    await agent.aiWaitFor('搜索框已激活', { timeoutMs: 3000 });

    // 遍历 6 种图片类型，逐一搜索并验证
    for (const item of imageTypeCases) {
      console.log(`操作步骤: 窗口内搜索关键词"${item.keyword}"（${item.type}）`);
      // 每次搜索前 Ctrl+A 全选并删除上一次的关键词
      await device.pressKey('Ctrl+A');
      await device.pressKey('Backspace');
      // 输入新关键词（无需回车，搜索自动出结果）
      await device.typeText(item.keyword);
      // 图片文本内容搜索耗时较长，等待搜索结果加载（最长10分钟）
      await agent.aiWaitFor('搜索结果已加载', { timeoutMs: 600000});
      console.log(`预期：能按关键词"${item.keyword}"搜索出${item.image}图片`);
      await agent.aiAssert(`搜索结果中能搜索出${item.image}图片`);
    }

    // 按 Esc 退出窗口内搜索
    console.log('操作步骤: 按 Esc 退出窗口内搜索');
    await device.pressKey('Esc');

    // ============================================================
    // 步骤2：全局搜索 6 种图片类型
    // ============================================================
    console.log('===== 步骤2：打开全局搜索，搜索6种图片类型 =====');

    // 关闭文管，为全局搜索提供干净状态
    console.log('准备步骤: 关闭文管');
    const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);

    // Shift+Space 打开全局搜索
    console.log('操作步骤: 按 Shift+Space 打开全局搜索');
    await device.pressKey('Shift', 'Space');
    await agent.aiWaitFor('全局搜索框已打开', { timeoutMs: 5000 });

    // 遍历 6 种图片类型，逐一搜索并验证
    for (const item of imageTypeCases) {
      console.log(`操作步骤: 全局搜索关键词"${item.keyword}"（${item.type}）`);
      // 每次搜索前 Ctrl+A 全选并删除上一次的关键词
      await device.pressKey('Ctrl+A');
      await device.pressKey('Backspace');
      // 输入新关键词（无需回车，搜索自动出结果）
      await device.typeText(item.keyword);
      // 图片文本内容搜索耗时较长，等待搜索结果加载（最长10分钟）
      await agent.aiWaitFor('搜索结果已加载', { timeoutMs: 600000 });
      console.log(`预期：能按关键词"${item.keyword}"搜索出${item.image}图片`);
      await agent.aiAssert(`搜索结果中能搜索出${item.image}图片`);
    }

    console.log('===== 测试全部通过 =====');
  }, { timeout: 1800000, tags: ['2000363', 'level3', 'image_content_search', 'DITT', 'yangtong'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 本次未在系统内新增素材副本（素材直接用仓库 resources），无需删除副本
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
