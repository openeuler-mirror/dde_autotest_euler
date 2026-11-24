/**
 * 用例 PMSID: 1583527
 * 用例标题: 【搜索设置】路径黑名单-添加链接文件夹
 * 前置条件：主目录下存在指向真实目录的软链接文件夹（本用例 beforeAll 创建）
 * 操作步骤：打开设置-索引-路径黑名单的"+" → 在文件选择对话框中选中链接文件夹 → 点击选择
 * 预期结果：链接文件夹无法加入路径黑名单，黑名单列表保持不变
 * 用例编写人: UT005045（许琪）
 * 生成时间: 2026-11-11
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const TARGET_DIR = `${TEST_HOME}/1583527_target`;
const LINK_DIR = `${TEST_HOME}/1583527_link`;

describe('1583527-【搜索设置】路径黑名单-添加链接文件夹', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 清理环境、重置黑名单并创建软链接文件夹');
    const { clearEnvironment, closeFileManager, closeGrandSearchSettings, resetGrandSearchBlacklist } = await import(
      `${caseDir}midscene_dde_file_manager/common/common.ts`
    );
    await closeFileManager(system);
    await clearEnvironment(system);
    await closeGrandSearchSettings(system);
    await resetGrandSearchBlacklist(system);
    await system.exec(`rm -rf "${LINK_DIR}" "${TARGET_DIR}" && mkdir -p "${TARGET_DIR}" && ln -s "${TARGET_DIR}" "${LINK_DIR}"`, 20000);
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保无残留菜单/面板');
    await device.pressKey('Escape');
    await device.pressKey('Escape');
  });

  test(
    '1583527-【搜索设置】路径黑名单-添加链接文件夹',
    async ({ device, agent, system }) => {
      const {
        openGrandSearchSettings,
        revealGrandSearchBlacklist,
        openBlacklistAddDialog,
        closeFolderChooser,
        getFolderChooserGeometry,
        isFolderChooserOpen,
        getGrandSearchBlacklistPaths,
      } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

      console.log('===== 步骤1：打开路径黑名单的文件选择对话框 =====');
      await openGrandSearchSettings(device, agent, system);
      await revealGrandSearchBlacklist(system);
      await openBlacklistAddDialog(system);
      const geo = await getFolderChooserGeometry(system);
      if (!geo) throw new Error('未能读取"查找目录"文件选择对话框几何信息');
      await agent.aiAssert('文件选择对话框已打开，查找范围为 /home/test，列表中可见文件夹 1583527_link');

      console.log('===== 步骤2：单击选中链接文件夹 =====');
      await agent.aiTap('文件选择对话框中名为 1583527_link 的链接文件夹条目');
      await sleep(800);
      const selected = await agent.aiBoolean('文件选择对话框中 1583527_link 文件夹行处于选中高亮状态');
      console.log(`链接文件夹是否已选中：${selected}`);
      if (!selected) {
        await agent.logScreenshot('1583527-链接文件夹未选中');
        throw new Error('前置操作失败：未能选中链接文件夹 1583527_link');
      }

      console.log('===== 步骤3：点击"选择(C)"尝试添加 =====');
      // 实测硬编码偏移点击"选择(C)"不稳定（点不中按钮，对话框原地停留），改用 AI 定位按钮
      await agent.aiTap('文件选择对话框右下角的"选择(C)"按钮');
      await sleep(1200);
      if (await isFolderChooserOpen(system)) {
        console.log('首次点击"选择(C)"后对话框未关闭，重试一次');
        await agent.aiTap('文件选择对话框右下角的"选择(C)"按钮');
        await sleep(1200);
      }
      await agent.logScreenshot('1583527-点击选择后');

      console.log('===== 步骤4：校验链接文件夹未被加入黑名单 =====');
      const paths = await getGrandSearchBlacklistPaths(system);
      console.log(`点击选择后黑名单配置 = ${JSON.stringify(paths)}`);
      if (paths.includes(LINK_DIR)) {
        await agent.logScreenshot('1583527-链接文件夹被加入黑名单');
        throw new Error(`断言失败：链接文件夹 ${LINK_DIR} 被成功加入路径黑名单（预期不可添加）`);
      }
      if (await isFolderChooserOpen(system)) {
        // 配置未变化即已满足预期，先关闭对话框再进行视觉断言（对话框会遮挡设置面板）
        console.log('点击"选择(C)"后对话框仍停留，关闭后继续校验');
        await closeFolderChooser(system);
      }
      await agent.aiAssert('链接文件夹未被加入路径黑名单，黑名单列表仍为空');

      console.log('===== 步骤5：关闭对话框并再次确认配置为空 =====');
      if (await isFolderChooserOpen(system)) {
        await closeFolderChooser(system);
      }
      if (await isFolderChooserOpen(system)) {
        throw new Error('未能关闭文件选择对话框');
      }
      if ((await getGrandSearchBlacklistPaths(system)).length !== 0) {
        throw new Error('断言失败：关闭对话框后黑名单配置不为空');
      }
      await revealGrandSearchBlacklist(system);
      await agent.aiAssert('路径黑名单列表为空，链接文件夹未被添加');

      console.log('===== 测试全部通过 =====');
    },
    { timeout: 420000, tags: ['1583527', 'level4', 'grand_search', 'xuqi'] }
  );

  afterEach(async ({ device, agent, system }) => {
    console.log('3. afterEach: 关闭设置面板');
    const { closeGrandSearch } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeGrandSearch(device, agent, system);
  });

  afterAll(async ({ device, agent, system }) => {
    console.log('4. afterAll: 清空黑名单、删除软链接与目录并清理环境');
    const { clearEnvironment, closeFileManager, closeGrandSearchSettings, resetGrandSearchBlacklist } = await import(
      `${caseDir}midscene_dde_file_manager/common/common.ts`
    );
    await closeGrandSearchSettings(system);
    await resetGrandSearchBlacklist(system);
    await system.exec(`rm -rf "${LINK_DIR}" "${TARGET_DIR}"`, 20000);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
