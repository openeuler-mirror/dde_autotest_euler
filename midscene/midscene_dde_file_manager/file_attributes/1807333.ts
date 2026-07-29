/**
 * 用例 PMSID: 1807333
 * 用例标题: 文件管理器属性窗口-隐藏属性配置
 * 生成时间: 2025-12-30 15:02:33
 * 用例编写人: UT000193（郑豪）
 */

describe('1807333-文件管理器属性窗口-隐藏属性配置', () => {
  beforeAll(async ({ device, uos, agen, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 在主目录创建1个testfile.txt文件,1个test文件夹
    await system.exec('mkdir -p ~/Desktop/1807333/test');
    await system.exec('touch ~/Desktop/1807333/testfile.txt');
  });

  test('1807333-文件管理器属性窗口-隐藏属性配置', async ({ device, agent, uos }) => {
    // 前置1：打开文件管理器并进入test目录
    await uos.openApp('文件管理器', { maximizeWindow: true });
    await agent.aiWaitFor('文件管理器界面已显示');
    await agent.aiTap('左侧栏桌面');
    await agent.aiDoubleClick('文件管理器中的"1807333"文件夹图标');

    // 步骤1：设置文件为隐藏属
    await agent.aiRightClick("'testfile.txt'文件图标");
    await agent.aiWaitFor('右键菜单加载完成');
    await agent.aiTap('属性');
    await agent.aiWaitFor('文件属性窗管加载完成');
    await agent.aiTap('隐藏此文件');
  
    // 断言1：验证文件隐藏后不可见
    await device.pressKey('Alt+Tab');
    await agent.aiAssert('文件管理器内容显示区域不显示testfile.txt文件');

    // 步骤2：显示隐藏文件并取消隐藏属性
    await device.pressKey('Alt+Tab');
    await agent.aiTap('隐藏此文件');

    // 断言2：验证取消隐藏后文件可见
    await device.pressKey('Alt+Tab');
    await agent.aiAssert('主目录中间内容显示区域显示testfile.txt文件');

    // 步骤3：设置文件夹为隐藏属性
    await device.pressKey('Alt+Tab');
    await device.pressKey('Esc');
    await agent.aiRightClick('test文件夹图标');
    await agent.aiWaitFor('右键菜单加载完成');
    await agent.aiTap('属性');
    await agent.aiWaitFor('文件属性窗管加载完成');
    await agent.aiTap('隐藏此文件');
    await agent.aiWaitFor('隐藏此文件前面显示已被勾选');

    // 断言3：验证文件夹隐藏后不可见
    await device.pressKey('Alt+Tab');
    await agent.aiAssert('主目录中间内容显示区域不显示test文件夹');

    // 步骤4：显示隐藏文件并取消文件夹隐藏属性
    await device.pressKey('Alt+Tab');
    await agent.aiTap('隐藏此文件');

    // 断言4：验证取消隐藏后文件夹可见
    await device.pressKey('Esc');
    await agent.aiAssert('主目录中间内容显示区域显示test文件夹');

  }, { timeout: 600000, tags: ['1807333', 'level3', 'file_attributes', 'zhenghao'] });

  afterEach(async ({ device,system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('killall dde-file-manager');
    await system.exec('rm -rf ~/Desktop/1807333');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
