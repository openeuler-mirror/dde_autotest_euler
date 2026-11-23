// @ts-nocheck
/**
 * 用例 PMSID: 2027175
 * 用例标题: 【侧边栏树形目录】文件数据同步测试
 * 生成时间: 2026-11-10 11:30:00
 * 用例编写人: UT002899(胡诗敏)
 */

describe('2027175-【侧边栏树形目录】文件数据同步测试', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件和环境
    await system.exec(`mkdir -p ~/A/B ~/A/C`)
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');

  });

  test('2027175-【侧边栏树形目录】文件数据同步测试', async ({ device, agent, uos, system }) => {
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

    // 步骤 1：在工作区对文件夹进行新建操作
    console.log('步骤 1：在工作区对文件夹进行新建操作');
    await uos.openApp('文件管理器', 3000, 30000, true);
    await agent.aiDoubleClick('文件管理器窗口左侧边栏的数据盘');
    await agent.aiDoubleClick('文件管理器窗口左侧边栏的目录"A"');
    await agent.aiTap('右侧主目录空白区域');
    await device.pressKey('Ctrl','Shift','N');
    await device.typeText('D', true)
    await agent.aiAssert('左侧边栏中，目录A下新增显示目录"D"');

    // 步骤 2：在工作区对文件夹进行删除操作
    console.log('步骤 2：在工作区对文件夹进行删除操作');
    await agent.aiTap('右侧主目录区域的目录C');
    await device.pressKey('delete');
    await agent.aiAssert('左侧边栏中，目录A下不显示目录"C"');

    // 步骤 3：在工作区对文件夹进行重命名操作
    console.log('步骤 3：在工作区对文件夹进行重命名操作');
    await agent.aiRightClick('右侧主目录区域的目录B');
    await agent.aiTap('重命名')
    await device.typeText('E', true)
    await agent.aiAssert('左侧边栏中，目录A下不显示目录"B"，新增显示目录"E"');

    // 步骤 4：在工作区对文件夹进行剪切并粘贴到另一位置
    console.log('步骤 4：在工作区对文件夹进行剪切并粘贴到另一位置');
    await agent.aiTap('右侧主目录区域的目录D');
    await device.pressKey('Ctrl','X')
    await agent.aiDoubleClick('右侧主目录区域的目录"E"');
    await device.pressKey('Ctrl','V')
    await agent.aiTap('左侧边栏的目录"E"前面的展开>', {deepThink: true});
    await agent.aiAssert('左侧边栏中，目录"E"下新增显示目录" D"');

    // 步骤 5：在工作区进行撤销操作（如撤销删除）
    console.log('步骤 5：在工作区进行撤销操作（如撤销删除）');
    await device.pressKey('Ctrl','Z');
    await agent.aiAssert('左侧边栏中，目录A显示下级目录D和目录E；右侧主目录区域，目录E中不存在目录D')

  }, { timeout: 600000, tags: ['2027175', 'level3', '2500u2','sidebar_tree_directory', 'DITT', 'hushimin'] });

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
