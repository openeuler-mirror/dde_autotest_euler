/**
 * 用例 PMSID: 1583887
 * 用例标题: 【结果列表】路径快捷开启-快捷打开搜索结果页 web 选项
 * 前置条件：无
 * 操作步骤：单击 dock 全局搜索图标 → 输入关键字"a" → 按住 Ctrl 单击 web 搜索选项
 * 预期结果：全局搜索应用打开并召回结果；Ctrl+单击后退出全局搜索并打开浏览器
 * 生成时间: 2026-11-12
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
if (!TEST_USER) throw new Error('缺少 TEST_USERNAME，请检查 .env');
const TEST_HOME = `/home/${TEST_USER}`;

// system.exec 远程以 root 执行，xdotool/wmctrl 必须显式带上 DISPLAY/XAUTHORITY 才能操作当前桌面
const X11 = `export DISPLAY=:0; export XAUTHORITY=${TEST_HOME}/.Xauthority; `;
const BROWSER_RE = 'chrom|firefox|browser|deepin-browser';
const WEB_ENTRY_DESC = '搜索结果区域中的"通过浏览器搜索"网页搜索入口（web 搜索选项）';

/** 统计当前浏览器窗口数量（客观判据，零模型调用） */
const countBrowserWindows = async (system) => {
  const res = await system.exec(`${X11}wmctrl -lx | grep -Ei "${BROWSER_RE}" | wc -l`, 10000);
  return Number((`${(res && res.stdout) || ''}`).trim()) || 0;
};

