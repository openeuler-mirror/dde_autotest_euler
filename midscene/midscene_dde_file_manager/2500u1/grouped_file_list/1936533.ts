/**
 * 用例 PMSID: 1936533
 * 用例标题: 【文件列表支持分组】对SMB目录进行分组
 * 生成时间: 2026-07-14
 * 用例编写人: UT006252（杨通）
 */

const caseDir = process.env.TESTCASE_DIR;
const username = process.env.TEST_USERNAME;
const smbIp = process.env.SMB_IP;
const smbDir = process.env.SMB_DIR;
const smbMountPath = `/media/${username}/smbmounts/smb-share:server=${smbIp},share=${smbDir}`;

describe('1936533-【文件列表支持分组】对SMB目录进行分组', () => {
  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    const { clearEnvironment, closeFileManager, SmbMount, cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 关闭文管并清理环境
    console.log('准备步骤: 关闭文管并恢复环境');
    await closeFileManager(system);
    await clearEnvironment(system);

    // 打开文件管理器
    console.log('准备步骤: 打开文件管理器');
    await uos.openApp('文件管理器', 3000, 20000, true);
    await agent.aiWaitFor('文件管理器界面已显示');

    // 前置清理：卸载已有 SMB 挂载（需要在文管打开后进行）
    console.log('准备步骤: 前置清理 SMB 挂载');
    await cleanSmbMounts(agent, system);

    // 挂载 SMB（用户名+密码模式）
    console.log('准备步骤: 挂载 SMB 共享目录');
    await SmbMount(agent, system, device, 1);
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');

    const { createGroupedFileListTestFiles } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 清理 SMB 共享目录中的旧文件
    console.log('清理步骤: 清理 SMB 共享目录旧文件');
    await system.exec(`rm -rf "${smbMountPath}"/*`, 1000);

    // 创建分组测试文件（通过公共方法，按时间组设置系统时间）
    console.log('准备步骤: 在 SMB 共享目录创建分组测试文件');
    await createGroupedFileListTestFiles(system, smbMountPath);

  });

  test('1936533-【文件列表支持分组】对SMB目录进行分组', async ({ device, agent, uos, system }) => {
    // ============================================================
    // 步骤 1：SMB 服务器首页分组状态验证
    // ============================================================
    console.log('===== 步骤1：点击左侧栏 SMB IP 查看首页分组状态 =====');
    await agent.aiTap(`左侧边栏中的${smbIp}地址`);
    await agent.aiWaitFor('SMB服务器首页已显示', { timeout: 5000 });
    await agent.aiAssert('SMB服务器首页未分组显示，所有文件平铺展示');
    console.log('预期1：SMB服务器首页未分组显示');

    // 点击进入共享目录
    console.log('点击进入共享目录');
    await agent.aiDoubleClick(`${smbDir}目录图标正中央`);
    await agent.aiWaitFor('SMB共享目录已打开', { timeout: 10000 });
    await agent.aiAssert('SMB共享目录中的文件未分组显示，所有文件平铺展示');
    console.log('预期2：进入共享目录后，默认视图未启用任何分组功能');

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
    await agent.aiAssert('SMB共享目录中显示A-H名称分组');
    await agent.aiAssert('SMB共享目录中显示I-P名称分组');

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
    await agent.aiAssert('SMB共享目录中文件按创建时间进行了分组');

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
    await agent.aiAssert('SMB共享目录中文件按大小区间进行了分组');

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
    await agent.aiAssert('SMB共享目录中文件按类型进行了分组');
    await agent.aiAssert('SMB共享目录中显示目录分组');
    await agent.aiAssert('SMB共享目录中显示文档分组或文本文档分组');

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
    await agent.aiAssert('SMB共享目录中文件按修改时间进行了分组');

    // ============================================================
    // 步骤 7：全选所有文件并删除，验证分组状态变化
    // ============================================================
    console.log('===== 步骤7：Ctrl+A 全选所有文件并删除 =====');
    await device.pressKey('Ctrl+A');

    // 右键菜单删除
    await device.pressKey('Delete');
    await agent.aiWaitFor('删除确认对话框已显示', { timeout: 5000 });
    await agent.aiTap('删除按钮');
    await agent.aiWaitFor('删除操作已完成', { timeout: 10000 });

    // 预期：所有文件删除后，分组标题均不显示
    console.log('预期：所有文件删除后，分组标题均不显示');
    await agent.aiAssert('SMB共享目录内没有任何分组标题显示');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 800000, tags: ['1936533', 'level3', 'grouped_file_list', 'DITT', 'yangtong'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');

    // 清理 SMB 共享目录内测试文件
    await system.exec(`rm -rf "${smbMountPath}"/*`, 1000);

    // 释放所有按键
    await device.releaseAllKeys();
  });

  afterAll(async ({ device, uos, agent, system, env }) => {
    console.log('5. afterAll: 清理测试套件');

    // 关闭可能的右键菜单
    await device.pressKey('Esc');

    const { closeFileManager, clearEnvironment, cleanSmbMounts } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 后置清理：卸载 SMB
    console.log('清理步骤: 卸载 SMB');
    await cleanSmbMounts(agent, system, 1);

    // 关闭文管
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
  });
});