/**
 * 用例 PMSID: 1964041
 * 用例标题: 【标签页支持右键固定】拖出固定标签页形成新窗口
 * 生成时间: 2026-07-14 13:22:36
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1964041-【标签页支持右键固定】拖出固定标签页形成新窗口', () => {
  beforeAll(async ({ uos }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件和环境
    await system.exec('mkdir -p ~/Downloads/A ~/Downloads/B ~/Downloads/C');
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');
    });

  test('1964041-【标签页支持右键固定】拖出固定标签页形成新窗口', async ({ uos, agent, device }) => {

    // 前置条件：文管窗口1中有固定标签页A、普通标签页B、固定标签页C
    console.log('前置条件：文管窗口1中有固定标签页A、普通标签页B、固定标签页C')
    await uos.openApp('文件管理器');
    await agent.aiTap('文件管理器左侧侧边栏的下载');
    await agent.aiDoubleClick('A');
    await agent.aiRightClick("标签A，左侧显示蓝色小点")
    await agent.aiTap("固定标签")

    await agent.aiTap("地址栏的下载", { deepThink: true })
    await agent.aiDoubleClick('C');
    await agent.aiRightClick("标签C，左侧显示蓝色小点")
    await agent.aiTap("固定标签")

    await agent.aiTap("地址栏的下载", { deepThink: true })
    await agent.aiDoubleClick('B');

    // 步骤 1：拖出标签页A形成新文管窗口2，检查文管窗口2是否有固定标签页A和C
    console.log('步骤 1：拖出标签页A形成新文管窗口2，检查文管窗口2是否有固定标签页A和C');
    await agent.aiDrag('标签A', '桌面左上角的计算机图标右侧的位置', { deepThink: true });
    await agent.aiAssert('新开的窗口中存在固定标签A和固定标签C');

    // 步骤 2：检查文管窗口1中是否有固定标签页A、普通标签页B、固定标签页C
    console.log('步骤 2：检查文管窗口1中是否有固定标签页A、普通标签页B、固定标签页C');
    await agent.aiTap('任务栏的文件管理器图标')
    await agent.aiAssert('窗口存在固定标签A、固定标签C、标签B，标签B不显示图钉外观的固定标识');

  }, { timeout: 600000, tags: ['1964041', 'level3', '2500u1', 'hushimin'] });

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
    await system.exec('rm -rf ~/Downloads/*');
    await uos.showDesktop();
  });
});
