// @ts-nocheck
/**
 * 用例 PMSID: 2027197
 * 用例标题: 【侧边栏树形目录】侧边栏支持展开树形结构目录-双击展开/折叠‌
 * 生成时间: 2026-11-10 11:30:00
 * 用例编写人: UT002899(胡诗敏)
 */


describe('2027197-【侧边栏树形目录】侧边栏支持展开树形结构目录-双击展开/折叠‌', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件和环境
    await system.exec(`mkdir -p ~/A/B`)
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');

  });

  test('2027197-【侧边栏树形目录】侧边栏支持展开树形结构目录-双击展开/折叠‌', async ({ device, agent, uos, system }) => {
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

    // 步骤 1：双击具有下级文件夹的目录标题
    console.log('步骤 1：双击具有下级文件夹的目录标题');
    await uos.openApp('文件管理器', 3000, 30000, true);
    await agent.aiDoubleClick('文件管理器窗口左侧边栏的数据盘');
    await agent.aiDoubleClick('左侧边栏的"A"目录');
    await agent.aiAssert('左侧边栏中，"A"目录下级文件夹展开，显示"B"目录');

    // 步骤 2：再次双击该目录标题
    console.log('步骤 2：再次双击该目录标题');
    await agent.aiDoubleClick('文件夹左侧边栏的"A"目录');
    await agent.aiAssert('左侧边栏中，"A"目录下级的目录"B"不显示',{deepthink:true});

    // 步骤 3：双击数据盘，检查数据盘盘符是否变为重命名状态
    console.log('步骤 3：双击数据盘，检查数据盘盘符是否变为重命名状态');
    await agent.aiDoubleClick('文件管理器窗口左侧边栏的数据盘');
    await agent.aiAssert('数据盘下级目录折叠，且数据盘目录不显示重命名状态');

  }, { timeout: 600000, tags: ['2027197', 'level3', '2500u2','sidebar_tree_directory', 'DITT', 'hushimin'] });

  afterEach(async ({ device, agent, uos }) => {
    console.log('4. afterEach: 每个测试后的清理');
    //环境清理
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
