/**
 * 用例 PMSID: 1965043
 * 用例标题: 【标签页支持右键固定】以新标签页打开固定标签页搜索结果中的文件夹
 * 生成时间: 2026-07-13
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1965043-【标签页支持右键固定】以新标签页打开固定标签页搜索结果中的文件夹', () => {
  beforeAll(async ({ uos }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件： 准备测试文件和环境
    await system.exec('mkdir -p ~/Downloads/A/测试文件夹B ~/Downloads/A/测试文件夹C');
    await system.exec('touch ~/Downloads/A/测试文本文档a.txt')
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');
  });

  test('1965043-以新标签页打开固定标签页搜索结果中的文件夹', async ({ uos, agent, device }) => {
    // 前置条件：固定标签页A，并在标签页A中搜索
    console.log('前置条件：固定标签页A，并在标签页A中搜索');
    await uos.openApp('文件管理器');
    await agent.aiTap('窗口左侧边栏的下载');
    await agent.aiDoubleClick('A');
    await agent.aiRightClick('标签A，左侧显示蓝色小点');
    await agent.aiTap('固定标签');
    await agent.aiTap('窗口右侧的搜索框');
    await device.typeText('测试', true);
    await agent.aiAssert('搜索结果中显示测试文件夹B、测试文件夹C、测试文本文档a.txt');

    // 步骤 1：双击搜索结果中的测试文件夹B，检查是否以新标签页打开B
    console.log('步骤 1：双击搜索结果中的测试文件夹B，检查是否以新标签页打开B');
    await agent.aiDoubleClick('搜索结果中的测试文件夹B');
    await agent.aiAssert('测试文件夹B以新标签页打开');

    // 步骤 2：双击搜索结果中的测试文件夹C，检查是否以新标签页打开C
    console.log('步骤 2：双击搜索结果中的测试文件夹C，检查是否以新标签页打开C');
    await agent.aiTap('标签栏的搜索标签', { deepThink:true})
    await agent.aiDoubleClick('搜索结果中的测试文件夹C');
    await agent.aiAssert('测试文件夹C以新标签页打开');

    // 步骤 3：双击搜索结果中的测试文本文档a.txt
    console.log('步骤 3：双击搜索结果中的测试文本文档a.txt');
    await agent.aiTap('标签栏的搜索标签', { deepThink:true})
    await agent.aiDoubleClick('搜索结果中的测试文本文档a.txt');
    await agent.aiAssert('测试文本文档a.txt正常打开');
    await agent.aiTap('右上角关闭按钮');

  }, { timeout: 900000, tags: ['1965043', 'level3', '2500u1', 'hushimin'] });

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
    await system.exec('rm -rf ~/Downloads/A')
    await uos.showDesktop();
  });
});
