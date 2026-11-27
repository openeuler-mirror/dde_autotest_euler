/**
 * 用例 PMSID: 1807687
 * 用例标题: 检查保险箱-列表模式-留白处右键菜单
 * 生成时间: 2026-11-16
 * 用例编写人: UT000000(熊能)
 * 参考: main_interface_area/file_rightclick/1807697.ts（列表模式留白右键同族）、fixed_directory/vault 系列脚本、common.ts createPasswordVault/UiRmVault/ensureVaultPluginEnabled
 * 追溯: PMS 1807687 步骤1-3 与期望1-3
 */
const caseDir = process.env.TESTCASE_DIR;
const VAULT_PWD = 'Uos123!!';
const FILE_A = '1807687_a.txt';
const FILE_B = '1807687_b.txt';
const USER = process.env.TEST_USERNAME;

// 几何留白右键：取文管窗口几何，在文件列表下方确定性空白处右键（客观定位，零模型）
async function blankRightClickByGeometry(agent, device, system) {
    const lx = await system.exec("wmctrl -lx | grep 'dde-file-manager.dde-file-manager' | head -1 | awk '{print $1}'", 10000);
    const winId = ((lx && lx.stdout) || '').trim();
    assertTrue(!!winId, '未找到文件管理器窗口，无法执行留白处右键');
    const geo = await system.exec(`xdotool getwindowgeometry --shell ${winId}`, 10000);
    const txt = `${(geo && geo.stdout) || ''}`;
    const pick = (k) => { const m = txt.match(new RegExp(k + '=(-?\\d+)')); return m ? Number(m[1]) : NaN; };
    const wx = pick('X'), wy = pick('Y'), ww = pick('WIDTH'), wh = pick('HEIGHT');
    assertTrue([wx, wy, ww, wh].every(Number.isFinite), '取文管窗口几何失败');
    // 最大化窗口：文件列表下方留白（底部上移 15% 高度处，水平居中）
    const x = Math.round(wx + ww / 2);
    const y = Math.round(wy + wh - Math.max(90, wh * 0.15));
    console.log(`几何留白右键: (${x},${y})`);
    await system.exec(`xdotool mousemove ${x} ${y} click 3`, 10000);
    await new Promise(resolve => setTimeout(resolve, 1000));
}

