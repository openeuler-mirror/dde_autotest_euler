
/**
 * 用例 PMSID: 1806855
 * 用例标题: 快捷访问-仅对当前用户生效
 * 生成时间: 2025-12-29 18:01:30
 * 用例编写人: UT000193（郑豪）
 */

describe('1806855-快捷访问-仅对当前用户生效', () => {
  // 测试套件初始化：显示桌面
  beforeAll(async ({ device, uos, agent, system  }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  // 每个测试前的准备：创建测试文件夹
  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建1个test文件夹
    await system.exec('mkdir -p ~/test');
  });

  test('1806855-快捷访问-仅对当前用户生效', async ({ device, agent, uos, system }) => {
    // 前置1：将test文件夹添加到快捷访问
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiTap("文件管理器侧边栏的主目录");
    await agent.aiRightClick('文件管理器文件区域的test文件夹');
    await agent.aiWaitFor('右键菜单加载完成');
    // 先判断是否存在"从快捷访问移除"选项，如果存在先点击移除
    try {

      await agent.aiTap("从快捷访问移除");
      // 移除后右键菜单会关闭，需要重新右键点击test文件夹
      await agent.aiRightClick('屏幕上方的test'); 
      await agent.aiWaitFor('右键菜单加载完成');
    } catch (error) {
      // 如果"从快捷访问移除"选项不存在，继续执行添加操作
      console.log('"从快捷访问移除"选项不存在，继续添加操作');
    }
    await agent.aiTap("右键菜单中的'添加到快捷访问'");
    
    // 步骤1：以管理员身份打开文件管理器
    await agent.aiRightClick('主目录空白区域');
    await agent.aiTap('以管理员身份打开', { maximizeWindow: true });
    await device.typeText(process.env.TEST_PASSWORD);
    await agent.aiTap('确定');
    await system.exec('killall -15 dde-file-manager');

    // 断言1：验证管理员窗口不存在test快捷方式（仅对当前用户生效）
    await agent.aiAssert('屏幕中间弹出文件管理器的窗口左侧栏不存在test快捷方式')
  }, { timeout: 600000, tags: ['1806855', 'level3', 'bookmark', 'zhenghao'] });

  // 每个测试后的清理
  afterEach(async ({ device }) => {
    console.log('4. afterEach: 每个测试后的清理');
  });

  // 测试套件清理：移除快捷访问并删除测试文件夹
  afterAll(async ({ uos, agent, device, system, env }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.exec(`echo ${env.testPassword} | sudo -S killall -15 dde-file-manager`);
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiRightClick("左侧栏中的test");
    await agent.aiTap("从快捷访问移除");
    await system.exec('rm -rf ~/test');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
