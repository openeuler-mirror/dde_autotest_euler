
/**
 * 优化后的测试脚本
 * 用例 PMSID: 1809145
 * 用例标题: 分组折叠-检查快捷访问分组默认排序
 * 生成时间: 2026-02-03 15:43:16
 * 用例编写人: UT000195(苏姗姗)
 */
const caseDir = process.env.TESTCASE_DIR;

describe('1809145-分组折叠-检查快捷访问分组默认排序', () => {
  beforeAll(async ({ device, uos, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
    // 引用公共方法清理应用进程和文管配置
    const { clearEnvironment, closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await clearEnvironment(system);
    await closeFileManager(system);
  });

  beforeEach(async ({ device, uos, system, agent }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 引用公共方法清理应用进程
    const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);

    // 步骤1: 打开文件管理器，点击右上方设置菜单
    console.log('===== 打开文件管理器，点击右上方设置菜单 =====');
    await uos.openApp('文件管理器', 2000, 20000, true);
    await agent.aiWaitFor("文件管理器窗口已显示", { timeout: 10000 });
    await agent.aiTap('文件管理器右上角的设置菜单');
    await agent.aiTap('设置');
    await agent.aiAssert('弹出文件管理器设置窗口');

    // 步骤2: 点击设置页面的侧边栏
    console.log('===== 点击设置页面的侧边栏 =====');
    await agent.aiTap('设置窗口中的侧边栏搜索项');

    // 步骤3: 滑动设置页面到最底部，点击恢复默认
    console.log('===== 滑动设置页面到最底部，点击恢复默认 =====');
    await agent.aiScroll('设置页面', { direction: 'down', distance: 30 });
    await agent.aiTap('设置页面底部的恢复默认按钮');

    // 步骤4: 关闭设置菜单
    console.log('===== 关闭设置菜单 =====');
    await agent.aiTap('设置窗口右上角的关闭按钮');
    await agent.aiAssert('设置窗口被关闭');

    // 步骤5: 按F5刷新窗口
    console.log('===== 按F5刷新窗口 =====');
    await device.pressKey("F5");
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('1809145-分组折叠-检查快捷访问分组默认排序', async ({ device, agent, uos }) => {
    // 步骤1: 断言左侧边栏列表从上至下显示顺序为"最近使用|主目录|桌面|视频|音乐|图片|文档|下载"
    console.log('步骤1: 断言左侧边栏列表从上至下显示顺序为"最近使用|主目录|桌面|视频|音乐|图片|文档|下载"');
    await agent.aiAssert("窗口左侧边栏从上至下显示顺序为：'最近使用''主目录''桌面''视频''音乐''图片''文档''下载'");

  }, { timeout: 1200000, tags: ['1809145', 'level2', 'group_collapse', 'DITT', 'sushanshan'] });

  afterEach(async ({ device, uos }) => {
    console.log('3. afterEach: 每个测试后的清理');
    console.log('[步骤3] 关闭窗口');
    await uos.closeCurrentWindow();
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('4. afterAll: 清理测试套件');
    // 引用公共方法清理应用进程
    const { closeFileManager } = await import(`${caseDir}midscene_dde_file_manager/common/common.ts`);
    await closeFileManager(system);
    await uos.showDesktop();
  });
});
