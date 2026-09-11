
/**
 * 用例 PMSID: 1805255
 * 用例标题: 【搜索】绝对路径、相对路径搜索
 * 生成时间: 2026-01-14 20:31:39
 * 用例编写人: UT000193（郑豪）
 */

describe('1805255-【搜索】绝对路径、相对路径搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('touch ~/Downloads/1805255.txt');
  });

  test('1805255-【搜索】绝对路径、相对路径搜索', async ({ device, agent, uos }) => {
    // 步骤1：在地址栏中输入绝对路径：/etc/apt，回车
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await device.pressKey("Ctrl+L");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText("/etc/apt");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 断言2：进入/etc/apt目录
    await agent.aiAssert("进入/etc/apt目录，存在sources.list文件、sources.list.d等文件");

    // 步骤2：在地址栏中输入：computer:///，回车
    await device.pressKey("Ctrl+L");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText("computer:///");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 断言2：跳转到计算机界面
    await agent.aiAssert("进入计算机界面，存在我的目录、磁盘列表等分类");

    // 步骤3：在地址栏中输入路径：~/Downloads，回车
    await device.pressKey("Ctrl+L");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Ctrl+A");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText("~/Downloads");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey("Enter");
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 断言3：进入home下Downloads目录
    await agent.aiAssert("存在1个1805255.txt的文件");
  }, { timeout: 600000, tags: ['1805255', 'level3', 'search', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('rm ~/Downloads/1805255.txt');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });
});
