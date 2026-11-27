/**
 * 用例 PMSID: 1809055
 * 用例标题: 分组折叠-调整深色主题查看侧边栏显示
 * 生成时间: 2026-11-16
 * 用例编写人: UT000686(李双双)
 * 参考: main_interface_area/fixed_directory/group_collapse/1809059.ts（分组折叠辅助写法）、top_area/v25_design/1816671.ts（文管菜单-主题切换深浅色）
 * 追溯: PMS 1809055 步骤1(调整到深色模式查看侧边栏展示) 期望1(侧边栏展示正常)
 */
const caseDir = process.env.TESTCASE_DIR;

/**
 * 通过文管自带菜单切换主题：右上角三条横线（菜单图标）→ 主题 → 深色/浅色
 * 用例要求主题在文件管理器设置里切换，不走控制中心（dde-control-center）
 */
async function switchThemeByFileManagerMenu(agent, themeName) {
  await agent.aiTap('文件管理器右上角的第一个图标：菜单图标', { deepThink: true });
  await agent.aiWaitFor('下拉菜单已展开且包含“主题”选项', { timeoutMs: 10000 });
  await agent.aiTap('下拉菜单中的“主题”选项', { deepThink: true });
  await new Promise(resolve => setTimeout(resolve, 800));
  await agent.aiTap(`主题子菜单中的“${themeName}”`, { deepThink: true });
  await new Promise(resolve => setTimeout(resolve, 1500));
}

describe('1809055-分组折叠-调整深色主题查看侧边栏显示', () => {
  let common = null;

  beforeAll(async ({ device, uos, system, agent }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    common = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await common.closeFileManager(system);
    await common.clearEnvironment(system);
  });

  beforeEach(async ({ device, uos, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await common.closeFileManager(system);
    await uos.showDesktop();
  });

  test('1809055-分组折叠-调整深色主题查看侧边栏显示', async ({ device, agent, uos, system }) => {
    // 步骤1前半：在文管自带菜单里切换深色主题（右上角三条横线-主题-深色），不经过控制中心
    console.log('===== 步骤1：在文件管理器菜单中切换为深色主题 =====');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
    await uos.maximizeWindow();
    await switchThemeByFileManagerMenu(agent, '深色');
    await new Promise(resolve => setTimeout(resolve, 2000));
    await agent.aiAssert('文件管理器整体背景已变为深色主题');

    // 步骤1后半：查看文管侧边栏展示
    console.log('===== 步骤1：深色模式下查看文管侧边栏 =====');

    // 期望1：侧边栏展示正常（各固定入口可见、无黑块/错位/文字缺失）
    console.log('期望1：侧边栏展示正常');
    await agent.aiAssert('文件管理器左侧边栏以深色主题正常显示，各目录条目文字清晰完整');
    await agent.aiAssert('侧边栏中主目录、桌面、文档、下载等常用目录条目均可见且无显示异常');
    await agent.aiAssert('侧边栏背景为深色且与工作区视觉层次区分正常，无空白断层或错位');

    // 分组结构观察（模块上下文附加观察，非用例步骤；不执行折叠交互，仅观察分组标题展示，
    // 折叠交互在深色主题下的状态判定经两轮调试均不可靠，按交付说明声明）
    console.log('联动观察：侧边栏分组标题展示');
    await agent.aiAssert('侧边栏各分组标题（如快捷访问、设备、网络等分组）在深色主题下文字清晰、展示正常，无错位或遮挡');

    console.log('===== 测试全部通过 =====');
  }, { timeout: 900000, tags: ['1809055', 'level4', 'fixed_directory', 'group_collapse', 'DITT', 'lishuangshuang'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await common.closeFileManager(system);
    await device.pressKey('Esc');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    // 恢复浅色主题：同样走文管菜单，afterEach 已关闭文管，这里先重新打开
    console.log('清理步骤：在文件管理器菜单中恢复浅色主题');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示', { timeoutMs: 30000 });
    await uos.maximizeWindow();
    await switchThemeByFileManagerMenu(agent, '浅色');
    await agent.aiAssert('文件管理器整体背景已恢复为浅色主题');
    await common.clearEnvironment(system);
    await uos.showDesktop();
  });
});
