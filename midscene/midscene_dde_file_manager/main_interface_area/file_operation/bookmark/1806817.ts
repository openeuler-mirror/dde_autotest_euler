
/**
 * 用例 PMSID: 1806817
 * 用例标题: 快捷访问-源文件夹右键移除
 * 生成时间: 2025-12-24 13:16:03
 * 用例编写人: UT000193（郑豪）
 */

describe('1806817-快捷访问-源文件夹右键移除', () => {
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    await system.exec('mkdir -p ~/test_folder');
  });

  test('1806817-快捷访问-源文件夹右键移除', async ({ device, agent, uos, system }) => {
    // 步骤1：进入普通目录，如视频-选中单个文件夹-右键点击添加快捷访问
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor("文件管理器界面已显示");
    await agent.aiTap("文件管理器侧边栏的主目录");
    await agent.aiWaitFor("主目录页面加载完成");
    await agent.aiRightClick("test_folder文件夹图标");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("右键菜单中的'添加到快捷访问'");

    // 断言1：成功添加快捷访问
    await agent.aiAssert("test_folder添加到文件管理器侧边栏");

    // 步骤2：再次选中该文件夹-右键移除快捷访问
    await agent.aiRightClick("test_folder文件夹图标");
    await agent.aiWaitFor("右键菜单加载完成");
    await agent.aiTap("从快捷访问移除");

    // 断言2：成功移除
    await agent.aiAssert("文件管理器左侧边栏不存在test_folder");
  }, { timeout: 300000, tags: ['1806817', 'level3', 'bookmark', 'zhenghao'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('rm -rf ~/test_folder');
    console.log('test_folder及其子文件夹清理完成');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
