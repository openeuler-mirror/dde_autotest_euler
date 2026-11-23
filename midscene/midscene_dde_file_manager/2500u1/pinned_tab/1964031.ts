/**
 * 用例 PMSID: 1964031
 * 用例标题: 【标签页支持右键固定】固定标签页后操作
 * 生成时间: 2026-07-14 8:19:45
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1964031-【标签页支持右键固定】固定标签页后操作', () => {
  beforeAll(async ({ uos }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件： 准备测试文件和环境
    await system.exec('mkdir -p ~/Pictures/A/A1');
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');

  });

  test('1964031-【标签页支持右键固定】固定标签页后操作', async ({ uos, agent, device, system }) => {
    // 前置条件： 打开文件夹A之后，固定标签
    console.log('前置条件： 打开文件夹A之后，固定标签');
    await uos.openApp('文件管理器');
    await agent.aiTap('文件管理器窗口左侧侧边栏的图片');
    await agent.aiDoubleClick('文件夹A的中间位置')
    await agent.aiRightClick('标签A，左侧显示蓝色小点');
    await agent.aiTap('固定标签');

    // 步骤 1：打开文管窗口，检查能否关闭固定标签A
    console.log('步骤 1：打开文管窗口，检查能否关闭固定标签A');
    await agent.aiHover('标签栏的标签页A，不是地址栏图片右边的A');
    await agent.aiAssert('标签栏的标签A右侧不显示X关闭样式，显示的是一个固定图标' ,{deepThink:true});

    // 步骤 2：在A所在标签页地址栏输入/home/uos，检查是否以新标签页打开新地址
    console.log('步骤 2：在A所在标签页地址栏输入/home/uos，检查是否以新标签页打开新地址');
    await agent.aiTap('文管窗口空白处');
    await agent.aiTap('标签A所在窗口的地址栏靠右侧的空白处');
    await device.pressKey('Ctrl','A');
    await device.pressKey('Delete');
    await agent.aiInput( '标签A所在窗口的地址栏','/home/uos');
    await device.pressKey('Enter');
    await agent.aiAssert('打开主目录，固定标签A仍然存在');

    // 步骤 3：关闭新标签页，仅剩固定标签页A时，检查剩余单个标签页时也显示标签页
    console.log('步骤 3：关闭新标签页，仅剩固定标签页A时，检查剩余单个标签页时也显示标签页');
    await agent.aiRightClick('标签栏的主目录')
    await agent.aiTap('关闭标签');
    await agent.aiAssert('标签A右侧存在图钉外观的固定标识',{deepThink:true});

    // 步骤 4：点击左侧栏的视频目录，检查是否以新标签页打开视频目录
    console.log('步骤 4：点击左侧栏的视频目录，检查是否以新标签页打开视频目录');
    await agent.aiTap('窗口左侧侧边栏的视频');
    await agent.aiAssert('视频目录以新标签页打开，固定标签页A仍然存在');

    // 步骤 5：点击后退按钮，检查是否以新标签页打开后退目录
    console.log('步骤 5：点击后退按钮，检查是否以新标签页打开后退目录');
    await agent.aiRightClick('标签栏的视频')
    await agent.aiTap('关闭标签');
    await agent.aiTap('后退按钮，参考这个样式<，位于地址栏的最左侧');
    await agent.aiAssert('顶部的标签页存在图片，固定标签页A仍然存在');

    // 步骤 6：取消固定标签页A，然后关闭标签页A，检查文管是否退出
    console.log('步骤 6：取消固定标签页A，然后关闭标签页A，检查文管是否退出');
    await agent.aiRightClick('标签栏的图片')
    await agent.aiTap('关闭标签');
    await agent.aiRightClick('标签栏的标签A');
    await agent.aiTap('取消固定标签');
    await agent.aiRightClick('标签栏的标签A');
    await agent.aiTap('关闭标签');
    await agent.aiAssert('文件管理器窗口关闭');
  },
      { timeout: 600000, tags: ['1964031', 'level3', '2500u1', 'hushimin'] });

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
    await system.exec('rm -rf ~/Pictures/A');
    await uos.showDesktop();
  });
});
