// @ts-nocheck
/**
 * 用例 PMSID: 2027177
 * 用例标题: 【侧边栏树形目录】侧边栏树形结构目录右键菜单操作测试
 * 生成时间: 2026-11-10 11:30:00
 * 用例编写人: UT002899(胡诗敏)
 */

describe('2027177-【侧边栏树形目录】侧边栏与工作区选中目录同步测试', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件和环境
    await system.exec(`mkdir -p ~/A/B/D ~/A/C`)
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');

  });

  test('2027177-【侧边栏树形目录】侧边栏与工作区选中目录同步测试', async ({ device, agent, uos, system }) => {
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

    // 步骤 1：在侧边栏中单击选中一级目录
    console.log('步骤 1：在侧边栏中单击选中一级目录');
    await uos.openApp('文件管理器', 3000, 30000, true);
    await agent.aiDoubleClick('文件管理器窗口左侧边栏的数据盘');
    await agent.aiDoubleClick('文件管理器窗口左侧边栏的目录"A"');
    await agent.aiAssert('右侧主目录区域，显示目录B和目录C');

    // 步骤 2：在工作区中打开一个新的目录
    console.log('步骤 2：在工作区中打开一个新的目录');
    await agent.aiDoubleClick('右侧主目录区域的目录"B"');
    await agent.aiAssert('左侧边栏高亮选中目录"B"');

    // 步骤 3：侧边栏未展开到工作区打开的目录层级
    console.log('步骤 3：侧边栏未展开到工作区打开的目录层级');
    await agent.aiDoubleClick('右侧主目录区域的目录"D"');
    await agent.aiAssert('左侧边栏中，可视区域内，不高亮显示目录"D"');

    // 步骤 4：侧边栏已展开到工作区打开的目录层级
    console.log('步骤 4：侧边栏已展开到工作区打开的目录层级');
    await agent.aiTap('左侧边栏的目录"B"前面的展开>', {deepThink: true});
    await agent.aiAssert('左侧边栏中，显示下级目录"D"，且目录D被高亮选中');

    // 步骤 5：展开数据盘，检查左侧栏展示的目录结果是否和工作区一致
    console.log('步骤 5：展开数据盘，检查左侧栏展示的目录结果是否和工作区一致');
    await device.pressKey('Alt+F4');
    await uos.openApp('文件管理器', 3000, 30000, true);
    await agent.aiDoubleClick('文件管理器窗口左侧边栏的数据盘');
    await agent.aiAssert('左侧边栏中，显示的目录与右侧主目录区域显示的目录一致')

  }, { timeout: 600000, tags: ['2027177', 'level3', '2500u2','sidebar_tree_directory', 'DITT', 'hushimin'] });

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
