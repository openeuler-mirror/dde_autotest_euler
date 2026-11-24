/**
 * 用例 PMSID: 1808013
 * 用例标题: 文管内切换目录动效-后退到上一次浏览目录
 * 生成时间: 2026-09-04 14:01:22
 * 用例编写人: UT002899(胡诗敏)
 */

describe('1808013-文管内切换目录动效-后退到上一次浏览目录', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall dde-file-manager', 500);
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, uos, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 前置条件：准备测试文件和文件夹
    await system.exec('mkdir -p ~/Documents/testFolder/aaa  ~/Documents/testFolder/bbb '  );
    await system.exec(`touch ~/Documents/testFolder/111.txt`)
  });

  test('1808013-文管内切换目录动效-后退到上一次浏览目录', async ({ device, agent, uos, system }) => {
    // 步骤 1: 打开文件管理器窗口，进入有多文件/文件夹的目录
    console.log('步骤 1: 打开文件管理器窗口，进入有多文件/文件夹的目录');
    await uos.openApp('文件管理器')
    await agent.aiTap('左侧边栏的文档')
    await agent.aiWaitFor('进入文档目录')
    await agent.aiDoubleClick('testFolder')
    await agent.aiWaitFor('进入testFolder目录')
    await agent.aiAssert('显示aaa文件夹、bbb文件夹和111.txt文件');

    //步骤 2：点击文管左上角的后退
    console.log('步骤 2：点击文管左上角的后退');
    await agent.aiTap('地址栏左侧的后退按钮：<')
    await agent.aiAssert('显示进入文档目录');

     }, { timeout: 300000, tags: ['1808013', 'level3', 'motion_effect', 'hushimin'] });

  afterEach(async ({ device, uos, agent, system }) => {
    console.log('7. afterEach: 每个测试后的清理');

  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('8. afterAll: 每个测试后的清理');
    await system.exec('killall dde-file-manager || true');
    await system.exec('rm -rf ~/Documents/*')
    await uos.showDesktop();
  });
});