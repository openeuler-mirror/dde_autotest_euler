/**
 * 用例 PMSID: 1964045
 * 用例标题: 【标签页支持右键固定】重复固定
 * 生成时间: 2026-07-14 18:32:32
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1964045-【标签页支持右键固定】重复固定', () => {
  beforeAll(async ({ uos }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件： 准备测试文件和环境
    await system.exec('mkdir -p ~/Downloads/A/P1 ~/Downloads/A/P2 ~/Downloads/A/P3');
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');

      });

  test('1964045-【标签页支持右键固定】重复固定', async ({ uos, agent, device }) => {
    // 步骤 1：打开一个文管窗口，然后打开三个标签页，三个标签页都是A目录
    console.log('步骤 1：打开一个文管窗口，然后打开三个标签页，三个标签页都是A目录');
    await uos.openApp('文件管理器');
    await agent.aiTap('文件管理器窗口左侧边栏的下载');
    await agent.aiDoubleClick('A')
    await agent.aiRightClick('P1')
    await agent.aiTap('在新标签中打开');
    await agent.aiTap('标签栏的标签A');
    await agent.aiRightClick('P2')
    await agent.aiTap('在新标签中打开');
    await agent.aiTap('标签栏的标签A');
    await agent.aiRightClick('P3')
    await agent.aiTap('在新标签中打开');
    await agent.aiAssert('当前文管窗口中存在P1、P2、P3标签页');

    // 步骤 2：右键标签页P1，设置标签页P1固定
    console.log('步骤 2：右键标签页P1，设置标签页P1固定');
    await agent.aiRightClick('P1，左侧显示蓝色小点');
    await agent.aiTap('固定标签');
    await agent.aiAssert({
      prompt: '标签栏的标签P1右侧，标签P2左侧，存在与传入的固定图标外观相似的图标',
      images: [{
        name: '固定图标',
        url: 'https://youqu.uniontech.com/_picture/test/pinned_icon.png'
      },
      ],
    }, { deepThink: true });

    // 步骤 3：右键标签页P2，设置标签页P2固定
    console.log('步骤 3：右键标签页P2，设置标签页P2固定');
    await agent.aiRightClick('P2，左侧显示蓝色小点');
    await agent.aiTap('固定标签');
    await agent.aiAssert({
      prompt: '标签栏的标签P2右侧，标签P3左侧，存在与传入的固定图标外观相似的图标',
      images: [{
        name: '固定图标',
        url: 'https://youqu.uniontech.com/_picture/test/pinned_icon.png'
      },
      ],
    }, { deepThink: true });

    //步骤 4：右键标签页P3，设置标签页P3固定
    console.log('步骤 4：右键标签页P3，设置标签页P3固定');
    await agent.aiRightClick('P3，左侧显示蓝色小点');
    await agent.aiTap('固定标签');
    await agent.aiAssert({
      prompt: '标签栏的标签P3右侧，存在与传入的固定图标外观相似的图标',
      images: [{
        name: '固定图标',
        url: 'https://youqu.uniontech.com/_picture/test/pinned_icon.png'
      },
      ],
    }, { deepThink: true });

  }, { timeout: 900000, tags: ['1964045', 'level3', '2500u1', 'hushimin'] });

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
