/**
 * 用例 PMSID: 1964071
 * 用例标题: 【标签页支持右键固定】固定标签页+自定义目录+设置默认目录
 * 生成时间: 2026-07-16 09:41:22
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1964071-【标签页支持右键固定】固定标签页+自定义目录+设置默认目录', () => {
  beforeAll(async ({ uos }) => {
    await uos.showDesktop();
  });

  beforeEach(async ({ system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件： 准备测试文件和环境
    await system.exec('mkdir -p ~/Documents/A ~/Downloads/B ~/Music/C');
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');
  });

  test('1964071-【标签页支持右键固定】固定标签页+自定义目录+设置默认目录', async ({ uos, agent, device, system }) => {
    // 前置条件 1：文管设置新窗口默认目录为图片
    console.log('前置条件 1：文管设置新窗口默认目录为图片');
    await uos.openApp('文件管理器');
    await agent.aiTap('右上角主菜单');
    await agent.aiTap('设置');
    await agent.aiTap('设置窗口左侧栏的新窗口选项');
    await agent.aiTap('默认目录右侧的下拉选项');
    await agent.aiTap('图片');
    await agent.aiAssert('新窗口默认目录显示为图片');

    // 前置条件 2：设置两个自定义目录A和B
    console.log('前置条件 2：设置两个自定义目录A和B');
    await agent.aiTap('自定义目录右侧的+号', {deepThink : true});
    await agent.aiTap('窗口左侧边栏的文档');
    await agent.aiTap("文件夹A的中间位置")
    await agent.aiTap("打开按钮")
    await agent.aiTap('自定义目录右侧的+号', {deepThink : true});
    await agent.aiTap('窗口左侧边栏的下载');
    await agent.aiTap("文件夹B的中间位置")
    await agent.aiTap("打开按钮")
    await device.pressKey("ESC")

    // 前置条件 3：设置音乐目录下文件夹C为固定标签页
    console.log('前置条件 3：设置音乐目录下文件夹C为固定标签页');
    await agent.aiTap('窗口左侧边栏的音乐');
    await agent.aiDoubleClick("文件夹C的中间位置")
    await agent.aiRightClick('标签C，左侧显示蓝色小点');
    await agent.aiTap('固定标签');
    await agent.aiAssert({
      prompt: '标签栏的标签C右侧，+号左侧，存在与传入的固定图标外观相同的图标',
      images: [{
        name: '固定图标',
        url: 'https://youqu.uniontech.com/_picture/test/pinned_icon.png'
      },
      ],
    }, { deepThink: true });
    await agent.aiTap('右上角关闭按钮');

    // 步骤 1：打开文管窗口，检查标签页排序为C->图片目录->A->B
    console.log('步骤 1：打开文管窗口，检查标签页排序为C->图片目录->A->B');
    await uos.openApp('文件管理器');
    await agent.aiAssert('标签栏从左到右排序为固定标签页C、图片目录、标签A、标签B');

    // 步骤 2：检查当前激活标签页是否是图片目录
    console.log('步骤 2：检查当前激活标签页是否是图片目录');
    await agent.aiAssert('当前窗口存在图片目录');

  }, { timeout: 900000, tags: ['1964071', 'level3', '2500u1', 'hushimin'] });

  afterEach(async ({ device, agent }) => {
    console.log('7. afterEach: 每个测试后的清理');
    // 删除自定义目录
    await agent.aiTap('右上角主菜单');
    await agent.aiTap('设置');
    await agent.aiTap('设置窗口左侧栏的新窗口选项');
    await agent.aiTap('默认目录右侧的下拉选项');
    await agent.aiTap('计算机');
    await agent.aiTap("自定义目录下方的/home/$USER/Documents/A右侧的删除图标", {deepThink :true});
    await agent.aiTap("自定义目录下方的/home/$USER/Downloads/B右侧的删除图标", {deepThink :true});
    await device.pressKey("ESC")
  });

  afterAll(async ({ uos, system, agent, device }) => {
    agent
    // 恢复文管配置
    await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
    await system.exec('rm -rf dde-file-manager.obtusely.json');
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager')
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager');
    await system.exec('rm -rf ~/Documents/A ~/Downloads/B ~/Music/C')
    await uos.showDesktop();
  });
});
