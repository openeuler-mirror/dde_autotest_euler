
/**
 * 用例 PMSID: 1805483
 * 用例标题: 【搜索】Bug211957转：搜索打开.sh文件后，打开文件所在位置不会导致文管闪退
 * 生成时间: 2026-02-06 11:38:15
 * 用例编写人: UT000193（郑豪）
 */

describe('1805483-【搜索】Bug211957转：搜索打开.sh文件后，打开文件所在位置不会导致文管闪退', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建测试用的.sh文件
    await system.exec(`rm /home/${process.env.TEST_USERNAME}/Desktop/1805483.sh`);
    await system.exec(`touch /home/${process.env.TEST_USERNAME}/Desktop/1805483.sh`);
    await system.exec(`echo "1805483用例执行中" >> /home/${process.env.TEST_USERNAME}/Desktop/1805483.sh`);
  });

  test('1805483-【搜索】Bug211957转：搜索打开.sh文件后，打开文件所在位置不会导致文管闪退', async ({ device, agent, uos, system }) => {
    // 步骤1：搜索任意.sh文件
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理界面右上角的搜索框");
    await device.typeText('1805483.sh');
    await agent.aiWaitFor("等待搜索结果加载完成");
    
    // 断言1：搜索成功
    await agent.aiAssert("搜索结果中显示1805483.sh文件");

    // 步骤2：双击打开搜索结果中的.sh文件
    await agent.aiDoubleClick("搜索结果中的1805483.sh文件");
    
    // 断言2：可以正常打开
    await agent.aiAssert("成功打开1805483.sh文件内容：1805483用例执行中");
    await system.exec('killall -15 deepin-editor');

    // 步骤3：右键点击.sh文件并选择【打开文件所在位置】
    await agent.aiRightClick("搜索结果中的1805483.sh文件");
    await agent.aiTap("右键菜单中的'打开文件所在位置'选项");
    
    // 断言3：打开新的文管窗口，并定位选中到.sh所在的位置
    await agent.aiAssert("打开新的文件管理器窗口");
    await agent.aiAssert("新窗口中1805483.sh文件所在目录被选中");
    
  }, { timeout: 600000, tags: ['1805483', 'level2', 'search', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec(`rm /home/${process.env.TEST_USERNAME}/Desktop/1805483.sh`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
