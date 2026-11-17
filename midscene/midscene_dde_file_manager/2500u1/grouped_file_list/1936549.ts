/**
 * 用例 PMSID: 1936549
 * 用例标题: 【文件列表支持分组】用户创建的快捷访问目录进行分组
 * 生成时间: 2026-07-16
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const quickAccessDir = '~/Music/1936549';

describe('1936549-【文件列表支持分组】用户创建的快捷访问目录进行分组', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);

    // 创建快捷访问目录
    console.log('准备步骤: 创建快捷访问目录');
    await system.exec(`mkdir -p ${quickAccessDir}`, 500);

    // 打开文件管理器并全屏
    console.log('准备步骤: 打开文件管理器并全屏');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');

    // 导航到音乐目录
    console.log('准备步骤: 导航到音乐目录');
    await agent.aiTap('文件管理器左侧栏的音乐目录');
    await agent.aiWaitFor('音乐目录已打开', { timeout: 5000 });

    // 右键目标目录，添加到快捷访问
    console.log('准备步骤: 添加到快捷访问');
    await agent.aiRightClick('1936549目录');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('添加到快捷访问');
    await agent.aiWaitFor('快捷访问已添加', { timeout: 3000 });
    await agent.aiAssert('文件管理器侧边区域存在1936549目录');

    // 通过快捷访问进入目录
    console.log('准备步骤: 通过快捷访问进入目录');
    await agent.aiTap('文件管理器侧边栏中的1936549');
    await agent.aiWaitFor('已进入1936549目录', { timeout: 5000 });
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    const { createGroupedFileListTestFiles } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 创建分组测试文件
    console.log('准备步骤: 创建分组测试文件');
    await createGroupedFileListTestFiles(system, quickAccessDir);
  });

  test('1936549-【文件列表支持分组】用户创建的快捷访问目录进行分组', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤 1：检查文件列表默认分组状态
    // ============================================================
    console.log('===== 步骤1：检查文件列表默认分组状态 =====');
    await agent.aiWaitFor('目录内文件列表已显示', { timeout: 5000 });
    await agent.aiAssert('目录中的文件未分组显示，所有文件平铺展示');

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

    // 预期：文件按名称首字母分组
    console.log('预期：文件按名称首字母分组');
    await agent.aiAssert('目录中显示A-H名称分组');
    await agent.aiAssert('目录中显示I-P名称分组');

    // ============================================================
    // 步骤 3：按创建时间分组
    // ============================================================
    console.log('===== 步骤3：右键 → 分组方式 → 创建时间 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的创建时间选项', { deepThink: true });
    await agent.aiWaitFor('文件按创建时间分组显示', { timeout: 10000, checkIntervalMs: 2000 });

    // 预期：文件按创建时间分组
    console.log('预期：文件按创建时间分组');
    await agent.aiAssert('目录中文件按创建时间进行了分组');

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
    await agent.aiAssert('目录中文件按大小区间进行了分组');

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

    // 预期：文件按类型分组
    console.log('预期：文件按类型分组');
    await agent.aiAssert('目录中文件按类型进行了分组');
    await agent.aiAssert('目录中显示目录分组');
    await agent.aiAssert('目录中显示文档分组或文本文档分组');

    // ============================================================
    // 步骤 6：按修改时间分组
    // ============================================================
    console.log('===== 步骤6：右键 → 分组方式 → 修改时间 =====');
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的修改时间选项', { deepThink: true });
    await agent.aiWaitFor('文件按修改时间分组显示', { timeout: 10000, checkIntervalMs: 2000 });

    // 预期：文件按修改时间分组
    console.log('预期：文件按修改时间分组');
    await agent.aiAssert('目录中文件按修改时间进行了分组');

    // ============================================================
    // 步骤 7：进入源目录，取消分组，检查快捷访问目录中是否也取消分组
    // ============================================================
    console.log('===== 步骤7：进入源目录，取消分组，检查快捷访问同步 =====');
    // 进入源目录（音乐目录下的1936549）
    await agent.aiTap('文件管理器左侧栏的音乐目录');
    await agent.aiWaitFor('音乐目录已打开', { timeout: 5000 });
    await agent.aiDoubleClick('1936549目录');
    await agent.aiWaitFor('已进入1936549目录', { timeout: 5000 });

    // 取消分组（选择"无"）
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的无选项', { deepThink: true });
    await agent.aiWaitFor('分组已取消', { timeout: 5000 });

    // 通过快捷访问进入同一目录，验证分组也已取消
    await agent.aiTap('文件管理器侧边栏中的1936549');
    await agent.aiWaitFor('已进入1936549目录', { timeout: 5000 });
    await agent.aiAssert('目录中的文件未分组显示，所有文件平铺展示');

    // ============================================================
    // 步骤 8：按任意方式分组后，选中所有文件，删除所有文件，检查所有分组是否隐藏
    // ============================================================
    console.log('===== 步骤8：按类型分组，全选删除，验证分组隐藏 =====');
    // 先按类型分组
    await agent.aiRightClick('文件管理器右侧空白区域中间位置');
    await agent.aiWaitFor('右键菜单已显示');
    await agent.aiTap('分组方式', { deepThink: true });
    await agent.aiWaitFor('分组方式子菜单已显示');
    await agent.aiTap('分组方式文本右下侧的子菜单中的类型选项', { deepThink: true });
    await agent.aiWaitFor('文件按类型分组显示', { timeout: 10000, checkIntervalMs: 2000 });
    await agent.aiTap('右侧文件区域中间区域的空白处');
    // 全选所有文件
    await device.pressKey('Ctrl+A');
    await agent.aiWaitFor('目录中文件已被选中', { timeout: 3000 });

    // 右键菜单删除
    await device.pressKey('Delete');
    await new Promise(r => setTimeout(r, 1000));

    // 预期：所有文件删除后，分组标题均不显示
    console.log('预期：所有文件删除后，分组标题均不显示');
    await agent.aiAssert('右侧目录内没有任何分组标题显示');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 800000, tags: ['1936549', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理快捷访问目录中的测试文件
    await system.exec(`rm -rf ${quickAccessDir}/*`, 500);

    // 释放所有按键
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, uos, agent, system }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭可能的右键菜单
    await device.pressKey('Esc');

    // 从快捷访问移除
    try {
      await agent.aiRightClick('文件管理器侧边栏中的1936549');
      await agent.aiWaitFor('右键菜单已显示', { timeout: 3000 });
      await agent.aiTap('从快捷访问移除');
      console.log('快捷访问已移除');
    } catch (error) {
      console.log('快捷访问移除失败或不存在');
    }

    // 删除快捷访问目录
    await system.exec(`rm -rf ${quickAccessDir}`, 500);

    const { closeFileManager, clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });
});