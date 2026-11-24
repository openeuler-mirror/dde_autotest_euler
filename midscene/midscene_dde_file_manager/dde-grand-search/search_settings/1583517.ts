/**
 * 用例 PMSID: 1583517
 * 用例标题: 【搜索设置】路径黑名单-选中单个路径删除
 * 前置条件：路径黑名单为空（本用例 beforeAll 清空配置）
 * 操作步骤：初始空列表查看"-" → 添加路径（原路径存在/不存在）→ 选中后点"-" → 取消 → 确认
 * 预期结果：空列表时"-"置灰无响应；点"-"弹移除提示；取消不删除；确认后路径被删除
 * 用例编写人: UT005045（许琪）
 * 生成时间: 2026-11-11
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

// A：原始路径存在；B：加入黑名单后删除磁盘目录，模拟"原始路径不存在"
const DIR_A = `${TEST_HOME}/1583517_exist`;
const DIR_B = `${TEST_HOME}/1583517_gone`;
const NAME_A = '1583517_exist';
const NAME_B = '1583517_gone';

describe('1583517-【搜索设置】路径黑名单-选中单个路径删除', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 清理环境、重置黑名单并创建两个测试目录');
    const { clearEnvironment, closeFileManager, closeGrandSearchSettings, resetGrandSearchBlacklist } = await import(
      `${caseDir}midscene_dde_file_manager/common/common.ts`
    );
    await closeFileManager(system);
    await clearEnvironment(system);
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
    '1583517-【搜索设置】路径黑名单-选中单个路径删除',
    async ({ device, agent, system }) => {
      const {
        openGrandSearchSettings,
        closeGrandSearchSettings,
        revealGrandSearchBlacklist,
        addBlacklistPathViaDialog,
        getGrandSearchBlacklistPaths,
        getBlacklistConfirmDialogGeometry,
        deleteBlacklistRow,
      } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

      console.log('===== 步骤1：初始空列表下"-"置灰，点击无响应 =====');
      await openGrandSearchSettings(device, agent, system);
      const geo = await revealGrandSearchBlacklist(system);
      const emptyPaths = await getGrandSearchBlacklistPaths(system);
      if (emptyPaths.length !== 0) {
        throw new Error(`前置条件不满足：黑名单应为空，实际 ${JSON.stringify(emptyPaths)}`);
      }
      await agent.aiAssert('路径黑名单列表为空，删除(-)按钮处于置灰不可用状态');
      // 客观校验：未选中任何条目时点击"-"不应弹出确认框
      await system.exec(
        `export DISPLAY=:0; export XAUTHORITY=${TEST_HOME}/.Xauthority; xdotool mousemove ${geo.x + 520} ${geo.y + 224}; xdotool click 1; sleep 1`,
        15000
      );
      if (await getBlacklistConfirmDialogGeometry(system)) {
        throw new Error('断言失败：黑名单为空时点击删除(-)仍弹出移除确认框');
      }
      console.log('空列表点击"-"无响应，符合置灰预期');

      console.log('===== 步骤2：分别添加原始路径存在/不存在的路径 =====');
      if (!(await addBlacklistPathViaDialog(system, DIR_A))) {
        throw new Error(`添加路径失败：${DIR_A}`);
      }
      if (!(await addBlacklistPathViaDialog(system, DIR_B))) {
        throw new Error(`添加路径失败：${DIR_B}`);
      }
      // 删除 B 的磁盘目录，使黑名单条目对应"原始路径不存在"
      await system.exec(`rm -rf "${DIR_B}"`, 15000);
      const twoPaths = await getGrandSearchBlacklistPaths(system);
      console.log(`添加后黑名单 = ${JSON.stringify(twoPaths)}`);
      if (!(twoPaths.includes(DIR_A) && twoPaths.includes(DIR_B))) {
        throw new Error(`断言失败：两条路径未全部写入配置，实际 ${JSON.stringify(twoPaths)}`);
      }
      await revealGrandSearchBlacklist(system);
      await agent.aiAssert(`路径黑名单列表中同时显示"${NAME_A}"和"${NAME_B}"两条路径`);

      console.log('===== 步骤3：选中第1条路径点"-"，在提示框点击"取消" =====');
      const cancelResult = await deleteBlacklistRow(system, 0, false);
      if (cancelResult !== 'cancel') {
        await agent.logScreenshot('1583517-未弹出移除提示框');
        throw new Error('断言失败：选中路径点击删除(-)后未弹出移除确认框');
      }
      if (await getBlacklistConfirmDialogGeometry(system)) {
        throw new Error('断言失败：点击"取消"后确认弹窗未消失');
      }
      const afterCancel = await getGrandSearchBlacklistPaths(system);
      console.log(`取消后黑名单 = ${JSON.stringify(afterCancel)}`);
      if (!(afterCancel.includes(DIR_A) && afterCancel.includes(DIR_B))) {
        throw new Error(`断言失败：点击取消后路径被删除，实际 ${JSON.stringify(afterCancel)}`);
      }
      await revealGrandSearchBlacklist(system);
      await agent.aiAssert(`路径黑名单列表中同时显示"${NAME_A}"和"${NAME_B}"两条路径`);

      console.log('===== 步骤4：选中第2条路径点"-"，在提示框点击"确定" =====');
      const okResult = await deleteBlacklistRow(system, 1, true);
      if (okResult !== 'ok') {
        throw new Error('断言失败：选中路径点击删除(-)后未弹出移除确认框');
      }
      const afterConfirm = await getGrandSearchBlacklistPaths(system);
      console.log(`确定后黑名单 = ${JSON.stringify(afterConfirm)}`);
      if (afterConfirm.includes(DIR_B)) {
        await agent.logScreenshot('1583517-确认后路径未删除');
        throw new Error(`断言失败：点击确定后 ${DIR_B} 仍在黑名单中`);
      }
      if (!afterConfirm.includes(DIR_A)) {
        throw new Error(`断言失败：未选中的路径 ${DIR_A} 被误删除`);
      }
      await revealGrandSearchBlacklist(system);
      await agent.aiAssert(`路径黑名单列表中已不显示"${NAME_B}"，仍显示"${NAME_A}"`);

      console.log('===== 测试全部通过 =====');
    },
    { timeout: 480000, tags: ['1583517', 'level2', 'grand_search', 'xuqi'] }
  );

  afterEach(async ({ device, agent, system }) => {
    console.log('3. afterEach: 关闭设置面板');
    const { closeGrandSearch } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeGrandSearch(device, agent, system);
  });

  afterAll(async ({ device, agent, system }) => {
    console.log('4. afterAll: 清空黑名单、删除测试目录并清理环境');
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
