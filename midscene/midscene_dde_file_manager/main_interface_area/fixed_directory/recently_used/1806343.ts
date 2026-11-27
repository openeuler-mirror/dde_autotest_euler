/**
 * 用例 PMSID: 1806343
 * 用例标题: 已打开多个文管窗口，文管设置：显示 最近使用
 * 生成时间: 2026-07-19 16:30:00
 * 用例编写人: UT000159（游伟）
 */

describe('1806343-已打开多个文管窗口，文管设置：显示 最近使用', () => {

  const caseDir = process.env.TESTCASE_DIR;

  const recentUtil = `${caseDir}midscene_dde_file_manager/main_interface_area/fixed_directory/recently_used/common.ts`;

  const openDialogApp = '音乐';
  const saveDialogApp = '文本编辑器';
  const openDialogAppCommand = 'deepin-music';
  const saveDialogAppCommand = 'deepin-editor';

  beforeAll(async ({ device, agent, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();

    // 准备步骤: 清理环境
    console.log('准备步骤：清理环境');
    const { clearEnvironment } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);

    // 准备步骤：回到桌面
    console.log('准备步骤：回到桌面');
    await uos.showDesktop();
  });

  beforeEach(async ({ uos, device, agent, system}) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 准备步骤: 设置隐藏文件管理器侧边栏的最近使用项
    console.log('准备步骤：设置隐藏文件管理器侧边栏的最近使用项');
    const { setRecentVisible } = await import(recentUtil);
    await setRecentVisible(agent, device, system, false);

    // 准备步骤：关闭文件管理器
    console.log('准备步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');
    await agent.aiWaitFor('没有文件管理器窗口')
  });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理步骤: 关闭文件打开/保存对话框
    console.log('清理步骤：关闭文件打开/保存对话框');
    await system.exec(`killall -15 dde-file-dialog`);

    // 清理步骤：关闭${openDialogApp}
    console.log('清理步骤：关闭${openDialogApp}');
    await system.exec(`killall -15 ${openDialogAppCommand}`);

    // 清理步骤：关闭${saveDialogApp}
    console.log('清理步骤：关闭${saveDialogApp}');
    await system.exec(`killall -15 ${saveDialogAppCommand}`);

    // 清理步骤: 恢复文件管理器侧边栏的最近使用项
    console.log('清理步骤：恢复文件管理器侧边栏的最近使用项');
    const { setRecentVisible } = await import(recentUtil);
    await setRecentVisible(agent, device, system, true);

    // 清理步骤：关闭文件管理器
    console.log('清理步骤：关闭文件管理器');
    await system.exec('killall -15 dde-file-manager');
    await agent.aiWaitFor('没有文件管理器窗口')
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
  });

  test('1806343-已打开多个文管窗口，文管设置：显示 最近使用', async ({ device, agent, uos, system }) => {

    const { openOpenDialog, openSaveDialog, setRecentVisible, assertRecentItem } = await import(recentUtil);

    // 步骤 1: 打开文件打开对话框
    console.log('步骤 1：打开文件打开对话框');
    await openOpenDialog(uos, agent, device, openDialogApp);

    // 步骤 2: 打开文件保存对话框
    console.log('步骤 2：打开文件保存对话框');
    await openSaveDialog(uos, agent, device, saveDialogApp);

    // 步骤 3: 设置显示侧边栏的最近使用项
    console.log('步骤 3：设置显示侧边栏的最近使用项');
    await setRecentVisible(agent, device, system, true);

    // 预期 3: 文件管理器, 文件打开对话框有最近使用项, 文件保存对话框窗口没有最近使用项, 组策略设置中有最近使用项
    console.log('预期 3：文件管理器，文件打开对话框有最近使用项，文件保存对话框窗口没有最近使用项');
    await assertRecentItem(agent, device, system, assertTrue, true);

  }, { timeout: 600000, tags: ['1806343', 'level3', 'DITT', 'youwei','file manager', 'dde-file-manager', 'long file name', 'recent', 'show', 'recently used'] });
});
