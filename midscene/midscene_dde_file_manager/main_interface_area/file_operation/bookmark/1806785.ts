/**
 * 用例 PMSID: 1806785
 * 用例标题: 快捷访问-回收站内文件夹右键无添加快捷访问
 * 生成时间: 2025-12-22 17:32:31
 * 用例编写人: UT000193（郑豪）
 */

describe('1806785-快捷访问-回收站内文件夹右键无添加快捷访问', () => {

  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system, env }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 清空回收站，确保测试环境干净
    await system.execSSH(`echo ${env.testPassword} | sudo -S rm -rf ~/.local/share/Trash/*`);
    // 创建测试文件夹结构
    await system.exec('mkdir -p ~/test_trash_folder');
    await system.exec('mkdir -p ~/test_trash_folder/文件夹1');
    await system.exec('mkdir -p ~/test_trash_folder/文件夹2');
    console.log('回收站已清空，并新建2个文件夹用于测试');
  });

  test('1806785-快捷访问-回收站内文件夹右键无添加快捷访问', async ({ device, agent, uos }) => {
    // 准备测试数据：将文件移动到回收站
    console.log('阶段1: 准备测试数据 - 将文件夹移动到回收站');
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理器侧边栏的主目录");
    await agent.aiWaitFor("主目录页面加载完成");
    await agent.aiDoubleClick("'test_trash_folder'文件夹图标");
    await device.pressKey('Ctrl+A');
    await device.pressKey("Delete");
    
    // 步骤1: 进入回收站并执行测试操作
    console.log('阶段2: 进入回收站并检查右键菜单');
    await agent.aiTap('文件管理器侧边栏的回收站');
    await agent.aiWaitFor("回收站页面加载完成");
    await device.pressKey('Ctrl+A');
    await agent.aiRightClick("'文件夹1'文件夹图标");
    await agent.aiWaitFor("右键菜单加载完成");

    // 断言1：检查右键菜单功能完整性
    console.log('阶段3: 验证右键菜单功能完整性');
    await agent.aiAssert("右键菜单中无'添加到快捷访问'选项");
  }, { timeout: 300000, tags: ['1806785', 'level4', 'mouse_keyboard_operations', 'zhenghao'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("点击文件管理器空白位置")
    await system.exec('rm -rf ~/test_trash_folder');
    console.log('test_trash_folder及其子文件夹清理完成');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});