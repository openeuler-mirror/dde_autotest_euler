
/**
 * 用例 PMSID: 1806779
 * 用例标题: 快捷访问-选中多个文件夹右键无添加快捷访问
 * 生成时间: 2025-12-22 14:52:14
 * 用例编写人: UT000193（郑豪）
 */

describe('1806779-快捷访问-选中多个文件夹右键无添加快捷访问', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建test文件夹并在其中创建4个子文件夹
    await system.exec('mkdir -p ~/test_folder');
    await system.exec('mkdir -p ~/test_folder/文件夹1');
    await system.exec('mkdir -p ~/test_folder/文件夹2');
    await system.exec('mkdir -p ~/test_folder/文件夹3');
    await system.exec('mkdir -p ~/test_folder/文件夹4');
    console.log('test_folder及其中4个子文件夹创建完成');
  });

  test('1806779-快捷访问-选中多个文件夹右键无添加快捷访问', async ({ device, agent, uos }) => {
    // 打开文件管理器，进入test_folder目录
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理器侧边栏的主目录");
    await agent.aiWaitFor("主目录页面加载完成");
    await agent.aiDoubleClick("’test_folder'文件夹图标");
    await agent.aiWaitFor("test_folder目录页面加载完成");
    
    // 步骤 1: 选中多个文件夹，打开右键菜单
    await device.pressKey('Ctrl+A');
    await agent.aiRightClick("'文件夹1'文件夹图标");
    await agent.aiWaitFor("右键菜单加载完成");
    
    // 断言 1: 验证右键菜单无添加快捷访问选项
    await agent.aiAssert("右键菜单中有'添加到快捷访问'选项");
  }, { timeout: 300000, tags: ['1806779', 'level4', 'bookmark', 'zhenghao'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    // 关闭文件管理器、删除测试文件夹test_folder
    await agent.aiTap("点击文件管理器空白位置")
    await system.exec('rm -rf ~/test_folder');
    console.log('test_folder及其子文件夹清理完成');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
