/**
 * 用例 PMSID: 1964037
 * 用例标题: 【标签页支持右键固定】固定标签页记忆排序
 * 生成时间: 2026-07-14 09:32:23
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1964037-【标签页支持右键固定】固定标签页记忆排序', () => {
  beforeAll(async ({ uos }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件： 准备测试文件和环境
    await system.exec('mkdir -p ~/Downloads/A ~/Downloads/B ~/Downloads/C ~/Downloads/D ~/Downloads/E');
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');
      });

  test('1964037-【标签页支持右键固定】固定标签页记忆排序', async ({ uos, agent, device, system }) => {
    // 前置条件：固定5个标签页
    console.log("前置条件：固定5个标签页")
    await uos.openApp('文件管理器')
    await agent.aiTap("窗口左侧侧边栏的下载")
    await agent.aiDoubleClick('A');
    await agent.aiRightClick("标签A，左侧显示蓝色小点")
    await agent.aiTap("固定标签")

    await agent.aiTap("地址栏的下载", { deepThink: true })
    await agent.aiDoubleClick('B');
    await agent.aiRightClick("标签B，左侧显示蓝色小点")
    await agent.aiTap("固定标签")

    await agent.aiTap("地址栏的下载", { deepThink: true })
    await agent.aiDoubleClick('C');
    await agent.aiRightClick("标签C，左侧显示蓝色小点")
    await agent.aiTap("固定标签")

    await agent.aiTap("地址栏的下载", { deepThink: true })
    await agent.aiDoubleClick('D');
    await agent.aiRightClick("标签D，左侧显示蓝色小点")
    await agent.aiTap("固定标签")

    await agent.aiTap("地址栏的下载", { deepThink: true })
    await agent.aiDoubleClick('E');
    await agent.aiRightClick("标签E，左侧显示蓝色小点")
    await agent.aiTap("固定标签")
    await agent.aiTap('右上角关闭按钮')

    // 步骤 1：打开桌面上的任一文件夹，检查是否有5个固定的标签页
    console.log('步骤 1：打开桌面上的任一文件夹，检查是否有5个固定的标签页');
    await agent.aiDoubleClick('主目录')
    await agent.aiAssert('当前窗口存在5个固定标签页A、B、C、D、E');

    // 步骤 2：调整5个固定标签页的位置为A-E-D-B-C
    console.log('步骤 2：调整5个固定标签页的位置为A-E-D-B-C');
    await agent.aiDrag('标签E', '标签B和标签C中间的分隔线位置', { deepThink: true });
    await agent.aiDrag('标签D', '标签B和标签C中间的分隔线位置', { deepThink: true });
    await agent.aiAssert('5个固定标签页顺序调整为A-E-D-B-C');

    // 步骤 3：关闭当前文管窗口，重新打开，检查5个固定标签页顺序
    console.log('步骤 3：关闭当前文管窗口，重新打开，检查5个固定标签页顺序');
    await system.exec('killall dde-file-manager');
    await uos.openApp('文件管理器');
    await agent.aiAssert('重新打开后5个固定标签页顺序是A-E-D-B-C');

  }, { timeout: 1200000, tags: ['1964037', 'level3', '2500u1', 'hushimin'] });

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
