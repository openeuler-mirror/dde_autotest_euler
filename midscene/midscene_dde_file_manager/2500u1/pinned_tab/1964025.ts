/**
 * 用例 PMSID: 1964025
 * 用例标题: 【标签页支持右键固定】固定/取消固定1个标签页
 * 生成时间: 2026-07-09 19:39:00
 * 用例编写人: UT002899(胡诗敏)
 */


describe('1964025-【标签页支持右键固定】固定/取消固定1个标签页', () => {
  beforeAll(async ({ uos, system }) => {
    await uos.showDesktop();
  });

    beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件: 准备测试文件和环境
    await system.exec(`mkdir -p ~/Desktop/A`)
    await system.exec(`cd ~/Desktop/A && wget http://10.7.62.32/midscene-uos/midscene_dde_file_manager/resources/1964025.zip && unzip 1964025.zip  && rm 1964025.zip`)
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');
    });

  test('1964025-【标签页支持右键固定】固定/取消固定1个标签页', async ({ uos, agent, device, system }) => {
    // 步骤 1：双击桌面文件夹A，选择固定标签页
    console.log('步骤 1：双击桌面文件夹A，选择固定标签页');
    await agent.aiDoubleClick('A');
    await agent.aiWaitFor("文件夹A显示已打开");
    await agent.aiRightClick("标签A，左侧显示蓝色小点")
    await agent.aiTap("固定标签")
    await agent.aiAssert({
      prompt: '标签栏的标签A右侧，+号左侧，存在与传入的固定图标外观相似的图钉图标',
      images: [{
        name: '固定图标',
        url: 'https://youqu.uniontech.com/_picture/test/pinned_icon.png'
      },
      ],
    });

    // 步骤 2：关闭文管窗口后再打开，存在文件夹A的固定标签页
    console.log('步骤 2：关闭文管窗口后再打开，存在文件夹A的固定标签页');
    await agent.aiTap("右上角关闭按钮")
    await uos.openApp('文件管理器')
    await agent.aiWaitFor("显示文件管理器窗口");
    await agent.aiAssert('标签栏存在固定标签A，位于计算机左侧的标签页');

    // 步骤 3：在固定标签页中正常打开图片、视频、文本文档，正常新建文件夹和文本文档
    console.log('步骤 3：在固定标签页中正常打开图片、视频、文本文档，正常新建文件夹和文本文档')
    await agent.aiTap("标签栏的标签A", { deepThink: true })
    await agent.aiWaitFor("文件夹A显示已打开");
    await agent.aiDoubleClick('可可爱爱小猫咪.png');
    await agent.aiAssert('正常打开');
    await system.exec('killall deepin-image-viewer || true');

    await agent.aiDoubleClick('徐慕言吃饭饭.mp4');
    await agent.aiAssert('正常打开');
    await system.exec('killall deepin-movie || true');

    await agent.aiDoubleClick('武汉介绍.txt');
    await agent.aiAssert('正常打开');
    await system.exec('killall deepin-editor || true');

    await agent.aiWaitFor("显示文件管理器窗口");
    await agent.aiRightClick('文件夹空白处');
    await agent.aiTap('新建文档');
    await agent.aiTap('文本文档');
    await agent.aiTap('文件夹空白处');
    await agent.aiAssert('存在新建文本.txt');

    await agent.aiRightClick('文件夹空白处');
    await agent.aiTap('新建文件夹');
    await agent.aiTap('文件夹空白处');
    await agent.aiAssert('存在新建文件夹');

    // 步骤 4：点击固定标签页上的图钉取消固定
    console.log('步骤 4：点击固定标签页上的图钉取消固定');
    await agent.aiRightClick('标签栏的标签A');
    await agent.aiTap("取消固定标签")
    await agent.aiAssert('标签A右侧不显示固定图标，注意：左侧的蓝色小点不是固定图标', { deepThink: true });

    // 步骤 5：关闭文管窗口后再打开，文管窗口不显示文件夹A的固定标签页
    console.log('步骤 5：关闭文管窗口后再打开，文管窗口不显示文件夹A的固定标签页');
    await agent.aiTap("右上角关闭按钮")
    await agent.aiTap("任务栏的文件管理器图标")
    await agent.aiWaitFor("显示文件管理器窗口");
    await agent.aiAssert('文管窗口标签栏不存在固定标签A', { deepThink: true });

  }, { timeout: 1200000, tags: ['1964025', 'level1', '2500u1', 'hushimin'] });

  afterEach(async ({ device }) => {
    console.log('7. afterEach: 每个测试后的清理');
  });

  afterAll(async ({ uos, system, agent }) => {
    // 恢复文管配置
    await system.exec('rm -rf .config/deepin/dde-file-manager/dde-file-manager.json');
    await system.exec('rm -rf dde-file-manager.obtusely.json');
    await system.exec('dde-dconfig reset org.deepin.dde.file-manager')
    await system.exec('dde-dconfig --set -a org.deepin.dde.file-manager -r org.deepin.dde.file-manager.view -k dfm.pinned.tabs -v ""')
    await system.exec('killall dde-file-manager || true');
    await system.exec('rm -rf ~/Desktop/A')
    await uos.showDesktop();
  });
});
