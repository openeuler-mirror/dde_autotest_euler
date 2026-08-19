/**
 * 用例 PMSID: 1805485
 * 用例标题: 【搜索】Bug200133转：全文搜索后，拖动侧边栏滚动条
 * 生成时间: 2026-04-09 17:30:00
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1805485-【搜索】全文搜索后拖动侧边栏滚动条', () => {
  let common;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 统一导入公共模块，避免重复加载
    common = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await common.clearEnvironment(system);
    await common.closeFileManager(system);
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await common.closeFileManager(system);
  });

  test('1805485-全文搜索后拖动侧边栏滚动条', async ({ device, agent, uos, system }) => {
    // 打开文件管理器（非最大化）
    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor('文件管理器窗口已显示', { timeout: 10000 });

    // 前置准备：批量创建测试文件（30个足够触发滚动）
    console.log('===== 前置准备：批量创建测试文件 =====');
    for (let i = 1; i <= 30; i++) {
      const fileName = `ddefilemanagertest1${i}.txt`;
      await system.exec(`touch ~/Documents/${fileName}`);
    }

    await device.pressKey('F5');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤1：进入计算机页面
    console.log('===== 步骤1: 进入计算机页面并搜索 =====');
    await agent.aiTap('侧边栏的计算机目录');
    await agent.aiWaitFor('计算机页面已打开', { timeout: 10000 });

    // 搜索关键字
    await agent.aiTap('右上角搜索框');
    await agent.aiInput('ddefilemanagertest1', '搜索框');
    await device.pressKey('Enter');

    // 等待搜索结果
    await agent.aiWaitFor('显示搜索结果文件', { timeout: 30000, deepThink: true });

    // 步骤2：最大化窗口
    console.log('===== 步骤2: 最大化窗口并验证滚动 =====');
    await uos.maximizeWindow();
    await agent.aiWaitFor('窗口已最大化', { timeout: 5000 });

    // 点击列表获取焦点
    await agent.aiTap('搜索结果列表区域');
    await new Promise(resolve => setTimeout(resolve, 500));

    // ==================== 向下滚动 PageDown ====================
    console.log('[步骤2.1] PageDown 滚动到底部');
    let reachBottom = false;
    let scrollCount = 0;
    const maxScroll = 15;

    while (!reachBottom && scrollCount < maxScroll) {
      await device.pressKey('PageDown');
      await new Promise(resolve => setTimeout(resolve, 800));
      scrollCount++;

      reachBottom = await agent.aiBoolean('文件列表已滚动到底部', { deepThink: true });
      console.log(`滚动第 ${scrollCount} 次，是否到底：${reachBottom}`);
    }

    if (scrollCount >= maxScroll) {
      throw new Error('【BUG】向下滚动卡顿/卡死，未到达底部');
    }

    // ==================== 向上滚动 PageUp ====================
    console.log('[步骤2.2] PageUp 滚动到顶部');
    let reachTop = false;
    scrollCount = 0;

    while (!reachTop && scrollCount < maxScroll) {
      await device.pressKey('PageUp');
      await new Promise(resolve => setTimeout(resolve, 1000))
      scrollCount++;

      reachTop = await agent.aiBoolean('文件列表已滚动到顶部', { deepThink: true });
      console.log(`滚动第 ${scrollCount} 次，是否到顶：${reachTop}`);
    }

    if (scrollCount >= maxScroll) {
      throw new Error('【BUG】向上滚动卡顿/卡死，未到达顶部');
    }

    console.log('✅ 全文搜索后滚动流畅，测试通过');

  }, { timeout: 600000, tags: ['1805485', 'level3', 'smoke', 'search', 'scroll', 'DITT', 'sushanshan'] });

  afterEach(async ({ system, uos }) => {
    console.log('3. afterEach: 清理环境');

    // 删除测试文件
    try {
      await system.exec('rm -f ~/Documents/ddefilemanagertest1*.txt');
      console.log('✅ 测试文件已批量删除');
    } catch (err) {
      console.warn('删除文件失败：', err.message);
    }

    await uos.closeCurrentWindow();
  });

  afterAll(async ({ system, uos }) => {
    console.log('4. afterAll: 全部清理');
    await common.closeFileManager(system);
    await common.clearEnvironment(system);
    await uos.showDesktop();
  });
});