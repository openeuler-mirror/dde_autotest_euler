// @ts-nocheck
/**
 * 用例 PMSID: 2027183
 * 用例标题: 【侧边栏树形目录】侧边栏树形结构目录右键菜单操作测试
 * 生成时间: 2026-11-10 11:30:00
 * 用例编写人: UT002899(胡诗敏)
 */

describe('2027183-【侧边栏树形目录】侧边栏树形结构目录右键菜单操作测试', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件和环境
    await system.exec(`mkdir -p ~/A/`)
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');

  });

  test('2027183-【侧边栏树形目录】侧边栏树形结构目录右键菜单操作测试', async ({ device, agent, uos, system }) => {
    // 前置条件: 勾选侧边栏磁盘分区以树形结构显示
    await uos.openApp('文件管理器', 3000, 30000);
    await agent.aiTap('右上角4个图标中的第1个（"主菜单"按钮，图标为多条横线）');
    await agent.aiTap('设置');
    await agent.aiTap('设置窗口左侧边栏的"侧边栏树形目录"')
    const isBoxChecked = await agent.aiBoolean('侧边栏磁盘分区以树形结构显示前面的复选框');
    if (isBoxChecked) {
      console.log('不需要勾选侧边栏磁盘分区以树形结构显示前面的复选框')
    }else{
      console.log('需要勾选侧边栏磁盘分区以树形结构显示前面的复选框');
      await agent.aiTap('侧边栏磁盘分区以树形结构显示前面的复选框');
    }
    await agent.aiAssert('侧边栏磁盘分区以树形结构显示前面的复选框显示已勾选');
    await device.pressKey('Esc');
    await device.pressKey('Alt+F4');

    // 步骤 1：在侧边栏中右键单击某个文件夹
    console.log('步骤 1：在侧边栏中右键单击某个文件夹');
    await uos.openApp('文件管理器', 3000, 30000, true);
    await agent.aiDoubleClick('文件管理器窗口左侧边栏的数据盘');
    await agent.aiRightClick('文件管理器窗口左侧边栏的目录"A"');
    await agent.aiAssert('目录"A"右键菜单显示3个菜单，分别是：在新窗口打开、在新标签页中打开、属性');

    // 步骤 2：选择“在新窗口打开”
    console.log('步骤 2：选择“在新窗口打开”  ');
    await agent.aiTap('右键菜单中的"在新窗口打开"');
    await agent.aiAssert('新窗口打开文件夹A，地址栏显示/home/主目录/A/');

    // 步骤 3：关闭新窗口，再次右键单击同一个文件夹，选择“在新标签中打开”
    console.log('步骤 3：关闭新窗口，再次右键单击同一个文件夹，选择“在新标签中打开”');
    await device.pressKey('Alt+F4');
    await agent.aiRightClick('文件管理器窗口左侧边栏的目录"A"');
    await agent.aiTap('右键菜单中的"在新标签页中打开"');
    await agent.aiAssert('当前窗口打开文件夹A，地址栏显示/home/主目录/A/');

    // 步骤 4：再关闭新标签页，再次右键单击同一个文件夹，选择“属性”
    console.log('步骤 4：关闭新标签页，再次右键单击同一个文件夹，选择“属性”');
    await agent.aiRightClick('文件管理器窗口左侧边栏的目录"A"');
    await agent.aiTap('右键菜单中的"属性"');
    await agent.aiAssert('显示文件夹A的属性窗口');

    await device.pressKey('Esc');


  }, { timeout: 600000, tags: ['2027183', 'level3', '2500u2','sidebar_tree_directory', 'DITT', 'hushimin'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 环境清理：文件管理器设置还原
     await agent.aiTap('右上角4个图标中的第3个(关闭X左侧的图标)');
    await agent.aiTap('右上角4个图标中的第1个（"主菜单"按钮，图标为多条横线）');
    await agent.aiTap('设置');
    await agent.aiTap('设置窗口左侧边栏的"侧边栏树形目录"')
    await agent.aiTap('侧边栏磁盘分区以树形结构显示前面的复选框')
    await agent.aiAssert('侧边栏磁盘分区以树形结构显示前面的复选框显示未勾选');
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
    await system.exec(`rm -rf ~/A`)
    await uos.showDesktop();
  });
});
