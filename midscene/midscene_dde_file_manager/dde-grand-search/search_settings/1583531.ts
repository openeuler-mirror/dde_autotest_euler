/**
 * 用例 PMSID: 1583531
 * 用例标题: 【搜索设置】路径黑名单-添加短路径/等宽路径/超长路径
 * 前置条件：路径黑名单为空（本用例 beforeAll 清空配置）
 * 操作步骤：在文件选择对话框依次输入短路径、与列表框等宽的路径、超长路径并确认
 * 预期结果：三条路径均添加成功；短/等宽路径完整显示；超长路径中间显示省略号
 * 用例编写人: UT005045（许琪）
 * 生成时间: 2026-11-11
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

// 短路径 / 与列表框宽度接近的路径 / 明显超长的路径
const DIR_SHORT = `${TEST_HOME}/1583531_s`;
const DIR_EQUAL = `${TEST_HOME}/1583531_${'b'.repeat(30)}`;
const DIR_LONG = `${TEST_HOME}/1583531_${'c'.repeat(90)}`;

describe('1583531-【搜索设置】路径黑名单-添加短路径等宽路径超长路径', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 清理环境、重置黑名单并创建三条测试目录');
    const { clearEnvironment, closeFileManager, closeGrandSearchSettings, resetGrandSearchBlacklist } = await import(
      `${caseDir}midscene_dde_file_manager/common/common.ts`
    );
    await closeFileManager(system);
    await clearEnvironment(system);
    await closeGrandSearchSettings(system);
    await resetGrandSearchBlacklist(system);
    await system.exec(`rm -rf "${DIR_SHORT}" "${DIR_EQUAL}" "${DIR_LONG}" && mkdir -p "${DIR_SHORT}" "${DIR_EQUAL}" "${DIR_LONG}"`, 20000);
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保无残留菜单/面板');
    await device.pressKey('Escape');
    await device.pressKey('Escape');
  });

  test(
    '1583531-【搜索设置】路径黑名单-添加短路径等宽路径超长路径',
    async ({ device, agent, system }) => {
      const {
        openGrandSearchSettings,
        revealGrandSearchBlacklist,
        addBlacklistPathViaDialog,
        getGrandSearchBlacklistPaths,
      } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

      console.log('===== 步骤1：打开设置并进入路径黑名单 =====');
      await openGrandSearchSettings(device, agent, system);
      await revealGrandSearchBlacklist(system);
      if ((await getGrandSearchBlacklistPaths(system)).length !== 0) {
        throw new Error('前置条件不满足：黑名单应为空');
      }

      console.log('===== 步骤2：添加短路径 =====');
      if (!(await addBlacklistPathViaDialog(system, DIR_SHORT))) {
        throw new Error(`添加短路径失败：${DIR_SHORT}`);
      }
      await revealGrandSearchBlacklist(system);
      // 2026-11-12 修正：实际列表显示的是完整路径 /home/test/1583531_s，原断言写成"显示条目1583531_s"被模型判定为不含前缀而失败
      await agent.aiAssert('路径黑名单列表中存在以"1583531_s"结尾的路径条目（完整路径为 /home/test/1583531_s），且该路径文字完整显示、末尾未被省略号截断');
      await agent.logScreenshot('1583531-短路径');

      console.log('===== 步骤3：添加与列表框宽度接近的等宽路径 =====');
      if (!(await addBlacklistPathViaDialog(system, DIR_EQUAL))) {
        throw new Error(`添加等宽路径失败：${DIR_EQUAL.substring(0, 40)}...`);
      }
      await revealGrandSearchBlacklist(system);
      await agent.aiAssert('路径黑名单列表中存在包含"1583531_bbbb"的路径条目（完整路径前缀为 /home/test/），且该路径文字可完整显示未被截断');
      await agent.logScreenshot('1583531-等宽路径');

      console.log('===== 步骤4：添加超长路径，检查中间省略号 =====');
      if (!(await addBlacklistPathViaDialog(system, DIR_LONG))) {
        throw new Error('添加超长路径失败');
      }
      await revealGrandSearchBlacklist(system);
      await agent.aiAssert('路径黑名单列表中超长路径以省略号（…）显示，且省略号位于路径中间，路径首尾内容可见');
      await agent.logScreenshot('1583531-超长路径省略号');

      console.log('===== 步骤5：客观校验三条路径均真实写入黑名单配置 =====');
      const paths = await getGrandSearchBlacklistPaths(system);
      console.log(`黑名单配置条目数 = ${paths.length}`);
      for (const dir of [DIR_SHORT, DIR_EQUAL, DIR_LONG]) {
        if (!paths.includes(dir)) {
          throw new Error(`断言失败：配置中缺少路径（len=${dir.length}），实际条目 ${JSON.stringify(paths.map((p) => p.length))}`);
        }
      }
      console.log('短路径/等宽路径/超长路径均已写入配置，黑名单共 3 条');

      console.log('===== 测试全部通过 =====');
    },
    { timeout: 480000, tags: ['1583531', 'level3', 'grand_search', 'xuqi'] }
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
    await system.exec(`rm -rf "${DIR_SHORT}" "${DIR_EQUAL}" "${DIR_LONG}"`, 20000);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
