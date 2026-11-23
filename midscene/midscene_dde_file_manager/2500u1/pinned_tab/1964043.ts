/**
 * 用例 PMSID: 1964043
 * 用例标题: 【标签页支持右键固定】固定目录删除/移动/重命名
 * 生成时间: 2026-07-14 16:07:22
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1964043-【标签页支持右键固定】固定目录删除/移动/重命名', () => {
  beforeAll(async ({ uos }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件： 准备测试文件和环境
    await system.exec('mkdir -p ~/Downloads/B ~/Downloads/C');
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');
  });

  test('1964043-【标签页支持右键固定】固定目录删除/移动/重命名', async ({ uos, agent, device, system }) => {
    console.log('前置条件：文管窗口1已打开固定标签页A、B、C');
   // 前置条件：固定3个标签页A、B、C，其中文件夹A在回收站
    console.log("前置条件：固定3个标签页A、B、C，其中文件夹A在回收站")
    await agent.aiRightClick("桌面中间位置空白处")
    await agent.aiTap("新建文件夹")
    await device.typeText('A',true)
    await agent.aiRightClick("A")
    await agent.aiTap("删除")
    await agent.aiDoubleClick('回收站');
    await agent.aiDoubleClick('文件夹A的中间位置');
    await agent.aiRightClick("标签A，左侧显示蓝色小点")
    await agent.aiTap("固定标签")

    await agent.aiTap("文件管理器左侧边栏的下载", { deepThink: true })
    await agent.aiDoubleClick('B');
    await agent.aiRightClick("标签B，左侧显示蓝色小点")
    await agent.aiTap("固定标签")

    await agent.aiTap("地址栏的下载", { deepThink: true })
    await agent.aiDoubleClick('C');
    await agent.aiRightClick("标签C，左侧显示蓝色小点")
    await agent.aiTap("固定标签")

    // 步骤 1：删除目录A，检查固定标签页A是否自动取消固定
    console.log('步骤 1：删除目录A，检查固定标签页A是否自动取消固定');
    await agent.aiTap('窗口左侧边栏的回收站')
    await agent.aiTap('清空按钮')
    await agent.aiTap('弹窗的清空按钮',{ deepThink: true})
    await agent.aiAssert('标签栏存在固定标签B和固定标签C，不显示标签A');

    // 步骤 2：移动目录B到其他目录，检查固定标签页B是否自动取消固定
    console.log('步骤 2：移动目录B到其他目录，检查固定标签页B是否自动取消固定');
    await agent.aiTap('窗口左侧边栏的下载')
    await agent.aiRightClick("B")
    await agent.aiTap('剪切按钮')
    await agent.aiTap('窗口左侧边栏的文档')
    await device.pressKey('Ctrl','V')
    await agent.aiAssert('标签栏显示固定标签C，不显示标签B');

    // 步骤 3：重命名目录C，检查固定标签页C是否自动取消固定
    console.log('步骤 3：重命名目录C，检查固定标签页C是否自动取消固定');
    await agent.aiTap('窗口左侧边栏的下载')
    await agent.aiRightClick("C")
    await agent.aiTap('重命名按钮')
    await device.typeText('D',true)
    await agent.aiAssert('标签栏只显示下载标签，不显示标签C');

    // 步骤 4：新打开文管窗口2，检查是否有固定标签页A、B、C
    console.log('步骤 4：新打开文管窗口2，检查是否有固定标签页A、B、C');
    await agent.aiTap('右上角关闭按钮')
    await uos.openApp('文件管理器');
    await agent.aiAssert('标签栏不存在固定标签页A、B、C');

  }, { timeout: 1200000, tags: ['1964043', 'level3', '2500u1', 'hushimin'] });

  afterEach(async ({ device }) => {
    console.log('7. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, system }) => {
    // 恢复文管配置
    await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
    await system.exec('rm -rf dde-file-manager.obtusely.json');
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager')
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager');
    await system.exec('rm -rf ~/Documents/* ~/Downloads/*');
    await uos.showDesktop();
  });
});