describe('1807687-检查保险箱-列表模式-留白处右键菜单', () => {
  let common = null;

  // 进入保险箱（若为锁定态先输入密码解锁）
  async function enterVault(agent, device) {
    await agent.aiTap('文件管理器左侧栏的保险箱');
    const needUnlock = await agent.aiBoolean('界面出现保险箱密码输入弹窗或保险箱内容尚未解锁');
    if (needUnlock) {
      await agent.aiTap('保险箱密码输入框');
      await device.pressKey('ctrl+a');
      await device.typeText(`${VAULT_PWD}`, true);
      await device.pressKey('enter');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    await agent.aiWaitFor('保险箱目录已打开', { timeoutMs: 20000 });
  }

  // 通过设置窗口把默认视图切换为指定视图
  async function setDefaultView(agent, device, system, viewName) {
    const { openFileManagerSettings } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await openFileManagerSettings(agent, device, system);
    await agent.aiTap("设置窗口左侧导航栏中'工作区'分组下的'视图'菜单项");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await agent.aiTap('默认视图右侧的下拉框');
    await agent.aiTap(`下拉列表中的'${viewName}'选项`);
    await agent.aiWaitFor(`默认视图当前值为'${viewName}'`);
    await agent.aiTap('设置窗口右上角的关闭按钮');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  beforeAll(async ({ device, uos, agent, system, env }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    common = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);

    // 前置1：已开启保险箱（确保插件可用 + 清理旧保险箱 + 创建新保险箱）
    console.log('beforeAll: 确保保险箱插件可用并创建保险箱');
    await common.ensureVaultPluginEnabled(system);
    await common.clearEnvironment(system);
    await common.rmVault(system);
    await common.createPasswordVault(uos, env, agent, device, system);

    // 前置3：保险箱目录内创建2个以上文件（解锁态经 vault_unlocked 挂载点写入）
    console.log('beforeAll: 在保险箱内创建测试文件');
    const mountCheck = await system.exec(`awk '$2 ~ /vault_unlocked$/ {print $2}' /proc/mounts | head -1`, 10000);
    const mountPoint = ((mountCheck && mountCheck.stdout) || '').trim();
    console.log(`保险箱挂载点 = ${mountPoint}`);
    assertTrue(!!mountPoint, '保险箱创建后未检测到 vault_unlocked 挂载点，无法写入测试文件');
    await system.exec(`sudo -u '${USER}' sh -c "printf 'a' > '${mountPoint}/${FILE_A}'; printf 'b' > '${mountPoint}/${FILE_B}'"`, 10000);
    const cnt = await system.exec(`ls '${mountPoint}' 2>/dev/null | grep -c 1807687 || true`, 10000);
    console.log(`保险箱内测试文件数 = ${((cnt && cnt.stdout) || '').trim()}`);
    assertTrue(parseInt(((cnt && cnt.stdout) || '0').trim(), 10) >= 2, '保险箱内测试文件创建失败');

    // 前置2：默认视图切换为列表视图
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
    await setDefaultView(agent, device, system, '列表视图');
    await common.closeFileManager(system);
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await common.closeFileManager(system);
    await uos.showDesktop();
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
    await enterVault(agent, device);
  });

  test('1807687-检查保险箱-列表模式-留白处右键菜单', async ({ device, agent, uos, system }) => {
    // 步骤1：进入保险箱，文件留白处右键
    console.log('===== 步骤1：保险箱列表模式文件留白处右键 =====');
    await blankRightClickByGeometry(agent, device, system);
    await agent.aiWaitFor('右键菜单已弹出', { timeoutMs: 10000 });
    // 期望1：不选中文件，唤起空白处右键菜单，功能可用（同空白处右键功能）
    await agent.aiAssert('右键菜单为空白处菜单，包含新建文件夹、全选、刷新、显示方式、排序方式、属性等空白处功能项');
    await device.pressKey('Esc');
    console.log('期望1通过：留白处右键唤起空白菜单');

    // 步骤2：搜索文件关键词后，文件留白处右键
    console.log('===== 步骤2：搜索关键词后留白处右键 =====');
    await device.pressKey('Ctrl+F');
    await agent.aiWaitFor('搜索输入框已激活', { timeoutMs: 10000 });
    await agent.aiInput('1807687', '文件管理器右上角的搜索输入框');
    await device.pressKey('Enter');
    await agent.aiWaitFor('搜索结果列表已加载完成', { timeoutMs: 60000 });
    await blankRightClickByGeometry(agent, device, system);
    await agent.aiWaitFor('右键菜单已弹出', { timeoutMs: 10000 });
    // 期望2：不选中文件，唤起空白处右键菜单，功能可用
    await agent.aiAssert('搜索结果页的右键菜单为空白处菜单（搜索结果为虚拟目录，包含全选、显示方式、排序方式、分组方式等空白处功能项，功能可用）');
    await device.pressKey('Esc');
    // 退出搜索状态
    await device.pressKey('Esc');
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('期望2通过：搜索后留白处右键唤起空白菜单');

    // 步骤3：切换图标视图检查右键功能
    console.log('===== 步骤3：切换图标视图后留白处右键 =====');
    await blankRightClickByGeometry(agent, device, system);
    await agent.aiWaitFor('右键菜单已弹出', { timeoutMs: 10000 });
    await agent.aiHover('右键菜单中的视图');
    await agent.aiTap('视图子菜单中的图标视图');
    await new Promise(resolve => setTimeout(resolve, 1500));
    await agent.aiAssert('文件以图标网格形式显示（视图已切换为图标视图，搜索结果页与保险箱目录共用同一视图设置）');
    await blankRightClickByGeometry(agent, device, system);
    await agent.aiWaitFor('右键菜单已弹出', { timeoutMs: 10000 });
    // 期望3：同右键菜单用例（空白处菜单功能可用）
    await agent.aiAssert('图标视图下的右键菜单为空白处菜单，功能项完整可用');
    await device.pressKey('Esc');
    console.log('期望3通过：图标视图下留白处右键功能可用');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 1200000, tags: ['1807687', 'level3', 'file_rightclick', 'vault', 'DITT', 'xiongneng'] });

  afterEach(async ({ device, agent, uos, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await device.pressKey('Esc');
    await common.closeFileManager(system);
  });

  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复默认视图为图标视图
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
    await setDefaultView(agent, device, system, '图标视图');
    // 删除保险箱
    await common.UiRmVault(device, agent, uos, env, system);
    await common.clearEnvironment(system);
    await uos.showDesktop();
  });
});
