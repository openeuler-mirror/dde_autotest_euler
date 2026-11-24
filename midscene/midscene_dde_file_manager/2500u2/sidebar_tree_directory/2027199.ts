// @ts-nocheck
/**
 * 用例 PMSID: 2027199
 * 用例标题: 【侧边栏树形目录】文管设置中侧边栏树形目录UI及默认值检查
 * 生成时间: 2026-11-10 11:30:00
 * 用例编写人: UT002899(胡诗敏)
 */


describe('2027199-【侧边栏树形目录】文管设置中侧边栏树形目录UI及默认值检查', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件和环境
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');

  });

  test('2027199-【侧边栏树形目录】文管设置中侧边栏树形目录UI及默认值检查', async ({ device, agent, uos, system }) => {
    // 步骤 1：打开文管设置，检查侧边栏-侧边栏树形目录位置
    console.log('步骤 1：打开文管设置，检查侧边栏-侧边栏树形目录位置');
    await uos.openApp('文件管理器', 3000, 30000);
    await agent.aiTap('右上角4个图标中的第1个（"主菜单"按钮，图标为多条横线）');
    await agent.aiTap('设置');
    await agent.aiAssert('显示文件管理器设置窗口，最上方显示基础设置文案');

    // 步骤 2：检查文管设置右侧的“侧边栏树形目录”分组，该分组下方是否有复选项，文案为：“侧边栏磁盘分区以树形结构显示”
    console.log('步骤 2：检查文管设置右侧的“侧边栏树形目录”分组，该分组下方是否有复选项，文案为：“侧边栏磁盘分区以树形结构显示” ');
    await agent.aiTap('设置窗口左侧边栏的"侧边栏树形目录"');
    await agent.aiAssert('右侧显示复选项：侧边栏磁盘分区以树形结构显示');

    // 步骤 3：“侧边栏磁盘分区以树形结构显示”默认状态
    console.log('步骤 3：“侧边栏磁盘分区以树形结构显示”默认状态');
    await agent.aiAssert('侧边栏磁盘分区以树形结构显示前面的复选框默认未勾选');

  }, { timeout: 600000, tags: ['2027199', 'level3', '2500u2','sidebar_tree_directory', 'DITT', 'hushimin'] });

  afterEach(async ({ device, agent }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //环境清理：关闭文件管理器
    await device.pressKey('Esc');
    await device.pressKey('Alt+F4');
  });

  afterAll(async ({ uos, device, system }) => {
    console.log('5. afterAll: 清理本次用例数据与窗口');
    await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
    await system.exec('rm -rf dde-file-manager.obtusely.json');
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager')
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');
    await uos.showDesktop();
  });
});
