
/**
 * 用例 PMSID: 1805541
 * 用例标题: 【搜索】搜索打开.sh文件后，打开文件所在位置不会导致文管闪退
 * 生成时间: 2026-01-05 17:19:02
 * 用例编写人: UT000193（郑豪）
 */

describe('1805541-【搜索】搜索打开.sh文件后，打开文件所在位置不会导致文管闪退', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.exec('killall -15 deepin-editor'); 
    await system.exec('rm ~/.config/deepin/deepin-editor/config.conf') 
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 在~/Downloads下创建一个1805541.sh文件
    await system.exec('touch ~/Downloads/1805541.sh');
    await system.exec('echo 执行1805541用例中... >> ~/Downloads/1805541.sh');
  });

  test('1805541-【搜索】搜索打开.sh文件后，打开文件所在位置不会导致文管闪退', async ({ device, agent, uos, system }) => {
    // 步骤1：打开文件管理器，搜索1805541.sh
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理界面右上角的搜索框");
    await device.typeText("1805541.sh");
    await agent.aiWaitFor("等待出现搜索结果");

    // 断言1：搜索成功，文件管理器列表中存在1805541.sh文件
    await agent.aiAssert("搜索结果中存在1805541.sh文件");

    // 步骤2：双击打开1805541.sh文件
    await agent.aiDoubleClick("搜索结果中的'1805541.sh'");

    // 断言2：1805541.sh打开成功
    await agent.aiAssert("1805541.sh文件已成功打开，显示文本编辑器界面，存在'执行1805541用例中'字符");

    // 步骤3：右键点击1805541.sh文件，选择打开文件所在位置
    await system.exec('killall -15 deepin-editor');
    await agent.aiRightClick("搜索结果中文件标题为'1805541.sh'的文件");
    await agent.aiTap("打开文件所在位置");

    // 断言3：打开新的文管窗口，并定位选中到1805541.sh所在的位置
    await agent.aiWaitFor("新的文件管理器窗口已打开");
    await agent.aiAssert("新窗口已定位到1805541.sh文件所在位置，上方显示下载路径");

  }, { timeout: 600000, tags: ['1805541', 'level2', 'search', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('killall dde-file-manager');
    await system.exec('rm ~/Downloads/1805541.sh');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec('killall -15 deepin-editor'); 
    await system.exec('rm ~/.config/deepin/deepin-editor/config.conf') 
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