describe('1583887-【结果列表】路径快捷开启-快捷打开搜索结果页 web 选项', () => {
  let browserBefore = 0;

  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 关闭文管并清理桌面环境');
    const { clearEnvironment, closeFileManager, resetGrandSearchScopesToAllOn } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    // 前置条件：Web 搜索类目开关必须为打开（前序用例关闭搜索范围后会残留，这里配置级恢复）
    await resetGrandSearchScopesToAllOn(system);
    await uos.showDesktop();
    await device.pressKey('Escape');
    browserBefore = await countBrowserWindows(system);
    console.log(`beforeAll: 当前浏览器窗口数 = ${browserBefore}`);
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 确保焦点在桌面');
    await device.pressKey('Escape');
  });

  test('1583887-【结果列表】路径快捷开启-快捷打开搜索结果页 web 选项', async ({ device, agent, system }) => {
    const { openGrandSearch, inputGrandSearchKeyword } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    console.log('===== 步骤1：单击 dock 全局搜索图标，输入关键字"a" =====');
    await openGrandSearch(device, agent);
    await inputGrandSearchKeyword(device, 'a');
    // 实测："a"命中大量应用/设置结果，Web 搜索入口排在列表靠后位置（窗口内不可见）；
    // 6.0.51 结果列表不响应鼠标滚轮（30 格无位移），但可用方向键向下移动选中项带动列表滚动
    const findWebEntry = async () => {
      for (let i = 0; i < 6; i++) {
        if (await agent.aiBoolean('搜索结果区域中存在"通过浏览器搜索"的网页搜索选项')) return true;
        console.log(`未看到 web 搜索入口，用方向键向下滚动结果列表（第 ${i + 1} 次）`);
        await system.exec(`${X11}for i in $(seq 1 8); do xdotool key Down; sleep 0.12; done; sleep 1.5`, 30000);
      }
      return await agent.aiBoolean('搜索结果区域中存在"通过浏览器搜索"的网页搜索选项');
    };
    if (!(await findWebEntry())) {
      await agent.logScreenshot('1583887-未找到web搜索入口');
      throw new Error('断言失败：输入"a"后搜索结果中未出现"通过浏览器搜索"的 web 搜索选项');
    }
    await agent.aiAssert('全局搜索应用已打开，输入"a"后召回结果，结果区域中存在"通过浏览器搜索"的 web 搜索选项');

    console.log('===== 步骤2：按住 Ctrl 单击 web 搜索选项 =====');
    // aiTap 无法携带修饰键，改为 aiLocate 取中心坐标后用 xdotool keydown ctrl click keyup ctrl
    let clicked = false;
    for (let attempt = 0; attempt < 3 && !clicked; attempt++) {
      try {
        const located = await agent.aiLocate(WEB_ENTRY_DESC, { deepLocate: false });
        const rect = located && located.rect;
        const center = located && located.center;
        let cx = NaN;
        let cy = NaN;
        if (rect && Number.isFinite(rect.left) && Number.isFinite(rect.top)) {
          cx = Math.round(rect.left + rect.width / 2);
          cy = Math.round(rect.top + rect.height / 2);
        } else if (Array.isArray(center) && center.length === 2) {
          cx = Math.round(center[0]);
          cy = Math.round(center[1]);
        }
        if (!Number.isFinite(cx) || !Number.isFinite(cy)) throw new Error('未取到 web 选项坐标');
        console.log(`Ctrl+单击 web 选项 第${attempt + 1}次（坐标 ${cx},${cy}）`);
        await system.exec(`${X11}xdotool mousemove ${cx} ${cy}; sleep 0.3; xdotool keydown ctrl click 1 keyup ctrl; sleep 1`, 15000);
        clicked = true;
      } catch (error) {
        console.log(`第${attempt + 1}次定位/点击 web 选项失败: ${String(error).substring(0, 160)}`);
        await sleep(1500);
      }
    }
    if (!clicked) {
      await agent.logScreenshot('1583887-未能Ctrl单击web选项');
      throw new Error('断言失败：未能完成 Ctrl+单击 web 搜索选项');
    }

    console.log('===== 步骤3：校验退出全局搜索并打开浏览器 =====');
    // 浏览器拉起需要时间，轮询窗口数量；同时校验全局搜索已关闭
    let browserAfter = browserBefore;
    let searchClosed = false;
    for (let i = 0; i < 30; i++) {
      await sleep(1000);
      browserAfter = await countBrowserWindows(system);
      searchClosed = await agent.aiBoolean('全局搜索窗口已关闭，当前显示桌面或浏览器窗口');
      if (browserAfter > browserBefore && searchClosed) break;
    }
    console.log(`校验结果：浏览器窗口数 ${browserBefore} -> ${browserAfter}，全局搜索已关闭 = ${searchClosed}`);
    await agent.logScreenshot('1583887-Ctrl单击web选项后的桌面');

    if (browserAfter <= browserBefore) {
      throw new Error(`断言失败：Ctrl+单击 web 选项后未打开浏览器（浏览器窗口数未增加，仍为 ${browserAfter}）`);
    }
    if (!searchClosed) {
      throw new Error('断言失败：Ctrl+单击 web 选项后全局搜索窗口未退出');
    }
    await agent.aiAssert('浏览器窗口已打开并展示网页搜索页面，全局搜索窗口已退出');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 300000, tags: ['1583887', 'level3', 'grand_search', 'xuqi'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 关闭可能残留的全局搜索');
    const { closeGrandSearch } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeGrandSearch(device, agent, system);
  });

  afterAll(async ({ device, agent, system }) => {
    console.log('5. afterAll: 关闭用例中新开的浏览器窗口并清理环境');
    const { clearEnvironment, closeFileManager, closeGrandSearch } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    try {
      // 只关闭用例新增的浏览器窗口，保留执行机原有浏览器会话
      const res = await system.exec(`${X11}wmctrl -lx | grep -Ei "${BROWSER_RE}" | awk '{print $1}'`, 10000);
      const ids = String((res && res.stdout) || '').split('\n').map((s) => s.trim()).filter(Boolean);
      for (let i = browserBefore; i < ids.length; i++) {
        await system.exec(`${X11}wmctrl -i -c ${ids[i]}`, 8000);
        await sleep(500);
      }
    } catch (error) {
      console.log(`afterAll: 关闭新增浏览器窗口失败（忽略）: ${String(error).substring(0, 120)}`);
    }
    await closeGrandSearch(device, agent, system);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
