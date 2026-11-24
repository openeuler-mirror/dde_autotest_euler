/**
 * 用例 PMSID: 1583529
 * 用例标题: 路径黑名单-添加超过一页路径
 * 前置条件：搜索设置-路径黑名单为空（本用例 beforeAll 自动清空并创建测试目录）
 * 操作步骤：1. 依次添加多个路径 2. 持续添加路径超过一页 3. 滚动鼠标滚动页面 4. 拖动鼠标滚动页面
 * 预期结果：1. 路径按顺序依次添加至最后 2. 均可添加成功，超过一页侧边栏出现滚动条 3. 滚动鼠标可滑动页面显示 4. 拖动滚动条可滑动页面显示
 * 用例编写人: UT005045（许琪）
 * 生成时间: 2026-11-12
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

const CASE_DIR = `${TEST_HOME}/1583529_blacklist`;
// 单页可视约 10 行，12 条可确保内容超过一页
const TOTAL = 12;
const TEST_PATHS = Array.from({ length: TOTAL }, (_, i) => `${CASE_DIR}/p${String(i + 1).padStart(2, '0')}`);

describe('1583529-路径黑名单-添加超过一页路径', () => {
  /** 读取若干路径的 basename，用于日志 */
  const baseNames = (paths) => paths.map((p) => p.split('/').pop());

  /** 读取路径黑名单列表当前可见的路径文字（从上到下用 | 分隔） */
  const readVisiblePaths = async (agent) => {
    try {
      const raw = await agent.aiQuery(
        '设置面板中"路径黑名单"列表里当前可见的路径条目，按从上到下用"|"分隔；列表为空或不可见时返回空字符串'
      );
      return String(Array.isArray(raw) ? raw.join('|') : raw || '').trim();
    } catch (error) {
      console.log(`读取可见路径异常: ${String(error).substring(0, 120)}`);
      return '';
    }
  };

  /** 按顺序添加全部路径，并逐条校验新增项位于配置末尾 */
  const addAllPaths = async (system) => {
    const { addBlacklistPathViaDialog, getGrandSearchBlacklistPaths } = await import(
      `${caseDir}midscene_dde_file_manager/common/common.ts`
    );
    for (let i = 0; i < TEST_PATHS.length; i++) {
      const target = TEST_PATHS[i];
      console.log(`添加第 ${i + 1}/${TEST_PATHS.length} 条路径: ${target}`);
      if (!(await addBlacklistPathViaDialog(system, target))) {
        throw new Error(`添加路径失败（文件选择对话框未关闭）：${target}`);
      }
      await sleep(1200);
      const paths = await getGrandSearchBlacklistPaths(system);
      console.log(`当前黑名单（${paths.length} 条）: ${JSON.stringify(baseNames(paths))}`);
      if (paths[paths.length - 1] !== target) {
        throw new Error(
          `断言失败：新添加路径应位于列表末尾，期望${target}，实际末位${paths[paths.length - 1]}，完整顺序 ${JSON.stringify(paths)}`
        );
      }
    }
  };

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
    await system.exec(`rm -rf "${CASE_DIR}" && mkdir -p ${TEST_PATHS.map((p) => `"${p}"`).join(' ')} && ls "${CASE_DIR}" | wc -l`, 20000);
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保无残留菜单/面板');
    await device.pressKey('Escape');
    await device.pressKey('Escape');
  });

  test(
    '1583529-路径黑名单-添加超过一页路径',
    async ({ device, agent, system }) => {
      const { openGrandSearchSettings, revealGrandSearchBlacklist, getGrandSearchBlacklistPaths } = await import(
        `${caseDir}midscene_dde_file_manager/common/common.ts`
      );

      console.log('===== 步骤1：打开设置并滚动到"索引-路径黑名单" =====');
      await openGrandSearchSettings(device, agent, system);
      await revealGrandSearchBlacklist(system);
      const emptyPaths = await getGrandSearchBlacklistPaths(system);
      if (emptyPaths.length !== 0) {
        throw new Error(`前置条件不满足：黑名单应为空，实际 ${JSON.stringify(emptyPaths)}`);
      }
      await agent.aiAssert('设置面板中"索引"分组下的"路径黑名单"区域可见，列表当前为空');

      console.log(`===== 步骤2：依次添加 ${TEST_PATHS.length} 条路径，校验按顺序追加到末尾 =====`);
      await addAllPaths(system);
      const paths = await getGrandSearchBlacklistPaths(system);
      if (JSON.stringify(paths) !== JSON.stringify(TEST_PATHS)) {
        await agent.logScreenshot('1583529-路径顺序不符');
        throw new Error(`断言失败：路径未按添加顺序保存，期望 ${JSON.stringify(TEST_PATHS)}，实际 ${JSON.stringify(paths)}`);
      }
      console.log(`全部路径按顺序添加成功：${JSON.stringify(baseNames(paths))}`);

      console.log('===== 步骤3：校验超过一页后列表出现滚动条 =====');
      await revealGrandSearchBlacklist(system);
      await agent.logScreenshot('1583529-添加完成后的路径黑名单');
      const hasScrollbar = await agent.aiBoolean('路径黑名单列表内容已超过一页，列表右侧出现垂直滚动条');
      console.log(`路径黑名单列表右侧滚动条可见 = ${hasScrollbar}`);
      if (!hasScrollbar) {
        await agent.logScreenshot('1583529-未出现滚动条');
        throw new Error('断言失败：添加 12 条路径后，路径黑名单列表右侧未出现垂直滚动条');
      }

      console.log('===== 步骤4：鼠标滚轮滚动列表，内容可滑动 =====');
      const beforeWheel = await readVisiblePaths(agent);
      console.log(`滚动前可见路径: ${beforeWheel}`);
      let listArea = null;
      try {
        listArea = await agent.aiLocate('"路径黑名单"中显示已添加路径的列表区域');
      } catch (error) {
        console.log(`定位路径黑名单列表区域失败: ${String(error).substring(0, 120)}`);
      }
      const wheelX = listArea && listArea.center ? Math.round(listArea.center[0]) : 0;
      const wheelY = listArea && listArea.center ? Math.round(listArea.center[1]) : 0;
      if (!wheelX || !wheelY) {
        await agent.logScreenshot('1583529-未定位到列表区域');
        throw new Error('断言失败：未能定位到路径黑名单列表区域，无法执行滚轮滚动');
      }
      await system.exec(
        `export DISPLAY=:0; export XAUTHORITY=${TEST_HOME}/.Xauthority; xdotool mousemove ${wheelX} ${wheelY}; sleep 0.3; xdotool click --repeat 6 --delay 250 5; sleep 1.5`,
        30000
      );
      const afterWheel = await readVisiblePaths(agent);
      console.log(`滚轮滚动后可见路径: ${afterWheel}`);
      await agent.logScreenshot('1583529-滚轮滚动后');
      if (afterWheel === beforeWheel) {
        await agent.logScreenshot('1583529-滚轮滚动无效');
        throw new Error(`断言失败：鼠标滚轮滚动后列表内容未变化，滚动前 "${beforeWheel}"，滚动后 "${afterWheel}"`);
      }

      console.log('===== 步骤5：拖动滚动条滑块，内容可滑动 =====');
      await revealGrandSearchBlacklist(system);
      const beforeDrag = await readVisiblePaths(agent);
      console.log(`拖动前可见路径: ${beforeDrag}`);
      let slider = null;
      try {
        slider = await agent.aiLocate('路径黑名单列表右侧垂直滚动条的滑块');
      } catch (error) {
        console.log(`定位滚动条滑块失败: ${String(error).substring(0, 120)}`);
      }
      if (!slider || !slider.center) {
        await agent.logScreenshot('1583529-未定位到滚动条滑块');
        throw new Error('断言失败：未能定位到路径黑名单列表的滚动条滑块，无法执行拖动');
      }
      const sx = Math.round(slider.center[0]);
      const sy = Math.round(slider.center[1]);
      console.log(`滚动条滑块坐标 (${sx},${sy})，向下拖动 120px`);
      await system.exec(
        `export DISPLAY=:0; export XAUTHORITY=${TEST_HOME}/.Xauthority; ` +
          `xdotool mousemove ${sx} ${sy}; sleep 0.3; xdotool mousedown 1; sleep 0.3; ` +
          `for i in $(seq 1 8); do xdotool mousemove ${sx} $(( ${sy} + i * 15 )); sleep 0.12; done; ` +
          `xdotool mouseup 1; sleep 1.5`,
        30000
      );
      const afterDrag = await readVisiblePaths(agent);
      console.log(`拖动滚动条后可见路径: ${afterDrag}`);
      await agent.logScreenshot('1583529-拖动滚动条后');
      if (afterDrag === beforeDrag) {
        await agent.logScreenshot('1583529-拖动滚动条无效');
        throw new Error(`断言失败：拖动滚动条后列表内容未变化，拖动前 "${beforeDrag}"，拖动后 "${afterDrag}"`);
      }

      console.log('===== 测试全部通过 =====');
    },
    { timeout: 900000, tags: ['1583529', 'level3', 'grand_search', 'xuqi'] }
  );

  afterEach(async ({ device, agent, system }) => {
    console.log('3. afterEach: 关闭设置面板/全局搜索窗口');
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
    await system.exec(`rm -rf "${CASE_DIR}"`, 15000);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
