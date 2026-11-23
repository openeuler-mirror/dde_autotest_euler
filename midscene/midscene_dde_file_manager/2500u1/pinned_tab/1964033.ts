/**
 * 用例 PMSID: 1964033
 * 用例标题: 【标签页支持右键固定】固定/取消固定标签页UI界面检查
 * 生成时间: 2026-07-14 09:31:31
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1964033-【标签页支持右键固定】固定/取消固定标签页UI界面检查', () => {
  beforeAll(async ({ uos }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件： 准备测试文件和环境
    await system.exec('mkdir -p ~/Downloads/A');
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');

  });

  test('1964033-【标签页支持右键固定】固定/取消固定标签页UI界面检查', async ({ uos, agent, device, system }) => {
    // 前置条件：已固定一个标签页
    console.log('前置条件：已固定一个标签页');
    await uos.openApp('文件管理器');
    await agent.aiTap("文件管理器窗口左侧边栏的下载")
    await agent.aiDoubleClick("A")
    await agent.aiRightClick("标签A，左侧显示蓝色小点")
    await agent.aiTap("固定标签")

    // 步骤 1：右键固定的标签页，检查取消固定是否排在第一位
    console.log('步骤 1：右键固定的标签页，检查取消固定是否排在第一位');
    await agent.aiRightClick('标签栏的标签A');
    await agent.aiAssert('取消固定标签排在第一位');

    // 步骤 2：检查固定标签页右侧是否有一个图钉
    console.log('步骤 2：检查固定标签页右侧是否有一个图钉');
    await agent.aiTap('当前窗口空白处')
    await agent.aiAssert({
      prompt: '标签栏的标签A右侧，+号左侧，存在与传入的固定图标外观相同的图标',
      images: [{
        name: '固定图标',
        url: 'https://youqu.uniontech.com/_picture/test/pinned_icon.png'
      },
      ],
    }, { deepThink: true });

    // 步骤 3：鼠标hover到图钉上，检查是否有提示取消固定标签
    console.log('步骤 3：鼠标hover到图钉上，检查是否有提示取消固定标签');
    await agent.aiHover('固定标签A右侧的图钉');
    await agent.aiAssert('hover图钉时显示文案：取消固定标签');

    // 步骤 4：点击图钉后检查固定标签菜单、图钉和关闭按钮
    console.log('步骤 4：点击图钉后检查固定标签菜单、图钉和关闭按钮');
    await agent.aiTap('标签A右侧的固定图标');
    await agent.aiAssert('标签A右侧不显示图钉外观的固定图标',{deepThink:true})
    await agent.aiRightClick('标签栏的标签A');
    await agent.aiAssert('固定标签排在第一位');
    await agent.aiTap('当前窗口空白处')
    await agent.aiHover('标签栏的标签A');
    await agent.aiAssert('标签A右侧显示X关闭样式');

    // 步骤 5：重新固定标签页，右键该标签页，选择取消固定标签
    console.log('步骤 5：重新固定标签页，右键该标签页，选择取消固定标签');
    await agent.aiRightClick('标签栏的标签A');
    await agent.aiTap('固定标签');
    await agent.aiRightClick('标签栏的标签A');
    await agent.aiTap('取消固定标签');
    await agent.aiAssert('标签A右侧不显示图钉外观的固定图标',{deepThink:true});

    // 步骤 6：关闭所有文管窗口，重新打开，检查不包含步骤5取消固定的标签页
    console.log('步骤 6：关闭所有文管窗口，重新打开，检查不包含步骤5取消固定的标签页');
    await system.exec('killall dde-file-manager');
    await uos.openApp('文件管理器');
    await agent.aiAssert('标签栏不显示固定标签A');

  }, { timeout: 600000, tags: ['1964033', 'level3', '2500u1', 'hushimin'] });

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
    await system.exec('rm -rf ~/Downloads/A');
    await uos.showDesktop();
  });
});
