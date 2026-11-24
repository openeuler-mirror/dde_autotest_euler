/**
 * 用例 PMSID: 1583883
 * 用例标题: 【结果列表】任务栏全局搜索图标 tips 检查
 * 前置条件：无
 * 操作步骤：鼠标悬停任务栏全局搜索图标 → 移开鼠标 → 再次悬停
 * 预期结果：悬停时显示"全局搜索"tips，移开后 tips 消失
 * 生成时间: 2026-11-11
 */

const caseDir = process.env.TESTCASE_DIR;

/** 等待指定毫秒 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('1583883-【结果列表】任务栏全局搜索图标 tips 检查', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 关闭文管并清理桌面，确保 dock 可见');
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    await uos.showDesktop();
    await device.pressKey('Escape');
  });

  beforeEach(async ({ device }) => {
    console.log('2. beforeEach: 释放焦点，避免既有悬浮状态');
    await device.pressKey('Escape');
    await sleep(500);
  });

  test('1583883-【结果列表】任务栏全局搜索图标 tips 检查', async ({ device, agent, system }) => {
    // 2026-11-12 修正：aiHover 未产生真实的指针悬停（实测 8s 内无 tips），改为 AI 定位 dock 图标坐标后用 xdotool
    // 真实移动鼠标并停留 1.5s，再以 1s 间隔轮询断言 tips 出现/消失
    const { locateGrandSearchDockIcon } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    const TEST_USER = ((process.env.TEST_USERNAME || '') + '').trim();
    const X11 = `export DISPLAY=:0; export XAUTHORITY=/home/${TEST_USER}/.Xauthority; `;
    const icon = await locateGrandSearchDockIcon(system, agent);
    console.log(`dock 全局搜索图标坐标 (${icon.x},${icon.y})`);

    // 2026-11-12 复跑实证：取证脚本用 aiQuery 读取提示文字可稳定拿到"全局搜索"，
    // 而 aiBoolean 长句式判断多次误判为无 tips，故改为读取提示文字后做包含判断
    const tipsText = async () => {
      const raw = await agent.aiQuery('任务栏全局搜索图标上方或附近当前显示的鼠标悬停提示文字（tips）；如果没有任何提示框，返回空字符串');
      return String(Array.isArray(raw) ? raw.join(' ') : raw || '');
    };

    /** 移动鼠标并轮询等待期望的 tips 状态；expectVisible=true 表示等待出现，false 表示等待消失 */
    const waitTips = async (expectVisible, timeoutMs) => {
      const deadline = Date.now() + timeoutMs;
      let last = '';
      while (Date.now() < deadline) {
        last = await tipsText();
        const visible = last.includes('全局搜索');
        if (visible === expectVisible) {
          console.log(`tips 文字 ${JSON.stringify(last)}（期望${expectVisible ? '出现' : '消失'}）`);
          return true;
        }
        await sleep(1000);
      }
      console.log(`等待超时，最后一次 tips 文字 ${JSON.stringify(last)}`);
      return false;
    };

    console.log('===== 步骤1：鼠标悬停任务栏全局搜索图标 =====');
    await system.exec(`${X11}xdotool mousemove 600 400; sleep 0.5; xdotool mousemove ${icon.x} ${icon.y}; sleep 2`, 15000);
    if (!(await waitTips(true, 10000))) {
      await agent.logScreenshot('1583883-未出现tips');
      throw new Error('断言失败：悬停任务栏全局搜索图标后 10s 内未显示"全局搜索"tips');
    }
    await agent.logScreenshot('1583883-悬停出现tips');

    console.log('===== 步骤2：鼠标移开，tips 消失 =====');
    await system.exec(`${X11}xdotool mousemove 960 540`, 8000);
    if (!(await waitTips(false, 10000))) {
      await agent.logScreenshot('1583883-tips未消失');
      throw new Error('断言失败：鼠标移开后 10s 内"全局搜索"tips 仍未消失');
    }

    console.log('===== 步骤3：再次悬停，tips 可重复出现 =====');
    await system.exec(`${X11}xdotool mousemove 600 400; sleep 0.5; xdotool mousemove ${icon.x} ${icon.y}; sleep 2`, 15000);
    if (!(await waitTips(true, 10000))) {
      await agent.logScreenshot('1583883-二次悬停无tips');
      throw new Error('断言失败：再次悬停后 10s 内未重新显示"全局搜索"tips');
    }

    console.log('===== 测试全部通过 =====');
  }, { timeout: 300000, tags: ['1583883', 'level4', 'grand_search', 'xuqi'] });

  afterEach(async ({ device }) => {
    console.log('4. afterEach: 把鼠标移开，避免遮挡后续操作');
    await device.pressKey('Escape');
  });

  afterAll(async ({ device, agent, system }) => {
    console.log('5. afterAll: 清理环境');
    const { clearEnvironment, closeFileManager, closeGrandSearch } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeGrandSearch(device, agent);
    await closeFileManager(system);
    await clearEnvironment(system);
  });
});
