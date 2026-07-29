
/**
 * 用例 PMSID: 1807431
 * 用例标题: 属性复制-快捷键全选
 * 生成时间: 2025-12-30 14:52:32
 * 用例编写人: UT000193（郑豪）
 */

describe('1807431-属性复制-快捷键全选', () => {
  beforeAll(async ({ device, uos, agent, system }) => {
    console.log('1. beforeAll: 初始化测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
    await uos.showDesktop();
  });

  beforeEach(async ({ device, agent, system }) => {
    console.log('2. beforeEach: 每个测试前的准备');
    // 创建1个test_folder测试文件夹
    await system.exec('mkdir -p ~/Desktop/test_folder');
  });

  test('1807431-属性复制-快捷键全选', async ({ device, agent, uos }) => {
    // 前置1：打开文件夹属性弹窗
    await agent.aiRightClick('test_folder文件夹图标');
    await agent.aiWaitFor('右键菜单加载完成');
    await agent.aiTap('属性');
    await agent.aiWaitFor('文件属性窗管加载完成');

    // 步骤1：打开属性右菜单，点击【全选】
    await agent.aiRightClick("属性窗口中位置属性的'test_folder'");
    await agent.aiWaitFor('右键菜单加载完成');
    await agent.aiTap("全选"); 
    await agent.aiWaitFor('test_folder显示已选中，蓝色背景');
    
    // 断言1：文件路径全选状态
    await agent.aiAssert('test_folder整个路径显示选中，蓝色背景');
  }, { timeout: 600000, tags: ['1807431', 'level3', 'file_attributes', 'zhenghao'] });

  afterEach(async ({ device, agent, system }) => {
    console.log('4. afterEach: 每个测试后的清理');
    await agent.aiTap("属性窗口右上角的'X'");
    await system.exec('rm -rf ~/Desktop/test_folder');
  });

  afterAll(async ({ uos, agent, device, system }) => {
    console.log('5. afterAll: 清理测试套件');
    await system.cleanupFileManager();
    await device.pressKey('Esc');
  });
});
