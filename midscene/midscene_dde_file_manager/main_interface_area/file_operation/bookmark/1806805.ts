
/**
 * 用例 PMSID: 1806805
 * 用例标题: [061]快捷访问-右键菜单检查
 * 生成时间: 2025-12-23 20:46:46
 * 用例编写人: UT000193（郑豪）
 */

describe('1806805-[061]快捷访问-右键菜单检查', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 新建1个文件夹并加入快捷访问目录
    await system.exec('mkdir -p ~/test_folder');

  });

  test('1806805-[061]快捷访问-右键菜单检查', async ({ device, agent, uos }) => {
    // 将新建目录添加到快捷访问
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理器侧边栏的主目录");
    await agent.aiWaitFor("主目录页面加载完成");
    await agent.aiRightClick("'test_folder'文件夹的图标");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("右键菜单中的'添加到快捷访问'");
    

    await agent.aiTap("侧边栏的快捷访问目录项");
    await agent.aiRightClick("文件管理器侧边栏test_folder文件夹图标");
    await agent.aiAssert("右键菜单包含:在新窗口打开、在新标签中打开、重命名、从快捷访问移除、属性");
  }, { timeout: 300000, tags: ['1806805', 'level3', 'bookmark', 'zhenghao'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("移除");
    // 关闭文件管理器，清理测试文件
    await system.exec('rm -rf ~/test_folder');
    
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
