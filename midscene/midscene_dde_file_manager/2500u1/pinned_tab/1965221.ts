// @ts-nocheck

/**
 * 用例 PMSID: 1965221
 * 用例标题: 【标签页支持右键固定】拖拽固定标签页合入其他文管窗口
 * 生成时间: 2026-11-09
 * 用例编写人: UT000649（黄甜）
 */

const caseDir = process.env.TESTCASE_DIR;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 平铺两个文管窗口到屏幕左/右半区
async function tileTwoFileManagerWindows(system) {
  const res = await system.exec("wmctrl -lx | grep -i dde-file-manager | awk '{print $1}'", 10000);
  const wids = String(res?.stdout || '').trim().split('\n').filter(Boolean);
  console.log(`平铺窗口：找到文管窗口 ${wids.join(', ')}`);
  if (wids.length < 2) throw new Error(`需要至少 2 个文管窗口才能测试跨窗口拖拽，实际只有 ${wids.length} 个`);
  const w1 = wids[0];
  const w2 = wids[1];
  // 先解除最大化，再摆放到左右半屏（以 1920x1043 为例；wmctrl 的 -e 参数: gravity,x,y,w,h）
  await system.exec(`wmctrl -i -r ${w1} -b remove,maximized_vert,maximized_horz`, 5000);
  await system.exec(`wmctrl -i -r ${w2} -b remove,maximized_vert,maximized_horz`, 5000);
  await sleep(600);
  await system.exec(`wmctrl -i -r ${w1} -e 0,0,0,960,1043`, 5000);
  await system.exec(`wmctrl -i -r ${w2} -e 0,960,0,960,1043`, 5000);
  await sleep(800);
  return { w1, w2 };
}

describe('1965221-【标签页支持右键固定】拖拽固定标签页合入其他文管窗口', () => {
  beforeAll(async ({ uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    const { closeFileManager, clearEnvironment, setDconfig } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await clearEnvironment(system);
    // 清空历史固定标签页记录（view 资源下的 dfm.pinned.tabs）
    await setDconfig(system, 'dfm.pinned.tabs', '""');
    await uos.showDesktop();
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备测试目录
    await system.exec('mkdir -p ~/Downloads/folderA ~/Downloads/folderB', 10000);
    // 再次清空固定标签，杀掉所有文管进程，确保环境干净
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""', 10000);
    await system.exec('killall dde-file-manager 2>/dev/null || true', 10000);
    await sleep(2000);
  });

  test('1965221-【标签页支持右键固定】拖拽固定标签页合入其他文管窗口', async ({ device, agent, uos, system }) => {

    // ===== 前置条件 =====
    console.log('===== 前置条件：窗口1中固定标签页A + 普通标签 =====');
    await uos.openApp('文件管理器');
    await agent.aiTap('文件管理器左侧侧边栏的下载');
    await agent.aiDoubleClick('folderA');
    // 右键标签页 → 固定标签
    await agent.aiRightClick("标签栏上显示folderA文字的标签页", { deepThink: true });
    await agent.aiTap('右键菜单中的固定标签选项');
    await sleep(1500);
    // 再打开一个普通标签 folderB
    await agent.aiTap('地址栏显示"下载"文字的地址栏区域', { deepThink: true });
    await agent.aiDoubleClick('下载文件夹中的folderB');
    await sleep(1500);

    // 确认窗口1中存在固定标签页 folderA 和普通标签页 folderB
    await agent.aiAssert('标签栏上有左侧显示固定标识的folderA标签页，以及一个没有固定标识的folderB标签页');
    console.log('窗口1 准备完成：固定标签页 folderA + 普通标签页 folderB');

    // 打开文管窗口2
    console.log('===== 打开文管窗口2 =====');
    await uos.openApp('文件管理器');
    await sleep(2500);
    const wids = await system.exec("wmctrl -lx | grep -i dde-file-manager | wc -l", 10000);
    const cnt = parseInt(String(wids?.stdout || '0').trim(), 10) || 0;
    console.log(`当前文管窗口数: ${cnt}`);
    if (cnt < 2) throw new Error(`前置条件失败：需要至少 2 个文管窗口，实际 ${cnt} 个`);

    // 平铺两个窗口到屏幕左右两侧
    console.log('===== 平铺两个窗口到屏幕左右 =====');
    await tileTwoFileManagerWindows(system);
    await sleep(1000);
    await agent.aiAssert('屏幕上左右并排显示两个文件管理器窗口');
    console.log('两个窗口已平铺');

    // ===== 步骤1 =====
    console.log('===== 步骤1：拖拽窗口1中的固定标签页folderA合入窗口2 =====');
    // 先激活左侧窗口（窗口1）
    await system.exec('xdotool mousemove 200 50 click 1', 5000);
    await sleep(500);
    await agent.aiDrag(
      '左侧窗口标签栏上的固定标签folderA',
      '右侧窗口标签栏的空白区域',
      { deepThink: true }
    );
    await sleep(3000);

    // 预期1：合入成功，窗口2中的 folderA 标签页自动取消固定
    console.log('===== 检查预期1 =====');
    await system.exec('xdotool mousemove 1400 50 click 1', 5000);
    await sleep(500);
    await agent.aiAssert('右侧窗口的标签栏中存在folderA标签页，且folderA标签页左侧没有显示固定标识（已自动取消固定）');
    console.log('预期1 ✅：拖拽合入成功，窗口2中folderA自动取消固定');

    // ===== 步骤2 =====
    console.log('===== 步骤2：检查窗口1中固定标签页folderA是否还在 =====');
    await system.exec('xdotool mousemove 200 50 click 1', 5000);
    await sleep(500);
    await agent.aiAssert('左侧窗口的标签栏上仍然有左侧显示固定标识的folderA标签页');
    console.log('预期2 ✅：窗口1中固定标签页folderA仍然保留');

    console.log('✅ 1965221 测试完成');
  }, { timeout: 600000, tags: ['1965221', 'level3', '2500u1', 'pinned_tab', 'DITT', 'huangtian'] });

  afterEach(async ({ device, system }) => {
    console.log('3. afterEach: 清理单个用例现场');
    try { await device.pressKey('Escape'); } catch (error) { }
    await sleep(500);
    await system.exec('killall dde-file-manager 2>/dev/null || true', 10000);
    await sleep(1500);
  });

  afterAll(async ({ uos, system }) => {
    console.log('4. afterAll: 恢复环境');
    const { resetDconfigDefaults, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await system.exec('rm -rf ~/Downloads/folderA ~/Downloads/folderB', 15000);
    await resetDconfigDefaults(system);
    await closeFileManager(system);
    await uos.showDesktop();
  });
});
