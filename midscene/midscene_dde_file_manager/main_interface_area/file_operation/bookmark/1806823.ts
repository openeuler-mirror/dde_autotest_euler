
/**
 * 用例 PMSID: 1806823
 * 用例标题: 快捷访问-切换顺序
 * 生成时间: 2025-12-25 20:04:49
 * 用例编写人: UT000193（郑豪）
 */

describe('1806823-快捷访问-切换顺序', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建test文件夹并在其中创建3个子文件夹
    await system.exec('mkdir -p ~/test_folder');
    await system.exec('mkdir -p ~/test_folder/A');
    await system.exec('mkdir -p ~/test_folder/B');
    await system.exec('mkdir -p ~/test_folder/C');
    console.log('test_folder及其中3个子文件夹创建完成');
  });
  
  test('1806823-快捷访问-切换顺序', async ({ device, agent, uos }) => {
    // 前置1：打开文件管理器，进入test_folder目录
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理器侧边栏的主目录");
    await agent.aiWaitFor("主目录页面加载完成");
    await agent.aiDoubleClick("test_folder文件夹图标");
    await agent.aiWaitFor("test_folder目录页面加载完成");
    
    // 前置2：选中多个文件夹，打开右键菜单
    await device.pressKey('Ctrl+A');
    await agent.aiRightClick("A文件夹图标");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("右键菜单中的'添加到快捷访问'");

    // 步骤1：拖拽文件夹ABC
    await agent.aiDrag("左侧栏的A", "左侧B和C之间空白处");
    await agent.aiAssert("左侧栏的B在A上面，左侧栏的C在A下面")
  }, { timeout: 600000, tags: ['1806823', 'level3', 'bookmark', 'zhenghao'] });

  afterEach(async ({ device, system, agent}) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('rm -rf ~/test_folder');
    await agent.aiRightClick("A文件夹图标");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("从快捷访问移除");
    await agent.aiRightClick("B文件夹图标");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("从快捷访问移除");
    await agent.aiRightClick("C文件夹图标");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("从快捷访问移除");
    await system.exec('killall -9 dde-file-manager');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
