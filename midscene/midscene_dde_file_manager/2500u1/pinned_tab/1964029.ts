/**
 * 用例 PMSID: 1964029
 * 用例标题: 【标签页支持右键固定】多开标签页同步取消固定状态
 * 生成时间: 2026-07-13 16:20:32
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1964029-【标签页支持右键固定】多开标签页同步取消固定状态', () => {
  beforeAll(async ({ uos }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件： 准备测试文件和环境
    await system.exec('mkdir -p ~/Downloads/A ~/Downloads/B ~/Downloads/C ~/Downloads/D');
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');
  });

  test('1964029-【标签页支持右键固定】多开标签页同步取消固定状态', async ({ uos, agent, device }) => {
    // 前置条件 1：固定标签页A,B,C
    console.log('前置条件 1：固定标签页A,B,C');
    await uos.openApp('文件管理器')
    await agent.aiTap("文件管理器窗口左侧边栏的下载")
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
      await agent.aiTap("右上角关闭按钮")

    // 前置条件 2：打开2个文管窗口，均显示3个固定标签页
    console.log("前置条件 2：打开2个文管窗口，均显示3个固定标签页")
    await uos.openApp('文件管理器')
    await agent.aiAssert('打开的文管窗口中存在3个固定标签A、B、C');
    await uos.openApp('文件管理器')
    await agent.aiAssert('打开的文管窗口中存在3个固定标签A、B、C');

    // 步骤 1：在文管窗口2中取消固定标签页A，同时新增固定标签页D
    console.log('步骤 1：在文管窗口2中取消固定标签页A，同时新增固定标签页D');
    await agent.aiTap('标签栏的标签A')
    await agent.aiRightClick('标签A，左侧显示蓝色小点');
    await agent.aiTap('取消固定标签');
    await agent.aiAssert('标签A右侧不显示固定图标，注意：蓝色圆点方块不是固定图标');
    await agent.aiTap("地址栏的下载", { deepThink: true })
    await agent.aiDoubleClick('D');
    await agent.aiRightClick("标签D，左侧显示蓝色小点")
    await agent.aiTap("固定标签")
    await agent.aiAssert({
      prompt: '标签栏的标签D的右侧存在与传入的固定图标外观相似的图钉图标',
      images: [{
        name: '固定图标',
        url: 'https://youqu.uniontech.com/_picture/test/pinned_icon.png'
      },
      ],
    }, { deepThink: true });

    // 检查文管窗口1中的固定标签页是否取消
    console.log('步骤 2：检查文管窗口1中的固定标签页A是否取消固定');
    await agent.aiTap("任务栏文件管理器图标")
    await agent.aiAssert('标签栏存在A、B、C三个标签页，其中B和C的右侧显示固定图标，标签A右侧不显示固定图标');

    // 步骤 3：新打开文管窗口3，检查是否有B、C、D三个固定标签页
    console.log('步骤 3：新打开文管窗口3，检查是否有B、C、D三个固定标签页');
    await uos.openApp('文件管理器');
    await agent.aiAssert('文管窗口中存在B、C、D三个固定标签页');

  }, { timeout: 1200000, tags: ['1964029', 'level2', '2500u1', 'hushimin'] });

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
