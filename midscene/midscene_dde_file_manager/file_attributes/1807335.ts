
/**
 * 用例 PMSID: 1807335
 * 用例标题: 桌面属性窗口-隐藏属性配置
 * 生成时间: 2025-12-30 14:56:22
 * 用例编写人: UT000193（郑豪）
 */

describe('1807335-桌面属性窗口-隐藏属性配置', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 在主目录创建1个testfile1.txt文件,1个test_folder1文件夹
    await system.exec('rm -rf ~/Desktop/.hidden');
    await system.exec('mkdir -p ~/Desktop/test_folder1');
    await system.exec('touch ~/Desktop/testfile1.txt');
  });
  test('1807335-桌面属性窗口-隐藏属性配置', async ({ device, agent, uos }) => {
    //前置1： 刷新桌面
    await agent.aiRightClick('桌面空白位置');
    await agent.aiWaitFor('右键菜单加载完成');
    await agent.aiTap('刷新');

    // 步骤1：设置文件为隐藏属性
    await agent.aiRightClick('testfile1.txt文件图标');
    await agent.aiWaitFor('右键菜单加载完成');
    await agent.aiTap('属性');
    await agent.aiWaitFor('文件属性窗管加载完成');
    await agent.aiTap('隐藏此文件');

    // 断言1：验证文件隐藏后不可见
    await device.pressKey('Super+D');
    await agent.aiAssert('桌面不显示testfile1.txt')

    // 步骤2：显示隐藏文件并取消隐藏属性
    await agent.aiTap('隐藏此文件');

    // 断言2：验证取消隐藏后文件可见
    await device.pressKey('Super+D');
    await agent.aiAssert('桌面显示testfile1.txt')

    // 步骤3：设置文件夹为隐藏属性
    await agent.aiTap("属性窗口右上角的'X'");
    await agent.aiRightClick('test_folder1文件夹图标');
    await agent.aiWaitFor('右键菜单加载完成');
    await agent.aiTap('属性');
    await agent.aiWaitFor('文件属性窗管加载完成');
    await agent.aiTap('隐藏此文件');

    // 断言3：验证文件夹隐藏后不可见
    await device.pressKey('Super+D');
    await agent.aiAssert('桌面不显示test_folder1')

    // 步骤4：显示隐藏文件并取消文件夹隐藏属性
    await device.pressKey('Super+D');
    await agent.aiTap('隐藏此文件');

    // 断言4：验证取消隐藏后文件夹可见
    await agent.aiTap("属性窗口右上角的'X'");
    await agent.aiAssert('桌面显示test_folder1文件夹')
  }, { timeout: 600000, tags: ['1807335', 'level3', 'file_attributes', 'zhenghao'] });

  afterEach(async ({ device, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await system.exec('rm -rf ~/Desktop/testfile1.txt');
    await system.exec('rm -rf ~/Desktop/test_folder1');
    await system.exec('rm -rf ~/Desktop/.hidden');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
