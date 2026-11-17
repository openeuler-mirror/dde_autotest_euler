/**
 * 用例 PMSID: 2001995
 * 用例标题: 【图片文本内容搜索】索引各个状态UI检查
 * 生成时间: 2026-08-26
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;

describe('2001995-【图片文本内容搜索】索引各个状态UI检查', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 前置条件 - 打开文管（不调用更新索引公共方法，本用例步骤2-4自行勾选/更新）');

    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    await closeFileManager(system);
    await clearEnvironment(system);

    // 只打开一次文件管理器并全屏
    console.log('准备步骤: 打开文件管理器并全屏');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');
  });

  test('2001995-【图片文本内容搜索】索引各个状态UI检查', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：打开文管设置->搜索，检查图片文本内容搜索不勾选时文案提示
    // ============================================================
    console.log('===== 步骤1：打开设置->搜索，检查不勾选时文案提示 =====');

    // 打开文管设置 → 搜索
    console.log('操作步骤: 打开设置 → 搜索');
    await agent.aiTap('文件管理器窗口右上角主菜单按钮', { deepThink: true });
    await agent.aiWaitFor('主菜单已打开', { timeoutMs: 3000 });
    await agent.aiTap('设置');
    await agent.aiWaitFor('设置界面已打开', { timeoutMs: 5000 });
    await agent.aiScroll('"侧边栏显示项目"选项', { direction: 'down', distance: 10 });
    await agent.aiTap('文管设置界面上的搜索，不是文管窗口右上角的搜索');
    await agent.aiWaitFor('搜索设置已打开', { timeoutMs: 3000 });

    // 检查"图片文本内容搜索"是否已勾选；已勾选则先取消勾选，未勾选则直接继续
    console.log('操作步骤: 检查图片文本内容搜索勾选状态');
    const isChecked = await agent.aiBoolean('图片文本内容搜索选项前的方框为勾选状态');
    if (isChecked) {
      console.log('图片文本内容搜索已勾选，点击取消勾选');
      await agent.aiTap('图片文本内容搜索选项左侧的勾选框', { deepThink: true });
      await agent.aiWaitFor('图片文本内容搜索选项已变为未勾选状态', { timeoutMs: 3000 });
    } else {
      console.log('图片文本内容搜索未勾选，直接继续');
    }

    console.log('预期1：未勾选时文案为"开启后支持搜索图片中的文本内容"');
    await agent.aiAssert('图片文本内容搜索下方的文案为"开启后支持搜索图片中的文本内容"');

    // ============================================================
    // 步骤2：勾选图片文本内容搜索，检查索引更新过程中状态
    // ============================================================
    console.log('===== 步骤2：勾选图片文本内容搜索，检查更新中状态 =====');

    console.log('操作步骤: 勾选图片文本内容搜索');
    await system.exec('rm -rf ~/.local/share/deepin/dde-file-manager/ocrtext-index');
    await agent.aiTap('图片文本内容搜索选项左侧的勾选框', { deepThink: true });

    console.log('预期2：索引更新过程中显示Loading动效与"正在更新索引"提示，显示已索引文件数量');
    // 勾选后索引更新开始，"正在更新索引"为瞬态，用 aiAsyncAssert 多次检查捕捉
    await agent.aiAsyncAssert('索引更新过程中显示Loading动效与"正在更新索引"提示', {
      startCount: 8,
      intervalMs: 100,
    });
    // ============================================================
    // 步骤3：等待索引更新完成后，检查文案与按钮
    // ============================================================
    console.log('===== 步骤3：等待索引更新完成，检查文案与按钮 =====');

    console.log('预期3：文案为"图片文本内容索引更新完成，上次更新时间：yyyy-mm-dd xx:xx:xx"，且有重新更新索引按钮');
    // 索引更新耗时较长，等待最长10分钟出现更新完成文案
    await agent.aiWaitFor('"图片文本内容搜索"下方显示"索引更新完成，上次更新时间"文案', {timeoutMs: 600000 });
    // 与用户确认："立即更新索引"与"重新更新索引"为同一按钮，文案为"重新更新索引"
    await agent.aiAssert('“图片文本内容搜索”右下角存在"立即更新索引"按钮');

    // ============================================================
    // 步骤4：点击"重新更新索引"按钮，检查索引是否更新成功
    // ============================================================
    console.log('===== 步骤4：点击"重新更新索引"，检查索引更新成功 =====');

    console.log('操作步骤: 点击"立即更新索引"按钮');
    await agent.aiTap('图片文本内容搜索右下方的立即更新索引');

    console.log('预期4：更新成功，出现"索引更新完成"提示');
    // 图片文本内容索引更新耗时较长，等待最长10分钟
    await agent.aiWaitFor('"图片文本内容搜索"下方显示"索引更新完成"提示', { timeoutMs: 600000 });

    // ============================================================
    // 步骤5：不勾选图片文本内容搜索，文管搜索栏输入图片文本内容，检查无法搜索到
    // ============================================================
    console.log('===== 步骤5：不勾选图片文本内容搜索，搜索图片文本内容，检查无法搜索到 =====');

    console.log('操作步骤: 取消勾选图片文本内容搜索');
    await agent.aiTap('图片文本内容搜索选项左侧的勾选框', { deepThink: true });
    await agent.aiWaitFor('图片文本内容搜索选项已变为未勾选状态', { timeoutMs: 3000 });

    // 关闭设置窗口，回到文管主界面
    console.log('操作步骤: 关闭设置窗口');
    await device.pressKey('Alt+F4');
    await agent.aiWaitFor('设置窗口已关闭', { timeoutMs: 3000 });

    // 不导航素材目录，默认界面 Ctrl+F 打开搜索框，输入 BA.bmp 的 OCR 文本"石鼓寺"
    console.log('操作步骤: Ctrl+F 打开搜索框');
    await device.pressKey('Ctrl+F');
    await agent.aiWaitFor('搜索框已激活', { timeoutMs: 3000 });

    console.log('操作步骤: 输入搜索内容"石鼓寺"');
    await device.typeText('石鼓寺');
    // 图片文本内容搜索耗时较长，等待搜索结果加载（最长10分钟）
    await agent.aiWaitFor('搜索结果已加载', { timeoutMs: 600000 });

    console.log('预期5：无法搜索到对应的图片');
    await agent.aiAssert('搜索结果中未显示BA.bmp图片，无法搜索到对应的图片');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 1800000, tags: ['2001995', 'level3', 'image_content_search', 'DITT', 'yangtong'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 本用例未复制任何素材副本，无需删除素材；直接关闭文管并清理环境
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
