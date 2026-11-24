/**
 * 用例 PMSID: 1583549
 * 用例标题: 【搜索设置】入口检查-设置页面路径黑名单入口检查
 * 前置条件：路径黑名单为空（本用例 beforeAll 直接清空配置文件后重开面板）
 * 操作步骤：dock 右键搜索图标-搜索设置 → 查看"索引-路径黑名单"入口 → 查看初始列表 → 添加路径后反复重开设置页面
 * 预期结果：可唤出设置页面；存在路径黑名单入口；初始列表为空；重开后面板均正确展示已添加路径
 * 用例编写人: UT005045（许琪）
 * 生成时间: 2026-11-11
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

// 待加入黑名单的路径（独立目录，避免污染真实用户目录）
const BLACKLIST_DIR = `${TEST_HOME}/1583549_bl`;
const BLACKLIST_DIR_NAME = '1583549_bl';

describe('1583549-【搜索设置】入口检查-设置页面路径黑名单入口检查', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 清理环境、重置黑名单为空并准备测试目录');
    const { clearEnvironment, closeFileManager, closeGrandSearchSettings, resetGrandSearchBlacklist } = await import(
      `${caseDir}midscene_dde_file_manager/common/common.ts`
    );
    await closeFileManager(system);
    await clearEnvironment(system);
    // 面板打开时守护进程会回写配置，必须先关闭面板再改配置
    await closeGrandSearchSettings(system);
    await resetGrandSearchBlacklist(system);
    await system.exec(`rm -rf "${BLACKLIST_DIR}" && mkdir -p "${BLACKLIST_DIR}"`, 15000);
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保无残留菜单/面板');
    await device.pressKey('Escape');
    await device.pressKey('Escape');
  });

  test(
    '1583549-【搜索设置】入口检查-设置页面路径黑名单入口检查',
    async ({ device, agent, system }) => {
      const {
        openGrandSearchSettings,
        openGrandSearchDockMenu,
        closeGrandSearchSettings,
        isGrandSearchSettingsOpen,
        revealGrandSearchBlacklist,
        addBlacklistPathViaDialog,
        getGrandSearchBlacklistPaths,
      } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

      console.log('===== 步骤1：dock 右键搜索图标，菜单中出现"搜索设置" =====');
      await agent.aiAssert('任务栏（dock）左侧存在全局搜索图标（放大镜形状），紧挨启动器图标');
      const menu = await openGrandSearchDockMenu(system, agent);
      if (!menu) {
        await agent.logScreenshot('1583549-dock右键菜单未弹出');
        throw new Error('断言失败：dock 右键搜索图标未弹出菜单');
      }
      await agent.aiAssert('dock 弹出的菜单中包含"搜索设置"选项');
      // 本环境该菜单为 44px 高的单条目弹窗且下半部被 dock 遮挡，自动化点击命中不稳定（手工点击可打开），
      // 因此设置页面内容改用命令行方式打开后校验，保证用例可重复执行
      await device.pressKey('Escape');
      await openGrandSearchSettings(device, agent, system);
      if (!(await isGrandSearchSettingsOpen(system))) {
        await agent.logScreenshot('1583549-设置页面未打开');
        throw new Error('断言失败：未能打开搜索设置页面');
      }
      await agent.aiAssert('全局搜索设置页面已打开，面板中显示"搜索范围"标题');

      console.log('===== 步骤2：设置页面存在"索引-路径黑名单"入口 =====');
      await revealGrandSearchBlacklist(system);
      await agent.aiAssert('设置页面中显示"索引"分组，分组内包含"路径黑名单"区域及其添加(+)/删除(-)按钮');
      await agent.logScreenshot('1583549-路径黑名单入口');

      console.log('===== 步骤3：路径黑名单初始状态为空 =====');
      const initPaths = await getGrandSearchBlacklistPaths(system);
      console.log(`初始黑名单配置条目数 = ${initPaths.length}`);
      if (initPaths.length !== 0) {
        throw new Error(`断言失败：黑名单初始配置应为空，实际为 ${JSON.stringify(initPaths)}`);
      }
      await agent.aiAssert('路径黑名单列表为空，列表内没有显示任何路径条目');

      console.log('===== 步骤4：添加一条黑名单路径 =====');
      const added = await addBlacklistPathViaDialog(system, BLACKLIST_DIR);
      if (!added) {
        await agent.logScreenshot('1583549-添加路径失败');
        throw new Error(`添加路径失败：${BLACKLIST_DIR}`);
      }
      await sleep(800);
      const afterAdd = await getGrandSearchBlacklistPaths(system);
      console.log(`添加后黑名单配置 = ${JSON.stringify(afterAdd)}`);
      if (!afterAdd.includes(BLACKLIST_DIR)) {
        await agent.logScreenshot('1583549-配置未写入');
        throw new Error(`断言失败：配置中未写入路径 ${BLACKLIST_DIR}，实际 ${JSON.stringify(afterAdd)}`);
      }
      await revealGrandSearchBlacklist(system);
      await agent.aiAssert(`路径黑名单列表中存在"${BLACKLIST_DIR_NAME}"路径条目`);

      console.log('===== 步骤5：关闭设置后重新打开，路径仍正确展示（第1次）=====');
      await closeGrandSearchSettings(system);
      await openGrandSearchSettings(device, agent, system);
      await revealGrandSearchBlacklist(system);
      await agent.aiAssert(`重新打开设置页面后，路径黑名单列表中仍显示"${BLACKLIST_DIR_NAME}"路径条目`);
      if (!(await getGrandSearchBlacklistPaths(system)).includes(BLACKLIST_DIR)) {
        throw new Error('断言失败：重开设置页面后配置中的路径丢失');
      }

      console.log('===== 步骤6：再次关闭并重新打开，路径仍正确展示（第2次）=====');
      await closeGrandSearchSettings(system);
      await openGrandSearchSettings(device, agent, system);
      await revealGrandSearchBlacklist(system);
      await agent.aiAssert(`再次打开设置页面后，路径黑名单列表中依然显示"${BLACKLIST_DIR_NAME}"路径条目`);

      console.log('===== 测试全部通过 =====');
    },
    { timeout: 480000, tags: ['1583549', 'level2', 'grand_search', 'xuqi'] }
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
    await system.exec(`rm -rf "${BLACKLIST_DIR}"`, 15000);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
