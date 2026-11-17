/**
 * 用例 PMSID: 1936489
 * 用例标题: 【文件列表支持分组】对系统目录下的隐藏文件分组
 * 生成时间: 2026-08-25
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('1936489-【文件列表支持分组】对系统目录下的隐藏文件分组', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 前置条件 - 清理环境并打开文件管理器');

    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    await closeFileManager(system);
    await clearEnvironment(system);

    // 打开文件管理器并全屏
    console.log('准备步骤: 打开文件管理器并全屏');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    // 通过地址栏进入 /etc 系统目录
    console.log('准备步骤: 通过地址栏进入 /etc 目录');
    await device.pressKey('Ctrl', 'l');
    await agent.aiWaitFor('地址栏已激活');
    await device.pressKey('Ctrl', 'a');
    await agent.aiWaitFor('地址栏内容被全选');
    await device.pressKey('Backspace');
    await device.typeText('/etc', true);
    await device.pressKey('Enter');
    await agent.aiWaitFor('/etc目录已打开', { timeout: 10000 });
  });

  test('1936489-【文件列表支持分组】对系统目录下的隐藏文件分组', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤1：通过右键设置分组方式为无，检查未分组
    // ============================================================
    console.log('===== 步骤1：设置分组方式为无，检查未分组 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的无选项', { deepThink: true });
    await agent.aiWaitFor('/etc目录中的文件未分组显示，所有文件平铺展示', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期1：未启用分组，所有文件平铺展示');

    // ============================================================
    // 步骤2：通过右键设置分组方式为名称，检查按名称分组
    // ============================================================
    console.log('===== 步骤2：设置分组方式为名称，检查按名称分组 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的名称选项', { deepThink: true });
    await agent.aiWaitFor('/etc目录中的文件按名称分组显示', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期2：能够按照名称正确分组');

    // ============================================================
    // 步骤3：通过右键设置分组方式为修改时间，检查按修改时间分组
    // ============================================================
    console.log('===== 步骤3：设置分组方式为修改时间，检查按修改时间分组 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的修改时间选项', { deepThink: true });
    await agent.aiWaitFor('/etc目录中的文件按修改时间分组显示', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期3：能够按照修改时间正确分组');

    // ============================================================
    // 步骤4：通过右键设置分组方式为创建时间，检查按创建时间分组
    // ============================================================
    console.log('===== 步骤4：设置分组方式为创建时间，检查按创建时间分组 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的创建时间选项', { deepThink: true });
    await agent.aiWaitFor('/etc目录中显示今天或者昨天的分组标题', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期4：能够按照创建时间正确分组');

    //============================================================
    // 步骤5：通过右键设置分组方式为大小，检查按大小分组
    // ============================================================
    console.log('===== 步骤5：设置分组方式为大小，检查按大小分组 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的大小选项', { deepThink: true });
    await agent.aiWaitFor('/etc目录中显示"未知"分组标题', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期5：能够按照大小正确分组');



    // ============================================================
    // 步骤6：通过右键设置分组方式为类型，检查按类型分组
    // ============================================================
    console.log('===== 步骤6：设置分组方式为类型，检查按类型分组 =====');
    await agent.aiTap('右上角搜索框左侧的紧挨着的下拉菜单的箭头', { deepThink: true });
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('"分组方式"文本左下侧的子菜单中的类型选项', { deepThink: true });
    await agent.aiWaitFor('/etc目录中显示"目录"分组标题', { timeout: 10000, checkIntervalMs: 2000 });
    console.log('预期6：能够按照类型正确分组');



    // ============================================================
    // 步骤7：类型分组下验证隐藏文件被正确分组
    // ============================================================
    console.log('===== 步骤7：类型分组下验证隐藏文件分组 =====');

    // 双击"目录"分组标题将其折叠，使下方"文档"分组及其文件数可见
    console.log('双击目录分组标题将其折叠');
    await agent.aiDoubleClick('目录分组标题', 1000);
    await agent.aiWaitFor('页面不显示apt目录', { timeout: 5000 });

    // 记录显示隐藏文件前"文档"分组的文件数
    console.log('记录显示隐藏文件前文档分组的文件数');
    const docCountBeforeRaw = await agent.aiQuery('文件管理器内容区域中“文档”分组标题上显示的文件数量，只返回一个数字');
    const docCountBefore = parseInt(String(docCountBeforeRaw ?? '').replace(/\D+/g, ''), 10);
    console.log(`显示隐藏文件前文档分组文件数: ${docCountBefore}`);

    // 按 Ctrl+H 显示隐藏文件
    console.log('按 Ctrl+H 显示隐藏文件');
    await device.pressKey('Ctrl+H');

    // 再次记录"文档"分组的文件数
    console.log('再次记录文档分组的文件数');
    const docCountAfterRaw = await agent.aiQuery('文件管理器内容区域中“文档”分组标题上显示的文件数量，只返回一个数字');
    const docCountAfter = parseInt(String(docCountAfterRaw ?? '').replace(/\D+/g, ''), 10);
    console.log(`显示隐藏文件后文档分组文件数: ${docCountAfter}`);

    // 比较两次数量，应不同（隐藏文件被正确归入对应分组）
    console.log('预期7：显示隐藏文件后，隐藏文件被正确分组，文档分组文件数发生变化');
    if (docCountBefore === docCountAfter) {
      throw new Error(`显示隐藏文件后文档分组文件数未变化: before=${docCountBefore}, after=${docCountAfter}`);
    }
    console.log('显示隐藏文件后，隐藏文件被正确归入对应分组');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 600000, tags: ['1936489', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 恢复隐藏文件隐藏状态（若测试中按了 Ctrl+H 显示隐藏文件）
    console.log('按 Ctrl+H 恢复隐藏文件隐藏状态');
    await device.pressKey('Ctrl+H');
    await sleep(1000);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });
});
