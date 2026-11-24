/**
 * 用例 PMSID: 1583533
 * 用例标题: 【搜索设置】路径黑名单-添加重复路径
 * 前置条件：搜索设置-路径黑名单中不存在待添加的测试路径（本用例 beforeAll 自动清空）
 * 操作步骤：搜索设置-索引-路径黑名单添加路径 A → 添加路径 B → 再次添加同一路径 A → 查看列表
 * 预期结果：列表中路径 A 仅保留一条，且位置移动到列表末尾（重复添加时原记录被移除）
 * 用例编写人: UT005045（许琪）
 * 生成时间: 2026-11-11
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

// A：重复添加的目标路径；B：插入 A 与"A 重新添加"之间的路径，用于验证 A 被移动到末尾
const DIR_A = `${TEST_HOME}/1583533_dup_a`;
const DIR_B = `${TEST_HOME}/1583533_dup_b`;
const NAME_A = '1583533_dup_a';
const NAME_B = '1583533_dup_b';

describe('1583533-【搜索设置】路径黑名单-添加重复路径', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 清空黑名单并创建测试目录');
    const { clearEnvironment, closeFileManager, closeGrandSearchSettings, resetGrandSearchBlacklist } = await import(
      `${caseDir}midscene_dde_file_manager/common/common.ts`
    );
    await closeFileManager(system);
    await clearEnvironment(system);
    // 面板打开时守护进程会回写配置，必须先关闭面板再改配置
    await closeGrandSearchSettings(system);
    await resetGrandSearchBlacklist(system);
    await system.exec(`rm -rf "${DIR_A}" "${DIR_B}" && mkdir -p "${DIR_A}" "${DIR_B}"`, 15000);
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保无残留菜单/面板');
    await device.pressKey('Escape');
    await device.pressKey('Escape');
  });

  test(
    '1583533-【搜索设置】路径黑名单-添加重复路径',
    async ({ device, agent, system }) => {
      const {
        openGrandSearchSettings,
        revealGrandSearchBlacklist,
        addBlacklistPathViaDialog,
        getGrandSearchBlacklistPaths,
      } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

      console.log('===== 步骤1：打开设置并滚动到"索引-路径黑名单" =====');
      await openGrandSearchSettings(device, agent, system);
      await revealGrandSearchBlacklist(system);
      const emptyPaths = await getGrandSearchBlacklistPaths(system);
      if (emptyPaths.length !== 0) {
        throw new Error(`前置条件不满足：黑名单应为空，实际 ${JSON.stringify(emptyPaths)}`);
      }
      await agent.aiAssert('设置面板中"索引"分组下的"路径黑名单"区域可见，列表当前为空');

      console.log('===== 步骤2：第一次添加路径 A =====');
      if (!(await addBlacklistPathViaDialog(system, DIR_A))) {
        throw new Error(`添加路径失败：${DIR_A}`);
      }
      let paths = await getGrandSearchBlacklistPaths(system);
      console.log(`添加 A 后黑名单 = ${JSON.stringify(paths)}`);
      if (paths.filter((p) => p === DIR_A).length !== 1) {
        throw new Error(`断言失败：路径 A 未正确写入配置，实际 ${JSON.stringify(paths)}`);
      }
      await revealGrandSearchBlacklist(system);
      await agent.aiAssert(`路径黑名单列表中显示"${NAME_A}"这一条记录`);

      console.log('===== 步骤3：添加路径 B（用于验证 A 重新添加后移动到末尾） =====');
      if (!(await addBlacklistPathViaDialog(system, DIR_B))) {
        throw new Error(`添加路径失败：${DIR_B}`);
      }
      paths = await getGrandSearchBlacklistPaths(system);
      console.log(`添加 B 后黑名单 = ${JSON.stringify(paths)}`);
      if (!(paths.includes(DIR_A) && paths.includes(DIR_B))) {
        throw new Error(`断言失败：添加 B 后两条路径未同时存在，实际 ${JSON.stringify(paths)}`);
      }

      console.log('===== 步骤4：第二次添加同一路径 A =====');
      if (!(await addBlacklistPathViaDialog(system, DIR_A))) {
        throw new Error(`重复添加路径失败：${DIR_A}`);
      }
      // 等待守护进程回写配置
      await sleep(1500);
      paths = await getGrandSearchBlacklistPaths(system);
      console.log(`重复添加 A 后黑名单 = ${JSON.stringify(paths)}`);

      console.log('===== 步骤5：校验 A 仅保留一条且位于列表末尾 =====');
      const countA = paths.filter((p) => p === DIR_A).length;
      if (countA !== 1) {
        await agent.logScreenshot('1583533-重复路径未合并');
        throw new Error(`断言失败：路径黑名单中 A 出现 ${countA} 条，预期 1 条，实际 ${JSON.stringify(paths)}`);
      }
      if (!paths.includes(DIR_B)) {
        throw new Error(`断言失败：路径 B 被误删除，实际 ${JSON.stringify(paths)}`);
      }
      if (paths[paths.length - 1] !== DIR_A) {
        await agent.logScreenshot('1583533-重复路径未移动到末尾');
        throw new Error(`断言失败：重复添加后 A 未移动到末尾，实际顺序 ${JSON.stringify(paths)}`);
      }
      await revealGrandSearchBlacklist(system);
      await agent.aiAssert(`路径黑名单列表中"${NAME_A}"只出现一条记录，且位于列表最后一行（"${NAME_B}"在上方）`);

      console.log('===== 测试全部通过 =====');
    },
    { timeout: 480000, tags: ['1583533', 'level3', 'grand_search', 'xuqi'] }
  );

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 关闭设置面板');
    const { closeGrandSearch } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeGrandSearch(device, agent, system);
  });

  afterAll(async ({ device, agent, system }) => {
    console.log('5. afterAll: 清空黑名单、删除测试目录并清理环境');
    const { clearEnvironment, closeFileManager, closeGrandSearchSettings, resetGrandSearchBlacklist } = await import(
      `${caseDir}midscene_dde_file_manager/common/common.ts`
    );
    await closeGrandSearchSettings(system);
    await resetGrandSearchBlacklist(system);
    await system.exec(`rm -rf "${DIR_A}" "${DIR_B}"`, 15000);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
