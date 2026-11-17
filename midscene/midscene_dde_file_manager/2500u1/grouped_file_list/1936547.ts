/**
 * 用例 PMSID: 1936547
 * 用例标题: 【文件列表支持分组】保险箱进行分组
 * 生成时间: 2026-07-14
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const username = process.env.TEST_USERNAME || 'uos';
const vaultPath = `/home/${username}/.config/Vault/vault_unlocked`;

describe('1936547-【文件列表支持分组】保险箱进行分组', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    const { clearEnvironment, closeFileManager, rmVault, createNoPasswordVault } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并恢复环境
    console.log('准备步骤: 关闭文管并恢复环境');
    await closeFileManager(system);
    await clearEnvironment(system);

    // 删除旧保险箱，确保环境干净
    console.log('准备步骤: 删除旧保险箱');
    await rmVault(system);

    // 创建透明加密保险箱
    console.log('准备步骤: 创建透明加密保险箱');
    await createNoPasswordVault(uos, env, agent, device, system);

    // 打开文件管理器并全屏
    console.log('准备步骤: 打开文件管理器并全屏');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器窗口已打开');

    // 导航到保险箱
    console.log('准备步骤: 导航到保险箱');
    await agent.aiTap('侧边栏中的保险箱');
    await agent.aiWaitFor('左侧边栏显示当前目录为保险箱');
    console.log('已进入保险箱');
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    const { createGroupedFileListTestFiles } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 创建保险箱分组测试文件（通过公共方法，按时间组设置系统时间）
    console.log('准备步骤: 创建保险箱分组测试文件');
    await createGroupedFileListTestFiles(system, vaultPath);
  });

  test('1936547-【文件列表支持分组】保险箱进行分组', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤 1：检查文件列表默认分组状态
    // ============================================================
    console.log('===== 步骤1：检查文件列表默认分组状态 =====');
    await agent.aiWaitFor('保险箱内文件列表已显示', { timeout: 5000 });
    await agent.aiAssert('保险箱中的文件未分组显示，所有文件平铺展示');

    // ============================================================
    // 步骤 2：按名称分组
    // ============================================================
    console.log('===== 步骤2：右键 → 分组方式 → 名称 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的名称选项', { deepThink: true });
    await agent.aiWaitFor('文件按名称分组显示', { timeout: 10000, checkIntervalMs: 2000 });

    // 预期：文件按名称首字母分组，A-H 和 I-P 两组
    console.log('预期：文件按名称首字母分组');
    await agent.aiAssert('保险箱中显示A-H名称分组');
    await agent.aiAssert('保险箱中显示I-P名称分组');

    // ============================================================
    // 步骤 3：按创建时间分组
    // ============================================================
    console.log('===== 步骤3：右键 → 分组方式 → 创建时间 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的创建时间选项', { deepThink: true });

    // 预期：文件按创建时间分组
    console.log('预期：文件按创建时间分组');
    await agent.aiAssert('保险箱中文件被分到更早分组下');

    // ============================================================
    // 步骤 4：按大小分组
    // ============================================================
    console.log('===== 步骤4：右键 → 分组方式 → 大小 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的大小选项', { deepThink: true });
    await agent.aiWaitFor('文件按大小分组显示', { timeout: 10000, checkIntervalMs: 2000 });

    // 预期：文件按大小分组
    console.log('预期：文件按大小分组');
    await agent.aiAssert('保险箱中文件按大小区间进行了分组');

    // ============================================================
    // 步骤 5：按类型分组
    // ============================================================
    console.log('===== 步骤5：右键 → 分组方式 → 类型 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的类型选项', { deepThink: true });
    await agent.aiWaitFor('文件按类型分组显示', { timeout: 10000, checkIntervalMs: 2000 });

    // 预期：文件按类型分组（目录、文档、图片、影片、音乐、压缩文件等）
    console.log('预期：文件按类型分组');
    await agent.aiAssert('保险箱中文件按类型进行了分组');
    await agent.aiAssert('保险箱中显示目录分组');
    await agent.aiAssert('保险箱中显示文档分组或文本文档分组');

    // ============================================================
    // 步骤 6：按修改时间分组
    // ============================================================
    console.log('===== 步骤6：右键 → 分组方式 → 修改时间 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的修改时间选项', { deepThink: true });
    await agent.aiWaitFor('文件按修改时间分组显示');

    // 预期：文件按修改时间分组
    console.log('预期：文件按修改时间分组');
    await agent.aiAssert('保险箱中文件按修改时间进行了分组');

    // ============================================================
    // 步骤 7：全选所有文件并删除，验证分组状态变化
    // ============================================================
    console.log('===== 步骤7：Ctrl+A 全选所有文件并删除 =====');
    await device.pressKey('Ctrl+A');

    // 键盘输入Delete键
    await device.pressKey('Delete');
    await agent.aiWaitFor('删除确认对话框已显示', { timeout: 5000 });
    await agent.aiTap('删除按钮');
    await agent.aiWaitFor('删除操作已完成', { timeout: 10000 });

    // 预期：所有文件删除后，分组标题均不显示
    console.log('预期：所有文件删除后，分组标题均不显示');
    await agent.aiAssert('保险箱内没有任何分组标题显示');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 800000, tags: ['1936547', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理保险箱内测试文件
    await system.exec(`rm -rf ${vaultPath}/*`, 500);

    // 释放所有按键
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, uos, agent, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭可能的右键菜单
    await device.pressKey('Esc');

    // 删除保险箱
    const { rmVault, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await rmVault(system);

    // 关闭文管
    await closeFileManager(system);
    await uos.showDesktop();
  });
});