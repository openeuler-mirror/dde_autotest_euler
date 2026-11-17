/**
 * 用例 PMSID: 2001997
 * 用例标题: 【图片文本内容搜索】索引更新失败UI检查
 * 生成时间: 2026-08-26
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const indexStatusFile = `~/.local/share/deepin/dde-file-manager/ocrtext-index/index_status.json`;
const textIndexService = 'deepin-service-plugin@org.deepin.Filemanager.TextIndex.service';

describe('2001997-【图片文本内容搜索】索引更新失败UI检查', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 前置条件 - 打开文管设置界面，点击侧边栏的搜索');

    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    await closeFileManager(system);
    await clearEnvironment(system);

    // 打开文件管理器并全屏
    console.log('准备步骤: 打开文件管理器并全屏');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');
  });

  test('2001997-【图片文本内容搜索】索引更新失败UI检查', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：删除 index_status.json 后关闭设置再打开，检查索引更新失败
    // ============================================================
    console.log('===== 步骤1：删除 index_status.json，关闭设置再打开，检查索引更新失败 =====');

    // 停掉 TextIndex 服务，防止其检测到状态文件缺失后自动进入"更新中"
    console.log('操作步骤: 停止 TextIndex 服务');
    await system.exec(`systemctl --user stop ${textIndexService}`, 1000);

    // 删除索引状态文件，触发索引更新失败
    console.log('操作步骤: 删除 index_status.json');
    await system.exec(`rm ${indexStatusFile}`);


    // 打开文管设置 → 搜索
    console.log('操作步骤: 打开设置 → 搜索');
    await agent.aiTap('文件管理器窗口右上角主菜单按钮', { deepThink: true });
    await agent.aiTap('设置');
    await agent.aiScroll('"侧边栏显示项目"选项', { direction: 'down', distance: 10 });
    await agent.aiTap('文管设置界面上的搜索，不是文管窗口右上角的搜索');

    console.log('预期1：更新失败，有文案提示"索引更新失败，请尝试重新更新索引"');
    await agent.aiWaitFor('“图片文本内容搜索”下方显示"索引更新失败，请尝试重新更新索引"提示', { timeoutMs: 30000 });

    // ============================================================
    // 步骤2：点击"重新更新索引"按钮，检查索引是否更新成功
    // ============================================================
    console.log('===== 步骤2：点击"重新更新索引"，检查索引更新成功 =====');

    // 启动 TextIndex 服务，使"重新更新索引"可正常执行
    console.log('操作步骤: 启动 TextIndex 服务');
    await system.exec(`systemctl --user start ${textIndexService}`, 1000);

    console.log('操作步骤: 点击"重新更新索引"按钮');
    await agent.aiTap('图片文本内容搜索右下方的重新更新索引');

    console.log('预期2：更新成功，出现"索引更新完成"提示');
    // 图片文本内容索引更新耗时较长，等待最长10分钟
    await agent.aiWaitFor('“图片文本内容搜索”下方显示"索引更新完成"提示', { timeoutMs: 600000});

    console.log('===== 测试全部通过 =====');
  }, { timeout: 1800000, tags: ['2001997', 'level3', 'image_content_search', 'DITT', 'yangtong'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 说明：步骤2 更新成功后系统自动重建 index_status.json，无需手动恢复；
    // index_status.json 为系统索引状态文件，非测试素材，不按素材清理规则处理
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
