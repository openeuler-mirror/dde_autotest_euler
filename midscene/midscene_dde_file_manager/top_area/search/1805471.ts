
/**
 * 用例 PMSID: 1805471
 * 用例标题: 【搜索】支持通配符搜索
 * 生成时间: 2026-02-06 13:59:36
 * 用例编写人: UT000193（郑豪）
 */

describe('1805471-【搜索】支持通配符搜索', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建测试文件
    await system.exec(`touch ~/Desktop/deepin-test.doc`);
    await system.exec(`touch ~/Desktop/deepin-file.doc`);
    await system.exec(`touch ~/Desktop/deepin-document.doc`);
    await system.exec('touch ~/Desktop/"(1).txt"');
    await system.exec(`touch ~/Desktop/deepin-test.txt`);
  });

  test('1805471-【搜索】支持通配符搜索', async ({ device, agent, uos }) => {
    // 步骤1：搜索输入框输入deepin*.doc
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("左侧栏桌面");
    await agent.aiTap("文件管理界面右上角的搜索框");
    await device.typeText('deepin*.doc');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 断言1：搜索出当前目录以deepin开头，.doc结尾的所有文件。
    await agent.aiAssert("搜索结果显示以'deepin'开头，以'.doc'结尾的3个文件");

    // 步骤2：在地址栏中搜索(1).txt，查看搜索结果显示
    await agent.aiTap("文件管理界面右上角的搜索框");
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Ctrl+A');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.typeText('(1).txt');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await device.pressKey('Enter');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 断言2:可以直接搜索(1).txt文件，不需要进行转义
    await agent.aiAssert("搜索结果显示文件'(1).txt'，不需要进行转义");
    
  }, { timeout: 600000, tags: ['1805471', 'level3', 'search', 'zhenghao'] });

  afterEach(async ({ device, system, env }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 清理测试文件
    await system.exec(`rm ~/Desktop/deepin-test.doc`);
    await system.exec(`rm ~/Desktop/deepin-file.doc`);
    await system.exec(`rm ~/Desktop/deepin-document.doc`);
    await system.exec('rm ~/Desktop/"(1).txt"');
    await system.exec(`rm ~/Desktop/deepin-test.txt`);
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
